import { DefaultTheme } from "styled-components";
declare module "styled-components" {
  export interface DefaultTheme {
    layoutDarkest: string;
    layoutDark: string;
    layoutLittleLessDark: string;
    layoutLightestOfTheBunch: string;

    textLightest: string;
    textLight: string;
    textDarker: string;
    textDarkest: string;

    success: string;
    error: string;
    info: string;
  }
}

export const darkTheme: DefaultTheme = {
  layoutDarkest: "#121212",
  layoutDark: "#191919",
  layoutLittleLessDark: "#1e1e1e",
  layoutLightestOfTheBunch: "#242424",

  textLightest: "#ffffff",
  textLight: "#dedede",
  textDarker: "#acacac",
  textDarkest: "#3a3a3a",

  success: "#2fd671",
  error: "#ff4f4f",
  info: "#f1fa8c",
};

/* Note to self, finish this lmfao */
export const lightTheme: DefaultTheme = {
  layoutDarkest: "#111416",
  layoutDark: "#161A1E",
  layoutLittleLessDark: "#1B1F23",
  layoutLightestOfTheBunch: "#2A2C2E",

  textLightest: "#ACACAC",
  textLight: "#9F9F9F",
  textDarker: "#acacac",
  textDarkest: "#646464",

  success: "",
  error: "",
  info: "",
};