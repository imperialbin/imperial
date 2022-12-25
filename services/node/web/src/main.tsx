import React from "react";
import ReactDOM from "react-dom/client";
import { SkeletonTheme } from "react-loading-skeleton";
import { Provider } from "react-redux";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

import { SWRConfig } from "swr";
import App from "./App";
import { store } from "./state";
import { fetcher } from "./utils/Rest";

import "react-loading-skeleton/dist/skeleton.css";
import ErrorBoundary from "./app/ErrorBoundary";

Sentry.init({
  dsn: "https://25ed4413241f432b8c56111756d4d886@o718150.ingest.sentry.io/5780575",
  integrations: [new BrowserTracing()],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <SWRConfig
          value={{
            fetcher: (url: string) => fetcher("GET", url),
          }}
        >
          <SkeletonTheme
            baseColor="var(--bg-contrast)"
            highlightColor="var(--bg-secondary)"
          >
            <App />
          </SkeletonTheme>
        </SWRConfig>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);
