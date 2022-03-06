import { createAppServer, asyncJsonHandler as handler } from "./src/index.js";
import SimpleUsersDao from "./src/data/simple-users-dao.js";

const users = new SimpleUsersDao([
  {
    username: "user",
    password: "password",
  },
]);

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
