import React, { useState, useEffect, createContext } from "react";

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
  name: string | null;
  email: string | null;
  username: string;
  password: string;
};

export default function Session({ children }: { children: React.ReactChild }) {
  const [initialized, setInitialized] = useState<boolean>(false);
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
          throw new Error(response.statusText);
        }
        return response;
      })
      .then((response) => response.json())
      .then((session: SessionData) => {
        setSession(session);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [session?.token, initialized]);

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
