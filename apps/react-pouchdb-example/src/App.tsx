import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { Database, Document } from "@stanlemon/react-pouchdb";
import {
  Authentication,
  Authenticated,
  Unauthenticated,
  withAuthentication,
  Login,
  SignUp,
} from "@stanlemon/react-couchdb-authentication";
import "bulma/css/bulma.css";
import "./App.css";
import { DocumentWithRows } from "./DocumentWithRows";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Login as LoginView } from "./Login";
import { SignUp as SignUpView } from "./SignUp";
import { Notes } from "./Notes";
import { Tasks } from "./Tasks";
import { Modal } from "./Modal";

//const remoteUrl = process.env.REMOTE_DB_URL ?? "http://localhost:8080/couchdb/";
const remoteUrl = "http://localhost:8080/couchdb/";

// Example using the component and wrapping children
const WrappedNotes = (): React.ReactElement => (
  <DocumentWithRows
    id="notes"
    loading={<div>Loading Notes...</div>}
    debug={true}
  >
    <Notes />
  </DocumentWithRows>
);
// Example using the component and the 'component' property
const WrappedTasks = (): React.ReactElement => (
  <Document
    id="tasks"
    component={<Tasks />}
    loading={<div>Loading Tasks...</div>}
    debug={true}
  />
);

export function App({
  logout,
  db,
  remoteDb,
  user,
}: {
  db?: PouchDB.Database;
  remoteDb?: PouchDB.Database;
  logout?: () => void;
  user?: {
    name: string;
    email: string;
  };
}): React.ReactElement {
  const [isSigningUp, setSigningUp] = useState(false);

  return (
    <>
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
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </Authenticated>
        <Unauthenticated>
          <>
            <Login component={LoginView} />
            <p className="has-text-centered">
              <button
                className="button is-text"
                onClick={() => setSigningUp(true)}
              >
                Don&apos;t have an account? Click here to sign up
              </button>
            </p>
          </>
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
      <Unauthenticated>
        <Modal open={isSigningUp} onClose={() => setSigningUp(false)}>
          <SignUp component={SignUpView} />
        </Modal>
      </Unauthenticated>
    </>
  );
}

const WrappedApp = withAuthentication(App);

export default function AuthenticatedApp(): React.ReactElement {
  return (
    <Authentication
      scaffold={false}
      debug={true}
      url={remoteUrl}
      // Disable sync because the <Database/> component will manage this for us
      sync={false}
    >
      <WrappedApp />
    </Authentication>
  );
}
