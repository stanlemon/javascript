import EventEmitter from "node:events";

import {
  createAppServer,
  createSchemas,
  asyncJsonHandler as handler,
  createLowDb,
  EVENTS,
  LowDBUserDao,
} from "@stanlemon/server-with-auth";
import Joi from "joi";
import { v4 as uuid } from "uuid";

export const db = createLowDb();
const dao = new LowDBUserDao(db);

db.data.items = db.data.items || [];

const eventEmitter = new EventEmitter();
eventEmitter.on(EVENTS.USER_CREATED, (user) => {
  // eslint-disable-next-line no-console
  console.log("New user signed up!", user);
  // Now send an email so they can verify!
});

export const app = createAppServer({
  webpack: "http://localhost:8080",
  secure: ["/api/"],
  dao,
  eventEmitter,
  schemas: createSchemas({
    name: Joi.string().required().label("Name"),
    email: Joi.string().email().required().label("Email"),
  }),
  jwtExpireInMinutes: 3, // Customize the jwt session window, default is 10
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

app.spa();
app.catch404s("/api/");
