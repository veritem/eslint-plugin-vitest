import { AST_NODE_TYPES } from '@typescript-eslint/utils'
import rule, { RULE_NAME } from '../src/rules/expect-expect'
import { ruleTester } from './ruleTester'

ruleTester.run(RULE_NAME, rule, {
  valid: [
    'test.skip("skipped test", () => {})',
    'it.todo("will test something eventually")',
    'test.todo("will test something eventually")',
    '[\'x\']();',
    'it("should pass", () => expect(true).toBeDefined())',
    'test("should pass", () => expect(true).toBeDefined())',
    'it("should pass", () => somePromise().then(() => expect(true).toBeDefined()))',
    'it("should pass", myTest); function myTest() { expect(true).toBeDefined() }',
    {
      code: `
   test('should pass', () => {
    expect(true).toBeDefined();
    foo(true).toBe(true);
   });
   `,
      options: [{ assertFunctionNames: ['expect', 'foo'] }]
    },
    {
      code: `
   import { bench } from 'vitest'

   bench('normal sorting', () => {
    const x = [1, 5, 4, 2, 3]
    x.sort((a, b) => {
     return a - b
    })
     }, { time: 1000 })
   `
    },
    {
      code: 'it("should return undefined",() => expectSaga(mySaga).returns());',
      options: [{ assertFunctionNames: ['expectSaga'] }]
    },
    {
      code: 'test(\'verifies expect method call\', () => expect$(123));',
      options: [{ assertFunctionNames: ['expect\\$'] }]
    },
    {
      code: 'test(\'verifies expect method call\', () => new Foo().expect(123));',
      options: [{ assertFunctionNames: ['Foo.expect'] }]
    },
    {
      code: `
   test('verifies deep expect method call', () => {
    tester.foo().expect(123);
   });
   `,
      options: [{ assertFunctionNames: ['tester.foo.expect'] }]
    },
    {
      code: `
   test('verifies chained expect method call', () => {
    tester
    .foo()
    .bar()
    .expect(456);
   });
   `,
      options: [{ assertFunctionNames: ['tester.foo.bar.expect'] }]
    },
    {
      code: `
   test("verifies the function call", () => {
    td.verify(someFunctionCall())
   })
   `,
      options: [{ assertFunctionNames: ['td.verify'] }]
    },
    {
      code: 'it("should pass", () => expect(true).toBeDefined())',
      options: [
        {
          assertFunctionNames: undefined,
          additionalTestBlockFunctions: undefined
        }
      ]
    },
    {
      code: `
   theoretically('the number {input} is correctly translated to string', theories, theory => {
    const output = NumberToLongString(theory.input);
    expect(output).toBe(theory.expected);
   })
   `,
      options: [{ additionalTestBlockFunctions: ['theoretically'] }]
    },
    {
      code: 'test(\'should pass *\', () => expect404ToBeLoaded());',
      options: [{ assertFunctionNames: ['expect*'] }]
    },
    {
      code: 'test(\'should pass *\', () => expect.toHaveStatus404());',
      options: [{ assertFunctionNames: ['expect.**'] }]
    },
    {
      code: 'test(\'should pass\', () => tester.foo().expect(123));',
      options: [{ assertFunctionNames: ['tester.*.expect'] }]
    },
    {
      code: 'test(\'should pass **\', () => tester.foo().expect(123));',
      options: [{ assertFunctionNames: ['**'] }]
    },
    {
      code: 'test(\'should pass *\', () => tester.foo().expect(123));',
      options: [{ assertFunctionNames: ['*'] }]
    },
    {
      code: 'test(\'should pass\', () => tester.foo().expect(123));',
      options: [{ assertFunctionNames: ['tester.**'] }]
    },
    {
      code: 'test(\'should pass\', () => tester.foo().expect(123));',
      options: [{ assertFunctionNames: ['tester.*'] }]
    },
    {
      code: 'test(\'should pass\', () => tester.foo().bar().expectIt(456));',
      options: [{ assertFunctionNames: ['tester.**.expect*'] }]
    },
    {
      code: 'test(\'should pass\', () => request.get().foo().expect(456));',
      options: [{ assertFunctionNames: ['request.**.expect'] }]
    },
    {
      code: 'test(\'should pass\', () => request.get().foo().expect(456));',
      options: [{ assertFunctionNames: ['request.**.e*e*t'] }]
    },
    {
      code: `
   import { test } from 'vitest';

   test('should pass', () => {
    expect(true).toBeDefined();
    foo(true).toBe(true);
   });
   `,
      options: [{ assertFunctionNames: ['expect', 'foo'] }],
      languageOptions: { parserOptions: { sourceType: 'module' } }
    },
    {
      code: `
   import { test as checkThat } from 'vitest';

   checkThat('this passes', () => {
    expect(true).toBeDefined();
    foo(true).toBe(true);
         });
   `,
      options: [{ assertFunctionNames: ['expect', 'foo'] }],
      languageOptions: { parserOptions: { sourceType: 'module' } }
    },
    {
      code: `
   const { test } = require('vitest');

   test('verifies chained expect method call', () => {
    tester
    .foo()
    .bar()
    .expect(456);
   });
   `,
      options: [{ assertFunctionNames: ['tester.foo.bar.expect'] }],
      languageOptions: { parserOptions: { sourceType: 'module' } }
    },
    {
      code: `
   it("should pass with 'typecheck' enabled", () => {
    expectTypeOf({ a: 1 }).toEqualTypeOf<{ a: number }>()
   });
   `,
      settings: { vitest: { typecheck: true } }
    },
    {
      code: `
    it.extend({ 
      theForce: async ({}, use) => { await use("Space Magic") },
      luke: async ({first}, use) => { await use(theForce) } 
    })
    `,
      name: "should allow it.extend"
    },
    {
      code: `
    async function theForce ({}, use) { await use("Space Magic") }
    const luke = async ({first}, use) => { await use(theForce) }; 
    const testOfStrength = it.extend({ theForce, luke });
    `,
      name: "should allow it.extend with extracted fixtures"
    },
    {
      code: `
    const myTest = base.extend({
      fixture: [
        async ({}, use) => {
          // this function will run
          setup()
          await use()
          teardown()
        },
        { auto: true }
      ],
    })
    myTest("should pass this", ()=>{
      expect(true).toBe(true);
    })
      `,
      options: [{
        "additionalTestBlockFunctions":[ "myTest"],
        "assertFunctionNames": ["expect"]
      }]
    }
  ],
  invalid: [
    {
      code: 'it("should fail", () => {});',
      errors: [
        {
          messageId: 'noAssertions',
          type: AST_NODE_TYPES.Identifier
        }
      ]
    },
    {
      code: 'it("should fail", myTest); function myTest() {}',
      errors: [
        {
          messageId: 'noAssertions',
          type: AST_NODE_TYPES.Identifier
        }
      ]
    },
    {
      code: 'test("should fail", () => {});',
      errors: [
        {
          messageId: 'noAssertions',
          type: AST_NODE_TYPES.Identifier
        }
      ]
    },
    {
      code: 'afterEach(() => {});',
      options: [{ additionalTestBlockFunctions: ['afterEach'] }],
      errors: [
        {
          messageId: 'noAssertions',
          type: AST_NODE_TYPES.Identifier
        }
      ]
    },
    {
      code: `
   theoretically('the number {input} is correctly translated to string', theories, theory => {
    const output = NumberToLongString(theory.input);
   })
   `,
      options: [{ additionalTestBlockFunctions: ['theoretically'] }],
      errors: [
        {
          messageId: 'noAssertions',
          type: AST_NODE_TYPES.Identifier
        }
      ]
    },
    {
      code: 'it("should fail", () => { somePromise.then(() => {}); });',
      errors: [
        {
          messageId: 'noAssertions',
          type: AST_NODE_TYPES.Identifier
        }
      ]
    },
    {
      code: 'test("should fail", () => { foo(true).toBe(true); })',
      options: [{ assertFunctionNames: ['expect'] }],
      errors: [
        {
          messageId: 'noAssertions',
          type: AST_NODE_TYPES.Identifier
        }
      ]
    },
    {
      code: 'it("should also fail",() => expectSaga(mySaga).returns());',
      options: [{ assertFunctionNames: ['expect'] }],
      errors: [
        {
          messageId: 'noAssertions',
          type: AST_NODE_TYPES.Identifier
        }
      ]
    },
    {
      code: 'test(\'should fail\', () => request.get().foo().expect(456));',
      options: [{ assertFunctionNames: ['request.*.expect'] }],
      errors: [
        {
          messageId: 'noAssertions',
          type: AST_NODE_TYPES.Identifier
        }
      ]
    },
    {
      code: 'test(\'should fail\', () => request.get().foo().bar().expect(456));',
      options: [{ assertFunctionNames: ['request.foo**.expect'] }],
      errors: [
        {
          messageId: 'noAssertions',
          type: AST_NODE_TYPES.Identifier
        }
      ]
    },
    {
      code: 'test(\'should fail\', () => tester.request(123));',
      options: [{ assertFunctionNames: ['request.*'] }],
      errors: [
        {
          messageId: 'noAssertions',
          type: AST_NODE_TYPES.Identifier
        }
      ]
    },
    {
      code: 'test(\'should fail\', () => request(123));',
      options: [{ assertFunctionNames: ['request.*'] }],
      errors: [
        {
          messageId: 'noAssertions',
          type: AST_NODE_TYPES.Identifier
        }
      ]
    },
    {
      code: 'test(\'should fail\', () => request(123));',
      options: [{ assertFunctionNames: ['request.**'] }],
      errors: [
        {
          messageId: 'noAssertions',
          type: AST_NODE_TYPES.Identifier
        }
      ]
    },
    {
      code: `
   import { test as checkThat } from 'vitest';

   checkThat('this passes', () => {
    // ...
   });
   `,
      languageOptions: { parserOptions: { sourceType: 'module' } },
      errors: [
        {
          messageId: 'noAssertions',
          type: AST_NODE_TYPES.Identifier
        }
      ]
    },
    {
      code: `
   it("should fail without 'typecheck' enabled", () => {
    expectTypeOf({ a: 1 }).toEqualTypeOf<{ a: number }>()
   });
   `,
      errors: [
        {
          messageId: 'noAssertions',
          type: AST_NODE_TYPES.Identifier
        }
      ]
    },
    {
      code: `
    import { it } from 'vitest';
    const myExtendedTest = it.extend({
      fixture: [
        async ({}, use) => {
          // this function will run
          setup()
          await use()
          teardown()
        },
        { auto: true }
      ],
    })
    myExtendedTest("should still fail when using the extended test", ()=> {
      // ...
    })
      `,
      options: [{ additionalTestBlockFunctions: ['myExtendedTest'] }], 
      languageOptions: { parserOptions: { sourceType: 'module' } },
      errors: [
        {
          messageId: 'noAssertions',
          type: AST_NODE_TYPES.Identifier
        }
      ]
    }
  ]
})
