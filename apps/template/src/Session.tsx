import React, { useState, useEffect, useContext, createContext } from "react";
import { useCookies } from "react-cookie";
import { ErrorMessage } from "./components/";
import fetchApi from "./helpers/fetchApi";

type SessionContextProperties = {
  initialized: boolean;
  token: string | null;
  user: ProfileData | null;
  error: string | null;
  message: string | null;
};

export type SessionContextData = SessionContextProperties & {
  setInitialized: React.Dispatch<React.SetStateAction<boolean>>;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  setUser: (user: ProfileData | null) => void;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setMessage: React.Dispatch<React.SetStateAction<string | null>>;
};

const DEFAULT_SESSION_CONTEXT_DATA: SessionContextData = {
  initialized: false,
  setInitialized: () => {},
  token: null,
  setToken: () => {},
  user: null,
  setUser: () => {},
  error: null,
  setError: () => {},
  message: null,
  setMessage: () => {},
};

export const SessionContext = createContext<SessionContextData>(
  DEFAULT_SESSION_CONTEXT_DATA
);

export type SessionData = {
  token: string | null;
  user: ProfileData | null;
};

export type ProfileData = {
  username: string;
  name: string;
  email: string;
};

export default function Session({ children }: { children: React.ReactNode }) {
  return (
    <SessionAware>
      <SessionLoader>{children}</SessionLoader>
    </SessionAware>
  );
}

export function SessionLoader({ children }: { children: React.ReactNode }) {
  const {
    initialized,
    setInitialized,
    token,
    setToken,
    setUser,
    error,
    setError,
  } = useContext(SessionContext);
  const [cookies, setCookie] = useCookies(["session_token"]);

  const checkSession = () => {
    fetchApi<SessionData, null>("/auth/session", token || cookies.session_token)
      .then((session: SessionData) => {
        if (session) {
          setCookie("session_token", session.token, { path: "/" });
          setToken(session.token);
          setUser(session.user);
        }
      })
      .catch((err) => {
        if (err.message !== "Unauthorized") {
          setError(err.message);
        }
      })
      .finally(() => {
        setInitialized(true);
      });
  };

  useEffect(() => {
    if (!initialized) {
      checkSession();
    }

    // Refresh the session every 30 seconds
    const intervalId = setInterval(checkSession, 1000 * 30);

    return () => clearInterval(intervalId);
  }, [token]);

  if (!initialized && error) {
    return <ErrorMessage error={error} />;
  }

  if (!initialized) {
    return (
      <div>
        <em>Loading...</em>
      </div>
    );
  }

  return children;
}

export function SessionAware({
  initialized: defaultInitialized = false,
  token: defaultToken = null,
  user: defaultUser = null,
  error: defaultError = null,
  message: defaultMessage = null,
  children,
}: Partial<SessionContextProperties> & { children: React.ReactNode }) {
  const [initialized, setInitialized] = useState<boolean>(defaultInitialized);
  const [token, setToken] = useState<string | null>(defaultToken);
  const [user, setUser] = useState<ProfileData | null>(defaultUser);
  const [error, setError] = useState<string | null>(defaultError);
  const [message, setMessage] = useState<string | null>(defaultMessage);

  return (
    <SessionContext.Provider
      value={{
        initialized,
        setInitialized,
        token,
        setToken,
        user,
        // Allow for partial setting of user data
        setUser: (user: ProfileData | null) => {
          if (!user) {
            setUser(null);
            return;
          }
          setUser((oldUser: React.SetStateAction<ProfileData | null>) => ({
            ...oldUser,
            ...user,
          }));
        },
        error,
        setError,
        message,
        setMessage,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
