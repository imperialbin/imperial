import "react-tippy/dist/tippy.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import { fetcher } from "../utils/fetcher";
import { Provider } from "jotai";
import store from "../state";
import { SkeletonTheme } from "react-loading-skeleton";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { darkTheme } from "../utils/theme";
import { ThemeForStupidProps } from "../types";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background: ${({ theme }: ThemeForStupidProps) => theme.layoutDark};
    color: ${({ theme }: ThemeForStupidProps) => theme.textLight};
    font-family: 'Manrope', sans-serif;
    font-weight: 500;
  }
`;

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  /* You might be thinking, whats the point of this?!?!?! why are we putting
  this in a different variable just for it to be used once!?!?!? that is because
  we are going to have a ternary here in the future that determines custom
  themes, you're welcome */
  const theme = darkTheme;
  return (
    <Provider>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <SWRConfig
          value={{
            fetcher: fetcher,
            refreshInterval: 120000,
            revalidateOnFocus: false,
          }}
        >
          <SkeletonTheme
            color={theme.layoutLightestOfTheBunch}
            highlightColor={theme.layoutDark}
          >
            <Component {...pageProps} />
          </SkeletonTheme>
        </SWRConfig>
      </ThemeProvider>
    </Provider>
  );
}

// commit moment
export default MyApp;
