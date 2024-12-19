# Alternative PouchDB Types for TypeScript

If you are using Typescript in your project, the PouchDB types `@types/pouchdb` can be problematic because they declare several types in the global namespace that exist in `@types/node`. This package is a fork of []`@types/pouchdb-core`](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/pouchdb-core) that removes the `Buffer` type from the global namespace, thus making it usable in modern Typescript projects.

This issue is pretty documented, for example [here](https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/62134) and [here](https://stackoverflow.com/questions/68833139/cannot-export-buffer-only-local-declarations-can-be-exported-from-a-module).

**I did not create these types, please check out the original package for all the details.**

## Usage

You can use these alternative types by adding the following to your package.json to override `@types/pouchdb-core` where the problem exists.

```json
{
  "devDependencies": {
    "@types/pouchdb": "^6.4.2",
    "@types/debug": "^4.1.12"
  },
  "overrides": {
    "@types/pouchdb-core": "npm:@stanlemon/types-pouchdb-core@^0.0.3"
  }
}
```
