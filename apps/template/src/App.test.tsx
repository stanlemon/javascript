import "@testing-library/jest-dom";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { ItemData } from "./views";
import { SessionContext } from "./Session";

const output = [
  { id: "1", item: "item one" },
  { id: "2", item: "item two" },
];
global.fetch = jest.fn((url, opts: { method: string; body: string }) => {
  if (opts.method === "post") {
    output.push(JSON.parse(opts.body) as ItemData);
  }
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve(output),
  });
}) as jest.Mock;

test("<App/>", async () => {
  render(
    <SessionContext.Provider
      value={{
        session: {
          token: "abcd",
          user: {
            username: "user",
            password: "password",
            name: "user",
            email: "user@example.com",
          },
        },
        setSession: () => {},
      }}
    >
      <App />
    </SessionContext.Provider>
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

  // Click the add button
  act(() => {
    fireEvent.click(screen.getByText("Add", { selector: "button" }));
  });

  // Now we should have a list item with the text we entered
  expect(await screen.findByText("item three")).toBeInTheDocument();
});
