// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="stripe-event-types" />

import Stripe from "stripe";
import { SES } from "../../../utils/aws";

export default async function (event: Stripe.DiscriminatedEvent.ChargeEvent) {
  SES.sendEmail(
    "payment_failed",
    {},
    event.data.object.billing_details.email as string,
    "Payment Failed",
  );
}
