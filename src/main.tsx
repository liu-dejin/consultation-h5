import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConfigProvider } from "antd-mobile";
import zhCN from "antd-mobile/es/locales/zh-CN";
import App from "./App.tsx";
import "@/styles/tailwind.css";
import "@/styles/reset.css";
import "@/styles/variables.css";
import "@/styles/global.css";

// 全局中文语言包
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
  </StrictMode>,
);
