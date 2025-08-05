import EventEmitter from "node:events";

import Joi from "joi";
import { omit } from "lodash-es";

import {
  createAppServer,
  asyncJsonHandler as handler,
  createSchemas,
  EVENTS,
  LowDBUserDao,
  createLowDb,
} from "./src/index.js";

const db = createLowDb();
const dao = new LowDBUserDao(db);
const eventEmitter = new EventEmitter();
Object.values(EVENTS).forEach((event) => {
  eventEmitter.on(event, (user) => {
    // eslint-disable-next-line no-console
    console.info(
      `Event = ${event}, User = ${JSON.stringify(
        omit(user, ["password", "verification_token"])
      )}`
    );
  });
});

const schemas = createSchemas({
  fullName: Joi.string().required().label("Full Name"),
  email: Joi.string().email().required().label("Email"),
});

export const app = createAppServer({
  port: 3003,
  secure: ["/api/"],
  schemas,
  dao,
  eventEmitter,
});

// Insecure endpoint
app.get(
  "/",
  handler(() => ({ hello: "world" }))
);

// Secure endpoint
app.get(
  "/api/users",
  handler(() => ({
    users: db.data.users.map((u) =>
      omit(u, ["password", "verification_token"])
    ),
  }))
);

app.catch404s("/api/");
