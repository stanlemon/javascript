import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import "./App.less";
import { defaults } from "lodash";

export default class App extends React.Component {
  state = {
    input: "",
    items: [],
  };

  handleTyping = (e: React.FormEvent<HTMLInputElement>): void => {
    this.setState({
      input: e.currentTarget.value,
    });
  };

  handleClick = (): void => {
    this.setState({
      items: [...this.state.items, this.state.input],
      input: "",
    });
  };

  render(): React.ReactElement {
    const x = defaults({ a: 1 }, { a: 3, b: 2 });
    console.log(x);

    return (
      <div>
        <h1>Hello World!</h1>
        <FontAwesomeIcon icon={faCoffee} />
        <input
          type="text"
          onChange={this.handleTyping}
          value={this.state.input}
        />
        <button onClick={this.handleClick}>Add</button>
        <ul>
          {this.state.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    );
  }
}
