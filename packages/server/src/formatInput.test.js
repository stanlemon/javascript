import formatInput from "./formatInput";

describe("formatInput()", () => {
  it("formats object keys", async () => {
    expect(formatInput({ fooBar: true })).toEqual({
      foo_bar: true,
    });
  });

  it("formats an array of object keys", async () => {
    expect(formatInput([{ fooBar: true }])).toEqual([
      {
        foo_bar: true,
      },
    ]);
  });

  it("does not formats strings", async () => {
    expect(formatInput("hereIsAString")).toEqual("hereIsAString");
  });

  it("does not formats anything else", async () => {
    expect(formatInput(true)).toEqual(true);
  });

  it("does not change already formatted object keys", async () => {
    expect(formatInput({ foo_bar: true })).toEqual({
      foo_bar: true,
    });
  });
});
