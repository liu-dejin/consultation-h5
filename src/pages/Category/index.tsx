import PageContainer from "@/components/PageContainer";
import { Card } from "antd-mobile";

/**
 * 分类示例（空页面，仅作占位）
 */
export default function Category() {
  return (
    <PageContainer title="分类">
      <Card title="分类">
        <p style={{ color: "#999", fontSize: 14 }}>这里是分类内容占位。</p>
      </Card>
    </PageContainer>
  );
}
