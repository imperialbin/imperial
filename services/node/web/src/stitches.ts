import { createStitches } from "@stitches/react";

export const { styled, css } = createStitches({
  theme: {
    colors: {
      /* General names */
      primary: "var(--primary-500)",
      secondary: "var(--primary-700)",
      tertiary: "var(--primary-400)",

      "text-primary": "var(--primary-0)",
      "text-secondary": "var(--primary-100)",
      "text-muted": "var(--primary-300)",

      success: "var(--success)",
      error: "var(--error)",
      info: "var(--info)",

      /* specific color variables exposed to stitches */
      "primary-900": "var(--primary-900)",
      "primary-800": "var(--primary-800)",
      "primary-700": "var(--primary-700)",
      "primary-600": "var(--primary-600)",
      "primary-500": "var(--primary-500)",
      "primary-400": "var(--primary-400)",
      "primary-300": "var(--primary-300)",
      "primary-200": "var(--primary-200)",
      "primary-100": "var(--primary-100)",
      "primary-50": "var(--primary-50)",
      "primary-0": "var(--primary-0)",
    },
    space: {
      1: "5px",
      2: "10px",
      3: "15px",
    },
    fontSizes: {
      1: "13px",
      2: "15px",
      3: "17px",
    },
    fonts: {
      main: "var(--font)",
      mono: "var(--font-mono)",
    },
    fontWeights: {},
    lineHeights: {},
    letterSpacings: {},
    sizes: {},
    borderWidths: {
      1: "1px",
      2: "2px",
      3: "4px",
    },
    borderStyles: {
      1: "15px",
    },
    radii: {
      tiny: "4px",
      small: "8px",
      medium: "10px",
      large: "15px",
    },
    shadows: {
      nav: "0px 0px 6px 3px rgb(0 0 0 / 25%);",
      dialogs:
        "0px -13px 24px -7px rgba(0, 0, 0, 0.1), 0px 24px 40px -11px rgba(0, 0, 0, 0.2)",
    },
    zIndices: {},
    transitions: {},
  },
});
