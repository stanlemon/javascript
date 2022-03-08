import { useState, useContext } from "react";
import { Session, User, SessionContext, FormErrors } from "./App";
import Input from "./Input";

// eslint-disable-next-line max-lines-per-function
export default function Register() {
  const [errors, setErrors] = useState<Record<string, string>>({});
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
    setErrors({});
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
          if (ok) {
            setSession(data as Session);
          } else {
            setErrors((data as FormErrors).errors);
          }
        }
      )
      .catch((err) => {
        console.error("error", err);
      });
  };

  return (
    <div>
      <Input
        label="Username"
        value={values.username}
        onChange={(value) => setValues({ ...values, username: value })}
        error={errors.username}
      />
      <Input
        type="password"
        label="Password"
        value={values.password}
        onChange={(value) => setValues({ ...values, password: value })}
        error={errors.password}
      />
      <button onClick={onSubmit}>Register</button>
    </div>
  );
}
