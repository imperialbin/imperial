import { loader } from "@monaco-editor/react";
import "@web/App.css";
import ErrorBoundary from "@web/components/ErrorBoundary";
import ModalManager from "@web/components/ModalManager";
import NotificationsManager from "@web/components/NotificationsManager";
import { IMPERIAL_THEME } from "@web/components/editorthemes/imperial";
import { store } from "@web/state";
import { addNotification, openModal, setUser } from "@web/state/actions";
import { globalStyles } from "@web/stitches.config";
import { SelfUser } from "@web/types";
import { makeRequest } from "@web/utils/rest";
import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { Info } from "react-feather";
import { SkeletonTheme } from "react-loading-skeleton";
import { Provider } from "react-redux";
import config from "../next-seo.config";
import DragandDrop from "../components/DragAndDrop";
import NextProgress from "next-progress";
import "react-loading-skeleton/dist/skeleton.css";

export default function App({ Component, pageProps }: AppProps) {
  globalStyles();

  useEffect(() => {
    // Fetch User
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
        // Ok fine
      });

    loader.init().then(async (monaco) => {
      monaco.editor.defineTheme("imperial", IMPERIAL_THEME);
      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2016,
        allowNonTsExtensions: true,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monaco.languages.typescript.ModuleKind.CommonJS,
        noEmit: true,
        typeRoots: ["node_modules/@types"],
        jsx: monaco.languages.typescript.JsxEmit.React,
        jsxFactory: "JSXAlone.createElement",
      });
    });
  }, []);

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <SkeletonTheme baseColor="var(--primary-500)" highlightColor="var(--primary-700)">
          <NextProgress color="var(--text-secondary)" options={{ showSpinner: false }} />

          <DragandDrop />
          <DefaultSeo {...config} />
          <NotificationsManager />
          <ModalManager />
          <Component {...pageProps} />
        </SkeletonTheme>
      </Provider>
    </ErrorBoundary>
  );
}
