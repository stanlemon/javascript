import { useContext } from "react";
import { SessionContext } from "../Session";
import { Header, Input, Spacer } from "../components";

export function Account() {
  const { session } = useContext(SessionContext);
  const setValue = (value: string) => {
    console.info(value);
  };
  const saveProfile = () => {};
  const updatePassword = () => {};

  return (
    <>
      <Header>Account for "{session.user?.username ?? ""}"</Header>
      <Header level={2}>Profile</Header>
      <Input
        name="name"
        label="Name"
        value={session.user?.name ?? ""}
        onChange={(value) => setValue(value)}
      />
      <Input
        name="email"
        label="Email"
        value={session.user?.email ?? ""}
        onChange={(value) => setValue(value)}
      />
      <button onClick={saveProfile}>Save</button>

      <Spacer />
      <Header level={2}>Password</Header>
      <Input
        name="current_password"
        type="password"
        label="Current Password"
        value={""}
        onChange={(value) => setValue(value)}
      />
      <Input
        name="new_password1"
        type="password"
        label="New Password"
        value={""}
        onChange={(value) => setValue(value)}
      />
      <Input
        name="new_password2"
        type="password"
        label="Repeat New Password"
        value={""}
        onChange={(value) => setValue(value)}
      />

      <button onClick={updatePassword}>Update</button>
    </>
  );
}

export default Account;
