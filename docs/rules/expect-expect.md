# Enforce having expectation in test body (`vitest/expect-expect`)

💼 This rule is enabled in the ✅ `recommended` config.

<!-- end auto-generated rule header -->

## Rule Details

Examples of **incorrect** code for this rule:

```js
test('myLogic', () => {
	const actual = myLogic()
})
```

Examples of **correct** code for this rule:

```js
test('myLogic', () => {
	const actual = myLogic()
	expect(actual).toBe(true)
})
```
