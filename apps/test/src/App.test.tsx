import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

test("Basic", () => {
  render(<App />);

  expect(true).toBe(true);
});
