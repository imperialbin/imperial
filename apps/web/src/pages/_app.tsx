import { loader } from "@monaco-editor/react";
import { IMPERIAL_THEME } from "@web/components/editorthemes/Imperial";
import ErrorBoundary from "@web/components/ErrorBoundary";
import ModalManager from "@web/components/ModalManager";
import NotificationsManager from "@web/components/NotificationsManager";
import { store } from "@web/state";
import { globalStyles } from "@web/stitches.config";
import { makeRequest } from "@web/utils/Rest";
import { IncomingMessage } from "http";
import { DefaultSeo } from "next-seo";
import type { AppContext, AppProps } from "next/app";
import NextApp from "next/app";
import { useEffect } from "react";
import { SkeletonTheme } from "react-loading-skeleton";
import { Provider } from "react-redux";
import { SWRConfig } from "swr";
import "../App.css";
import config from "../next-seo.config";
import { setUser } from "../state/actions";
import { Id, SelfUser } from "../types";

export default function App({
  Component,
  pageProps,
  user,
}: AppProps & { user: SelfUser | null }) {
  globalStyles();

  useEffect(() => {
    if (user) {
      store.dispatch(setUser(user));
    }
  }, [user]);

  useEffect(() => {
    /* Fetch user */

    loader.init().then(async (monaco) => {
      monaco.editor.defineTheme("imperial", IMPERIAL_THEME);
    });
  }, []);

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <SWRConfig
          value={{
            fetcher: (url: string) => makeRequest("GET", url),
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

App.getInitialProps = async (context: AppContext) => {
  const ctx = await NextApp.getInitialProps(context);

  const request = context.ctx.req as IncomingMessage & {
    cookies: Record<"imperial-auth", Id<"imperial_auth">>;
  };
  console.log(request.cookies);
  if (request.cookies["imperial-auth"]) {
    const response = await makeRequest("GET", "/users/@me", undefined, {
      headers: {
        Authorization: request.cookies["imperial-auth"],
      },
    });

    return { ...ctx, user: response?.success ? response?.data ?? null : null };
  }

  return { ...ctx };
};
