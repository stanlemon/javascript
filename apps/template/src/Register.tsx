import { useState, useContext } from "react";
import { Session, User, SessionContext, FormErrors } from "./App";
import Input from "./Input";

// eslint-disable-next-line max-lines-per-function
export default function Register() {
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
    fetch("/auth/register", {
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
          console.log(ok, status, data);

          if (ok) {
            setSession(data as Session);
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
        label="Name"
        value={values.name || ""}
        onChange={(value) => setValues({ ...values, name: value })}
      />
      <Input
        type="email"
        label="Email"
        value={values.email || ""}
        onChange={(value) => setValues({ ...values, email: value })}
      />
      <Input
        label="Username"
        value={values.username}
        onChange={(value) => setValues({ ...values, username: value })}
      />
      <Input
        type="password"
        label="Password"
        value={values.password}
        onChange={(value) => setValues({ ...values, password: value })}
      />
      <button onClick={onSubmit}>Register</button>
    </div>
  );
}
