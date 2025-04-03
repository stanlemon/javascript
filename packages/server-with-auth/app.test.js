/**
 * @jest-environment node
 */
import request from "supertest";
import { app } from "./app.js";
import { signupAndLogin } from "./src/utilities/testUtils.js";

const username = "test" + Math.random();
const password = "p@$$w0rd!";

describe("/app", () => {
  it("Insecure endpoint", async () => {
    // Insecure endpoint
    const response = await request(app)
      .get("/")
      .set("Accept", "application/json");

    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ hello: "world" });
  });

  it("Secure endpoint with no auth", async () => {
    const response = await request(app)
      .get("/api/users")
      .set("Accept", "application/json");

    expect(response.status).toEqual(401);
  });

  it("Secure endpoint with auth", async () => {
    const session = await signupAndLogin(app, username, password, {
      email: "test@test.com",
      fullName: "Test User",
    });

    const token = session.token;

    const response = await request(app)
      .get("/api/users")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token);

    expect(response.status).toEqual(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body.users[0]).toEqual(
      expect.objectContaining({
        id: session.id,
        username,
      })
    );
  });
});
