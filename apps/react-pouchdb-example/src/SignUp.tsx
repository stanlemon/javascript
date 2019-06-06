import * as React from "react";
import { Header } from "./Header";

export function SignUp(props: {
  error: string;
  username: string;
  setUsername(event: React.FormEvent<HTMLInputElement>): void;
  email: string;
  setEmail(event: React.FormEvent<HTMLInputElement>): void;
  password: string;
  setPassword(event: React.FormEvent<HTMLInputElement>): void;
  signUp(): void;
  navigateToLogin(): void;
}): JSX.Element {
  return (
    <div>
      <Header title="Test App" subtitle="Signup for a new account" />

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
                  <i className="fas fa-envelope" />
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
                  <i className="fas fa-lock" />
                </span>
              </p>
            </div>
            <div className="field">
              <p className="control">
                <button className="button is-success" onClick={props.signUp}>
                  Sign Up
                </button>
              </p>
            </div>

            <p>
              <button
                className="button is-text"
                onClick={props.navigateToLogin}
              >
                Return to login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
