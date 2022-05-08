import * as React from "react";
import { render, act, screen, waitFor, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import PouchDB from "pouchdb";
import { App } from "./App";
// https://github.com/facebook/jest/issues/11511#issuecomment-853355787
import { setImmediate } from "timers";

window.setImmediate = setImmediate;

describe("<App />", () => {
  beforeAll(async () => {
    const { default: PouchDBMemoryAdapter } = await import(
      "pouchdb-adapter-memory"
    );

    PouchDB.plugin(PouchDBMemoryAdapter);
  });

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
