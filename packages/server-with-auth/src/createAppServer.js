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
    getUserByUsernameAndPassword,
    getUserByVerificationToken,
    createUser,
    updateUser,
  } = {
    port: 3000,
    webpack: false,
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
  passport.initialize();

  app.use(
    auth({
      secret,
      getUserByUsernameAndPassword,
      getUserByVerificationToken,
      createUser,
      updateUser,
    })
  );

  return app;
}
