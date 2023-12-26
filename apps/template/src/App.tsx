import { useState, useContext } from "react";
import { useCookies } from "react-cookie";
import { Switch, Route, Link } from "wouter";
import "./App.less";
import { SessionContext } from "./Session";
import { Column, ErrorMessage, Header, Row, Spacer } from "./components/";
import { Login, SignUp, Items, Account } from "./views/";

export type ErrorResponse = {
  message: string;
};

export type FormErrors = {
  errors: Record<string, string>;
};

export default function App() {
  const [error] = useState<string | boolean>(false);
  const { session, setSession } = useContext(SessionContext);
  const [, , removeCookie] = useCookies(["session_token"]);

  const logout = () => {
    removeCookie("session_token", { path: "/" });
    setSession({ token: null, user: null });
  };

  return (
    <>
      <Header />
      <ErrorMessage error={error} />
      {!session.user && (
        <Row>
          <Column>
            <h2>Login</h2>
            <Login />
          </Column>
          <Column />
          <Column>
            <h2>Sign Up</h2>
            <SignUp />
          </Column>
        </Row>
      )}
      {session.user && (
        <>
          <p>
            <em>
              You are logged in as{" "}
              <Link href="/account">{session.user?.username}</Link>.
            </em>{" "}
            <span style={{ cursor: "pointer" }} onClick={logout}>
              (logout)
            </span>
          </p>
          <Switch>
            <Route path="/">
              <Items />
            </Route>
            <Route path="/account">
              <Account />
            </Route>
          </Switch>
          <Spacer />
        </>
      )}
    </>
  );
}
