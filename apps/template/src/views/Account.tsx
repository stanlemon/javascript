import { useContext } from "react";
import { SessionContext } from "../Session";
import { Header, Spacer } from "../components";
import { Profile, Password } from "./";
import { Link } from "wouter";

export function Account() {
  const { user } = useContext(SessionContext);

  return (
    <>
      <Header>Account for "{user?.name ?? user?.username ?? ""}"</Header>
      <Profile />
      <Spacer />
      <Password />
      <Spacer />
      <Link href="/">Return Home</Link>
    </>
  );
}

export default Account;
