import { useState, useContext } from "react";

import { Input, Spacer } from "../components/";
import { fetchApi, ApiError } from "../helpers/fetchApi";
import { SessionContext, ProfileData, SessionData } from "../Session";

export type FormErrors = {
  errors: Record<string, string>;
};

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
    fetchApi<SessionData, SignUpForm>("/auth/signup", null, "post", values)
      .then((session: SessionData) => {
        setToken(session.token as string);
        setUser(session.user as ProfileData);
      })
      .catch((err: ApiError) => {
        if (err.message !== "Unauthorized") {
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
        error={errors?.username}
        autoCapitalize="off"
      />
      <Input
        name="name"
        label="Name"
        value={values.name}
        onChange={(value) => setValues({ ...values, name: value })}
        error={errors?.name}
        autoCapitalize="off"
      />
      <Input
        name="email"
        label="Email"
        value={values.email}
        onChange={(value) => setValues({ ...values, email: value })}
        error={errors?.email}
        autoCapitalize="off"
      />
      <Input
        name="password"
        type="password"
        label="Password"
        value={values.password}
        onChange={(value) => setValues({ ...values, password: value })}
        error={errors?.password}
      />
      <Spacer />
      <button onClick={onSubmit}>Sign Up</button>
    </>
  );
}

export default SignUp;
