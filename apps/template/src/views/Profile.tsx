import { useContext } from "react";
import { SessionContext } from "../Session";
import { Header, Input } from "../components/";

export function Profile() {
  const { session, setSession } = useContext(SessionContext);
  const setValue = (value: string) => {
    console.log(value);
  };

  return (
    <>
      <Header>Profile for "{session.user?.username ?? ""}"</Header>
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
    </>
  );
}

export default Profile;
