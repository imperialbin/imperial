import PageBase from "./components/PageBase";
import React from "react";
import Header from "./components/Header";

export default function PaymentFailed() {
  return (
    <PageBase title="Payment Failed">
      <Header header="Payment Failed!" subHeader="BILLING" />
      <p>
        Uh oh... We've received your order, but it seems like your payment
        failed. Please try again, or contact us on our Discord or Twitter if you
        have any questions!
      </p>
    </PageBase>
  );
}
