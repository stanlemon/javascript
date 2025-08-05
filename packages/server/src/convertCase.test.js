import { snakeCase } from "lodash-es";
import { describe, it, expect } from "vitest";

import convertCase from "./convertCase";

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
