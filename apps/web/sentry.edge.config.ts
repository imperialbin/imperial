// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever middleware or an Edge route handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { env } from "./src/utils/Env";

Sentry.init({
  dsn: env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: env.SENTRY_ENVIRONMENT,
});
