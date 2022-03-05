import dotenv from "dotenv";
import { createAppServer as createBaseAppServer } from "@stanlemon/server";
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import auth from "./routes/auth.js";

dotenv.config();

export default function createAppServer(
  {
    port,
    webpack,
    getUserById,
    getUserByUsername,
    getUserByUsernameAndPassword,
    getUserByVerificationToken,
    createUser,
    updateUser,
  } = {
    port: 3000,
    webpack: false,
    getUserById: (userId) => {},
    getUserByUsername: (username) => {},
    getUserByUsernameAndPassword: (username, password) => {},
    getUserByVerificationToken: (token) => {},
    createUser: (user) => {},
    updateUser: (userId, user) => {},
  }
) {
  if (!process.env.JWT_SECRET) {
    console.warn("You need to specify a secret.");
  }

  const secret = process.env.JWT_SECRET || "YouNeedASecret";

  const app = createBaseAppServer({ port, webpack });

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
  passport.serializeUser((user, done) => {
    done(null, user.id);
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
      getUserByUsername,
      getUserByUsernameAndPassword,
      getUserByVerificationToken,
      createUser,
      updateUser,
    })
  );

  return app;
}
