/**
 * @jest-environment node
 */
import request from "supertest";
import { app, db } from "./app.js";

describe("/app", () => {
  afterEach(() => {
    // Prevent data from bleeding over after each test
    db.data.items = [];
  });

  it("lists items", async () => {
    const response = await request(app)
      .get("/api/items")
      .set("Accept", "application/json");

    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(200);
    expect(response.body).toEqual([]);
  });

  it("add item", async () => {
    const response = await request(app)
      .post("/api/items")
      .set("Accept", "application/json")
      .send({ item: "hello world" });

    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject([{ item: "hello world" }]);
  });

  it("delete item", async () => {
    const response1 = await request(app)
      .post("/api/items")
      .set("Accept", "application/json")
      .send({ item: "hello world" });

    const items = response1.body;

    const response2 = await request(app)
      .delete(`/api/items/${items[0].id}`)
      .set("Accept", "application/json");

    expect(response2.headers["content-type"]).toMatch(/json/);
    expect(response2.status).toEqual(200);
    expect(response2.body).toMatchObject([]);
  });
});
