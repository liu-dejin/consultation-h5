import { RouterProvider } from "react-router";
import { router } from "@/router";
import ErrorBoundary from "@/components/ErrorBoundary";

/**
 * 根组件
 * 仅承载路由，布局与页面由 router 配置决定
 * 外层包裹错误边界，避免运行时异常导致白屏
 */
export default function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}
