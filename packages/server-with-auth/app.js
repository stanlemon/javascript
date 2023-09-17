import { createAppServer, asyncJsonHandler as handler } from "./src/index.js";
import LowDBUserDao from "./src/data/lowdb-user-dao.js";

const dao = new LowDBUserDao();

const app = createAppServer({
  port: 3003,
  secure: ["/api/"],
  dao,
});

// Insecure endpoint
app.get(
  "/",
  handler(() => ({ hello: "world" }))
);

// Insecure endpoint
app.get(
  "/hello/:name",
  handler(({ name = "world" }) => ({ hello: name }))
);

// Secure endpoint
app.get(
  "/api/users",
  handler(() => ({ users: dao.getDB().data.users }))
);
