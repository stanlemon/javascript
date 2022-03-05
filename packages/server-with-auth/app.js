import {
  createAppServer,
  asyncJsonHandler as handler,
  checkAuth,
} from "./src/index.js";
import UserSample from "./src/data/user.sample.js";

const users = new UserSample({ username: "user", password: "password" });

const app = createAppServer({
  port: 3003,
  ...users,
});

app.get(
  "/",
  handler(({ name }) => ({ hello: name || "Stan" }))
);

app.use("/secure", checkAuth());

app.get(
  "/secure",
  handler(() => ({ secure: true }))
);
