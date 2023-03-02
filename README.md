## eslint-plugin-vitest

![npm](https://img.shields.io/npm/v/eslint-plugin-vitest)
[![ci](https://github.com/veritem/eslint-plugin-vitest/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/veritem/eslint-plugin-vitest/actions/workflows/ci.yml)

Eslint plugin for vitest

### Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-vitest`:

```sh
npm install eslint-plugin-vitest --save-dev
```

### Usage

Add `vitest` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["vitest"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "vitest/max-nested-describe": [
      "error",
      {
        "max": 3
      }
    ]
  }
}
```

#### Recommended

To use the recommended configuration, extend it in your `.eslintrc` file:

```json
{
  "extends": ["plugin:vitest/recommended"]
}
```

#### all

To use the all configuration, extend it in your `.eslintrc` file:

```json
{
  "extends": ["plugin:vitest/all"]
}
```

### Rules

<!-- begin auto-generated rules list -->

⚠️ Configurations set to warn in.\
🌐 Set in the `all` configuration.\
✅ Set in the `recommended` configuration.\
🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).\
💡 Manually fixable by [editor suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

| Name                                                                         | Description                                                              | ⚠️ | 🔧 | 💡 |
| :--------------------------------------------------------------------------- | :----------------------------------------------------------------------- | :- | :- | :- |
| [consistent-test-filename](docs/rules/consistent-test-filename.md)           | forbidden .spec test file pattern                                        | 🌐 |    |    |
| [consistent-test-it](docs/rules/consistent-test-it.md)                       | Prefer test or it but not both                                           | 🌐 | 🔧 |    |
| [expect-expect](docs/rules/expect-expect.md)                                 | Enforce having expectation in test body                                  | ✅  |    |    |
| [max-expects](docs/rules/max-expects.md)                                     | Enforce a maximum number of expect per test                              | 🌐 |    |    |
| [max-nested-describe](docs/rules/max-nested-describe.md)                     | Nested describe block should be less than set max value or default value | 🌐 |    |    |
| [no-alias-methods](docs/rules/no-alias-methods.md)                           | Disallow alias methods                                                   | 🌐 | 🔧 |    |
| [no-commented-out-tests](docs/rules/no-commented-out-tests.md)               | Disallow commented out tests                                             | ✅  |    |    |
| [no-conditional-expect](docs/rules/no-conditional-expect.md)                 | Disallow conditional expects                                             | 🌐 |    |    |
| [no-conditional-in-test](docs/rules/no-conditional-in-test.md)               | Disallow conditional tests                                               | 🌐 |    |    |
| [no-conditional-tests](docs/rules/no-conditional-tests.md)                   | Disallow conditional tests                                               | 🌐 |    |    |
| [no-disabled-tests](docs/rules/no-disabled-tests.md)                         | Disallow disabled tests                                                  | 🌐 |    |    |
| [no-done-callback](docs/rules/no-done-callback.md)                           | Disallow using a callback in asynchrounous tests and hooks               | 🌐 |    | 💡 |
| [no-duplicate-hooks](docs/rules/no-duplicate-hooks.md)                       | Disallow duplicate hooks and teardown hooks                              | 🌐 |    |    |
| [no-focused-tests](docs/rules/no-focused-tests.md)                           | Disallow focused tests                                                   | 🌐 | 🔧 |    |
| [no-hooks](docs/rules/no-hooks.md)                                           | Disallow setup and teardown hooks                                        | 🌐 |    |    |
| [no-identical-title](docs/rules/no-identical-title.md)                       | Disallow identical titles                                                | ✅  | 🔧 |    |
| [no-interpolation-in-snapshots](docs/rules/no-interpolation-in-snapshots.md) | Disallow string interpolation in snapshots                               | 🌐 | 🔧 |    |
| [no-large-snapshots](docs/rules/no-large-snapshots.md)                       | Disallow large snapshots                                                 | 🌐 |    |    |
| [no-mocks-import](docs/rules/no-mocks-import.md)                             | Disallow importing from __mocks__ directory                              | 🌐 |    |    |
| [no-restricted-vi-methods](docs/rules/no-restricted-vi-methods.md)           | Disallow specific `vi.` methods                                          | 🌐 |    |    |
| [no-skipped-tests](docs/rules/no-skipped-tests.md)                           | Disallow skipped tests                                                   | 🌐 |    |    |
| [prefer-lowercase-title](docs/rules/prefer-lowercase-title.md)               | Enforce lowercase titles                                                 | 🌐 | 🔧 |    |
| [prefer-to-be](docs/rules/prefer-to-be.md)                                   | Suggest using toBe()                                                     | ✅  | 🔧 |    |

<!-- end auto-generated rules list -->

#### Credits

- [eslint-plugin-jest](https://github.com/jest-community/eslint-plugin-jest)

### Licence

[MIT](https://github.com/veritem/eslint-plugin-vitest/blob/main/LICENSE) Licence &copy; 2022 - present [veritem](https://github.com/veritem)
