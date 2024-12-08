import { createRoot } from "react-dom/client";
import App from "./App";

const root = createRoot(
  document.body.appendChild(document.createElement("div"))
);
root.render(<App />);

// This is a workaround for changes made in React 19 until fontawesome is updated.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface Element extends React.JSX.Element {}
  }
}
