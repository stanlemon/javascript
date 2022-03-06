import request from "supertest";
import createAppServer from "../createAppServer";
import UsersInMemory from "../data/users-in-memory.js";

let users = new UsersInMemory();

const app = createAppServer({ ...users, start: false });

describe("/auth", () => {
  let userId;

  beforeEach(() => {
    // Reset our users database before each test
    const user = users.createUser({
      username: "test",
      email: "test@test.com",
      name: "test",
      password: "test",
      verification_token: "abcdefghijklmnopqrstuvwxyz",
    });

    userId = user.id;
  });

  // Disabling this linting rule because it is unaware of the supertest assertions
  /* eslint-disable jest/expect-expect */
  it("POST /register creates a user", async () => {
    const username = "test1";
    const name = "Test Tester1";
    const email = "test1@test.com";
    const password = "p@$$w0rd!";

    const data = {
      username,
      name,
      email,
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
        expect(res.body.errors.name).not.toBe(undefined);
        expect(res.body.errors.password).not.toBe(undefined);
      });
  });

  it("POST /register returns error on invalid email", async () => {
    await request(app)
      .post("/auth/register")
      .send({
        email: "not an email address",
        name: "Test Tester",
        password: "p@$$w0rd!",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(400)
      .then((res) => {
        expect(res.body.errors).not.toBe(undefined);
        expect(res.body.errors.email).not.toBe(undefined);
      });
  });

  it("POST /register returns error on short password", async () => {
    await request(app)
      .post("/auth/register")
      .send({
        email: "test@test.com",
        name: "Test Tester",
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
        email: "test@test.com",
        name: "Test Tester",
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
        email: "test@test.com",
        name: "Test Tester",
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

  it("GET /verify verifies email address", async () => {
    const user = users.getUserById(userId);
    expect(user.verification_token).not.toBe(null);
    expect(user.verified_date).toBeUndefined();

    // First call will verify the email address
    await request(app)
      .get("/auth/verify/" + user.verification_token)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(200)
      .then((res) => {
        expect(res.body.success).toEqual(true);
      });

    const refresh = await users.getUserById(userId);

    expect(refresh.verified_date).not.toBe(null);

    // Subsequent calls are not successful because the email address is already verified
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
