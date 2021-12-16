# ESLint Config

ESLint is great, but it takes a lot to setup! This is my attempt to create a package that contains all of the dependencies I need, plus a simple config to use.

To use this, simply create the following file:

.eslintrc.json
```json
{
  "extends": [
    "@stanlemon"
  ]
}
```

For the most part this config utilizes `create-react-app` with support for `typescript` (only in typescript files) and is consistent with `prettier` formatting.

If you don't like it, use something else. ;)
