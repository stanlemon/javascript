import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { CookiesProvider } from "react-cookie";
import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
  type MockedFunction,
} from "vitest";

import App from "./App";
import { fetchApi } from "./helpers/fetchApi";
import { SessionAware } from "./Session";
import { ItemData } from "./views";

vi.mock("./helpers/fetchApi");

describe("<App/>", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("logged out", async () => {
    render(
      <CookiesProvider>
        <SessionAware initialized={true} token={null} user={null}>
          <App />
        </SessionAware>
      </CookiesProvider>
    );

    expect(screen.getByRole("heading", { name: "Hello World!" })).toBeDefined();

    expect(screen.getByRole("heading", { name: "Login" })).toBeDefined();

    expect(screen.getByRole("heading", { name: "Sign Up" })).toBeDefined();
  });

  it("logged in", async () => {
    const mockedFetchApi = fetchApi as MockedFunction<
      typeof fetchApi<ItemData[], null>
    >;
    mockedFetchApi.mockResolvedValue([]);

    render(
      <CookiesProvider>
        <SessionAware
          initialized={true}
          token="abcd"
          user={{
            username: "user",
            name: "user",
            email: "user@example.com",
          }}
        >
          <App />
        </SessionAware>
      </CookiesProvider>
    );

    // The header is present
    expect(screen.getByRole("heading", { name: "Hello World!" })).toBeDefined();

    // The auth text is present
    expect(
      screen.queryByText("You are logged in as", { exact: false })
    ).toBeDefined();

    // Wait for async components to load
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "New Item" })).toBeDefined();
    });
  });
});
