import { isEmpty } from "lodash-es";
import { format } from "date-fns";
import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { schemaHandler, formatOutput } from "@stanlemon/server";
import schema from "../../src/schema/user.js";

/* eslint-disable max-lines-per-function */
export default function authRoutes({
  secret,
  getUserByUsernameAndPassword,
  getUserByVerificationToken,
  createUser,
  updateUser,
}) {
  const router = Router();

  router.get("/auth/session", (req, res, next) => {
    /* look at the 2nd parameter to the below call */
    passport.authenticate("jwt", { session: false }, (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({
          user: false,
        });
      }

      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }

        // Return back some of our details
        res.status(200).json({ user: req.user });
      });
    })(req, res, next);
  });

  router.post("/auth/login", async (req, res) => {
    const user = await getUserByUsernameAndPassword(
      req.body.username,
      req.body.password
    );

    if (!user) {
      res.status(401).json({
        message: "Incorrect username or password.",
      });
      return;
    }

    const update = await updateUser(user.id, {
      last_logged_in: makeDateString(),
    });

    const token = jwt.sign(user, secret);

    res.json({
      token,
      user: formatOutput(update),
    });
  });

  router.get("/auth/logout", (req, res) => {
    req.logout();

    return res.status(401).json({
      user: false,
    });
  });

  router.post(
    "/auth/register",
    schemaHandler(
      // Modify the schema to make password required for this operation
      schema.append({ password: schema._keys.password.required() }),
      async (req, res) => {
        const user = await createUser(req.body);

        if (isEmpty(user)) {
          res.status(500).json({
            message: "An error has occurred",
          });
        }

        // TODO: Add hook for handling verification notification
        // user.verification_token

        res.json({ success: true });
      }
    )
  );

  router.get("/auth/verify/:token", async (req, res) => {
    const { token } = req.params;

    const user = await getUserByVerificationToken(token);

    if (isEmpty(user)) {
      return res
        .status(401)
        .json({ success: false, message: "Cannot verify user." });
    }

    if (!isEmpty(user.verified_date)) {
      return res
        .status(200)
        .send({ success: false, message: "User already verified." });
    }

    await updateUser(user.id, { verified_date: makeDateString() });

    return res.send({ success: true, message: "User verified!" });
  });

  return router;
}

const SQL_DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSSxxx";

function makeDateString(d = new Date()) {
  return format(d, SQL_DATE_FORMAT);
}
