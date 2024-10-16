/** @type {import('vite').UserConfig} */

import react from "@vitejs/plugin-react";
// https://vitejs.dev/config/
export default {
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  build: {
    outDir: "dist",
    minify: "esbuild",
    chunkSizeWarningLimit: 500,
    sourcemap: true,
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
  base: "/", // Asegúrate de que este sea el correcto según tu configuración de Nginx
};
