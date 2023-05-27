// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="stripe-event-types" />

import { Id, Logger, permer } from "@imperial/commons";
import { memberPlusTokens, users } from "@imperial/internal";
import { eq } from "drizzle-orm";
import Stripe from "stripe";
import { db } from "../../../db";
import { SES } from "../../../utils/aws";

export default async function (event: Stripe.DiscriminatedEvent.ChargeEvent) {
  const tokenId = event.data.object.metadata.member_plus_token as
    | Id<"member_plus">
    | undefined;
  if (!tokenId) {
    Logger.error("stripe", "Refund event missing member_plus_token");
    return;
  }

  const { token, user: claimedUser } =
    (
      await db
        .select({
          user: users,
          token: memberPlusTokens,
        })
        .from(memberPlusTokens)
        .leftJoin(users, eq(users.id, memberPlusTokens.claimed_by))
        .where(eq(memberPlusTokens.id, tokenId))
    )[0] ?? null;

  if (!token) {
    Logger.error("stripe", "Database is missing member_plus_token for refund");
    return;
  }

  if (claimedUser) {
    await db
      .update(users)
      .set({
        flags: permer.subtract(claimedUser.flags, ["member-plus"]),
      })
      .where(eq(users.id, claimedUser.id));
  }

  await db.delete(memberPlusTokens).where(eq(memberPlusTokens.id, tokenId));

  SES.sendEmail(
    "order_refunded",
    {
      amount_refunded: event.data.object.amount_refunded,
      receipt_url: event.data.object.receipt_url as string,
    },
    event.data.object.billing_details.email as string,
    "Payment Refunded",
  );
}
