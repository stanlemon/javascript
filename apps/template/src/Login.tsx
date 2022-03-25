import { useState, useContext } from "react";
import { Session, User, SessionContext, ErrorMessage } from "./App";
import Input from "./Input";

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState<User>({
    name: "",
    email: "",
    username: "",
    password: "",
  });

  const { setSession } = useContext(SessionContext) || {
    setSession: () => {},
  };

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
          status,
          data,
        }: {
          ok: boolean;
          status: number;
          data: Record<string, unknown>;
        }) => {
          if (ok) {
            setSession(data as Session);
          } else {
            setError((data as ErrorMessage).message);
          }
        }
      )
      .catch((err) => {
        console.error("error", err);
      });
  };

  return (
    <div>
      {error && (
        <div>
          <strong>{error}</strong>
        </div>
      )}
      <Input
        name="username"
        label="Username"
        value={values.username}
        onChange={(value) => setValues({ ...values, username: value })}
      />
      <Input
        name="password"
        type="password"
        label="Password"
        value={values.password}
        onChange={(value) => setValues({ ...values, password: value })}
        onEnter={onSubmit}
      />
      <button onClick={onSubmit}>Login</button>
    </div>
  );
}
