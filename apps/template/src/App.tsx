import { useContext, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Switch, Route, Link } from "wouter";

import "./App.less";
import {
  Column,
  ErrorMessage,
  SuccessMessage,
  Header,
  Row,
  Spacer,
} from "./components/";
import { SessionContext } from "./Session";
import { Login, SignUp, Verify, Items, Account } from "./views/";

export default function App() {
  const { error, message, user, setUser, setToken, setMessage } =
    useContext(SessionContext);
  const [, , removeCookie] = useCookies(["session_token"]);

  const logout = () => {
    removeCookie("session_token", { path: "/" });
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    // After 10 seconds, clear out any messages
    const timer = setTimeout(() => {
      setMessage(null);
    }, 1000 * 10);

    return () => clearTimeout(timer);
  });

  return (
    <>
      <Header />
      <ErrorMessage error={error} />
      <SuccessMessage message={message} />
      {!user && (
        <Switch>
          <Route path="/verify/:token">
            {({ token: verificationToken }: { token: string }) => (
              <Verify token={verificationToken} />
            )}
          </Route>
          <Route>
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
          </Route>
        </Switch>
      )}
      {user && (
        <>
          <p>
            <em>
              You are logged in as <Link href="/account">{user?.username}</Link>
              .
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
