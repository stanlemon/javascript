import { useContext, useState } from "react";

import { Header, Input } from "../components";
import { fetchApi, ApiError } from "../helpers/fetchApi";
import { SessionContext } from "../Session";

export type PasswordForm = {
  current_password: string;
  new_password1: string;
  new_password2: string;
};

export type PasswordRequest = {
  current_password: string;
  password: string;
};

export const DEFAULT_PASSWORD_DATA: PasswordForm = {
  current_password: "",
  new_password1: "",
  new_password2: "",
};

export function Password() {
  const { token, setMessage, setError } = useContext(SessionContext);
  const [password, setPassword] = useState<PasswordForm>(DEFAULT_PASSWORD_DATA);
  const [errors, setErrors] = useState<Partial<PasswordForm>>({});

  const storePassword = (key: keyof PasswordForm, value: string) => {
    setPassword({ ...password, [key]: value });
  };
  const savePassword = () => {
    setErrors({});

    if (password.new_password1 !== password.new_password2) {
      setErrors({ new_password2: "Passwords do not match" });
      return;
    }

    fetchApi<null, PasswordRequest>("/auth/password", token, "post", {
      current_password: password.current_password,
      password: password.new_password1,
    })
      .then(() => {
        setPassword(DEFAULT_PASSWORD_DATA);
        setErrors({});
        setMessage("Password updated.");
        setError(null);
      })
      .catch((err: ApiError) => {
        if (err.code === 400) {
          setErrors({ ...(err.body.errors as PasswordForm) });
        }
      });
  };

  return (
    <>
      <Header level={2}>Password</Header>
      <Input
        name="current_password"
        type="password"
        label="Current Password"
        value={password.current_password}
        error={errors.current_password}
        onChange={(value) => storePassword("current_password", value)}
      />
      <Input
        name="new_password1"
        type="password"
        label="New Password"
        value={password.new_password1}
        error={errors.new_password1}
        onChange={(value) => storePassword("new_password1", value)}
      />
      <Input
        name="new_password2"
        type="password"
        label="Repeat New Password"
        value={password.new_password2}
        error={errors.new_password2}
        onChange={(value) => storePassword("new_password2", value)}
      />

      <button onClick={savePassword}>Update</button>
    </>
  );
}

export default Password;
