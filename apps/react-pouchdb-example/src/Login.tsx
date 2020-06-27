import * as React from "react";
import { Header } from "./Header";
import { LoginViewProps as Props } from "@stanlemon/react-couchdb-authentication/dist/components/LoginView";

export function Login(props: Props): React.ReactElement {
  return (
    <div>
      <Header title="Test App" subtitle="Login to get started" />

      <br />

      <div className="container">
        <div className="columns">
          <div className="column is-three-fifths is-offset-one-fifth">
            {props.error && (
              <div className="notification is-danger">{props.error}</div>
            )}

            <div className="field">
              <label className="label">Username</label>
              <div className="control has-icons-left has-icons-right">
                <input
                  className="input"
                  type="text"
                  placeholder="Username"
                  value={props.username}
                  onChange={props.setUsername}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-user" />
                </span>
              </div>
            </div>
            <div className="field">
              <label className="label">Password</label>
              <p className="control has-icons-left">
                <input
                  className="input"
                  type="password"
                  placeholder="Password"
                  value={props.password}
                  onChange={props.setPassword}
                  onKeyDown={(e): void => {
                    // Submit the form if they hit enter
                    if (e.key.toLowerCase() === "enter") {
                      props.login();
                    }
                  }}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-lock" />
                </span>
              </p>
            </div>
            <div className="field">
              <p className="control">
                <button className="button is-success" onClick={props.login}>
                  Login
                </button>
              </p>
            </div>

            <p>
              <button
                className="button is-text"
                onClick={props.navigateToSignUp}
              >
                Click here to sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
