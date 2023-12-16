import { createEslintRule, getAccessorValue, replaceAccessorFixer } from '../utils'
import { parseVitestFnCall } from '../utils/parseVitestFnCall'

export const RULE_NAME = 'no-alias-methods'
export type MESSAGE_ID = 'noAliasMethods'
export type Options = []

export default createEslintRule<Options, MESSAGE_ID>({
    name: RULE_NAME,
    meta: {
        docs: {
            description: 'Disallow alias methods',
            requiresTypeChecking: false,
            recommended: 'error'
        },
        messages: {
            noAliasMethods: 'Replace {{ alias }}() with its canonical name {{ canonical }}()'
        },
        type: 'suggestion',
        fixable: 'code',
        schema: []
    },
    defaultOptions: [],
    create(context) {
        const methodNames: Record<string, string> = {
            toBeCalled: 'toHaveBeenCalled',
            toBeCalledTimes: 'toHaveBeenCalledTimes',
            toBeCalledWith: 'toHaveBeenCalledWith',
            lastCalledWith: 'toHaveBeenLastCalledWith',
            nthCalledWith: 'toHaveBeenNthCalledWith',
            toReturn: 'toHaveReturned',
            toReturnTimes: 'toHaveReturnedTimes',
            toReturnWith: 'toHaveReturnedWith',
            lastReturnedWith: 'toHaveLastReturnedWith',
            nthReturnedWith: 'toHaveNthReturnedWith',
            toThrowError: 'toThrow'
        }

        return {
            CallExpression(node) {
                const vitestFnCall = parseVitestFnCall(node, context)

                if (vitestFnCall?.type !== 'expect')
                    return

                const { matcher } = vitestFnCall

                const alias = getAccessorValue(matcher)

                if (alias in methodNames) {
                    const canonical = methodNames[alias]

                    context.report({
                        messageId: 'noAliasMethods',
                        data: { alias, canonical },
                        node: matcher,
                        fix: fixer => [replaceAccessorFixer(fixer, matcher, canonical)]
                    })
                }
            }
        }
    }
})
