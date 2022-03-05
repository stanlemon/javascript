import {
  createAppServer,
  asyncJsonHandler as handler,
  UsersInMemory,
} from "@stanlemon/server-with-auth";

const users = new UsersInMemory({
  id: 1,
  username: "user",
  password: "password",
  name: "Test User",
});

const app = createAppServer({
  webpack: "http://localhost:8080",
  secure: ["/api/"],
  ...users,
});

app.get(
  "/api/users",
  handler(() => ({ users: users.users }))
);
