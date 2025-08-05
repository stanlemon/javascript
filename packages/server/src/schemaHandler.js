import Joi from "joi";

import { asyncJsonHandler } from "./asyncJsonHandler.js";

const { ValidationError } = Joi;

/**
 *
 * @param {Joi.Schema} schema
 * @param {*} fn
 * @returns
 */
export default function schemaHandler(schema, fn) {
  return async (req, res, next) => {
    // Validate the input schema
    try {
      const value = await schema.validateAsync(req.body, {
        // False here will not allow keys that are not part of the schema
        allowUnknown: false,
        // True here will strip the unknown keys from the returned value
        stripUnknown: true,
        // Ensure that all rules are evaluated, by default Joi stops on the first error
        abortEarly: false,
        // Customized error messages
        messages: {
          "any.invalid": "{{#label}} is invalid",
          "any.required": "{{#label}} is required",
          "boolean.base": "{{#label}} must be true or false",
          "string.empty": "{{#label}} is required",
          "string.email": "{{#label}} must be a valid email address",
          "string.min":
            "{{#label}} must be at least {{#limit}} characters long",
          "string.max":
            "{{#label}} cannot be more than {{#limit}} characters long",
          "number.base": "{{#label}} must be a number",
          "date.base": "{{#label}} must be a valid date",
        },
      });

      req.body = value;

      // Wrap all of these in our async handler
      await asyncJsonHandler(fn)(req, res, next);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({
          errors: Object.assign.apply(
            null,
            error.details.map((d) => ({ [d.path]: d.message }))
          ),
        });
      }
    }
  };
}
