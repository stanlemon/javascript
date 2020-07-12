import * as React from "react";
import { LoginViewProps as Props } from "@stanlemon/react-couchdb-authentication/dist/components/LoginView";

export function Login(props: Props): React.ReactElement {
  return (
    <>
      {props.error && (
        <div className="notification is-danger">{props.error}</div>
      )}
      <div className="field is-horizontal">
        <div className="field-body">
          <div className="field">
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
          <button className="button is-success" onClick={props.login}>
            Login
          </button>
        </div>
      </div>
      <p className="has-text-centered">
        <button className="button is-text" onClick={props.navigateToSignUp}>
          Don't have an account? Click here to sign up
        </button>
      </p>
    </>
  );
}

/*
            <p>
              <button
                className="button is-text"
                onClick={props.navigateToSignUp}
              >
                Click here to sign up
              </button>
            </p>
*/
