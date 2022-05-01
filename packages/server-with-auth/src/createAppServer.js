import dotenv from "dotenv";
import {
  createAppServer as createBaseAppServer,
  DEFAULTS as BASE_DEFAULTS,
} from "@stanlemon/server";
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import shortid from "shortid";
import defaultUserSchema from "./schema/user.js";
import checkAuth from "./checkAuth.js";
import auth from "./routes/auth.js";

dotenv.config();

// TODO: Add option for schema
export const DEFAULTS = {
  ...BASE_DEFAULTS,
  secure: [],
  schema: defaultUserSchema,
  getUserById: (userId) => {},
  getUserByUsername: (username) => {},
  getUserByUsernameAndPassword: (username, password) => {},
  getUserByVerificationToken: (token) => {},
  createUser: (user) => {},
  updateUser: (userId, user) => {},
};

export default function createAppServer(options) {
  const {
    port,
    webpack,
    start,
    secure,
    schema,
    getUserById,
    getUserByUsername,
    getUserByUsernameAndPassword,
    getUserByVerificationToken,
    createUser,
    updateUser,
  } = { ...DEFAULTS, ...options };

  const app = createBaseAppServer({ port, webpack, start });

  if (process.env.NODE_ENV === "test") {
    return app;
  }

  if (!process.env.JWT_SECRET) {
    console.warn("You need to specify a secret.");
  }

  const secret = process.env.JWT_SECRET || shortid.generate();

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
    getUserById(id)
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
      getUserById,
      getUserByUsername,
      getUserByUsernameAndPassword,
      getUserByVerificationToken,
      createUser,
      updateUser,
    })
  );

  secure.forEach((path) => {
    app.use(path, checkAuth());
  });

  return app;
}
