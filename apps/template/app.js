import {
  createAppServer,
  asyncJsonHandler as handler,
  SimpleUsersDao,
} from "@stanlemon/server-with-auth";
import { Low, JSONFile } from "lowdb";

const app = createAppServer({
  webpack: "http://localhost:8080",
  secure: ["/api/"],
  ...new SimpleUsersDao(),
});

const db = new Low(new JSONFile("./db.json"));
await db.read();
db.data.items ||= [];

app.get(
  "/api/items",
  handler(() => ({ items: db.data.items }))
);

app.post(
  "/api/items",
  handler(async (item) => {
    db.data.items.push(item);
    await db.write();
    return db.data.items;
  })
);
