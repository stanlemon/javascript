import * as React from "react";
import { Database, Document } from "@stanlemon/react-pouchdb";
import { Login } from "./Login";
import { SignUp } from "./SignUp";
import { Notes } from "./Notes";
import { Tasks } from "./Tasks";
import { Authentication } from "@stanlemon/react-couchdb-authentication";
import {
  LoginContainer,
  SignUpContainer
} from "@stanlemon/react-couchdb-authentication/dist/components/";
import "./App.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "bulma/css/bulma.css";
import { Footer } from "./Footer";
import { Header } from "./Header";

const remoteUrl = process.env.REMOTE_URL
  ? process.env.REMOTE_URL
  : "http://127.0.0.1:5984/_users";

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
      <Authentication
        url={remoteUrl}
        // Disable sync because the <Database/> component will manage this for us
        sync={false}
        loading={<div>Loading...</div>}
        login={<LoginContainer component={<Login />} />}
        signup={<SignUpContainer component={<SignUp />} />}
      >
        {({ logout, db, remoteDb, user }) => (
          <div>
            <Header
              title="Test App"
              subtitle="Notes, tasks and stuff like that"
            />

            <div className="app container">
              <div className="columns">
                <div className="column">
                  <h1>
                    Hello, <a href={"mailto:" + user.email}>{user.name}</a>!
                  </h1>
                </div>
                <div className="column has-text-right">
                  <button className="button is-small" onClick={logout}>
                    <span className="icon is-small">
                      <i className="fas fa-sign-out-alt" />
                    </span>
                    <span>Logout</span>
                  </button>
                </div>
              </div>

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
            <Footer />
          </div>
        )}
      </Authentication>
    );
  }
}
