import React, { useState, useEffect, createContext } from "react";
import { useCookies } from "react-cookie";
import { ErrorMessage } from "./components/";

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
  const [cookies, setCookie, removeCookie] = useCookies(["session_token"]);

  const clearSession = () => {
    removeCookie("session_token", { path: "/" });
    setSession({ token: null, user: null });
  };

  const checkSession = () => {
    fetch("/auth/session", {
      headers: {
        Authorization: `Bearer ${session.token || cookies.session_token || ""}`,
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
        setCookie("session_token", session.token, { path: "/" });
        setSession(session);
      })
      .catch((err: Error) => {
        if (err.message === "Unauthorized") {
          clearSession();
          return;
        }
        setError(err.message);
      });
  };

  useEffect(() => {
    checkSession();

    // Refresh the session every 30 seconds
    const intervalId = setInterval(checkSession, 1000 * 30);

    return () => clearInterval(intervalId);
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

  const contextValue = {
    session,
    setSession,
  };

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
}
