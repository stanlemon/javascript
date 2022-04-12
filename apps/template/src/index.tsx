import { createRoot } from "react-dom/client";
import App from "./App";

const root = createRoot(
  document.body.appendChild(document.createElement("div"))
);
root.render(<App />);

const link = document.createElement("link");
link.setAttribute("rel", "stylesheet");
link.setAttribute("type", "text/css");
link.setAttribute(
  "href",
  "https://cdn.jsdelivr.net/npm/water.css@2/out/water.min.css"
);

document.getElementsByTagName("head")[0].appendChild(link);
