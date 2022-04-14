import "styled-components";

type Hex = `#${string}`;

declare module "styled-components" {
  export interface DefaultTheme {
    type: "light" | "dark";
    background: {
      dark: Hex;
      darkest: Hex;
      littleLessDark: Hex;
      lightestOfTheBunch: Hex;
    };
    text: {
      lightest: Hex;
      light: Hex;
      dark: Hex;
      darkest: Hex;
    };
    system: {
      error: Hex;
      success: Hex;
      info: Hex;
    };
  }
}
