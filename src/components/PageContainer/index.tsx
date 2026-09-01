import type { ReactNode } from "react";
import { NavBar } from "antd-mobile";
import { useNavigate } from "react-router";
import Loading from "@/components/Loading";

interface PageContainerProps {
  /** 页面标题 */
  title?: string;
  /** 是否显示返回按钮 */
  showBack?: boolean;
  /** 是否处于加载中 */
  loading?: boolean;
  /** 子内容 */
  children?: ReactNode;
}

/**
 * 统一页面容器
 * 提供标题栏、返回、加载态等通用能力
 */
export default function PageContainer({
  title,
  showBack = false,
  loading = false,
  children,
}: PageContainerProps) {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100%", background: "#f5f5f5" }}>
      {/* 顶部导航栏 */}
      {title ? <NavBar onBack={showBack ? () => navigate(-1) : undefined}>{title}</NavBar> : null}

      {/* 内容区 */}
      {loading ? <Loading /> : <div style={{ padding: 12 }}>{children}</div>}
    </div>
  );
}
