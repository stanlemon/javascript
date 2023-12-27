import { createRoot } from "react-dom/client";

type Props = {
  name: string;
};

function App({ name }: Props) {
  return <div>Hello {name}!</div>;
}

const root = createRoot(
  document.body.appendChild(document.createElement("div"))
);
root.render(<App name="world" />);
