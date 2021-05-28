import * as React from "react";
import { render, act, screen, waitFor, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import PouchDB from "pouchdb";
import { App } from "./App";

window.setImmediate = window.setInterval;

// eslint-disable-next-line @typescript-eslint/no-var-requires
PouchDB.plugin(require("pouchdb-adapter-memory"));

describe("<App />", () => {
  afterEach(cleanup);

  // eslint-disable-next-line jest/expect-expect
  it("renders", async () => {
    const db = new PouchDB("test", {
      adapter: "memory",
    });

    act(() => {
      render(<App db={db} />);
    });

    await waitFor(() => screen.getByText("Notes:"));

    await waitFor(() => screen.getByText("Tasks:"));
  });
});
