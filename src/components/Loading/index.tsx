import { DotLoading } from "antd-mobile";

interface LoadingProps {
  /** 提示文案 */
  tip?: string;
  /** 是否全屏居中 */
  fullScreen?: boolean;
}

/**
 * 通用加载组件
 * 用于路由懒加载、页面局部加载等场景
 */
export default function Loading({ tip = "加载中...", fullScreen = true }: LoadingProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: 24,
        minHeight: fullScreen ? "60vh" : undefined,
      }}
    >
      <DotLoading color="primary" />
      <span style={{ fontSize: 14, color: "#999" }}>{tip}</span>
    </div>
  );
}
