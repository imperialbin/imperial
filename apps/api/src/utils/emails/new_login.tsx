import PageBase from "./components/PageBase";
import React from "react";
import Header from "./components/Header";
import Button from "./components/Button";
import { EmailProps as EmailProps } from "./emails";

export default function NewLogin({
  userAgent = { ip: "0.0.0.0", user_agent: "Chrome :3" },
}: EmailProps["new_login"]) {
  return (
    <PageBase title="New Login">
      <Header header="New Login" subHeader="SECURITY" />
      <p>
        You have logged in with the IP {userAgent.ip} on {userAgent.user_agent}.
        If this was not you, please reset your password.
      </p>
      <Button href="https://imperialb.in/auth/forgot">Reset Password</Button>
    </PageBase>
  );
}
