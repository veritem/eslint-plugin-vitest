# Disallow importing `node:test` (`vitest/no-import-node-test`)

<<<<<<< HEAD
💼 This rule is enabled in the ✅ `recommended` config.

=======
>>>>>>> d24de5b (fix plugin key (#409))
🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

This rule warns when `node:test` is imported (usually accidentally). With `--fix`, it will replace the import with `vitest`.

Examples of **incorrect** code for this rule:

```ts
import { test } from 'node:test'
import { expect } from 'vitest'

test('foo', () => {
  expect(1).toBe(1)
})
```

Examples of **correct** code for this rule:

```ts
import { test, expect } from 'vitest'

test('foo', () => {
  expect(1).toBe(1)
})
```
