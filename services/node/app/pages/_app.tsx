import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import { fetcher } from "../utils/fetcher";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <SWRConfig
      value={{
        fetcher: fetcher,
        refreshInterval: 120000,
        revalidateOnFocus: false,
      }}
    >
      <Component {...pageProps} />
    </SWRConfig>
  );
}

// commit moment
export default MyApp;
