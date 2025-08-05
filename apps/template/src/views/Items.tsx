import { useState, useEffect, useContext } from "react";

import { Input, Row, Spacer } from "../components/";
import { fetchApi } from "../helpers/fetchApi";
import { SessionContext } from "../Session";

export type ItemData = {
  id: string;
  item: string;
};

export function Items() {
  const { token, setError } = useContext(SessionContext);
  const [items, setItems] = useState<ItemData[]>([]);
  const [value, setValue] = useState<string>("");

  const catchError = (err: Error) => {
    setError(err.message);
  };

  const saveItem = (item: string) => {
    fetchApi<ItemData[], { item: string }>("/api/items", token, "post", {
      item,
    })
      .then((items) => {
        setItems(items);
      })
      .catch(catchError);
  };

  const deleteItem = (id: string) => {
    fetchApi<ItemData[], string>(`/api/items/${id}`, token, "delete")
      .then((items) => {
        setItems(items);
      })
      .catch(catchError);
  };

  const addItem = () => {
    if (value.trim() === "") {
      return;
    }
    saveItem(value);
    setValue("");
  };

  useEffect(() => {
    fetchApi<ItemData[], null>("/api/items", token)
      .then((items) => {
        setItems(items ?? []);
      })
      .catch(catchError);
  }, []);

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

export default Items;
