import { describe, it } from 'vitest'
<<<<<<< HEAD:tests/prefer-to-be-falsy.test.ts
import rule, { RULE_NAME } from '../src/rules/prefer-to-be-falsy'
import { ruleTester } from './ruleTester'
=======
import { ruleTester } from '../utils/test'
import rule, { RULE_NAME } from './prefer-to-be-falsy'
>>>>>>> 0b9528e (chore: update):src/rules/prefer-to-be-falsy.test.ts

const messageId = 'preferToBeFalsy'

describe(RULE_NAME, () => {
	it(RULE_NAME, () => {
		ruleTester.run(RULE_NAME, rule, {
			valid: [
				'[].push(false)',
				'expect("something");',
				'expect(true).toBeTrue();',
				'expect(false).toBeTrue();',
				'expect(false).toBeFalsy();',
				'expect(true).toBeFalsy();',
				'expect(value).toEqual();',
				'expect(value).not.toBeFalsy();',
				'expect(value).not.toEqual();',
				'expect(value).toBe(undefined);',
				'expect(value).not.toBe(undefined);',
				'expect(false).toBe(true)',
				'expect(value).toBe();',
				'expect(true).toMatchSnapshot();',
				'expect("a string").toMatchSnapshot(false);',
				'expect("a string").not.toMatchSnapshot();',
				'expect(something).toEqual(\'a string\');',
				'expect(false).toBe',
				'expectTypeOf(false).toBe'
			],
			invalid: [
				{
					code: 'expect(true).toBe(false);',
					output: 'expect(true).toBeFalsy();',
					errors: [{ messageId, column: 14, line: 1 }]
				},
				{
					code: 'expect(wasSuccessful).toEqual(false);',
					output: 'expect(wasSuccessful).toBeFalsy();',
					errors: [{ messageId, column: 23, line: 1 }]
				},
				{
					code: 'expect(fs.existsSync(\'/path/to/file\')).toStrictEqual(false);',
					output: 'expect(fs.existsSync(\'/path/to/file\')).toBeFalsy();',
					errors: [{ messageId, column: 40, line: 1 }]
				},
				{
					code: 'expect("a string").not.toBe(false);',
					output: 'expect("a string").not.toBeFalsy();',
					errors: [{ messageId, column: 24, line: 1 }]
				},
				{
					code: 'expect("a string").not.toEqual(false);',
					output: 'expect("a string").not.toBeFalsy();',
					errors: [{ messageId, column: 24, line: 1 }]
				},
				{
					code: 'expectTypeOf("a string").not.toEqual(false);',
					output: 'expectTypeOf("a string").not.toBeFalsy();',
					errors: [{ messageId, column: 30, line: 1 }]
				}
			]
		})
	})
})
