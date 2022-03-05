import { useState, useEffect } from "react";
import "./App.less";
import Header from "./Header";
import Input from "./Input";

type User = {
  username: string;
  password: string;
};

export default function App() {
  const [value, setValue] = useState<string>("");
  const [items, setItems] = useState<string[]>([]);
  const [session, setSession] = useState<null | User>(null);

  useEffect(() => {
    fetch("/auth/session")
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response;
      })
      .then((response) => response.json())
      .then((session: User) => {
        setSession(session);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [session]);

  const addItem = () => {
    setItems([...items, value]);
    setValue("");
  };

  return (
    <div>
      <Header />
      <div>
        {!session && <em>You are not currently logged in.</em>}
        {session && <em>You logged in as {session.username}.</em>}
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
    </div>
  );
}
