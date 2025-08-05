import { useContext } from "react";
import { Link } from "wouter";

import { Header, Spacer } from "../components";
import { SessionContext } from "../Session";

import { Profile, Password } from "./";

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
