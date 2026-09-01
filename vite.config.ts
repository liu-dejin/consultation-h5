import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // 路径别名：@ 指向 src
  resolve: {
    alias: {
      "@": `${import.meta.dirname}/src`,
    },
  },
  server: {
    port: 5173,
    host: true,
    // 接口代理示例（按需修改目标地址）
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
  build: {
    // 生产环境不生成 sourcemap
    sourcemap: false,
    // 分包优化：拆分第三方依赖
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
