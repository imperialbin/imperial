import { Logger } from "@imperial/commons";
import { FastifyImp } from "../../types";
import { GitHub } from "../../utils/github";
import push from "./handlers/push";
import { PingEvent, PushEvent, StarEvent } from "@octokit/webhooks-types";
import ping from "./handlers/ping";
import star from "./handlers/star";

export const githubWebhook: FastifyImp<{}, unknown, true> = async (
  request,
  reply,
) => {
  if (
    !GitHub.verifySignature(
      request.body,
      request.headers["x-hub-signature-256"] as string,
    )
  ) {
    reply.status(400).send({
      success: false,
      error: {
        code: "bad_request",
        message: "Invalid signature",
      },
    });

    return;
  }

  const event = request.headers["x-github-event"] as string;

  switch (event) {
    case "push": {
      push(request.body as PushEvent);
      break;
    }

    case "star": {
      star(request.body as StarEvent);
      break;
    }

    case "ping": {
      ping(request.body as PingEvent);
      break;
    }

    default:
      Logger.info("GitHub", `Unhandled event ${event}`);
      break;
  }

  reply.status(204).send();
};
