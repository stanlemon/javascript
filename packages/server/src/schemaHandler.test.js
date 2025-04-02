import Joi from "joi";
import schemaHandler from "./schemaHandler";

describe("schemaHandler()", () => {
  it("validates schema against invalid response", async () => {
    const req = jest.fn();
    req.body = {
      foo: "bar",
      email: "stan",
    };
    const res = jest.fn();
    res.status = jest.fn().mockReturnValue({ json: jest.fn() });
    const next = jest.fn();

    const person = Joi.object({
      fullName: Joi.string().required().label("Full Name").required(),
      email: Joi.string().email().required().label("Email").required(),
    });

    const controller = jest.fn();

    await schemaHandler(person, controller)(req, res, next);

    expect(res.status.mock.calls[0][0]).toBe(400);
    expect(res.status().json.mock.calls[0][0]).toEqual({
      errors: {
        fullName: '"Full Name" is required',
        email: '"Email" must be a valid email address',
      },
    });
    expect(controller).not.toHaveBeenCalled();
  });

  it("validates schema against valid response", async () => {
    const body = {
      fullName: "Stan Lemon",
      email: "stanlemon@users.noreply.github.com",
    };
    const req = jest.fn();
    req.body = body;
    const res = jest.fn();
    res.status = jest.fn().mockReturnValue({ json: jest.fn() });
    const next = jest.fn();

    const person = Joi.object({
      fullName: Joi.string().required().label("Full Name").required(),
      email: Joi.string().email().required().label("Email").required(),
    });

    const controller = async (req, res, next) => {
      return Promise.resolve(body);
    };

    await schemaHandler(person, controller)(req, res, next);

    expect(res.status.mock.calls[0][0]).toBe(200);
    expect(res.status().json.mock.calls[0][0]).toEqual(body);
  });
});
