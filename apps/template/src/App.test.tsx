import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import { ItemData } from "./views";
import { SessionAware } from "./Session";
import { fetchApi } from "./helpers/fetchApi";
import { CookiesProvider } from "react-cookie";

jest.mock("./helpers/fetchApi");

describe("<App/>", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("logged out", async () => {
    render(
      <CookiesProvider>
        <SessionAware initialized={true} token={null} user={null}>
          <App />
        </SessionAware>
      </CookiesProvider>
    );

    expect(
      screen.getByRole("heading", { name: "Hello World!" })
    ).toBeInTheDocument();

    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Sign Up" })
    ).toBeInTheDocument();
  });

  it("logged in", async () => {
    const mockedFetchApi = fetchApi as jest.MockedFunction<
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
    expect(
      screen.getByRole("heading", { name: "Hello World!" })
    ).toBeInTheDocument();

    // The auth text is present
    expect(
      screen.queryByText("You are logged in as", { exact: false })
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "New Item" })
      ).toBeInTheDocument();
    });
  });
});
