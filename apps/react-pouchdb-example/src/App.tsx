import * as React from "react";
import { Container, Document } from "./PouchDb";
import Counter from "./Counter";
import "./App.css";

const WrappedCounter = Document("counter", Counter);

export default class App extends React.Component {
  render(): React.ReactNode {
    return (
      <Container database="local">
        <div className="app">
          <h1>Counter App!</h1>
          <WrappedCounter count={0} loading={<div>Loading...</div>} />
        </div>
      </Container>
    );
  }
}
