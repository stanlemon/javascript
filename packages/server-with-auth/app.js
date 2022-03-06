import { createAppServer, asyncJsonHandler as handler } from "./src/index.js";
import UsersInMemory from "./src/data/users-in-memory.js";

const users = new UsersInMemory({
  username: "user",
  password: "password",
  name: "Test User",
});

const app = createAppServer({
  port: 3003,
  secure: ["/api/"],
  ...users,
});

app.get(
  "/",
  handler(({ name }) => ({ hello: "world" }))
);

app.get(
  "/api/users",
  handler(() => ({ users: users.users }))
);

app.get(
  "/insecure",
  handler(() => ({ secure: false }))
);
