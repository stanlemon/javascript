import Joi from "joi";
import { ROUTES } from "../constants.js";

export default function checkSchemas(schemas) {
  Object.values(schemas).forEach((schema) => {
    if (!Joi.isSchema(schema)) {
      throw new Error("The schema object must be of type Joi schema.");
    }
  });

  if (schemas[ROUTES.SIGNUP] === undefined) {
    throw new Error(
      "The schemas object must have a schema designed for the signup route."
    );
  }

  if (
    !schemas[ROUTES.SIGNUP].describe().keys.username ||
    !schemas[ROUTES.SIGNUP].describe().keys.password
  ) {
    throw new Error(
      "The schema object for the signup route must have a username and password defined."
    );
  }
}
