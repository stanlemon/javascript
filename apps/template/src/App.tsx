import { useState, useContext, useEffect } from "react";
import "./App.less";
import { SessionContext } from "./Session";
import {
  Column,
  ErrorMessage,
  Header,
  Input,
  Row,
  Spacer,
} from "./components/";
import { Login, SignUp } from "./views/";

export type ErrorResponse = {
  message: string;
};

export type FormErrors = {
  errors: Record<string, string>;
};

export type ItemData = {
  id: string;
  item: string;
};

// eslint-disable-next-line max-lines-per-function
export default function App() {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [items, setItems] = useState<ItemData[]>([]);
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

    fetchApi<ItemData[], null>("/api/items", session?.token || "")
      .then((items) => {
        setLoaded(true);
        setItems(items);
      })
      .catch(catchError);
  });

  const saveItem = (item: string) => {
    fetchApi<ItemData[], { item: string }>(
      "/api/items",
      session?.token || "",
      "post",
      {
        item,
      }
    )
      .then((items) => {
        setItems(items);
      })
      .catch(catchError);
  };

  const deleteItem = (id: string) => {
    fetchApi<ItemData[], string>(
      `/api/items/${id}`,
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
            <h2>Sign Up</h2>
            <SignUp />
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
  items: ItemData[];
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
        {items.map(({ item, id }, i) => (
          <Row key={i} as="li">
            <button
              style={{ marginLeft: "auto", order: 2 }}
              onClick={() => deleteItem(id)}
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
