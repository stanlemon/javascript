import Home from "./Home";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

test("<Home/>", async () => {
  render(<Home />);

  await waitFor(() => screen.getByText("Hello World"));
});
