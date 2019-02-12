# Parcel App

A react app using pouchdb built with parcel in typescript.

This repository is a personal playground for setting up and configuring a specific toolchain.

To get started:
```shell
npm install
```

To run the app:
```shell
npm start
```

To run the tests:
```shell
npm test
```

## Syncing to a Remote Database

The `<PouchDb.Database>` component has an attribute called `remote` that can be either a `PouchDB` instance or a valid URL for a CouchBD compatible database instance. If you want a quick and easy way to test this out, install `pouchdb-server` and run it.

Install `pouchdb-server`:

```shell
npm install -g pouchdb-server
```

Run `pouchdb-server`:
```shell
pouchdb-server -m
```
_The `-m` attribute stores data in memory only, if you would rather use sql do `npm install -g pouchdb-adapter-node-websql` and then use the `--sqlite` argument when starting the `pouchdb-server` instance instead of `-m`._

## PouchDB Components

Several components for making PouchDB easy to use are included.

To beging using, start with the `<Database />` component which must be used at the highest level you wish to use PouchDB at.

```tsx
<Database database="local" remote="http://127.0.0.1:5984/test">
  <h1>Database</h1>
</Database>
```

If you want to get the PouchDB instance as a `db` property on a component, simply wrap it in `<Aware/>`.

```tsx
<Database>
  <Aware>
    <DatabaseInfo />
  </Aware>
</Database>
```

Any component can be wrapped in a `<Document />` which loads data from a PouchDB document, receives changes if that local PouchDB instance is syncing from a remote CouchDB instance, and provides a `putDocument()` method that can be used in place of `setState()` under most circumstances.

Using a higher order function:
```tsx
import { Counter } from "./Counter";
const WrappedCounter = withDocument("counter", Counter);
<WrappedCounter />
```

Using the component and wrapping children:
```tsx
import { Notes } from "./Notes";
<Document id="notes" loading={<div>Loading Notes...</div>}>
  <Notes />
</Document>
```

Using the component with the 'component' property
```tsx
import { Tasks } from "./Tasks";
<Document id="tasks" component={<Tasks />} />
```