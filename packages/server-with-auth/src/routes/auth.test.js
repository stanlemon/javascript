/**
 * @jest-environment node
 */
import request from "supertest";
import Joi from "joi";
import { v4 as uuidv4 } from "uuid";
import { createAppServer, createSchemas } from "../index.js";
import LowDBUserDao, { createInMemoryDb } from "../data/lowdb-user-dao.js";

// This suppresses a warning we don't need in tests
process.env.JWT_SECRET = "SECRET";

let dao = new LowDBUserDao(createInMemoryDb());

// We want to explicitly test functionality we disable during testing
process.env.NODE_ENV = "override";
const app = createAppServer({
  dao,
  start: false,
  schemas: createSchemas({
    name: Joi.string().label("Name"),
    email: Joi.string().email().label("Email"),
  }),
});
process.env.NODE_ENV = "test";

describe("/auth", () => {
  // Disabling this linting rule because it is unaware of the supertest assertions
  /* eslint-disable jest/expect-expect */
  it("POST /signup creates a user", async () => {
    const username = "test" + uuidv4();
    const password = "p@$$w0rd!";
    const fullName = "Test User";

    const data = {
      username,
      password,
      fullName, // Not in the schema, should be discarded
    };

    await request(app)
      .post("/auth/signup")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send(data)
      .expect(200)
      .then((res) => {
        expect(res.body.user.username).toEqual(username);
        expect(res.body.user.createdAt).not.toBeUndefined();
        expect(res.body.user.lastUpdated).not.toBeUndefined();
        expect(res.body.user.fullName).toBeUndefined();
        expect(res.body.errors).toBeUndefined();
        expect(res.body.token).not.toBeUndefined();
        expect(res.body.user).not.toBeUndefined();
      });
  });

  it("POST /signup returns error on empty data", async () => {
    await request(app)
      .post("/auth/signup")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(400)
      .then((res) => {
        expect(res.body.errors).not.toBe(undefined);
        expect(res.body.errors.username).not.toBe(undefined);
      });
  });

  it("POST /signup returns error on short password", async () => {
    await request(app)
      .post("/auth/signup")
      .send({
        username: "test" + uuidv4(),
        password: "short",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(400)
      .then((res) => {
        expect(res.body.errors).not.toBe(undefined);
        expect(res.body.errors.password).not.toBe(undefined);
      });
  });

  it("POST /signup returns error on too long password", async () => {
    await request(app)
      .post("/auth/signup")
      .send({
        username: "test" + uuidv4(),
        password:
          "waytolongpasswordtobeusedforthisapplicationyoushouldtrysomethingmuchmuchshorter",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(400)
      .then((res) => {
        expect(res.body.errors).not.toBe(undefined);
        expect(res.body.errors.password).not.toBe(undefined);
      });
  });

  it("POST /signup returns error on already taken username", async () => {
    const data = {
      username: "test" + uuidv4(),
      password: "p@$$w0rd!",
    };

    // First call should succeed
    await request(app)
      .post("/auth/signup")
      .send(data)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(200);

    // Second call will fail
    await request(app)
      .post("/auth/signup")
      .send(data)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({
          error: "Bad Request: A user with this username already exists",
        });
      });
  });

  /**
   * @returns Session token
   */
  async function signupAndLogin(
    username = "test" + uuidv4(),
    password = "p@$$w0rd!"
  ) {
    const signup = await request(app)
      .post("/auth/signup")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send({
        username,
        password,
      })
      .expect(200);

    const session = await request(app)
      .post("/auth/login")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send({
        username,
        password,
      })
      .expect(200);

    expect(signup.body.user.id).toEqual(session.body.user.id);

    return {
      id: session.body.user.id,
      token: session.body.token,
    };
  }

  it("GET /verify verifies user", async () => {
    const { id } = await signupAndLogin();
    // Verification token should not be part of the response, so load it from the DB
    const user = await dao.getUserById(id);

    expect(user.verification_token).not.toBe(null);
    expect(user.verified_date).toBeUndefined();

    // First call will verify the user
    const verify = await request(app)
      .get("/auth/verify/" + user.verification_token)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(200);

    expect(verify.body.success).toEqual(true);

    const refresh = await dao.getUserById(user.id);

    expect(refresh.verified_date).not.toBe(null);

    // Subsequent calls are not successful because the user is already verified
    const reverify = await request(app)
      .get("/auth/verify/" + user.verification_token)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(400);
    expect(reverify.body).toEqual({
      success: false,
      message: "User already verified.",
    });
  });

  it("GET /user retrieves the user", async () => {
    const username = "test" + uuidv4();
    const password = "p@$$w0rd!";

    const { id, token } = await signupAndLogin(username, password);

    const user = await request(app)
      .get("/auth/user")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token);

    expect(user.status).toEqual(200);
    expect(user.body.id).toEqual(id);
    expect(user.body.username).toEqual(username);
    expect(user.body.createdAt).not.toBeUndefined();
    expect(user.body.lastUpdated).not.toBeUndefined();
    expect(user.body.fullName).toBeUndefined();
  });

  it("UPDATE /user updates the user", async () => {
    const { id, token } = await signupAndLogin();

    const check = await dao.getUserById(id);

    expect(check.name).toBeFalsy();
    expect(check.email).toBeFalsy();

    const data = {
      name: "Test User",
      email: "test@test.com",
    };

    const update = await request(app)
      .put("/auth/user")
      .send(data)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token);

    expect(update.status).toEqual(200);

    const user = await dao.getUserById(id);

    expect(user.name).toEqual(data.name);
    expect(user.email).toEqual(data.email);
  });

  it("DELETE /user deletes the user", async () => {
    const { id, token } = await signupAndLogin();

    const del = await request(app)
      .delete("/auth/user")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token);

    expect(del.status).toEqual(200);

    const user = await dao.getUserById(id);

    expect(user).toBeFalsy();
  });

  it("POST /password updates the password", async () => {
    const username = "test" + uuidv4();
    const password1 = "FirstP@ssw0rd";
    const password2 = "SecondP@ssw0rd";
    const data = { password: password2, currentPassword: password1 };

    const { token } = await signupAndLogin(username, password1);

    const reset = await request(app)
      .post("/auth/password")
      .send(data)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token);

    expect(reset.status).toEqual(200);

    // Using the old password should fail
    await request(app)
      .post("/auth/login")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send({
        username,
        password: password1,
      })
      .expect(401);

    // Using the new password should succeed
    const attempt2 = await request(app)
      .post("/auth/login")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send({
        username,
        password: password2,
      })
      .expect(200);

    expect(attempt2.body.user.username).toEqual(username);
  });
});
