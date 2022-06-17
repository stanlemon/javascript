import {
  createAppServer,
  asyncJsonHandler as handler,
  SimpleUsersDao,
} from "@stanlemon/server-with-auth";

const dao = new SimpleUsersDao();
export const db = dao.getDb();
db.data.items = db.data.items || [];

const app = createAppServer({
  webpack: "http://localhost:8080",
  secure: ["/api/"],
  ...dao,
});

app.get(
  "/api/items",
  handler(() => db.data.items)
);

app.post(
  "/api/items",
  handler(async ({ item }) => {
    db.data.items.push({ item, id: dao.generateId() });
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

export default app;
