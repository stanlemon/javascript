import "@testing-library/jest-dom";
import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Account from "./Account";
import { SessionContext, SessionData } from "../Session";

import { useState } from "react";

jest.mock("../helpers/fetchApi", () => {
  return {
    __esModule: true,
    default: jest.fn(() => {
      return Promise.resolve({
        name: "Jean Luc Picard",
        email: "jeanluc@starfleet.com",
      });
    }),
  };
});

describe("<Account/>", () => {
  it("works", async () => {
    render(
      <SessionAware>
        <Account />
      </SessionAware>
    );

    expect(screen.getByText('Account for ""')).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText("Name"), "Jean Luc Picard");

    fireEvent.click(screen.getByText("Save", { selector: "button" }));

    await waitFor(() => {
      expect(
        screen.getByText('Account for "Jean Luc Picard"')
      ).toBeInTheDocument();
    });
  });
});

function SessionAware({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionData>({
    token: null,
    user: null,
  });

  return (
    <SessionContext.Provider
      value={{
        session,
        setSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
