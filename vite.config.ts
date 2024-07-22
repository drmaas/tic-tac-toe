import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./scripts/test-listener.ts",
    coverage: {
      provider: "istanbul", // or 'v8'
    },
  },
});
