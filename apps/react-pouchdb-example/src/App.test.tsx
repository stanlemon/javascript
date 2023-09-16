import { render, act, screen, waitFor } from "@testing-library/react";
import PouchDB from "pouchdb";
import { App } from "./App";
// https://github.com/facebook/jest/issues/11511#issuecomment-853355787
import { setImmediate } from "timers";
import PouchDBMemoryAdapter from "pouchdb-adapter-memory";

PouchDB.plugin(PouchDBMemoryAdapter);

window.setImmediate = setImmediate;

describe("<App />", () => {
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
