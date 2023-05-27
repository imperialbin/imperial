import PageBase from "./components/PageBase";
import React from "react";
import Header from "./components/Header";
import Button from "./components/Button";
import { EmailProps } from "./emails";
import { Link } from "@react-email/components";

export default function PaymentSuccess({
  token,
  receipt_url,
}: EmailProps["payment_success"]) {
  return (
    <PageBase title="Payment Success">
      <Header header="Payment Success!" subHeader="BILLING" />
      <p>
        Booyeah! Thank you for your support! We've generated you a Member+ token
        for you to either share or use yourself. If you have any questions,
        please contact us on our Discord or Twitter!
        <br />
        <Link className="block mt-2 text-zinc-400" href={receipt_url}>
          View your receipt
        </Link>
      </p>
      <Button href={`https://imperialb.in/auth/upgrade?token=${token}`}>
        Claim
      </Button>
    </PageBase>
  );
}
