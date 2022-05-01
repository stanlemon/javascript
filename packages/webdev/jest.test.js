/**
 * @jest-environment node
 */
// This package is already transformed
import { v1 as uuidv1 } from "uuid";

test("jest works", () => {
  expect(true).toBe(true);
});

test("jest does not transform ignored packages", () => {
  expect(uuidv1()).not.toBeNull();
});
