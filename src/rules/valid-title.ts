import { AST_NODE_TYPES, JSONSchema, TSESTree } from '@typescript-eslint/utils'
import { createEslintRule, getStringValue, isStringNode, StringNode } from '../utils'
import { parseVitestFnCall } from '../utils/parseVitestFnCall'
import { DescribeAlias, TestCaseName } from '../utils/types'

export const RULE_NAME = 'valid-title'

const trimFXPrefix = (word: string) =>
    ['f', 'x'].includes(word.charAt(0)) ? word.substring(1) : word

const quoteStringValue = (node: StringNode): string =>
    node.type === AST_NODE_TYPES.TemplateLiteral
        ? `\`${node.quasis[0].value.raw}\``
        : node.raw

type MESSAGE_IDS =
    | 'titleMustBeString'
    | 'emptyTitle'
    | 'duplicatePrefix'
    | 'accidentalSpace'
    | 'disallowedWord'
    | 'mustNotMatch'
    | 'mustMatch'
    | 'mustNotMatchCustom'
    | 'mustNotMatchCustom'
    | 'mustMatchCustom';

type MatcherGroups = 'describe' | 'test' | 'it';

type MatcherAndMessage = [matcher: string, message?: string];

const MatcherAndMessageSchema: JSONSchema.JSONSchema7 = {
    type: 'array',
    items: { type: 'string' },
    minItems: 1,
    maxItems: 2,
    additionalItems: false
} as const

type Options = {
    ignoreTypeOfDescribeName?: boolean;
    allowArguments?: boolean;
    disallowedWords?: string[];
    mustNotMatch?:
    | Partial<Record<MatcherGroups, string | MatcherAndMessage>>
    | MatcherAndMessage
    | string;
    mustMatch?:
    | Partial<Record<MatcherGroups, string | MatcherAndMessage>>
    | MatcherAndMessage
    | string;
}[]

type CompiledMatcherAndMessage = [matcher: RegExp, message?: string];

const compileMatcherPattern = (matcherMaybeWithMessage: MatcherAndMessage | string): CompiledMatcherAndMessage => {
    const [matcher, message] = Array.isArray(matcherMaybeWithMessage)
        ? matcherMaybeWithMessage
        : [matcherMaybeWithMessage]

    return [new RegExp(matcher, 'u'), message]
}

const compileMatcherPatterns = (matchers:
    | Partial<Record<MatcherGroups, string | MatcherAndMessage>>
    | MatcherAndMessage
    | string): Record<MatcherGroups, CompiledMatcherAndMessage | null> &
    Record<string, CompiledMatcherAndMessage | null> => {
    if (typeof matchers === 'string' || Array.isArray(matchers)) {
        const compiledMatcher = compileMatcherPattern(matchers)

        return {
            describe: compiledMatcher,
            test: compiledMatcher,
            it: compiledMatcher
        }
    }

    return {
        describe: matchers.describe ? compileMatcherPattern(matchers.describe) : null,
        test: matchers.test ? compileMatcherPattern(matchers.test) : null,
        it: matchers.it ? compileMatcherPattern(matchers.it) : null
    }
}

const doesBinaryExpressionContainStringNode = (binaryExp: TSESTree.BinaryExpression): boolean => {
    if (isStringNode(binaryExp.right))
        return true

    if (binaryExp.left.type === AST_NODE_TYPES.BinaryExpression)
        return doesBinaryExpressionContainStringNode(binaryExp.left)

    return isStringNode(binaryExp.left)
}

