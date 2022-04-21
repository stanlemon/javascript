import { useState, useContext, useEffect } from "react";
import "./App.less";
import { SessionContext } from "./Session";
import Header from "./Header";
import Input from "./Input";
import Login from "./Login";
import Register from "./Register";

export type ErrorMessage = {
  message: string;
};

export type FormErrors = {
  errors: Record<string, string>;
};

export default function App() {
  const [value, setValue] = useState<string>("");
  const [items, setItems] = useState<string[]>([]);

  const { session } = useContext(SessionContext);

  const itemsJson = JSON.stringify(items);
  useEffect(() => {
    fetchApi("/api/items", session?.token || "")
      .then((items: string[]) => {
        setItems(items);
      })
      .catch((err) => console.error(err));
  }, [itemsJson, session?.token]);

  const addItem = () => {
    setValue("");

    fetchApi("/api/items", session?.token || "", "post", value)
      .then((items: string[]) => {
        setItems(items);
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Header />
      {!session.user && (
        <Row>
          <Column>
            <h2>Login</h2>
            <Login />
          </Column>
          <Column>
            <h2>Register</h2>
            <Register />
          </Column>
        </Row>
      )}
      {session.user && (
        <>
          <p>
            <em>You logged in as {session.user?.username}</em>
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
    </>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        width: "100%",
      }}
    >
      {children}
    </div>
  );
}

function Column({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexBasis: "100%",
        flex: 1,
      }}
    >
      {children}
    </div>
  );
}

function fetchApi(
  url: string,
  token: string,
  method = "get",
  data?: any
): Promise<any> {
  return fetch(url, {
    method: method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response;
    })
    .then((response) => response.json());
}
