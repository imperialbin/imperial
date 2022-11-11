import "react-tippy/dist/tippy.css";
import type { AppProps } from "next/app";
import { LanguageProvider } from "../components/locales/LocalesProvider";
import { RuntimesProvider } from "../components/runner/PistonRuntimesProvider";
import { SWRConfig } from "swr";
import { fetcher } from "../utils/fetcher";
import { Provider } from "jotai";
import { SkeletonTheme } from "react-loading-skeleton";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { darkTheme } from "../utils/theme";
import { ModalManager } from "../components/ui";

const GlobalStyle = createGlobalStyle`
  html {
    max-height: 100vh;
  }
  body {
    width: 100vw;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background: ${({ theme }) => theme.layoutDark};
    color: ${({ theme }) => theme.textLight};
    font-family: 'Manrope', sans-serif;
    font-weight: 500;
  }

  ::-webkit-scrollbar {
    width: 5px;
    height: 0;
  }
  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 5px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #666;
  }
  ::-webkit-scrollbar-thumb:active {
    background: #555;
  }
  ::-webkit-scrollbar-corner {
    background: transparent;
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
            fetcher,
            refreshInterval: 120000,
            revalidateOnFocus: false,
          }}
        >
          <RuntimesProvider>
            <LanguageProvider>
              <ModalManager />
              <SkeletonTheme
                color={theme.layoutLightestOfTheBunch}
                highlightColor={theme.layoutDark}
              >
                <Component {...pageProps} />
              </SkeletonTheme>
            </LanguageProvider>
          </RuntimesProvider>
        </SWRConfig>
      </ThemeProvider>
    </Provider>
  );
}

export default MyApp;
