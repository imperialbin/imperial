import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/r": "https://imperial.hop.sh/v1/document",
      "/link/discord": {
        target:
          process.env.NODE_ENV !== "development"
            ? "https://imperial.hop.sh/v1/oauth/discord"
            : "https://imperial.hop.sh/v1/oauth/discord",
        changeOrigin: true,
      },
      "/link/github": {
        target:
          process.env.NODE_ENV !== "development"
            ? "https://imperial.hop.sh/v1/oauth/github"
            : "https://imperial.hop.sh/v1/oauth/github",
        changeOrigin: true,
      },
    },
  },
});
