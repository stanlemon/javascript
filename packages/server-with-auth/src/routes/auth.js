import { isEmpty } from "lodash-es";
import { Router } from "express";
import jwt from "jsonwebtoken";
import {
  schemaHandler,
  formatOutput,
  BadRequestException,
} from "@stanlemon/server";
import checkAuth from "../checkAuth";

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

  router.get("/auth/session", checkAuth(), async (req, res) => {
    const userId = req.user;

    if (!userId) {
      res.status(401).json({
        token: false,
        user: false,
      });
      return;
    }

    const user = await getUserById(userId);

    if (!user) {
      res.status(401).json({
        token: false,
        user: false,
      });
    } else {
      const token = jwt.sign(user.id, secret);
      res.status(200).json({ token, user: formatOutput(user, ["password"]) });
    }
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
      last_logged_in: new Date(),
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

    if (user.verified_date) {
      return res
        .status(400)
        .send({ success: false, message: "User already verified." });
    }

    await updateUser(user.id, { verified_date: new Date() });

    return res.send({ success: true, message: "User verified!" });
  });

  return router;
}
