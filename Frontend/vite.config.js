import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const proxy = env.VITE_API_URL
    ? {
        "/api": {
          target: env.VITE_API_URL,
          changeOrigin: true,
        },
      }
    : undefined;

  return {
    plugins: [react(), tailwindcss()],
    server: {
      ...(proxy ? { proxy } : {}),
    },
  };
});
