import { useContext } from "react";
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
  const { error, user, setUser, setToken } = useContext(SessionContext);
  const [, , removeCookie] = useCookies(["session_token"]);

  const logout = () => {
    removeCookie("session_token", { path: "/" });
    setToken(null);
    setUser(null);
  };

  return (
    <>
      <Header />
      <ErrorMessage error={error} />
      {!user && (
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
