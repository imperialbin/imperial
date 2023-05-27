// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="stripe-event-types" />

import { Logger } from "@imperial/commons";
import Stripe from "stripe";
import { FastifyImp } from "../../types";
import { env } from "../../utils/env";
import chargeFailed from "./handlers/chargeFailed";
import chargeSucceeded from "./handlers/chargeSucceeded";
import refund from "./handlers/refund";

// Todo: Maybe put this into its own separate class and file like AWS, GitHub, and Discord?
export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export const stripeWebhook: FastifyImp<{}, unknown, true> = async (
  request,
  reply,
) => {
  const stripeSignature = request.headers["stripe-signature"] as string;
  let event: Stripe.DiscriminatedEvent;

  try {
    event = stripe.webhooks.constructEvent(
      request.rawBody!,
      stripeSignature,
      env.STRIPE_WEBHOOK_SECRET,
    ) as Stripe.DiscriminatedEvent;
  } catch (err) {
    Logger.error("stripe", String(err));
    return reply.status(400).send({
      success: false,
      error: {
        code: "bad_request",
        message: "Invalid Stripe event",
      },
    });
  }

  Logger.info("stripe", `Received Stripe webhook ${event.type}`);

  switch (event.type) {
    case "charge.succeeded": {
      await chargeSucceeded(event);
      break;
    }

    case "charge.failed": {
      await chargeFailed(event);
      break;
    }

    case "charge.refunded": {
      await refund(event);
      break;
    }

    default:
      break;
  }

  reply.status(204).send();
};
