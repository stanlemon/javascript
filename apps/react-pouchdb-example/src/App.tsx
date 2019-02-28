import * as React from "react";
import { Database, Aware, Document, withDocument } from "./PouchDb";
import { Counter } from "./Counter";
import { Notes } from "./Notes";
import { Tasks } from "./Tasks";
import { Example } from "./Example";
import { DatabaseInfo } from "./DatabaseInfo";
import "./App.css";
import "bulma/css/bulma.css";

// Example using the HOC
const WrappedCounter = withDocument("counter", Counter);
// Example using the component and wrapping children
const WrappedNotes = (): React.ReactElement<{}> => (
  <Document id="notes" loading={<div>Loading Notes...</div>}>
    <Notes />
  </Document>
);
// Example using the component and the 'component' property
const WrappedTasks = (): React.ReactElement<{}> => (
  <Document id="tasks" component={<Tasks />} />
);

export default class App extends React.Component {
  render(): React.ReactNode {
    return (
      <Database database="local" remote="http://127.0.0.1:5984/test">
        <div className="app">
          <h1 className="is-size-1">Test App!</h1>
          <Example />
          <br />
          <WrappedNotes />
          <br />
          <WrappedTasks />
          <div style={{ marginTop: 20 }} />
          <Aware>
            <DatabaseInfo />
          </Aware>
        </div>
      </Database>
    );
  }
}
