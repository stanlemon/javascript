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
  };
}
