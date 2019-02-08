import * as React from "react";
import { Container, withDocument } from "./PouchDb";
import Counter from "./Counter";
import { Notes } from "./Notes";
import "./App.css";

const WrappedCounter = withDocument("counter", Counter);
const WrappedNotes = withDocument("notes", Notes);

export default class App extends React.Component {
  render(): React.ReactNode {
    return (
      <Container database="local">
        <div className="app">
          <h1>Counter App!</h1>
          <WrappedCounter count={0} loading={<div>Loading...</div>} />
          <WrappedNotes loading={<div>Loading...</div>} />
        </div>
      </Container>
    );
  }
}
