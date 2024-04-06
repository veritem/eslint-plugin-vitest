# Nested describe block should be less than set max value or default value (`vitest/max-nested-describe`)

<<<<<<< HEAD
⚠️ This rule _warns_ in the 🌐 `all` config.

=======
>>>>>>> d24de5b (fix plugin key (#409))
<!-- end auto-generated rule header -->

## Rule Details

Examples of **incorrect** code for this rule with `max: 1`:

```js
describe('outer', () => {
	describe('inner', () => {
		// ...
	})
})
```

Examples of **correct** code for this rule:

```js
describe('inner', () => {
	// ...
})
```

## Options

> Default: `5`

Maximum number of nested `describe` blocks.

```js
{
	max: number
}
```
