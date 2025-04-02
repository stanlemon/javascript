import asyncJsonHandler from "./asyncJsonHandler";

describe("asyncHandler()", () => {
  it("handles fn response", async () => {
    const body = {
      hello: "World",
    };
    const req = jest.fn();
    const res = jest.fn();
    res.status = jest.fn().mockReturnValue({ json: jest.fn() });
    const next = jest.fn();

    const controller = async (req, res, next) => {
      return Promise.resolve(body);
    };

    await asyncJsonHandler(controller)(req, res, next);

    expect(res.status.mock.calls[0][0]).toBe(200);
    expect(res.status().json.mock.calls[0][0]).toEqual(body);
  });

  it("handles fn 400", async () => {
    const req = jest.fn();
    const res = jest.fn();
    res.status = jest.fn().mockReturnValue({ json: jest.fn() });
    const next = jest.fn();

    const controller = async (req, res, next) => {
      throw new Error("Bad Request");
    };

    await asyncJsonHandler(controller)(req, res, next);

    expect(res.status.mock.calls[0][0]).toBe(400);
  });

  it("handles fn 403", async () => {
    const req = jest.fn();
    const res = jest.fn();
    res.status = jest.fn().mockReturnValue({ json: jest.fn() });
    const next = jest.fn();

    const controller = async (req, res, next) => {
      throw new Error("Not Authorized");
    };

    await asyncJsonHandler(controller)(req, res, next);

    expect(res.status.mock.calls[0][0]).toBe(403);
  });

  it("handles fn 404", async () => {
    const req = jest.fn();
    const res = jest.fn();
    res.status = jest.fn().mockReturnValue({ json: jest.fn() });
    const next = jest.fn();

    const controller = async (req, res, next) => {
      throw new Error("Not Found");
    };

    await asyncJsonHandler(controller)(req, res, next);

    expect(res.status.mock.calls[0][0]).toBe(404);
  });

  it("handles fn 409", async () => {
    const req = jest.fn();
    const res = jest.fn();
    res.status = jest.fn().mockReturnValue({ json: jest.fn() });
    const next = jest.fn();

    const controller = async (req, res, next) => {
      throw new Error("Already Exists");
    };

    await asyncJsonHandler(controller)(req, res, next);

    expect(res.status.mock.calls[0][0]).toBe(409);
  });

  it("handles fn 500", async () => {
    const req = jest.fn();
    const res = jest.fn();
    res.status = jest.fn().mockReturnValue({ json: jest.fn() });
    const next = jest.fn();

    const controller = async (req, res, next) => {
      throw new Error("Who knows!");
    };

    await asyncJsonHandler(controller)(req, res, next);

    expect(res.status.mock.calls[0][0]).toBe(500);
  });
});
