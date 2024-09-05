import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "build", // Ensure this matches your deployment script
  },
  plugins: [react()],
  server: {
    port: 3000,
  },
  base: "/the-mh-coffee/",
});
