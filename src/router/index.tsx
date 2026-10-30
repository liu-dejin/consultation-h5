import { createBrowserRouter, Navigate } from "react-router";
import { lazy, Suspense } from "react";
import type { ComponentType } from "react";
import TabBarLayout from "@/layouts/TabBarLayout";
import Loading from "@/components/Loading";
import RequireAuth from "@/components/RequireAuth";

// ===== 登录模块（登录 / 注册 / 忘记密码，无需登录，不带 TabBar）=====
const NotFound = lazy(() => import("@/pages/NotFound"));
const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"));

// ===== 主模块 Tab 页（需登录，带 TabBar）=====
const Home = lazy(() => import("@/pages/Home"));
const Wiki = lazy(() => import("@/pages/Wiki"));
const Message = lazy(() => import("@/pages/Message"));
const Profile = lazy(() => import("@/pages/Profile"));

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
  // 登录模块：登录 / 注册 / 忘记密码
  { path: "login", element: withSuspense(Login) },
  { path: "register", element: withSuspense(Register) },
  { path: "forgot-password", element: withSuspense(ForgotPassword) },
  {
    // 主模块：四个 Tab 页
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
      { path: "wiki", element: withSuspense(Wiki) },
      { path: "message", element: withSuspense(Message) },
      { path: "profile", element: withSuspense(Profile) },
    ],
  },
  // 兜底 404
  { path: "*", element: withSuspense(NotFound) },
]);
