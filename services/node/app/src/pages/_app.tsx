import type { AppProps } from "next/app";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { DarkTheme } from "../utils/Theme";
import { Provider } from "react-redux";
import { store } from "../../state";
import { SkeletonTheme } from "react-loading-skeleton";
import ModalManager from "../components/ModalManager";

const GlobalStyle = createGlobalStyle`
 *, *:before, *:after {
  margin:0;
  padding:0;
  box-sizing: border-box;
  font-family: 'Manrope', sans-serif;
 }
 

 html {
  max-width: 100vw;
 }

 body {
  background: ${({ theme }) => theme.background.darkest};
  color: ${({ theme }) => theme.text.light};
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

function Imperial({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={DarkTheme}>
      <Provider store={store}>
        <ModalManager />
        <GlobalStyle />
        <SkeletonTheme
          baseColor={DarkTheme.background.lightestOfTheBunch}
          highlightColor={DarkTheme.background.dark}
        >
          <Component {...pageProps} />
        </SkeletonTheme>
      </Provider>
    </ThemeProvider>
  );
}

export default Imperial;
