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
  }, [session?.token]);

  const addItem = () => {
    setItems([...items, value]);
    setValue("");
  };

  return (
    <SessionContext.Provider value={contextValue}>
      <Header />
      <div>
        {!session && (
          <>
            <p>
              <em>You are not currently logged in.</em>
            </p>
            <Login />
            <Spacer />
            <Register />
            <Spacer />
          </>
        )}
        {session?.user && (
          <p>
            <em>You logged in as {session.user.username}.</em>
          </p>
        )}
      </div>
      <Input
        label="Item"
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
    </SessionContext.Provider>
  );
}

function Spacer() {
  return <div style={{ minHeight: "2em" }} />;
}
