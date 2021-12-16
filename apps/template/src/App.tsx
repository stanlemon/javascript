import React, { useState } from "react";
import "./App.less";

function Input({ onClick }) {
  const [value, setValue] = useState("");

  const handleClick = () => {
    onClick(value);
    setValue("");
  };

  return (
    <>
      <input
        type="text"
        onChange={(e) => setValue(e.currentTarget.value)}
        value={value}
      />
      <button onClick={handleClick}>Add</button>
    </>
  );
}

export default function App() {
  const [items, setItems] = useState([]);
  return (
    <div>
      <h1>Hello World!</h1>
      <Input onClick={(item) => setItems([...items, item])} />
      <ul>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
