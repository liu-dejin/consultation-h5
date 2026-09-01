import { Component } from "react";
import type { ReactNode } from "react";
import { Button, ErrorBlock } from "antd-mobile";

interface Props {
  /** 子节点 */
  children: ReactNode;
}

interface State {
  /** 是否发生错误 */
  hasError: boolean;
}

/**
 * 全局错误边界
 * 用于捕获渲染过程中的异常，避免整页白屏
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  handleReset = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
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
          <ErrorBlock status="empty" title="页面出现异常" description="请尝试刷新页面" />
          <Button color="primary" onClick={this.handleReset} style={{ marginTop: 16 }}>
            刷新重试
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
