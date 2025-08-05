import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { test } from "vitest";

import Home from "./Home";

test("<Home/>", async () => {
  render(<Home />);

  await waitFor(() => screen.getByText("Hello World"));
});
