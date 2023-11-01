import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteCompression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteCompression({ threshold: 0, deleteOriginFile: true })],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.search(".css") != -1) return "assets/index.css";
          return assetInfo.name;
        },
        entryFileNames: (assetInfo) => {
          if (assetInfo.name == "index") return "assets/index.js";
          return assetInfo.name;
        },
      },
    },
  },
});
