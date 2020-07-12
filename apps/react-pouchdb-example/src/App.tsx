import * as React from "react";
import { Database, Document } from "@stanlemon/react-pouchdb";
import {
  Authentication,
  Context as AuthenticationContext,
  Authenticated,
  Unauthenticated,
  withAuthentication,
  Login,
  SignUp,
} from "@stanlemon/react-couchdb-authentication";
import "@fortawesome/fontawesome-free/css/all.css";
import "bulma/css/bulma.css";
import "./App.css";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Login as LoginView } from "./Login";
import { SignUp as SignUpView } from "./SignUp";
import { Notes } from "./Notes";
import { Tasks } from "./Tasks";

const remoteUrl = process.env.REMOTE_URL
  ? process.env.REMOTE_URL
  : "http://127.0.0.1:5984/";

// Example using the component and wrapping children
const WrappedNotes = (): React.ReactElement => (
  <Document id="notes" loading={<div>Loading Notes...</div>} debug={true}>
    <Notes />
  </Document>
);
// Example using the component and the 'component' property
const WrappedTasks = (): React.ReactElement => (
  <Document id="tasks" component={<Tasks />} debug={true} />
);

export const App = withAuthentication(
  ({
    logout,
    db,
    remoteDb,
    user,
  }: {
    logout?: () => void;
    db: PouchDB.Database;
    remoteDb: PouchDB.Database;
    user?: { name: string; email: string };
  }): React.ReactElement => {
    return (
      <div>
        <Header title="Test App" subtitle="Notes, tasks and stuff like that" />

        <div className="app container">
          <Authenticated>
            <div className="columns is-mobile is-gapless is-vcentered">
              <div className="column is-half">
                {user && user.name && (
                  <h1>
                    Hello, <a href={`mailto:${user.email}`}>{user.name}</a>!
                  </h1>
                )}
              </div>
              <div className="column  is-half has-text-right">
                <button className="button is-small" onClick={logout}>
                  <span className="icon is-small">
                    <i className="fas fa-sign-out-alt" />
                  </span>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </Authenticated>
          <Unauthenticated>
            <AuthenticationContext.Consumer>
              {({ login, error }) => (
                <Login error={error} login={login} component={LoginView} />
              )}
            </AuthenticationContext.Consumer>
          </Unauthenticated>

          <hr />

          <div className="columns">
            <Database debug={true} database={db} remote={remoteDb}>
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
    );
  }
);

export default function (): React.ReactElement {
  return (
    <Authentication
      scaffold={false}
      debug={true}
      url={remoteUrl}
      // Disable sync because the <Database/> component will manage this for us
      sync={false}
      login={<Login component={LoginView} />}
      signup={<SignUp component={SignUpView} />}
    >
      <App />
    </Authentication>
  );
}
