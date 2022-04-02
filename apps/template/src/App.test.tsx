import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        token: "token",
        user: {
          name: "Test Tester",
          email: "test@test.com",
          username: "test",
          password: "password",
        },
      }),
  })
) as jest.Mock;

test("<App/>", async () => {
  act(() => {
    render(<App />);
  });

  // A fetch request will be made, and then the page will be initialized, wait for that
  await waitFor(() => {
    // The header is present
    expect(screen.getByRole("heading")).toHaveTextContent("Hello World!");
  });

  // Type some data into the input
  await userEvent.type(screen.getByLabelText("Item"), "The first item");

  // Click the add button
  fireEvent.click(screen.getByText("Add", { selector: "button" }));

  // Now we should have a list item with the text we entered
  expect(screen.getByRole("listitem")).toHaveTextContent("The first item");
});
