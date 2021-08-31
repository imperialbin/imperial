import "../styles/global.css";
import "react-tippy/dist/tippy.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import { fetcher } from "../utils/fetcher";
import { Provider } from "jotai";
import store from "../state";
import { SkeletonTheme } from "react-loading-skeleton";
import { ThemeProvider } from "styled-components";
import { darkTheme } from "../utils/theme";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const { initialState } = pageProps;
  return (
    <Provider initialValues={initialState && [[store.editor, initialState]]}>
      <ThemeProvider theme={darkTheme}>
        <SWRConfig
          value={{
            fetcher: fetcher,
            refreshInterval: 120000,
            revalidateOnFocus: false,
          }}
        >
          <SkeletonTheme color={"#acacac"} highlightColor={"black"}>
            <Component {...pageProps} />
          </SkeletonTheme>
        </SWRConfig>
      </ThemeProvider>
    </Provider>
  );
}

// commit moment
export default MyApp;
