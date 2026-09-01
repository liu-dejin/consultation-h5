import PageContainer from "@/components/PageContainer";
import { Button, Card } from "antd-mobile";

/**
 * 首页示例（空页面，仅作占位）
 */
export default function Home() {
  return (
    <PageContainer title="首页">
      <Card title="欢迎使用">
        <p style={{ color: "#999", fontSize: 14 }}>这里是首页内容占位，后续可按需扩展。</p>
        <Button color="primary" size="small">
          示例按钮
        </Button>
      </Card>
    </PageContainer>
  );
}
