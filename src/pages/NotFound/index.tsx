import { Button, ErrorBlock } from "antd-mobile";
import { useNavigate } from "react-router";

/**
 * 404 页面
 */
export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100dvh",
        padding: 24,
      }}
    >
      <ErrorBlock status="empty" title="页面不存在" description="请检查访问地址是否正确" />
      <Button
        color="primary"
        onClick={() => navigate("/", { replace: true })}
        style={{ marginTop: 16 }}
      >
        返回首页
      </Button>
    </div>
  );
}
