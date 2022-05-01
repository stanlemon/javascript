import React, { useState, useContext, useEffect } from "react";
import "./App.less";
import { SessionContext } from "./Session";
import Header from "./Header";
import Input from "./Input";
import Login from "./Login";
import Register from "./Register";

export type ErrorResponse = {
  message: string;
};

export type FormErrors = {
  errors: Record<string, string>;
};

export default function App() {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [items, setItems] = useState<string[]>([]);
  const [error, setError] = useState<string | boolean>(false);

  const { session, setSession } = useContext(SessionContext);

  const catchError = (err: Error) => {
    if (err.message === "Unauthorized") {
      return;
    }
    setError(err.message);
  };

  useEffect(() => {
    if (loaded) {
      return;
    }

    fetchApi<string[], null>("/api/items", session?.token || "")
      .then((items) => {
        setLoaded(true);
        setItems(items);
      })
      .catch(catchError);
  });

  const saveItem = (item: string) => {
    fetchApi<string[], string>("/api/items", session?.token || "", "post", item)
      .then((items) => {
        setItems(items);
      })
      .catch(catchError);
  };

  const deleteItem = (item: string) => {
    fetchApi<string[], string>(
      "/api/items/" + item,
      session?.token || "",
      "delete"
    )
      .then((items) => {
        setItems(items);
      })
      .catch(catchError);
  };

  const logout = () => {
    setSession({ token: null, user: null });
  };

  return (
    <>
      <Header />
      <ErrorMessage error={error} />
      {!session.user && (
        <Row>
          <Column>
            <h2>Login</h2>
            <Login />
          </Column>
          <Column />
          <Column>
            <h2>Register</h2>
            <Register />
          </Column>
        </Row>
      )}
      {session.user && (
        <>
          <p>
            <em>You are logged in as {session.user?.username}.</em>{" "}
            <span style={{ cursor: "pointer" }} onClick={logout}>
              (logout)
            </span>
          </p>
          <ItemList items={items} saveItem={saveItem} deleteItem={deleteItem} />
        </>
      )}
      <Spacer />
    </>
  );
}

function ItemList({
  items,
  saveItem,
  deleteItem,
}: {
  items: string[];
  saveItem(item: string): void;
  deleteItem(item: string): void;
}) {
  const [value, setValue] = useState<string>("");

  const addItem = () => {
    saveItem(value);
    setValue("");
  };

  return (
    <>
      <h2>New Item</h2>
      <Input
        label="Item"
        name="item"
        value={value}
        onChange={(value) => setValue(value)}
        onEnter={addItem}
      />
      <button onClick={addItem}>Add</button>
      <Spacer />
      <h2>My Items</h2>
      <ul style={{ padding: 0 }}>
        {items.map((item, i) => (
          <Row key={i} as="li">
            <button
              style={{ marginLeft: "auto", order: 2 }}
              onClick={() => deleteItem(item)}
            >
              Delete
            </button>
            <div>{item}</div>
          </Row>
        ))}
      </ul>
    </>
  );
}

export function Row({
  as = "div",
  children,
}: {
  as?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
}) {
  return React.createElement(
    as,
    {
      style: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        width: "100%",
      },
    },
    children
  );
}

export function Spacer({ height = "2em" }: { height?: string | number }) {
  return <div style={{ height, minHeight: height }} />;
}

export function Column({
  as = "div",
  children,
}: {
  as?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
}) {
  return React.createElement(
    as,
    {
      style: {
        display: "flex",
        flexDirection: "column",
        flexBasis: "100%",
        flex: "1 1 0",
      },
    },
    children
  );
}

export function ErrorMessage({ error }: { error: string | boolean }) {
  if (error) {
    return (
      <p>
        <strong>An error has occurred:</strong> {error}
      </p>
    );
  }
  return <></>;
}

function fetchApi<T, P>(
  url: string,
  token: string,
  method = "get",
  data?: P
): Promise<T> {
  return fetch(url, {
    method: method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json() as Promise<T>;
  });
}
