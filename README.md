# My JavaScript

This repository maintains a shared Renovate configuration. All npm packages and example apps are retired. The [MIT license](LICENSE) applies to this repository.

## Renovate

The [shared Renovate configuration](renovate.json5) starts from `config:best-practices`. It groups related dependencies and merges stable minor and patch updates when checks pass. Major updates and security updates stay open for review.

Add this entry to your repository's `renovate.json`:

```json
{
  "extends": [
    "github>stanlemon/javascript:renovate.json5"
  ]
}
```

Run `npm run renovate:validate` from the repository root. This command downloads the Renovate validator when needed.

## Deprecated Projects

These packages and apps receive no further updates. Their source remains available in Git.

### Webdev

[@stanlemon/webdev](https://github.com/stanlemon/javascript/tree/820834069030885114c3c8eaa5b2d30c1bccd94a/packages/webdev) provided shared Webpack, Babel, and Jest configuration. Published versions remain available on npm.

### Deprecated at `deprecate-packages`

* [@stanlemon/react-couchdb-authentication](https://github.com/stanlemon/javascript/tree/deprecate-packages/packages/react-couchdb-authentication) - React components for CouchDB authentication
* [@stanlemon/react-pouchdb](https://github.com/stanlemon/javascript/tree/deprecate-packages/packages/react-pouchdb) - React components for PouchDB
* [@stanlemon/types-pouchdb-core](https://github.com/stanlemon/javascript/tree/deprecate-packages/packages/types-pouchdb-core) - TypeScript types for PouchDB core
* [@stanlemon/react-pouchdb-example](https://github.com/stanlemon/javascript/tree/deprecate-packages/packages/react-pouchdb-example) - Example app using React PouchDB
* [@stanlemon/cli](https://github.com/stanlemon/javascript/tree/deprecate-packages/packages/cli) - CLI for creating new web apps

### Deprecated at `deprecate-2026-03-app-template-hello-world-servers`

* [@stanlemon/app-template](https://github.com/stanlemon/javascript/tree/deprecate-2026-03-app-template-hello-world-servers/apps/template) - Full-stack starter app built on `@stanlemon/webdev` and `@stanlemon/server-with-auth`
* [@stanlemon/hello-world](https://github.com/stanlemon/javascript/tree/deprecate-2026-03-app-template-hello-world-servers/apps/hello-world) - Hello world example app for `@stanlemon/webdev`
* [@stanlemon/server](https://github.com/stanlemon/javascript/tree/deprecate-2026-03-app-template-hello-world-servers/packages/server) - Basic Express server setup
* [@stanlemon/server-with-auth](https://github.com/stanlemon/javascript/tree/deprecate-2026-03-app-template-hello-world-servers/packages/server-with-auth) - Express server setup with authentication helpers

### Deprecated at `deprecate-2026-04-eslint-config`

* [@stanlemon/eslint-config](https://github.com/stanlemon/javascript/tree/deprecate-2026-04-eslint-config/packages/eslint-config) - Shared ESLint and Prettier config, replaced in this repo by Biome-based tooling
