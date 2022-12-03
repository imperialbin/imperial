import { createStitches } from "@stitches/react";

export const { styled, css } = createStitches({
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
      info: "var(--info)",
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
