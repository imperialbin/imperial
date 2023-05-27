// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="stripe-event-types" />

import { Logger, pika } from "@imperial/commons";
import { memberPlusTokens } from "@imperial/internal";
import Stripe from "stripe";
import { db } from "../../../db";
import { SES } from "../../../utils/aws";
import { stripe } from "../webhook";

export default async function (event: Stripe.DiscriminatedEvent.ChargeEvent) {
  const token = pika.gen("member_plus");

  await db.insert(memberPlusTokens).values({
    id: token,
  });

  await stripe.charges
    .update(event.data.object.id, {
      metadata: {
        member_plus_token: token,
      },
    })
    .catch((err) => {
      Logger.error("stripe", "Failed to update charge metadata" + String(err));
    });

  SES.sendEmail(
    "payment_success",
    { token, receipt_url: event.data.object.receipt_url as string },
    event.data.object.billing_details.email as string,
    "Payment Success",
  );
}
