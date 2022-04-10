import { useState, useEffect, createContext } from "react";
import "./App.less";
import Header from "./Header";
import Input from "./Input";
import Login from "./Login";
import Register from "./Register";

export const SessionContext = createContext<{
  session: Session | null;
  setSession: React.Dispatch<React.SetStateAction<Session | null>>;
} | null>(null);

export type ErrorMessage = {
  message: string;
};

export type FormErrors = {
  errors: Record<string, string>;
};

export type Session = {
  token: string | null;
  user: User | null;
};

export type User = {
  name: string | null;
  email: string | null;
  username: string;
  password: string;
};

export default function App() {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [session, setSession] = useState<Session | null>(null);
  const [value, setValue] = useState<string>("");
  const [items, setItems] = useState<string[]>([]);

  const contextValue = { session, setSession };

  useEffect(() => {
    fetch("/auth/session", {
      headers: {
        Authorization: `Bearer ${session?.token || ""}`,
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
      .then((session: Session) => {
        setSession(session);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [session?.token, initialized]);

  const addItem = () => {
    setItems([...items, value]);
    setValue("");
  };

  if (!initialized) {
    return (
      <div>
        <em>Loading...</em>
      </div>
    );
  }

  return (
    <SessionContext.Provider value={contextValue}>
      <Header />
      <div>
        {!session && (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flexBasis: "100%",
                flex: 1,
              }}
            >
              <h2>Login</h2>
              <Login />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flexBasis: "100%",
                flex: 1,
              }}
            >
              <h2>Register</h2>
              <Register />
            </div>
          </div>
        )}
        {session?.user && (
          <>
            <p>
              <em>You logged in as {session.user.username}.</em>
            </p>
            <Input
              label="Item"
              name="item"
              value={value}
              onChange={(value) => setValue(value)}
              onEnter={addItem}
            />
            <button onClick={addItem}>Add</button>

            <ul>
              {items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </SessionContext.Provider>
  );
}

function Spacer() {
  return <div style={{ minHeight: "2em" }} />;
}
