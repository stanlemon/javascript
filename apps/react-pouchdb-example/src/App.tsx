import * as React from "react";
import { Database, Document } from "@stanlemon/react-pouchdb";
import { Notes } from "./Notes";
import { Tasks } from "./Tasks";
import "./App.css";
import "bulma/css/bulma.css";

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
          <hr />
          <div className="columns">
            <div className="column">
              <WrappedNotes />
            </div>
            <div className="column">
              <WrappedTasks />
            </div>
          </div>
        </div>
        <br />
        <footer className="footer">
          <div className="content has-text-centered">
            <p>
              Created by <a href="http://stanlemon.net">Stan Lemon</a> using{" "}
              <a href="https://github.com/stanlemon/react-pouchdb">
                React PouchDB components.
              </a>
            </p>
          </div>
        </footer>
      </Database>
    );
  }
}
