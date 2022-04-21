import {
  createAppServer,
  asyncJsonHandler as handler,
  SimpleUsersDao,
} from "@stanlemon/server-with-auth";
import { Low, JSONFile } from "lowdb";

const adapter = new JSONFile("./db.json");

const app = createAppServer({
  webpack: "http://localhost:8080",
  secure: ["/api/"],
  ...new SimpleUsersDao([], adapter),
});

const db = new Low(adapter);
await db.read();
db.data.items ||= [];

app.get(
  "/api/items",
  handler(() => db.data.items)
);

app.post(
  "/api/items",
  handler(async (item) => {
    db.data.items.push(item);
    await db.write();
    return db.data.items;
  })
);
