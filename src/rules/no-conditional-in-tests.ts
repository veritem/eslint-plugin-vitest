import { createEslintRule } from "../utils";

export const RULE_NAME = "no-conditional-in-tests";
export type MessageIds = "noConditionalInTests";
export type Options = [];

/**  
TODO(WIP @veritem):This rule reports on any use of a conditional statement such as if
switch, and ternary expressions.
*/
export default createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "problem",
    docs: {
      description: "Disallow conditional statements in tests",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      noConditionalInTests: "Conditional statements are not allowed in tests.",
    },
  },
  defaultOptions: [],
  create: (context) => {
    const reserved = ["beforeEach", "describe"];

    return {
      ExpressionStatement(node) {
        // if (callee.type === "Identifier") {
        //     args.forEach(arg => {
        //         if (arg.type === AST_NODE_TYPES.ConditionalExpression && arg.consequent.range) { // if (node.expression.type === "CallExpression") {
        //     const { callee, arguments: args } = node.expression
        //     console.log({ callee })
        //             context.report({
        //                 node,
        //                 messageId: 'noConditionalInTests',
        //             })
        //         }
        //     })
        // }
        // }
      },
    };
  },
});
