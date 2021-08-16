import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
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
                <FontAwesomeIcon icon={faUser} />
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
                <FontAwesomeIcon icon={faLock} />
              </span>
            </p>
          </div>
          <button className="button is-success" onClick={props.login}>
            Login
          </button>
        </div>
      </div>
    </>
  );
}
