import "@testing-library/jest-dom";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { ItemData } from "./views";
import { SessionAware } from "./Session";
import fetchApi from "./helpers/fetchApi";

jest.mock("./helpers/fetchApi");

describe("<App/>", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("renders", async () => {
    const output = [
      { id: "1", item: "item one" },
      { id: "2", item: "item two" },
    ];

    const mockedFetchApi = fetchApi as jest.MockedFunction<
      typeof fetchApi<ItemData[], null>
    >;
    mockedFetchApi.mockResolvedValue(output);

    render(
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
    );

    // The auth text is present
    expect(
      screen.queryByText("You are logged in as", { exact: false })
    ).toBeInTheDocument();

    // The header is present
    expect(
      screen.getByRole("heading", { name: "Hello World!" })
    ).toBeInTheDocument();

    expect(await screen.findByText("item one")).toBeInTheDocument();

    expect(await screen.findByText("item two")).toBeInTheDocument();

    // Type some data into the input
    await userEvent.type(screen.getByLabelText("Item"), "item three");

    // This is the response that will be provided on the add call
    mockedFetchApi.mockResolvedValue([
      ...output,
      { id: "3", item: "item three" },
    ]);

    // Click the add button
    act(() => {
      fireEvent.click(screen.getByText("Add", { selector: "button" }));
    });

    expect(mockedFetchApi.mock.calls[1][3]).toEqual({ item: "item three" });

    // Now we should have a list item with the text we entered
    expect(await screen.findByText("item three")).toBeInTheDocument();
  });
});
