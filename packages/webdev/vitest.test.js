import { v1 as uuidv1 } from "uuid";
import { test, expect } from "vitest";

test("vitest works", () => {
  expect(true).toBe(true);
});

test("vitest does not transform ignored packages", () => {
  expect(uuidv1()).not.toBeNull();
});
