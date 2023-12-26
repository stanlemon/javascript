import { useContext, useState } from "react";
import { SessionContext } from "../Session";
import { Header, Input, Spacer } from "../components";

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
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE_DATA);
  const [password, setPassword] = useState<PasswordData>(DEFAULT_PASSWORD_DATA);

  const storeProfile = (key: keyof ProfileData, value: string) => {
    setProfile({ ...profile, [key]: value });
  };
  const saveProfile = () => {
    console.log(profile);
  };

  const storePassword = (key: keyof PasswordData, value: string) => {
    setPassword({ ...password, [key]: value });
  };
  const savePassword = () => {
    console.log(password);
  };

  return (
    <>
      <Header>Account for "{session.user?.username ?? ""}"</Header>
      <Header level={2}>Profile</Header>
      <Input
        name="name"
        label="Name"
        value={profile.name}
        onChange={(value) => storeProfile("name", value)}
      />
      <Input
        name="email"
        label="Email"
        value={profile.email}
        onChange={(value) => storeProfile("email", value)}
      />
      <button onClick={saveProfile}>Save</button>

      <Spacer />
      <Header level={2}>Password</Header>
      <Input
        name="current_password"
        type="password"
        label="Current Password"
        value={password.current_password ?? ""}
        onChange={(value) => storePassword("current_password", value)}
      />
      <Input
        name="new_password1"
        type="password"
        label="New Password"
        value={password.new_password1 ?? ""}
        onChange={(value) => storePassword("new_password1", value)}
      />
      <Input
        name="new_password2"
        type="password"
        label="Repeat New Password"
        value={password.new_password2 ?? ""}
        onChange={(value) => storePassword("new_password2", value)}
      />

      <button onClick={savePassword}>Update</button>
    </>
  );
}

export default Account;
