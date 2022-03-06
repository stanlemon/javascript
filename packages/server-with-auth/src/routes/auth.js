import { isEmpty } from "lodash-es";
import { format } from "date-fns";
import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import {
  schemaHandler,
  formatOutput,
  BadRequestException,
} from "@stanlemon/server";

/* eslint-disable max-lines-per-function */
export default function authRoutes({
  secret,
  schema,
  getUserById,
  getUserByUsername,
  getUserByUsernameAndPassword,
  getUserByVerificationToken,
  createUser,
  updateUser,
}) {
  const router = Router();

  router.get("/auth/session", (req, res, next) => {
    /* look at the 2nd parameter to the below call */
    passport.authenticate("jwt", { session: false }, (err, userId) => {
      if (err) {
        return next(err);
      }
      if (!userId) {
        return res.status(401).json({
          token: false,
          user: false,
        });
      }

      req.logIn(userId, async (err) => {
        if (err) {
          return next(err);
        }

        const user = await getUserById(userId);

        if (!user) {
          return res.status(401).json({
            token: false,
            user: false,
          });
        } else {
          const token = jwt.sign(user.id, secret);
          res
            .status(200)
            .json({ token, user: formatOutput(user, ["password"]) });
        }
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

    const token = jwt.sign(user.id, secret);

    res.json({
      token,
      user: formatOutput(update, ["password"]),
    });
  });

  router.get("/auth/logout", (req, res) => {
    req.logout();

    return res.status(401).json({
      token: false,
      user: false,
    });
  });

  router.post(
    "/auth/register",
    schemaHandler(schema, async (data) => {
      const existing = await getUserByUsername(data.username);

      if (existing) {
        throw new BadRequestException(
          "A user with this username already exists"
        );
      }

      const user = await createUser(data);

      if (isEmpty(user)) {
        return {
          message: "An error has occurred",
        };
      }

      // TODO: Add hook for handling verification notification
      // user.verification_token

      const token = jwt.sign(user.id, secret);
      return { token, user: formatOutput(user, ["password"]) };
    })
  );

  router.get("/auth/verify/:token", async (req, res) => {
    const { token } = req.params;

    const user = await getUserByVerificationToken(token);

    if (isEmpty(user)) {
      return res
        .status(400)
        .json({ success: false, message: "Cannot verify user." });
    }

    if (!isEmpty(user.verified_date)) {
      return res
        .status(400)
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
