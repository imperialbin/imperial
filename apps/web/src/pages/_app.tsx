import { loader } from "@monaco-editor/react";
import ErrorBoundary from "@web/components/ErrorBoundary";
import ModalManager from "@web/components/ModalManager";
import NotificationsManager from "@web/components/NotificationsManager";
import { IMPERIAL_THEME } from "@web/components/editorthemes/Imperial";
import { store } from "@web/state";
import { globalStyles } from "@web/stitches.config";
import { makeRequest } from "@web/utils/Rest";
import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { Info } from "react-feather";
import { SkeletonTheme } from "react-loading-skeleton";
import { Provider } from "react-redux";
import { SWRConfig } from "swr";
import "../App.css";
import config from "../next-seo.config";
import { addNotification, openModal, setUser } from "../state/actions";
import { SelfUser } from "../types";

export default function App({ Component, pageProps }: AppProps) {
  globalStyles();

  useEffect(() => {
    makeRequest<SelfUser>("GET", "/users/@me")
      .then((data) => {
        if (data.data) {
          store.dispatch(setUser(data.data));

          // Note: this will run twice ONLY in dev because of strict mode
          if (
            !data.data.confirmed &&
            !window.location.pathname.includes("/auth/confirm")
          ) {
            store.dispatch(
              addNotification({
                icon: <Info />,
                message: "Please confirm your email address",
                type: "warning",
                onClick() {
                  store.dispatch(
                    openModal("resend_confirm_email", {
                      email: data?.data?.email ?? "",
                    }),
                  );
                },
              }),
            );
          }
        }
      })
      .catch(() => {
        // ok fine
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
