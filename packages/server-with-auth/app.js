import { omit } from "lodash-es";
import EventEmitter from "node:events";
import Joi from "joi";
import {
  createAppServer,
  asyncJsonHandler as handler,
  createSchemas,
  EVENTS,
} from "./src/index.js";
import LowDBUserDao, { createDb } from "./src/data/lowdb-user-dao.js";

const db = createDb();
const dao = new LowDBUserDao(db);
const eventEmitter = new EventEmitter();
Object.values(EVENTS).forEach((event) => {
  eventEmitter.on(event, (user) => {
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

const app = createAppServer({
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

// Insecure endpoint
app.get(
  "/hello/:name",
  handler(({ name = "world" }) => ({ hello: name }))
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

app.catch404s("/api/*");
