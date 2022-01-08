import { useState } from "react";
import "./App.less";
import Header from "./Header";
import Input from "./Input";

export default function App() {
  const [items, setItems] = useState<string[]>([]);
  return (
    <div>
      <Header />
      <Input onClick={(item) => setItems([...items, item])} />
      <ul>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
