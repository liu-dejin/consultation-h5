import PageContainer from "@/components/PageContainer";
import { Card, List } from "antd-mobile";

/**
 * 我的示例（空页面，仅作占位）
 */
export default function Profile() {
  return (
    <PageContainer title="我的">
      <Card>
        <List>
          <List.Item>示例项 1</List.Item>
          <List.Item>示例项 2</List.Item>
          <List.Item>示例项 3</List.Item>
        </List>
      </Card>
    </PageContainer>
  );
}
