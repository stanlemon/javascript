import { useState, useContext } from "react";
import { FormErrors, ErrorMessage, Spacer } from "./App";
import { SessionData, UserData, SessionContext } from "./Session";
import Input from "./Input";

// eslint-disable-next-line max-lines-per-function
export default function Register() {
  const [error, setError] = useState<string | boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [values, setValues] = useState<UserData>({
    name: "",
    email: "",
    username: "",
    password: "",
  });

  const { setSession } = useContext(SessionContext);

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
            setSession(data as SessionData);
          } else {
            setErrors((data as FormErrors).errors);
          }
        }
      )
      .catch((err: Error) => {
        // Put any generis error onto the username field
        setError(err.message);
      });
  };

  return (
    <>
      <ErrorMessage error={error} />
      <Input
        name="username"
        label="Username"
        value={values.username}
        onChange={(value) => setValues({ ...values, username: value })}
        error={errors.username}
        autoCapitalize="off"
      />
      <Input
        name="password"
        type="password"
        label="Password"
        value={values.password}
        onChange={(value) => setValues({ ...values, password: value })}
        error={errors.password}
      />
      <Spacer />
      <button onClick={onSubmit}>Register</button>
    </>
  );
}
