import React from "react";
import ReactDOM from "react-dom/client";
import { SkeletonTheme } from "react-loading-skeleton";
import { Provider } from "react-redux";
import { SWRConfig } from "swr";
import App from "./App";
import { store } from "./state";
import { fetcher } from "./utils/Rest";

import "react-loading-skeleton/dist/skeleton.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
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
  </React.StrictMode>
);
