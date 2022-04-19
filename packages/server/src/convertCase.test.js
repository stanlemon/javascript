import convertCase from "./convertCase";
import { snakeCase } from "lodash-es";

describe("convertCase()", () => {
  const convert = (obj) => convertCase(obj, convert, snakeCase);

  it("converts object keys", async () => {
    expect(convert({ fooBar: true }, convertCase, snakeCase)).toEqual({
      foo_bar: true,
    });
  });

  it("converts an array of object keys", async () => {
    expect(convert([{ fooBar: true }], convertCase, snakeCase)).toEqual([
      {
        foo_bar: true,
      },
    ]);
  });

  it("does not convert strings", async () => {
    expect(convert("hereIsAString", convertCase, snakeCase)).toEqual(
      "hereIsAString"
    );
  });

  it("does not convert anything else", async () => {
    expect(convert(true, convertCase, snakeCase)).toEqual(true);
  });
});
