import { useState, useContext } from "react";
import { FormErrors } from "../App";
import { Input, Spacer } from "../components/";
import { SessionContext, ProfileData } from "../Session";

export type SignUpForm = {
  name: string;
  email: string;
  username: string;
  password: string;
};

export function SignUp() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [values, setValues] = useState<SignUpForm>({
    name: "",
    email: "",
    username: "",
    password: "",
  });

  const { setToken, setUser, setError } = useContext(SessionContext);

  const onSubmit = () => {
    setErrors({});
    fetch("/auth/signup", {
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
            setErrors((data as FormErrors).errors);
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
        error={errors.username}
        autoCapitalize="off"
      />
      <Input
        name="name"
        label="Name"
        value={values.name}
        onChange={(value) => setValues({ ...values, name: value })}
        error={errors.name}
        autoCapitalize="off"
      />
      <Input
        name="email"
        label="Email"
        value={values.email}
        onChange={(value) => setValues({ ...values, email: value })}
        error={errors.email}
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
      <button onClick={onSubmit}>Sign Up</button>
    </>
  );
}

export default SignUp;
