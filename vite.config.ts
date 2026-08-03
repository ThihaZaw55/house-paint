import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Spring Boot port
        changeOrigin: true,
        secure: false,
      }
    }
  },
  base: "/house-paint/",
  build: {
    outDir: "docs",
  },
});
