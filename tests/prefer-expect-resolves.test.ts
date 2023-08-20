import { it, describe } from 'vitest'
<<<<<<< HEAD:tests/prefer-expect-resolves.test.ts
import rule, { RULE_NAME } from '../src/rules/prefer-expect-resolves'
import { ruleTester } from './ruleTester'
=======
import { ruleTester } from '../utils/test'
import rule, { RULE_NAME } from './prefer-expect-resolves'
>>>>>>> 0b9528e (chore: update):src/rules/prefer-expect-resolves.test.ts

const messageId = 'expectResolves'

describe(RULE_NAME, () => {
	it(RULE_NAME, () => {
		ruleTester.run(RULE_NAME, rule, {
			valid: [
				'expect.hasAssertions()',
				`it('passes', async () => {
					await expect(someValue()).resolves.toBe(true);
				  });`,
				`it('is true', async () => {
		        const myPromise = Promise.resolve(true);

		        await expect(myPromise).resolves.toBe(true);
		      });
		    `,
				`it('errors', async () => {
		        await expect(Promise.reject(new Error('oh noes!'))).rejects.toThrowError(
		          'oh noes!',
		        );
		     });`,
				'expect().nothing();'
			],
			invalid: [
				{
					code: 'it(\'passes\', async () => { expect(await someValue()).toBe(true); });',
					output: 'it(\'passes\', async () => { await expect(someValue()).resolves.toBe(true); });',
					errors: [{
						messageId
					}]
				},
				{
					code: 'it(\'is true\', async () => { const myPromise = Promise.resolve(true); expect(await myPromise).toBe(true); });',
					output: 'it(\'is true\', async () => { const myPromise = Promise.resolve(true); await expect(myPromise).resolves.toBe(true); });',
					errors: [
						{
							messageId,
							endColumn: 92,
							column: 77
						}
					]
				}
			]
		})
	})
})
