# My JavaScript

This repository maintains a shared Renovate configuration. All npm packages and example apps are retired. The [MIT license](LICENSE) applies to this repository.

## Renovate

The [shared Renovate configuration](renovate.json5) starts from `config:best-practices`. It groups related dependencies and merges stable minor and patch updates when checks pass. Major updates require review. Security fixes can merge automatically when checks pass.

Add this entry to your repository's `renovate.json`:

```json
{
  "extends": [
    "github>stanlemon/javascript:renovate.json5"
  ]
}
```

To opt in to automatic major updates, add the [aggressive preset](aggressive.json5) after the baseline:

```json
{
  "extends": [
    "github>stanlemon/javascript:renovate.json5",
    "github>stanlemon/javascript:aggressive.json5"
  ]
}
```

The aggressive preset waits until each major release is at least 21 days old. Missing release timestamps block those updates. Renovate merges through a PR after CI passes and refreshes branches that fall behind the base. Failed or pending CI blocks merging. A passing release-age result alone does not count as passing CI.

Node.js runtime majors still require review after seven months. The baseline rules for pre-1.0 minor and patch updates, peers, maintenance, and security fixes still apply.

Keep the baseline alone for repositories that need manual review of major updates. Remove the aggressive entry to return to that policy. Repository-level rules apply after presets and can override these safeguards.

Run `npm ci` to install the locked validation tool, then `npm run renovate:check` from the repository root to validate both preset schemas and test both policies. Both checks use the exact Renovate development dependency; Renovate manages updates to that version through `package.json` and `package-lock.json`. `npm run renovate:validate` runs only the schema validator; `npm test` runs only the behavior scenarios.

Tooling overrides select the advisory fixes for affected glob and minimatch versions. They leave older, unaffected callback-based glob consumers unchanged. The schema and behavior checks validate this installation.

The scenarios cover manual and aggressive major upgrades, stable and pre-1.0 updates, Node runtime majors, peers, maintenance, and security fixes. They resolve Renovate defaults and built-in presets before applying its real package rules, so valid config changes that alter these policies fail CI.

## Deprecated Projects

These packages and apps receive no further updates. Their source remains available in Git.

### Webdev

[@stanlemon/webdev](https://github.com/stanlemon/javascript/tree/820834069030885114c3c8eaa5b2d30c1bccd94a/packages/webdev) provided shared Webpack, Babel, and Jest configuration. Published versions remain available on npm.

### Deprecated at `deprecate-packages`

* [@stanlemon/react-couchdb-authentication](https://github.com/stanlemon/javascript/tree/deprecate-packages/packages/react-couchdb-authentication) - React components for CouchDB authentication
* [@stanlemon/react-pouchdb](https://github.com/stanlemon/javascript/tree/deprecate-packages/packages/react-pouchdb) - React components for PouchDB
* [@stanlemon/types-pouchdb-core](https://github.com/stanlemon/javascript/tree/deprecate-packages/packages/types-pouchdb-core) - TypeScript types for PouchDB core
* [@stanlemon/react-pouchdb-example](https://github.com/stanlemon/javascript/tree/deprecate-packages/apps/react-pouchdb-example) - Example app using React PouchDB
* [@stanlemon/cli](https://github.com/stanlemon/javascript/tree/deprecate-packages/packages/cli) - CLI for creating new web apps

### Deprecated at `deprecate-2026-03-app-template-hello-world-servers`

* [@stanlemon/app-template](https://github.com/stanlemon/javascript/tree/deprecate-2026-03-app-template-hello-world-servers/apps/template) - Full-stack starter app built on `@stanlemon/webdev` and `@stanlemon/server-with-auth`
* [@stanlemon/hello-world](https://github.com/stanlemon/javascript/tree/deprecate-2026-03-app-template-hello-world-servers/apps/hello-world) - Hello world example app for `@stanlemon/webdev`
* [@stanlemon/server](https://github.com/stanlemon/javascript/tree/deprecate-2026-03-app-template-hello-world-servers/packages/server) - Basic Express server setup
* [@stanlemon/server-with-auth](https://github.com/stanlemon/javascript/tree/deprecate-2026-03-app-template-hello-world-servers/packages/server-with-auth) - Express server setup with authentication helpers

### Deprecated at `deprecate-2026-04-eslint-config`

* [@stanlemon/eslint-config](https://github.com/stanlemon/javascript/tree/24c306284bd367bbafb3937991879968f3851ba5/packages/eslint-config) - Shared ESLint and Prettier configuration
