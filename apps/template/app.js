import EventEmitter from "node:events";
import {
  createAppServer,
  createSchemas,
  asyncJsonHandler as handler,
  createDb,
  ROUTES,
  EVENTS as AUTH_EVENTS,
  LowDBUserDao,
} from "@stanlemon/server-with-auth";
import Joi from "joi";
import { v4 as uuid } from "uuid";
import { omit } from "lodash-es";

export const db = createDb();
const dao = new LowDBUserDao(db);

db.data.items = db.data.items || [];

const eventEmitter = new EventEmitter();
Object.values(AUTH_EVENTS).forEach((event) => {
  eventEmitter.on(event, (user) => {
    console.log(
      `Event = ${event}, User = ${JSON.stringify(
        omit(user, ["password", "verification_token"])
      )}`
    );
  });
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

app.catch404s();
