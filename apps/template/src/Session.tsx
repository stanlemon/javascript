import React, { useState, useEffect, createContext } from "react";
import { ErrorMessage } from "./App";

export const SessionContext = createContext<{
  session: SessionData;
  setSession: React.Dispatch<React.SetStateAction<SessionData>>;
}>({
  session: {
    token: null,
    user: null,
  },
  setSession: () => {},
});

export type SessionData = {
  token: string | null;
  user: UserData | null;
};

export type UserData = {
  name: string;
  email: string;
  username: string;
  password: string;
};

export default function Session({ children }: { children: React.ReactNode }) {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [error, setError] = useState<string | boolean>(false);
  const [session, setSession] = useState<SessionData>({
    token: null,
    user: null,
  });

  useEffect(() => {
    fetch("/auth/session", {
      headers: {
        Authorization: `Bearer ${session.token || ""}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        setInitialized(true);

        if (!response.ok) {
          throw new ErrorMessage(response.statusText);
        }
        return response;
      })
      .then((response) => response.json())
      .then((session: SessionData) => {
        setSession(session);
      })
      .catch((err: Error) => {
        if (err.message === "Unauthorized") {
          return;
        }
        setError(err.message);
      });
  }, [session?.token, initialized]);

  if (error) {
    return <ErrorMessage error={error} />;
  }

  if (!initialized) {
    return (
      <div>
        <em>Loading...</em>
      </div>
    );
  }

  const contextValue = { session, setSession };

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
}
