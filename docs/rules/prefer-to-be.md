# Suggest using toBe() (`vitest/prefer-to-be`)

<<<<<<< HEAD
⚠️ This rule _warns_ in the 🌐 `all` config.

=======
>>>>>>> d24de5b (fix plugin key (#409))
🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

### Correct 

```ts
import { test } from 'vitest'

test('foo', () => {
  expect(1).toBe(1)
})
```

### Incorrect 

```ts
import { test } from 'vitest'

test('foo', () => {
  expect(1).toEqual(1)
})
```
	