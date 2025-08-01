import React from "react";
import PouchDB from "pouchdb";
import PouchDBMemoryAdapter from "pouchdb-adapter-memory";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Authentication, Login, SignUp, withAuthentication } from "../";
import fetch from "isomorphic-fetch";

if (!window.setImmediate) {
  // This is as gross as it looks. It's a workaround for using PouchDB in tests.
  window.setImmediate = window.setTimeout as unknown as typeof setImmediate;
}

PouchDB.plugin(PouchDBMemoryAdapter);

const couchDbUrl = process.env.COUCHDB_URL || "http://localhost:5984/";

const checkCouchDb = async () => {
  try {
    await fetch(couchDbUrl);
    return true;
  } catch (err) {
    return false;
  }
};

describe("<Authentication /> with CouchDB instance", () => {
  // This is a full end to end test
  it("Can submit <Signup />, create user doc, logout and then <Login />", async () => {
    const isCouchDbUp = await checkCouchDb();
    if (!isCouchDbUp) {
      console.warn(
        "Skipping the end to end test because I do not have a CouchDB instance to work with."
      );
      return;
    }

    const username = "test" + Date.now().toString();
    const password = "password";
    const email = "email@example.com";

    const App = withAuthentication(
      ({ user, logout }): React.ReactElement => (
        <>
          <h1>Authenticated</h1>
          <h2>Hello {user.name}</h2>
          <button data-testid="logout" onClick={logout}>
            Click to logout
          </button>
        </>
      )
    );

    render(
      <Authentication
        debug={false}
        adapter="memory"
        url={couchDbUrl}
        login={<Login />}
        signup={<SignUp />}
      >
        <App />
      </Authentication>
    );

    // This element is present before connecting to CouchDB and then should be removed.
    await waitFor(() => {
      const loading = screen.queryByText("Loading...");
      expect(loading).not.toBeInTheDocument(); // it doesn't exist
    });

    // On login screen, navigate to signup
    fireEvent.click(screen.getByTestId("navigate-to-sign-up"));

    // Check that our signup form is on the page
    const signUpButton = screen.getByRole("button", { name: "Sign Up" });
    expect(signUpButton).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Username"), {
      target: {
        value: username,
      },
    });

    // Fill in email
    fireEvent.change(screen.getByLabelText("Email"), {
      target: {
        value: email,
      },
    });

    // Fill in password
    fireEvent.change(screen.getByLabelText("Password"), {
      target: {
        value: password,
      },
    });

    // Submit the form
    fireEvent.click(signUpButton);

    await waitFor(
      () => {
        expect(screen.getByText("Authenticated")).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    expect(screen.getByText("Hello " + username)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("logout"));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Username"), {
      target: {
        value: username,
      },
    });

    // Fill in password
    fireEvent.change(screen.getByLabelText("Password"), {
      target: {
        value: password,
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(screen.getByText("Authenticated")).toBeInTheDocument();
    });

    // Now we need to cleanup the user that we created
    const userUrl =
      couchDbUrl.substring(0, 7) +
      username +
      ":" +
      password +
      "@" +
      couchDbUrl.substring(7) +
      "_users/org.couchdb.user:" +
      username;

    const userResponse = await fetch(userUrl);
    const user = (await userResponse.json()) as { _rev: string };

    const userDeleteResponse = await fetch(userUrl + "?rev=" + user._rev, {
      method: "DELETE",
    });
    const userDelete = (await userDeleteResponse.json()) as { ok: boolean };

    // We successfully delete the user that we created
    expect(userDelete.ok).toBe(true);
  }, 25000);
});
