import { createRoot } from "react-dom/client";
import { App } from "./App";

const root = createRoot(
  document.body.appendChild(document.createElement("div"))
);
root.render(<App />);
