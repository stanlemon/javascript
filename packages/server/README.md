# Express App Server

[![npm version](https://badge.fury.io/js/%40stanlemon%2Fserver.svg)](https://badge.fury.io/js/%40stanlemon%2Fserver)

This is a base express app server that is wired up with sensible defaults, like compression, json support and serving the `dist` folder statically.

It also include a function called `asyncJsonHandler` which is a wrapper for most express requests. It standardizes input/output as JSON, accepting camel case properties and snake casing them for output. It also covers a bunch of standard error behaviors.

When `NODE_ENV=development` the server will also proxy requests to webpack.

This library goes well with [@stanlemon/webdev](../webdev/README.md).

```javascript
import {
  createAppServer,
  asyncJsonHandler as handler,
  NotFoundException,
} from "@stanlemon/server";

const app = createAppServer({ port: 3003 });

// curl http://localhost:3003/hello?name=Stanley
app.get(
  "/hello",
  handler(({ name }) => ({ hello: name || "Stan" }))
);

// curl http://localhost:3003/hello/Stan
app.get(
  "/hello/Stan",
  // Promises are handled correctly
  handler(() => {
    // This is the same as just hitting /hello, so we'll demonstrate the exception handling
    throw new NotFoundException();
  })
);

// curl http://localhost:3003/hello/Stanley
app.get(
  "/hello/:name",
  // Promises are handled correctly
  handler(({ name }) => Promise.resolve({ hello: name || "Stan" }))
);

// curl -X POST http://localhost:3003/hello -H 'Content-Type: application/json' -d '{"name": "Stanley"}'
app.post(
  "/hello",
  // You can also use async/await
  handler(async ({ name }) => await Promise.resolve({ hello: name || "Stan" }))
);
```
