import dotenv from "dotenv";
import {
  createAppServer as createBaseAppServer,
  DEFAULTS as BASE_DEFAULTS,
} from "@stanlemon/server";
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { v4 as uuid } from "uuid";
import Joi from "joi";
import defaultUserSchema from "./schema/user.js";
import checkAuth from "./checkAuth.js";
import auth from "./routes/auth.js";
import UserDao from "./data/user-dao.js";

dotenv.config();

export const DEFAULTS = {
  ...BASE_DEFAULTS,
  secure: [],
  schema: defaultUserSchema,
  dao: new UserDao(),
};

/**
 * Create an app server with authentication.
 * @param {number} options.port Port to listen on
 * @param {boolean} options.webpack Whether or not to create a proxy for webpack
 * @param {string[]} options.secure Paths that require authentication
 * @param {Joi.Schema} options.schema Joi schema for user object
 * @param {UserDao} options.dao Data access object for user interactions
 * @returns {import("express").Express} Express app
 */
export default function createAppServer(options) {
  const { port, webpack, start, secure, schema, dao } = {
    ...DEFAULTS,
    ...options,
  };

  if (!(dao instanceof UserDao)) {
    throw new Error("The dao object must be of type UserDao.");
  }

  if (!Joi.isSchema(schema)) {
    throw new Error("The schema object must be of type Joi schema.");
  }

  if (!schema.describe().keys.username || !schema.describe().keys.password) {
    throw new Error(
      "The schema object must have a username and password defined."
    );
  }

  const app = createBaseAppServer({ port, webpack, start });

  if (process.env.NODE_ENV === "test") {
    return app;
  }

  if (!process.env.JWT_SECRET) {
    console.warn("You need to specify a JWT secret!");
  }

  const secret = process.env.JWT_SECRET || uuid();

  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: secret,
        // NOTE: Setting options like 'issuer' here must also be set when the token is signed below
        jsonWebTokenOptions: {
          expiresIn: "120m",
        },
      },
      (payload, done) => {
        done(null, payload);
      }
    )
  );
  passport.serializeUser((id, done) => {
    done(null, id);
  });
  passport.deserializeUser((id, done) => {
    dao
      .getUserById(id)
      .then((user) => {
        // An undefined user means we couldn't find it, so the session is invalid
        done(null, user === undefined ? false : user);
      })
      .catch((error) => {
        done(error, null);
      });
  });
  passport.initialize();

  app.use(
    auth({
      secret,
      schema,
      dao,
    })
  );

  secure.forEach((path) => {
    app.use(path, checkAuth());
  });

  return app;
}
