/**
 * @jest-environment node
 */
import request from "supertest";
import { MemorySync } from "lowdb";
import createAppServer from "../createAppServer";
import LowDBUserDao from "../data/lowdb-user-dao.js";

// This suppresses a warning we don't need in tests
process.env.JWT_SECRET = "SECRET";

let dao = new LowDBUserDao([], new MemorySync());

// We want to explicitly test functionality we disable during testing
process.env.NODE_ENV = "override";
const app = createAppServer({ dao, start: false });
process.env.NODE_ENV = "test";

describe("/auth", () => {
  let userId;

  beforeAll(async () => {
    // Reset our users database before each test
    const user = await dao.createUser({
      username: "test",
      password: "test",
    });

    userId = user.id;
  });

  // Disabling this linting rule because it is unaware of the supertest assertions
  /* eslint-disable jest/expect-expect */
  it("POST /register creates a user", async () => {
    const username = "test1";
    const password = "p@$$w0rd!";

    const data = {
      username,
      password,
    };

    await request(app)
      .post("/auth/register")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send(data)
      .expect(200)
      .then((res) => {
        expect(res.body.errors).toBeUndefined();
        expect(res.body.token).not.toBeUndefined();
        expect(res.body.user).not.toBeUndefined();
      });
  });

  it("POST /register returns error on empty data", async () => {
    await request(app)
      .post("/auth/register")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(400)
      .then((res) => {
        expect(res.body.errors).not.toBe(undefined);
        expect(res.body.errors.username).not.toBe(undefined);
      });
  });

  it("POST /register returns error on short password", async () => {
    await request(app)
      .post("/auth/register")
      .send({
        username: "testshort",
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

  it("POST /register returns error on too long password", async () => {
    await request(app)
      .post("/auth/register")
      .send({
        username: "testlong",
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

  it("POST /register returns error on already taken username", async () => {
    await request(app)
      .post("/auth/register")
      .send({
        username: "test",
        password: "p@$$w0rd!",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({
          error: "Bad Request: A user with this username already exists",
        });
      });
  });

  it("GET /verify verifies user", async () => {
    const user = dao.getUserById(userId);

    expect(user.verification_token).not.toBe(null);
    expect(user.verified_date).toBeUndefined();

    // First call will verify the user
    await request(app)
      .get("/auth/verify/" + user.verification_token)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(200)
      .then((res) => {
        expect(res.body.success).toEqual(true);
      });

    const refresh = await dao.getUserById(userId);

    expect(refresh.verified_date).not.toBe(null);

    // Subsequent calls are not successful because the user is already verified
    await request(app)
      .get("/auth/verify/" + user.verification_token)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({
          success: false,
          message: "User already verified.",
        });
      });
  });
});
