import {
  createAppServer,
  asyncJsonHandler as handler,
  checkAuth,
} from "./src/index.js";
import UsersInMemory from "./src/data/users-in-memory.js";

const users = new UsersInMemory({
  id: 1,
  username: "user",
  password: "password",
  name: "Test User",
});

const app = createAppServer({
  port: 3003,
  ...users,
});

app.get(
  "/",
  handler(({ name }) => ({ hello: "world" }))
);

app.use("/api/", checkAuth());

app.get(
  "/api/users",
  handler(() => ({ users: users.users }))
);

app.get(
  "/insecure",
  handler(() => ({ secure: false }))
);
