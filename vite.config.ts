import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import AutoImport from "unplugin-auto-import/vite";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // 自动导入：react hooks 和 react-router hooks 不用手写 import，
    // 编译时插件会自动把 import 注入进去（dts 文件提交到 git，tsc 靠它做类型检查）
    AutoImport({
      imports: ["react", "react-router"],
      dts: "src/auto-imports.d.ts",
    }),
  ],
  resolve: {
    alias: {
      "@": `${import.meta.dirname}/src`,
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("antd-mobile")) return "antd";
            if (id.includes("react")) return "vendor";
            return "vendor";
          }
        },
      },
    },
  },
});
