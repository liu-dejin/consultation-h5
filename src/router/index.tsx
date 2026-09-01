import { createBrowserRouter, Navigate } from "react-router";
import { lazy, Suspense } from "react";
import type { ComponentType } from "react";
import TabBarLayout from "@/layouts/TabBarLayout";
import Loading from "@/components/Loading";
import RequireAuth from "@/components/RequireAuth";

// 懒加载示例页面
const Home = lazy(() => import("@/pages/Home"));
const Category = lazy(() => import("@/pages/Category"));
const Profile = lazy(() => import("@/pages/Profile"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Login = lazy(() => import("@/pages/Login"));

/**
 * 懒加载包裹（统一 Suspense 兜底）
 */
function withSuspense(Component: ComponentType) {
  return (
    <Suspense fallback={<Loading />}>
      <Component />
    </Suspense>
  );
}

/**
 * 基础路由配置
 * 使用 react-router@7 的 createBrowserRouter
 */
export const router = createBrowserRouter([
  { path: "login", element: withSuspense(Login) },
  {
    path: "/",
    element: (
      <RequireAuth>
        <TabBarLayout />
      </RequireAuth>
    ),
    children: [
      // 默认重定向到首页
      { index: true, element: <Navigate to="home" replace /> },
      { path: "home", element: withSuspense(Home) },
      { path: "category", element: withSuspense(Category) },
      { path: "profile", element: withSuspense(Profile) },
    ],
  },
  // 兜底 404
  { path: "*", element: withSuspense(NotFound) },
]);
