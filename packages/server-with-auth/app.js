import { createAppServer, asyncJsonHandler as handler } from "./src/index.js";
import SimpleUsersDao from "./src/data/simple-users-dao.js";

const users = new SimpleUsersDao();

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
  handler(() => ({ users: users.db.data.users }))
);

app.get(
  "/insecure",
  handler(() => ({ secure: false }))
);
