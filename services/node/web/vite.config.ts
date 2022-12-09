import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, 
    proxy: {
      "/r": "https://imperial.hop.sh/v1/document",
      "/link/discord": {
        target:
          process.env.NODE_ENV !== "development"
            ? "http://localhost:8080/v1/oauth/discord"
            : "https://imperial.hop.sh/v1/oauth/discord",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/link\/discord/, ""),
      },
      "/link/github": {
        target:
          process.env.NODE_ENV !== "development"
            ? "http://localhost:8080/v1/oauth/github"
            : "https://imperial.hop.sh/v1/oauth/github",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/link\/github/, ""),
      },
    },
  },
});
