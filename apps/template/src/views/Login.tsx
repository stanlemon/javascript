import { useState, useContext } from "react";
import { useCookies } from "react-cookie";
import { Input, Spacer } from "../components/";
import { ProfileData, SessionContext, SessionData } from "../Session";
import fetchApi, { ApiError } from "../helpers/fetchApi";

export type LoginForm = {
  username: string;
  password: string;
};

export function Login() {
  const [values, setValues] = useState<LoginForm>({
    username: "",
    password: "",
  });
  const [_, setCookie] = useCookies(["session_token"]);

  const { setToken, setUser, setError } = useContext(SessionContext);

  const onSubmit = () => {
    setError(null);
    fetchApi<SessionData, LoginForm>("/auth/login", null, "post", values)
      .then((session: SessionData) => {
        setToken(session.token as string);
        setUser(session.user as ProfileData);
        setCookie("session_token", session.token);
        setError(null);
      })
      .catch((err: ApiError) => {
        if (err.message === "Unauthorized") {
          setError(err.body.message as string);
        }
      });
  };

  return (
    <>
      <Input
        name="username"
        label="Username"
        value={values.username}
        onChange={(value) => setValues({ ...values, username: value })}
        autoCapitalize="off"
      />
      <Input
        name="password"
        type="password"
        label="Password"
        value={values.password}
        onChange={(value) => setValues({ ...values, password: value })}
        onEnter={onSubmit}
      />
      <Spacer />
      <button onClick={onSubmit}>Login</button>
    </>
  );
}

export default Login;
