import * as React from "react";
import { Database, Aware, Document, withDocument } from "./PouchDb";
import Counter from "./Counter";
import { Notes } from "./Notes";
import { Tasks } from "./Tasks";
import { DatabaseInfo } from "./DatabaseInfo";
import "./App.css";
import { withContainer, Header } from "./withContainer";

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

const WrappedHeader = withContainer(Header);

export default class App extends React.Component {
  render(): React.ReactNode {
    return (
      <Database database="local" remote="http://127.0.0.1:5984/test">
        <div className="app">
          <WrappedHeader>Test App!</WrappedHeader>
          <WrappedCounter count={0} loading={<div>Loading Counter...</div>} />
          <WrappedNotes />
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
