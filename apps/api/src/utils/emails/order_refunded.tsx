import PageBase from "./components/PageBase";
import React from "react";
import Header from "./components/Header";
import Button from "./components/Button";
import { EmailProps } from "./emails";

export default function OrderRefunded({
  receipt_url,
  amount_refunded,
}: EmailProps["order_refunded"]) {
  return (
    <PageBase title="Order Refunded">
      <Header header="Order Refunded" subHeader="BILLING" />
      <p>
        We've refunded your order, you should receive {amount_refunded} in your
        account within 5-10 business days. Furthermore, the Member+ token will
        be revoked and removed from any user that used it. If you have any
        questions, please contact us on our Discord or Twitter!
      </p>
      <Button href={receipt_url}>Receipt</Button>
    </PageBase>
  );
}
