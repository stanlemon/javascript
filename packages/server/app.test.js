/**
 * @jest-environment node
 */
import request from "supertest";
import { app } from "./app.js";

describe("/app", () => {
  it("GET /hello", async () => {
    // Happy path 200 use case
    const response = await request(app)
      .get("/hello")
      .set("Accept", "application/json");

    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ hello: "Stan" });
  });

  it("GET /hello/Stan", async () => {
    // This endpoint explicitly 404s
    const response = await request(app)
      .get("/hello/Stan")
      .set("Accept", "application/json");

    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(404);
    expect(response.body).toEqual({ error: "Not Found" });
  });

  it("GET /hello/Sara", async () => {
    // Custom parameter 200
    const response = await request(app)
      .get("/hello/Sara")
      .set("Accept", "application/json");

    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ hello: "Sara" });
  });

  it("POST /hello", async () => {
    // POST request with JSON body 200
    const response = await request(app)
      .post("/hello")
      .set("Accept", "application/json")
      .send({ name: "Henry" });

    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ hello: "Henry" });
  });

  it("GET 404 on undefined api path", async () => {
    const response = await request(app)
      .get("/not-found")
      .set("Accept", "application/json");

    expect(response.status).toEqual(404);
  });
});
