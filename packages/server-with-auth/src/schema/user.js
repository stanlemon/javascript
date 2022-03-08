import Joi from "joi";

const schema = Joi.object({
  username: Joi.string().required().label("Username"),
  password: Joi.string().required().min(8).max(64).label("Password"),
});

export default schema;
