import { EventEmitter } from "node:events";

import { schemaHandler, formatOutput } from "@stanlemon/server";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { isEmpty, omit } from "lodash-es";
import passport from "passport";

import checkAuth from "../checkAuth.js";
import { HIDDEN_FIELDS, ROUTES, EVENTS } from "../constants.js";
import checkSchemas from "../utilities/checkSchemas.js";
import checkUserDao from "../utilities/checkUserDao.js";

/**
 * Create express routes for authentication operations.
 * @param {object} options
 * @param {string[]} options.secret Route patterns to protect by authentication.
 * @param {Object.<string, Joi.Schema>} options.schemas Object map of routes to schema for validating route inputs.
 * @param {import("../data/user-dao.js").default} options.dao Dao to use for various user operations
 * @param {EventEmitter} options.eventEmitter  Event emitter that can be used to hook into user operations
 * @param {number} options.jwtExpireInMinutes Number of minutes before a JWT token expires
 * @returns {Express.Router}
 */
/* eslint-disable max-lines-per-function */
export default function authRoutes({
  secret,
  schemas,
  dao,
  eventEmitter,
  jwtExpireInMinutes,
}) {
  checkUserDao(dao);
  checkSchemas(schemas);

  if (!(eventEmitter instanceof EventEmitter)) {
    throw new Error("The eventEmitter object must be of type EventEmitter.");
  }

  const router = Router();

  const makeJwtToken = (user) => {
    const token = jwt.sign({ ...user }, secret, {
      expiresIn: 60 * jwtExpireInMinutes,
    });
    return token;
  };

  router.get(ROUTES.SESSION, checkAuth(), async (req, res) => {
    const userId = req.user.id;

    if (!userId) {
      res.status(401).json({
        token: false,
        user: false,
      });
      return;
    }

    const user = await dao.getUserById(userId);

    if (!user) {
      res.status(401).json({
        token: false,
        user: false,
      });
    } else {
      const token = makeJwtToken(user);
      res.status(200).json({ token, user: formatOutput(user, HIDDEN_FIELDS) });
    }
  });

  router.post(ROUTES.LOGIN, (req, res, next) => {
    // Customizing the login so we can send a proper JSON response when unable to login
    passport.authenticate("local", (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Incorrect username or password.",
        });
      }

      return req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }

        return dao
          .updateUser(user.id, {
            last_logged_in: new Date(),
          })
          .then((update) => {
            const token = makeJwtToken(user);

            eventEmitter.emit(EVENTS.USER_LOGIN, omit(user, ["password"]));

            return res.json({
              token,
              user: formatOutput(update, HIDDEN_FIELDS),
            });
          });
      });
    })(req, res, next);
  });

  router.get(ROUTES.LOGOUT, (req, res) => {
    // This will happen if you are only using the JWT strategy
    if (req.logout !== undefined && req.user !== undefined) {
      return req.logout(() => {
        if (req?.user?.id) {
          eventEmitter.emit(EVENTS.USER_LOGOUT, req.user.id);
        }

        return res.status(401).json({
          token: false,
          user: false,
        });
      });
    } else {
      console.warn("Logout attempted, but unable to complete.");
      return res.status(404).json({ error: "Not Found" });
    }
  });

  router.post(
    ROUTES.SIGNUP,
    schemaHandler(schemas[ROUTES.SIGNUP], async (data, req, res) => {
      const existing = await dao.getUserByUsername(data.username);

      if (existing) {
        res.status(400).json({
          success: false,
          message: "A user with this username already exists.",
        });
        return;
      }

      const user = await dao.createUser({
        ...data,
      });

      if (isEmpty(user)) {
        res.status(400).json({
          success: false,
          message: "An error has occurred",
        });
        return;
      }

      eventEmitter.emit(EVENTS.USER_CREATED, omit(user, ["password"]));

      const token = makeJwtToken(user);
      return { token, user: formatOutput(user, HIDDEN_FIELDS) };
    })
  );

  router.get(ROUTES.VERIFY, async (req, res) => {
    const { token } = req.params;

    const user = await dao.getUserByVerificationToken(token);

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

    await dao.updateUser(user.id, { verified_date: new Date() });

    eventEmitter.emit(EVENTS.USER_VERIFIED, omit(user, ["password"]));

    return res.send({ success: true, message: "User verified!" });
  });

  router.get(ROUTES.USER, checkAuth(), async (req, res) => {
    const userId = req.user.id;

    if (!userId) {
      res.status(401).json({
        token: false,
        user: false,
      });
      return;
    }

    const user = await dao.getUserById(userId);

    if (!user) {
      res.status(401).json({
        token: false,
        user: false,
      });
    } else {
      res.status(200).json(formatOutput(user, HIDDEN_FIELDS));
    }
  });

  router.put(
    ROUTES.USER,
    checkAuth(),
    schemaHandler(schemas[ROUTES.USER], async (data, req, res) => {
      const user = await dao.getUserById(req.user.id);

      if (!user) {
        res.status(404).json({
          success: false,
          message: "Not Found",
        });
        return;
      }

      const input = {
        ...omit(data, [
          "id",
          "created_at",
          "last_updated",
          "last_login",
          "password",
          "username",
          "verification_token",
          "verified_date",
        ]),
      };

      const updated = await dao.updateUser(user.id, input);

      eventEmitter.emit(EVENTS.USER_UPDATED, omit(user, ["password"]));

      res.status(200).json(formatOutput(updated, HIDDEN_FIELDS));
    })
  );

  router.delete(ROUTES.USER, checkAuth(), async (req, res) => {
    const deleted = await dao.deleteUser(req.user.id);

    eventEmitter.emit(EVENTS.USER_DELETED, req.user.id, deleted);

    res.status(200).json({ success: deleted });
  });

  router.post(
    ROUTES.PASSWORD,
    checkAuth(),
    schemaHandler(schemas[ROUTES.PASSWORD], async (data, req, res) => {
      const currentUser = await dao.getUserById(req.user.id);
      const user = await dao.getUserByUsernameAndPassword(
        currentUser.username,
        data.current_password // Reminder: Joi will switch the casing
      );

      if (!user) {
        res.status(400).json({
          success: false,
          errors: {
            current_password: "Current password is incorrect",
          },
        });
        return;
      }

      const success = await dao.updateUser(user.id, {
        password: data.password,
      });

      if (success) {
        eventEmitter.emit(EVENTS.USER_PASSWORD, omit(user, ["password"]));
      }

      return { success: success };
    })
  );

  // TODO: This is a placeholder for a password reset request, you should implement the event handler to handle this.
  router.get(
    ROUTES.RESET,
    schemaHandler(schemas[ROUTES.RESET], async (data) => {
      const user = await dao.getUserByUsername(data.username);

      eventEmitter.emit(EVENTS.USER_RESET_REQUESTED, omit(user, ["password"]));

      return { success: true };
    })
  );

  // TODO: This is a placeholder for a password reset completion, you should implement the event handler to handle this.
  router.post(
    ROUTES.RESET,
    schemaHandler(schemas[ROUTES.RESET], async (data) => {
      const user = await dao.getUserByUsername(data.username);

      eventEmitter.emit(EVENTS.USER_RESET_COMPLETED, omit(user, ["password"]));

      return { success: true };
    })
  );

  return router;
}
