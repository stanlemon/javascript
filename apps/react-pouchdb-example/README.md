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

