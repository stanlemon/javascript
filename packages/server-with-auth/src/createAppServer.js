import EventEmitter from "node:events";
import { config } from "dotenv";
import {
  createAppServer as createBaseAppServer,
  DEFAULTS as BASE_DEFAULTS,
} from "@stanlemon/server";
import expressSession from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { v4 as uuid } from "uuid";
import SCHEMAS from "./schema/index.js";
import checkAuth from "./checkAuth.js";
import auth from "./routes/auth.js";
import UserDao from "./data/user-dao.js";
import checkUserDao from "./utilities/checkUserDao.js";
import checkSchemas from "./utilities/checkSchemas.js";

config();

export const DEFAULTS = {
  ...BASE_DEFAULTS,
  secure: [],
  schemas: SCHEMAS,
  dao: new UserDao(),
  eventEmitter: new EventEmitter(),
  jwtExpireInMinutes: 10,
};

/**
 * Create an app server with authentication.
 * @param {object} options
 * @param {number} options.port Port to listen on
 * @param {boolean} options.webpack Whether or not to create a proxy for webpack
 * @param {string[]} options.secure Paths that require authentication
 * @param {Object.<string, Joi.Schema>} options.schemas Object map of routes to schema for validating route inputs.
 * @param {UserDao} options.dao Data access object for user interactions
 * @returns {import("@stanlemon/server/src/createAppServer.js").AppServer} Pre-configured express app server with extra helper methods
 */
/* eslint-disable max-lines-per-function */
export default function createAppServer(options) {
  const {
    port,
    webpack,
    start,
    secure,
    schemas,
    dao,
    eventEmitter,
    jwtExpireInMinutes,
  } = {
    ...DEFAULTS,
    ...options,
  };

  checkUserDao(dao);
  checkSchemas(schemas);

  const app = createBaseAppServer({ port, webpack, start });

  if (process.env.NODE_ENV === "test") {
    return app;
  }

  if (!process.env.COOKIE_SECRET) {
    console.warn("You need to specify a cookie secret!");
  }

  if (!process.env.JWT_SECRET) {
    console.warn("You need to specify a JWT secret!");
  }

  // These secrets will not be stable between restarts
  const cookieSecret = process.env.COOKIE_SECRET || uuid();
  const jwtSecret = process.env.JWT_SECRET || uuid();

  passport.use(
    new LocalStrategy((username, password, done) => {
      dao.getUserByUsernameAndPassword(username, password).then((user) => {
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      });
    })
  );

  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: jwtSecret,
        // NOTE: Setting options like 'issuer' here must also be set when the token is signed below
        jsonWebTokenOptions: {
          expiresIn: `${jwtExpireInMinutes}m`,
        },
      },
      (payload, done) => {
        done(null, payload);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser(({ id }, done) => {
    dao
      .getUserById(id)
      .then((user) => {
        // An undefined user means we couldn't find it, so the session is invalid
        done(null, !user ? false : user);
      })
      .catch((error) => {
        done(error, null);
      });
  });

  app.use(
    expressSession({
      secret: cookieSecret,
      resave: true,
      saveUninitialized: true,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(
    auth({
      secret: jwtSecret,
      schemas,
      dao,
      eventEmitter,
      jwtExpireInMinutes,
    })
  );

  secure.forEach((path) => {
    app.use(path, checkAuth());
  });

  // Handling 500
  app.use(function (error, req, res, next) {
    console.error(error);
    res.status(500).json({ error: "Internal Error" });
  });

  return app;
}
