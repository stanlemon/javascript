import { createAppServer, asyncJsonHandler as handler } from "./src/index.js";
import LowDBUserDao, { createDb } from "./src/data/lowdb-user-dao.js";

const db = createDb();
const dao = new LowDBUserDao(db);

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
  handler(() => ({ users: db.data.users }))
);
