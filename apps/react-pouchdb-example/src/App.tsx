import * as React from "react";
import {
  Database,
  Context as DatabaseContext,
  Document
} from "@stanlemon/react-pouchdb";
import { Notes } from "./Notes";
import { Tasks } from "./Tasks";
import { Authentication } from "@stanlemon/react-couchdb-authentication";
import {
  LoginContainer,
  Login,
  SignUpContainer,
  SignUp
} from "@stanlemon/react-couchdb-authentication/dist/components/";
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
const LoginComponent = props => (
  <LoginContainer {...props} component={<Login />} />
);
const SignUpComponent = props => (
  <SignUpContainer {...props} component={<SignUp />} />
);
const LoadingComponent = (): React.ReactElement<{}> => <div>Loading...</div>;

const remoteUrl = "http://127.0.0.1:5984/_users";

export default class App extends React.Component {
  /* eslint-disable max-lines-per-function */
  render(): React.ReactNode {
    return (
      <Authentication
        url={remoteUrl}
        // Disable sync because the <Database/> component will manage this for us
        sync={false}
        loading={<LoadingComponent />}
        login={<LoginComponent />}
        signup={<SignUpComponent />}
      >
        {({ logout, db, remoteDb, user }) => (
          <div>
            <h1>
              Hello <a href="mailto:{user.email}">{user.name}</a>
            </h1>
            <button onClick={logout}>Logout</button>
            <div className="app">
              <h1 className="is-size-1">Test App!</h1>
              <hr />
              <div className="columns">
                <Database database={db} remote={remoteDb}>
                  <div className="column">
                    <WrappedNotes />
                  </div>
                  <div className="column">
                    <WrappedTasks />
                  </div>
                </Database>
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
          </div>
        )}
      </Authentication>
    );
  }
}
