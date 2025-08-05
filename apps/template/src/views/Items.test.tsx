import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
  type MockedFunction,
} from "vitest";

import { fetchApi } from "../helpers/fetchApi";
import { SessionAware } from "../Session";

import { Items, ItemData } from "./Items";

vi.mock("../helpers/fetchApi");

describe("<Items/>", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders", async () => {
    const output = [
      { id: "1", item: "item one" },
      { id: "2", item: "item two" },
    ];

    const mockedFetchApi = fetchApi as MockedFunction<
      typeof fetchApi<ItemData[], null>
    >;
    mockedFetchApi.mockResolvedValue(output);

    render(
      <SessionAware>
        <Items />
      </SessionAware>
    );

    // Testing Library queries throw if elements aren't found, providing built-in assertions
    await screen.findByText("item one"); // Will throw if not found
    await screen.findByText("item two"); // Will throw if not found

    // Type some data into the input
    await userEvent.type(screen.getByLabelText("Item"), "item three");

    // This is the response that will be provided on the add call
    mockedFetchApi.mockResolvedValue([
      ...output,
      { id: "3", item: "item three" },
    ]);

    // Click the add button
    fireEvent.click(screen.getByText("Add", { selector: "button" }));

    expect(mockedFetchApi.mock.calls[1][3]).toEqual({ item: "item three" });

    // Now we should have a list item with the text we entered
    await screen.findByText("item three"); // Will throw if not found
  });
});
