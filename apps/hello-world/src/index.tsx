import { createRoot } from "react-dom/client";

import Home from "./components/Home";

const root = createRoot(
  document.body.appendChild(document.createElement("div"))
);
root.render(<Home />);
