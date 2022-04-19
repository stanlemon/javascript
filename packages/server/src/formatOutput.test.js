import formatOutput from "./formatOutput";

describe("formatOutput()", () => {
  it("formats object keys", async () => {
    expect(formatOutput({ foo_bar: true })).toEqual({
      fooBar: true,
    });
  });

  it("formats an array of object keys", async () => {
    expect(formatOutput([{ foo_bar: true }])).toEqual([
      {
        fooBar: true,
      },
    ]);
  });

  it("does not formats strings", async () => {
    expect(formatOutput("hereIsAString")).toEqual("hereIsAString");
  });

  it("does not formats anything else", async () => {
    expect(formatOutput(true)).toEqual(true);
  });

  it("does not change already formatted object keys", async () => {
    expect(formatOutput({ fooBar: true })).toEqual({
      fooBar: true,
    });
  });
});
