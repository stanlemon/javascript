import {
  createAppServer,
  asyncJsonHandler as handler,
  createDb,
  LowDBUserDao,
} from "@stanlemon/server-with-auth";
import { v4 as uuid } from "uuid";

export const db = createDb();
const dao = new LowDBUserDao(db);

db.data.items = db.data.items || [];

export const app = createAppServer({
  webpack: "http://localhost:8080",
  secure: ["/api/"],
  dao,
});

app.get(
  "/api/items",
  handler(() => db.data.items)
);

app.post(
  "/api/items",
  handler(async ({ item }) => {
    db.data.items.push({ item, id: uuid() });
    await db.write();
    return db.data.items;
  })
);

app.delete(
  "/api/items/:id",
  handler(async ({ id }) => {
    db.data.items = db.data.items.filter((item) => id !== item.id);
    await db.write();
    return db.data.items;
  })
);
