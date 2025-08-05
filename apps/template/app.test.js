/**
 * @vitest-environment node
 */
import { test__signupAndLogin } from "@stanlemon/server-with-auth";
import request from "supertest";
import { describe, it, expect } from "vitest";

import { app, db } from "./app.js";

async function signupAndLogin() {
  const { token } = await test__signupAndLogin(
    app,
    "test" + Math.random(),
    "p@$$w0rd!",
    { name: "Test User", email: "test@test.com" }
  );
  return token;
}

describe("/app", () => {
  afterEach(() => {
    // Prevent data from bleeding over after each test
    db.data.items = [];
  });

  it("lists items", async () => {
    const token = await signupAndLogin();
    const response = await request(app)
      .get("/api/items")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token);

    expect(response.status).toEqual(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toEqual([]);
  });

  it("add item", async () => {
    const token = await signupAndLogin();
    const response = await request(app)
      .post("/api/items")
      .set("Accept", "application/json")
      .send({ item: "hello world" })
      .set("Authorization", "Bearer " + token);

    expect(response.status).toEqual(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toMatchObject([{ item: "hello world" }]);
  });

  it("delete item", async () => {
    const token = await signupAndLogin();
    const response1 = await request(app)
      .post("/api/items")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)
      .send({ item: "hello world" });
    const items = response1.body;

    const response2 = await request(app)
      .delete(`/api/items/${items[0].id}`)
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token);

    expect(response2.status).toEqual(200);
    expect(response2.headers["content-type"]).toMatch(/json/);
    expect(response2.body).toMatchObject([]);
  });
});
