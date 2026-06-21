import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 650,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return;
          }

          if (id.includes("react") || id.includes("react-dom")) {
            return "vendor-react";
          }

          if (id.includes("@tanstack")) {
            return "vendor-query";
          }

          if (id.includes("jspdf") || id.includes("html-to-image") || id.includes("html2canvas")) {
            return "vendor-export";
          }

          if (id.includes("dompurify")) {
            return "vendor-sanitize";
          }

          return;
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
