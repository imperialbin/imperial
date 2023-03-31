import { IMPERIAL_THEME } from "@web/components/editorthemes/Imperial";
import ErrorBoundary from "@web/components/ErrorBoundary";
import ModalManager from "@web/components/ModalManager";
import NotificationsManager from "@web/components/NotificationsManager";
import { store } from "@web/state";
import { globalStyles } from "@web/stitches.config";
import { fetcher, makeRequest } from "@web/utils/Rest";
import { loader } from "@monaco-editor/react";
import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { SkeletonTheme } from "react-loading-skeleton";
import { Provider } from "react-redux";
import { SWRConfig } from "swr";
import "../App.css";
import config from "../next-seo.config";
import { setUser } from "../state/actions";
import { SelfUser } from "../types";

export default function App({ Component, pageProps }: AppProps) {
  globalStyles();

  useEffect(() => {
    /* Fetch user */
    makeRequest<SelfUser>("GET", "/users/@me").then(({ data }) => {
      store.dispatch(setUser(data ?? null));
    });

    loader.init().then(async (monaco) => {
      monaco.editor.defineTheme("imperial", IMPERIAL_THEME);
    });
  }, []);

  return (
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
            <DefaultSeo {...config}/>
            <NotificationsManager/>
            <ModalManager/>
            <Component {...pageProps}/>
          </SkeletonTheme>
        </SWRConfig>
      </Provider>
    </ErrorBoundary>
  );
}
