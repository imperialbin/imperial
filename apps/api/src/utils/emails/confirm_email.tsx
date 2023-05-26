import PageBase from "./components/PageBase";
import React from "react";
import Header from "./components/Header";
import Button from "./components/Button";
import { EmailProps } from "./emails";

export default function ConfirmEmail({
  token = "fake_token",
}: EmailProps["confirm_email"]) {
  return (
    <PageBase title="Welcome Aboard!">
      <Header header="Confirm Email" subHeader="ONBOARDING" />
      <p>
        Welcome aboard! We&apos;re glad to see you signup on IMPERIAL, click the
        button below to confirm your email address and get access to features
        like encrypted documents, screenshot embeds, and more!
      </p>
      <Button href={`https://imperialb.in/auth/confirm?token=${token}`}>
        Reset Password
      </Button>
    </PageBase>
  );
}
