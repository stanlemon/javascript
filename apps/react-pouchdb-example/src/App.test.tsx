import * as React from "react";
import { render, waitFor, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import PouchDB from "pouchdb";
import { App } from "./App";

window.setImmediate = window.setInterval;

// eslint-disable-next-line @typescript-eslint/no-var-requires
PouchDB.plugin(require("pouchdb-adapter-memory"));

jest.useFakeTimers();

describe("<App />", () => {
  afterEach(cleanup);

  // eslint-disable-next-line jest/expect-expect
  it("renders", async () => {
    const db = new PouchDB("test", {
      adapter: "memory",
    });

    const { getByText } = render(<App db={db} />);

    await waitFor(() => getByText("Loading Notes..."));

    await waitFor(() => getByText("Loading Tasks..."));
  });
});
