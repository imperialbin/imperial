import "../styles/global.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import { fetcher } from "../utils/fetcher";
import { Provider } from "jotai";
import store from "../state";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const { initialState } = pageProps;
  return (
    <Provider
      initialValues={initialState && [[store.languageState, initialState]]}
    >
      <SWRConfig
        value={{
          fetcher: fetcher,
          refreshInterval: 120000,
          revalidateOnFocus: false,
        }}
      >
        <Component {...pageProps} />
      </SWRConfig>
    </Provider>
  );
}

// commit moment
export default MyApp;
