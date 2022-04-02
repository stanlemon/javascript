import ReactDOM from "react-dom";

type Props = {
  name: string;
};

function App({ name }: Props) {
  return <div>Hello {name}!</div>;
}

ReactDOM.render(<App name="world" />, document.getElementById("root"));
