/**
 * @jest-environment jsdom
 */
// This package is already transformed, and it uses crypto which is not supported in jsdom.
import { v1 as uuidv1 } from "uuid";

test("jest works", () => {
  expect(true).toBe(true);
});

test("jest does not transform ignored packages", () => {
  expect(uuidv1()).not.toBeNull();
});
