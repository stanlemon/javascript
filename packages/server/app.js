import {
  createAppServer,
  asyncJsonHandler as handler,
  NotFoundException,
} from "./src/index.js";

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
