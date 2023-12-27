import { useContext, useState } from "react";
import { SessionContext } from "../Session";
import { Header, Input, Spacer } from "../components";
import fetchApi, { ApiError } from "../helpers/fetchApi";

type Errors = {
  name?: string;
  email?: string;
  current_password?: string;
  password?: string;
  repeat_password?: string;
};

export type ProfileData = {
  name: string;
  email: string;
};
export const DEFAULT_PROFILE_DATA: ProfileData = {
  name: "",
  email: "",
};

export type PasswordData = {
  current_password: string;
  new_password1: string;
  new_password2: string;
};

export const DEFAULT_PASSWORD_DATA: PasswordData = {
  current_password: "",
  new_password1: "",
  new_password2: "",
};

export function Account() {
  const { session } = useContext(SessionContext);
  const [profile, setProfile] = useState<ProfileData>({
    ...DEFAULT_PROFILE_DATA,
    name: session.user?.name ?? "",
    email: session.user?.email ?? "",
  });
  const [password, setPassword] = useState<PasswordData>(DEFAULT_PASSWORD_DATA);
  const [errors, setErrors] = useState<Errors>({});

  const storeProfile = (key: keyof ProfileData, value: string) => {
    setProfile({ ...profile, [key]: value });
  };
  const saveProfile = () => {
    setErrors({});
    fetchApi<ProfileData, ProfileData>(
      "/auth/user",
      session?.token || "",
      "put",
      profile
    )
      .then((user) => {
        setProfile(user);
        setErrors({});
      })
      .catch((err: ApiError) => {
        if (err.code === 400) {
          setErrors({ ...(err.body.errors as Errors) });
        }
      });
  };

  const storePassword = (key: keyof PasswordData, value: string) => {
    setPassword({ ...password, [key]: value });
  };
  const savePassword = () => {
    setErrors({});

    if (password.new_password1 !== password.new_password2) {
      setErrors({ repeat_password: "Passwords do not match" });
      return;
    }

    fetchApi<PasswordData, { current_password: string; password: string }>(
      "/auth/password",
      session?.token || "",
      "post",
      {
        current_password: password.current_password,
        password: password.new_password1,
      }
    )
      .then(() => {
        setPassword(DEFAULT_PASSWORD_DATA);
        setErrors({});
      })
      .catch((err: ApiError) => {
        if (err.code === 400) {
          setErrors({ ...(err.body.errors as Errors) });
        }
      });
  };

  return (
    <>
      <Header>Account for "{session.user?.username ?? ""}"</Header>
      <Header level={2}>Profile</Header>
      <Input
        name="name"
        label="Name"
        value={profile.name}
        error={errors.name}
        onChange={(value) => storeProfile("name", value)}
      />
      <Input
        name="email"
        label="Email"
        value={profile.email}
        error={errors.email}
        onChange={(value) => storeProfile("email", value)}
      />
      <button onClick={saveProfile}>Save</button>

      <Spacer />
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
        error={errors.password}
        onChange={(value) => storePassword("new_password1", value)}
      />
      <Input
        name="new_password2"
        type="password"
        label="Repeat New Password"
        value={password.new_password2}
        error={errors.repeat_password}
        onChange={(value) => storePassword("new_password2", value)}
      />

      <button onClick={savePassword}>Update</button>
    </>
  );
}

export default Account;
