import { extendTheme, ThemeConfig } from "@chakra-ui/react";
import { Colors } from "./colors";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};

export const theme = extendTheme({
  config,
  Colors,
});
