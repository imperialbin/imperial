import { PingEvent } from "@octokit/webhooks-types";
import { Logger } from "@imperial/commons";

export default async function (event: PingEvent) {
  Logger.info("GitHub", `Ping event received ${event.zen}`);
}
