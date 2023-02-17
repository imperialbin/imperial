import { createStitches } from "@stitches/react";
import { Manrope, JetBrains_Mono } from "@next/font/google";

const manrope = Manrope({
  weight: "variable",
  style: "normal",
  display: "swap",
  preload: true,
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  weight: "variable",
  style: "normal",
  display: "swap",
  preload: true,
  subsets: ["latin"],
});

const stitches = createStitches({
  theme: {
    colors: {
      /* General names */
      primary: "var(--bg-primary)",
      secondary: "var(--bg-secondary)",
      tertiary: "var(--bg-tertiary)",
      contrast: "var(--bg-contrast)",

      "text-white": "var(--text-white)",
      "text-primary": "var(--text-primary)",
      "text-secondary": "var(--text-secondary)",
      "text-muted": "var(--text-muted)",

      success: "var(--success)",
      error: "var(--error)",
      warning: "var(--warning)",
    },
    space: {
      tiny: "2px",
      small: "5px",
      medium: "10px",
      "medium-large": "15px",
      large: "20px",
    },
    fontSizes: {
      1: "13px",
      2: "15px",
      3: "17px",
    },
    fonts: {
      main: `${manrope.style.fontFamily}, sans-serif`,
      mono: `${jetbrainsMono.style.fontFamily}, monospace`,
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
      nav: "0px -13px 24px -7px rgba(0, 0, 0, 0.1)",
      dialogs: "0px -13px 24px -7px rgba(0, 0, 0, 0.1)",
    },
    zIndices: {},
    transitions: {},
  },
});

export const { styled, css, keyframes, getCssText, theme, config } = stitches;

export const globalStyles = stitches.globalCss({
  "*, *::before, *::after": {
    fontFamily: "$main",
  },

  body: {
    margin: 0,
    padding: 0,
    boxSizing: "border-box",
    fontFamily: "$main",
  },

  ".monaco-editor *": {
    fontFamily: "$mono!important",
  },
});