export default createEslintRule<Options, MESSAGE_IDS>({
    name: RULE_NAME,
    meta: {
        docs: {
            description: 'Enforce valid titles',
            recommended: 'error'
        },
        messages: {
            titleMustBeString: 'Test title must be a string',
            emptyTitle: '{{functionName}} should not have an empty title',
            duplicatePrefix: 'should not have duplicate prefix',
            accidentalSpace: 'should not have leading or trailing spaces',
            disallowedWord: '"{{word}}" is not allowed in test title',
            mustNotMatch: '{{functionName}} should not match {{pattern}}',
            mustMatch: '{{functionName}} should match {{pattern}}',
            mustNotMatchCustom: '{{message}}',
            mustMatchCustom: '{{message}}'
        },
        type: 'suggestion',
        schema: [
            {
                type: 'object',
                properties: {
                    ignoreTypeOfDescribeName: {
                        type: 'boolean',
                        default: false
                    },
                    allowArguments: {
                        type: 'boolean',
                        default: false
                    },
                    disallowedWords: {
                        type: 'array',
                        items: { type: 'string' }
                    }
                },
                patternProperties: {
                    [/^must(?:Not)?Match$/u.source]: {
                        oneOf: [
                            { type: 'string' },
                            MatcherAndMessageSchema,
                            {
                                type: 'object',
                                propertyNames: { enum: ['describe', 'test', 'it'] },
                                additionalProperties: {
                                    oneOf: [{ type: 'string' }, MatcherAndMessageSchema]
                                }
                            }
                        ]
                    }
                },
                additionalProperties: false
            }
        ],
        fixable: 'code'
    },
    defaultOptions: [{ ignoreTypeOfDescribeName: false, allowArguments: false, disallowedWords: [] }],
    create(context, [
        {
            ignoreTypeOfDescribeName,
            allowArguments,
            disallowedWords = [],
            mustNotMatch,
            mustMatch
        }
    ]) {
        const disallowedWordsRegexp = new RegExp(`\\b(${disallowedWords.join('|')})\\b`, 'iu')

        const mustNotMatchPatterns = compileMatcherPatterns(mustNotMatch ?? {})
        const mustMatchPatterns = compileMatcherPatterns(mustMatch ?? {})

        return {
            CallExpression(node: TSESTree.CallExpression) {
                const vitestFnCall = parseVitestFnCall(node, context)

                if (vitestFnCall?.type !== 'describe' && vitestFnCall?.type !== 'test') return

                const [argument] = node.arguments

                if (!argument || (allowArguments && argument.type === AST_NODE_TYPES.Identifier)) return

                if (!isStringNode(argument)) {
                    if (argument.type === AST_NODE_TYPES.BinaryExpression &&
                        doesBinaryExpressionContainStringNode(argument))
                        return

                    if (argument.type !== AST_NODE_TYPES.TemplateLiteral &&
                        !(ignoreTypeOfDescribeName && vitestFnCall.type === 'describe')) {
                        context.report({
                            messageId: 'titleMustBeString',
                            loc: argument.loc
                        })
                    }
                    return
                }

                const title = getStringValue(argument)

                if (!title) {
                    context.report({
                        messageId: 'emptyTitle',
                        data: {
                            functionName: vitestFnCall.type === 'describe'
                                ? DescribeAlias.describe
                                : TestCaseName.test
                        },
                        node
                    })
                    return
                }

                if (disallowedWords.length > 0) {
                    const disallowedMatch = disallowedWordsRegexp.exec(title)

                    if (disallowedMatch) {
                        context.report({
                            messageId: 'disallowedWord',
                            data: {
                                word: disallowedMatch[1]
                            },
                            node: argument
                        })
                        return
                    }
                }

                if (title.trim().length !== title.length) {
                    context.report({
                        messageId: 'accidentalSpace',
                        node: argument,
                        fix: fixer => [
                            fixer.replaceTextRange(
                                argument.range,
                                quoteStringValue(argument)
                                    .replace(/^([`'"]) +?/u, '$1')
                                    .replace(/ +?([`'"])$/u, '$1')
                            )
                        ]
                    })
                }

                const unPrefixedName = trimFXPrefix(vitestFnCall.name)
                const [firstWord] = title.split(' ')

                if (firstWord.toLowerCase() === unPrefixedName) {
                    context.report({
                        messageId: 'duplicatePrefix',
                        node: argument,
                        fix: fixer => [
                            fixer.replaceTextRange(
                                argument.range,
                                quoteStringValue(argument).replace(/^([`'"]).+? /u, '$1')
                            )
                        ]
                    })
                }

                const vitestFnName = unPrefixedName

                const [mustNotMatchPattern, mustNotMatchMessage] = mustNotMatchPatterns[vitestFnName] ?? []

                if (mustNotMatchPattern) {
                    if (mustNotMatchPattern.test(title)) {
                        context.report({
                            messageId: mustNotMatchMessage ? 'mustNotMatchCustom' : 'mustNotMatch',
                            node: argument,
                            data: {
                                functionName: vitestFnName,
                                pattern: mustNotMatchPattern,
                                message: mustNotMatchMessage
                            }
                        })
                        return
                    }
                }

                const [mustMatchPattern, mustMatchMessage] = mustMatchPatterns[vitestFnName] ?? []

                if (mustMatchPattern) {
                    if (!mustMatchPattern.test(title)) {
                        context.report({
                            messageId: mustMatchMessage ? 'mustMatchCustom' : 'mustMatch',
                            node: argument,
                            data: {
                                functionName: vitestFnName,
                                pattern: mustMatchPattern,
                                message: mustMatchMessage
                            }
                        })
                    }
                }
            }
        }
    }
})
