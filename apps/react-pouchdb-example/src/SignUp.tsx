import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { SignUpViewProps as Props } from "@stanlemon/react-couchdb-authentication/dist/components/SignUpView";

export function SignUp(props: Props): React.ReactElement {
  return (
    <>
      <h1 className="is-size-1">Sign Up</h1>
      <hr />
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
            <FontAwesomeIcon icon={faUser} />
          </span>
        </div>
      </div>
      <div className="field">
        <label className="label">Email</label>
        <p className="control has-icons-left has-icons-right">
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={props.email}
            onChange={props.setEmail}
          />
          <span className="icon is-small is-left">
            <FontAwesomeIcon icon={faEnvelope} />
          </span>
        </p>
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
          />
          <span className="icon is-small is-left">
            <FontAwesomeIcon icon={faLock} />
          </span>
        </p>
      </div>
      <div className="field">
        <p className="control has-text-centered">
          <button className="button is-success" onClick={props.signUp}>
            Sign Up
          </button>
        </p>
      </div>
    </>
  );
}
