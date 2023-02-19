import { IMPERIAL_THEME } from "@/components/editorthemes/Imperial";
import ErrorBoundary from "@/components/ErrorBoundary";
import ModalManager from "@/components/ModalManager";
import NotificationsManager from "@/components/NotificationsManager";
import { store } from "@/state";
import { fetcher, makeRequest } from "@/utils/Rest";
import { loader } from "@monaco-editor/react";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { SkeletonTheme } from "react-loading-skeleton";
import { Provider } from "react-redux";
import { SWRConfig } from "swr";
import "../App.css";
import { setUser } from "../state/actions";
import { SelfUser } from "../types";
import { globalStyles } from "@/stitches.config";
import { DefaultSeo } from "next-seo";
import config from "../next-seo.config";

export default function App({ Component, pageProps }: AppProps) {
  globalStyles();

  useEffect(() => {
    /* fetch user */
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
            <DefaultSeo {...config} />
            <NotificationsManager />
            <ModalManager />
            <Component {...pageProps} />
          </SkeletonTheme>
        </SWRConfig>
      </Provider>
    </ErrorBoundary>
  );
}
