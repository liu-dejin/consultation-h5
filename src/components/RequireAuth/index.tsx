import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { useUserStore } from "@/stores/useUserStore";

/**
 * 路由守卫：未登录跳转登录页，并携带当前地址用于登录后回跳
 */
export default function RequireAuth({ children }: { children: ReactNode }) {
  const user = useUserStore((state) => state.user);
  const location = useLocation();

  if (!user?.token) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  return children;
}
