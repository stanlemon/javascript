import Joi from "joi";
import { ROUTES } from "../constants.js";

/**
 * Schema for a strong password.
 */
export const PASSWORD = Joi.string()
  .required()
  .min(8)
  .max(64)
  .label("Password");

/**
 * Schema for creating a new user
 */
export const CREATE_USER = Joi.object({
  username: Joi.string().required().label("Username"),
  password: PASSWORD,
});

export const RESET_PASSWORD = Joi.object({
  username: Joi.string().required().label("Username"),
});

export const CHANGE_PASSWORD = Joi.object({
  password: PASSWORD,
  currentPassword: PASSWORD,
});

export const USER = Joi.object({});

/**
 * For use by the DAO to make sure the data shape is correct.
 */
export const DAO = Joi.object({
  id: Joi.string().uuid().label("ID").default("").required(),
  username: Joi.string().label("Username").default("").required(),
  password: Joi.string().label("Password").default("").required(),
  verification_token: Joi.string().label("Verification Token").default(""),
  verify_at: Joi.date().label("Date Verified").default(null),
  last_logged_in: Joi.date().label("Date Last Logged In").default(null),
  created_at: Joi.date().label("Date Created").default(null).required(),
  last_updated: Joi.date().label("Date Last Updated").default(null).required(),
});

/**
 * Base schemas mapped to routes.
 */
const SCHEMAS = {
  [ROUTES.SIGNUP]: CREATE_USER,
  [ROUTES.RESET]: RESET_PASSWORD,
  [ROUTES.PASSWORD]: CHANGE_PASSWORD,
  [ROUTES.USER]: USER,
};

export default SCHEMAS;

/**
 * Create a collection of schemas while supplying a custom user schema.
 * @param {Joi.Schema} user User schema to append to the base schemas for sign up and user operations.
 * @returns {Object.<string, Joi.Schema>} Schemas by end point.
 */
export function createSchemas(user = {}) {
  return {
    ...SCHEMAS,
    [ROUTES.SIGNUP]: SCHEMAS[[ROUTES.SIGNUP]].append(user),
    [ROUTES.USER]: SCHEMAS[[ROUTES.USER]].append(user),
    dao: DAO.append(user),
  };
}
