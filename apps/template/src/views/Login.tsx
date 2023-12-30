import { useState, useContext } from "react";
import { ErrorResponse } from "../App";
import { Input, Spacer } from "../components/";
import { ProfileData, SessionContext } from "../Session";

export type LoginForm = {
  username: string;
  password: string;
};

export function Login() {
  const [values, setValues] = useState<LoginForm>({
    username: "",
    password: "",
  });

  const { setToken, setUser, setError } = useContext(SessionContext);

  const onSubmit = () => {
    setError(null);
    fetch("/auth/login", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(values),
    })
      .then((response) =>
        response.json().then((data: Record<string, unknown>) => ({
          ok: response.ok,
          status: response.status,
          data,
        }))
      )
      .then(
        ({
          ok,
          data,
        }: {
          ok: boolean;
          status: number;
          data: Record<string, unknown>;
        }) => {
          if (ok) {
            setToken(data.token as string);
            setUser(data.user as ProfileData);
          } else {
            setError((data as ErrorResponse).message);
          }
        }
      )
      .catch((err: Error) => {
        setError(err.message);
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
