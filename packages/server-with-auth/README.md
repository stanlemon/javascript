# Express App Server with Authentication

[![npm version](https://badge.fury.io/js/%40stanlemon%2Fserver-with-auth.svg)](https://badge.fury.io/js/%40stanlemon%2Fserver-with-auth)

This is a base express app server that is wired up with sensible defaults, like compression, json support and serving the `dist` folder statically and also includes basic authentication support. It builds off of the [@stanlemon/server](../server/README.md) package.

This package includes authentication against secure endpoints using JWT. There are endpoints for logging in and signing up, as well as basic user management flows such as updating a profile, verifying a user and resetting a password.

When `NODE_ENV=development` the server will also proxy requests to webpack.

This library goes well with [@stanlemon/webdev](../webdev/README.md). You can see this package, along with [@stanlemon/webdev] in action by using the [@stanlemon/app-template](../../apps/template/README.md) package.

```javascript
import {
  createAppServer,
  asyncJsonHandler as handler,
  NotFoundException,
  LowDBUserDao,
  createLowDb
} from "@stanlemon/server-with-auth";
import  from "./src/data/lowdb-user-dao.js";

const db = createLowDb();
const dao = new LowDBUserDao(db);

const app = createAppServer({
  port: 3003,secure: ["/api/"],
  schemas,
  dao,
 });


// Insecure endpoint
app.get(
  "/",
  handler(() => ({ hello: "world" }))
);

// Secure endpoint
app.get(
  "/api/users",
  handler(() => ({
    users: db.data.users.map((u) =>
      omit(u, ["password", "verification_token"])
    ),
  }))
);
```
