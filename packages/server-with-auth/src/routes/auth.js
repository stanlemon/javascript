import { EventEmitter } from "node:events";
import { isEmpty, omit } from "lodash-es";
import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import {
  schemaHandler,
  formatOutput,
  BadRequestException,
  formatInput,
} from "@stanlemon/server";
import checkAuth from "../checkAuth.js";
import checkUserDao from "../utilities/checkUserDao.js";
import checkSchemas from "../utilities/checkSchemas.js";
import { HIDDEN_FIELDS, ROUTES, EVENTS } from "../constants.js";

/**
 * Create express routes for authentication operations.
 * @param {object} options
 * @param {string[]} options.secret Route patterns to protect by authentication.
 * @param {Object.<string, Joi.Schema>} options.schemas Object map of routes to schema for validating route inputs.
 * @param {import("../data/user-dao.js").default} options.dao Dao to use for various user operations
 * @param {EventEmitter} options.eventEmitter  Event emitter that can be used to hook into user operations
 * @returns {Express.Router}
 */
/* eslint-disable max-lines-per-function */
export default function authRoutes({ secret, schemas, dao, eventEmitter }) {
  checkUserDao(dao);
  checkSchemas(schemas);

  if (!(eventEmitter instanceof EventEmitter)) {
    throw new Error("The eventEmitter object must be of type EventEmitter.");
  }

  const router = Router();

  router.get(ROUTES.SESSION, checkAuth(), async (req, res) => {
    const userId = req.user;

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
      const token = jwt.sign(user.id, secret);
      res.status(200).json({ token, user: formatOutput(user, HIDDEN_FIELDS) });
    }
  });

  router.post(ROUTES.LOGIN, (req, res, next) => {
    // Customizing the login so we can send a proper JSON response when unable to login
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        res.status(401).json({
          message: "Incorrect username or password.",
        });
      }

      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }

        dao
          .updateUser(user.id, {
            last_logged_in: new Date(),
          })
          .then((update) => {
            const token = jwt.sign(user.id, secret);

            eventEmitter.emit(EVENTS.USER_LOGIN, user);

            res.json({
              token,
              user: formatOutput(update, HIDDEN_FIELDS),
            });
          });
      });
    })(req, res, next);
  });

  router.get(ROUTES.LOGOUT, (req, res) => {
    // This will happen if you are only using the JWT strategy
    if (req.logout !== undefined) {
      req.logout();
    } else {
      console.warn("Logout attempted, but there is no logout function.");
    }

    eventEmitter.emit(EVENTS.USER_LOGOUT, req.user);

    return res.status(401).json({
      token: false,
      user: false,
    });
  });

  const signup = schemaHandler(schemas[ROUTES.SIGNUP], async (data) => {
    const existing = await dao.getUserByUsername(data.username);

    if (existing) {
      throw new BadRequestException("A user with this username already exists");
    }

    const now = new Date();
    const user = await dao.createUser({
      ...data,
      created_at: now,
      last_updated: now,
    });

    if (isEmpty(user)) {
      return {
        message: "An error has occurred",
      };
    }

    eventEmitter.emit(EVENTS.USER_CREATED, user);

    const token = jwt.sign(user.id, secret);
    return { token, user: formatOutput(user, HIDDEN_FIELDS) };
  });

  router.post(ROUTES.SIGNUP, signup);
  // Deprecated endpoint /register
  router.post(ROUTES.REGISTER, signup);

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

    eventEmitter.emit(EVENTS.USER_VERIFIED, user);

    return res.send({ success: true, message: "User verified!" });
  });

  router.get(ROUTES.USER, checkAuth(), async (req, res) => {
    const userId = req.user;

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
      const user = await dao.getUserById(req.user);

      if (!user) {
        res.status(404).json({
          error: "Not Found",
        });
        return;
      }

      const now = new Date();
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
        last_updated: now,
      };

      const updated = await dao.updateUser(user.id, input);

      eventEmitter.emit(EVENTS.USER_UPDATED, user);

      res.status(200).json(formatOutput(updated, HIDDEN_FIELDS));
    })
  );

  router.delete(ROUTES.USER, checkAuth(), async (req, res) => {
    const deleted = await dao.deleteUser(req.user);

    eventEmitter.emit(EVENTS.USER_DELETED, req.user, deleted);

    res.status(200).json({ success: deleted });
  });

  // TODO: Implement password reset
  router.post(
    ROUTES.PASSWORD,
    checkAuth(),
    schemaHandler(schemas[ROUTES.PASSWORD], async (data, req, res) => {
      const user = await dao.getUserById(req.user);

      if (
        !dao.getUserByUsernameAndPassword(user.username, data.currentPassword)
      ) {
        res.status(400).json({
          errors: {
            currentPassword: "Current password is incorrect",
          },
        });
        return;
      }

      await dao.updateUser(user.id, {
        password: data.password,
      });

      eventEmitter.emit(EVENTS.USER_PASSWORD, data.username);

      return { success: true };
    })
  );

  // This is a placeholder for a password reset request, you should implement the event handler to handle this.
  router.post(
    ROUTES.RESET,
    schemaHandler(schemas[ROUTES.RESET], async (data) => {
      eventEmitter.emit(EVENTS.USER_RESET_REQUESTED, data.username);

      return { success: true };
    })
  );

  return router;
}
