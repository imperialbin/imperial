import PageBase from "./components/PageBase";
import React from "react";
import Header from "./components/Header";
import Button from "./components/Button";
import { EmailProps } from "./emails";

export default function ResetPassword({
  token = "fake_token",
}: EmailProps["reset_password"]) {
  return (
    <PageBase title="Reset Password">
      <Header header="Reset Password" subHeader="SECURITY" />
      <p>
        You've requested to reset your password, click the button below to
        continue this process. If this wasn't you, no worries, you can ignore
        this email as it may have been an accident.
      </p>
      <Button href={`https://imperialb.in/auth/reset?token=${token}`}>
        Reset Password
      </Button>
    </PageBase>
  );
}
