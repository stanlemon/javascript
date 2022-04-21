import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { SessionContext } from "./Session";

const output = ["item one", "item two"];
global.fetch = jest.fn((url, opts: { method: string; body: string }) => {
  if (opts.method === "post") {
    output.push(JSON.parse(opts.body) as string);
  }
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve(output),
  });
}) as jest.Mock;

test("<App/>", async () => {
  act(() => {
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
  });

  // The auth text is present
  expect(screen.getByText("You logged in as user")).toBeInTheDocument();

  // The header is present
  expect(
    screen.getByRole("heading", { name: "Hello World!" })
  ).toBeInTheDocument();

  expect(
    await screen.findByText("item one", { selector: "li" })
  ).toBeInTheDocument();

  expect(
    await screen.findByText("item two", { selector: "li" })
  ).toBeInTheDocument();

  // Type some data into the input
  await userEvent.type(screen.getByLabelText("Item"), "item three");

  // Click the add button
  act(() => {
    fireEvent.click(screen.getByText("Add", { selector: "button" }));
  });

  // Now we should have a list item with the text we entered
  expect(
    await screen.findByText("item three", { selector: "li" })
  ).toBeInTheDocument();
});
