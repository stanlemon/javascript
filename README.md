# My Javascript

[![Test](https://github.com/stanlemon/javascript/actions/workflows/test.yml/badge.svg)](https://github.com/stanlemon/javascript/actions/workflows/test.yml)

This repository used to contains things I liked to reuse. They were generic enough that they might have been useful to you too. The reality today is that toolchains have evolved. For example, I think vite is a better choice than webpack and biome a better choices than eslint and prettier. These tools offer better out of the box experiences, and that was ultimately the pain I was trying to solve for myself with these packages. Furthermore, in the age of AI, Claude Code or Codex are going to be a better solution for bootstrapping new projects than any template or CLI I could create. So, I am deprecating all the packages and apps in this repo. They still remain in git history for the curious archaeologist.

Everything exists under the *MIT* license, so please use as you see fit. If you find a bug, please open an issue or a pull request and let me know.

## Recommended Projects

* [@stanlemon/webdev](packages/webdev/README.md) wired up webpack and babel for a great development experience, with support for React, TypeScript, and more. This was the recommended starting point for new projects.

## Deprecated Projects

These packages and apps are deprecated and will not receive further updates. Historical source remains available at the tagged snapshots below.

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
