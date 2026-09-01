/// <reference types="vite/client" />

/**
 * 环境变量类型声明
 * 仅 VITE_ 前缀的变量会暴露给客户端
 */
interface ImportMetaEnv {
  /** 接口基础地址 */
  readonly VITE_API_BASE_URL: string;
  /** 应用标题 */
  readonly VITE_APP_TITLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
