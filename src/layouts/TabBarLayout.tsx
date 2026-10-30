import { Outlet, useLocation, useNavigate } from "react-router";
import { TabBar } from "antd-mobile";
import { AppOutline, AppstoreOutline, MessageOutline, UserOutline } from "antd-mobile-icons";

/**
 * 底部 Tab 布局
 * 包含 4 个 Tab：首页 / 健康百科 / 消息中心 / 我的
 * 子路由通过 Outlet 渲染
 */
export default function TabBarLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // 根据当前路径决定高亮的 Tab
  const getActiveKey = () => {
    const { pathname } = location;
    if (pathname.startsWith("/wiki")) return "/wiki";
    if (pathname.startsWith("/message")) return "/message";
    if (pathname.startsWith("/profile")) return "/profile";
    return "/home";
  };

  // Tab 配置
  const tabs = [
    { key: "/home", title: "首页", icon: <AppOutline /> },
    { key: "/wiki", title: "健康百科", icon: <AppstoreOutline /> },
    { key: "/message", title: "消息中心", icon: <MessageOutline /> },
    { key: "/profile", title: "我的", icon: <UserOutline /> },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100dvh",
        background: "#f5f5f5",
      }}
    >
      {/* 主内容区，可滚动 */}
      <div style={{ flex: 1, overflow: "auto", paddingBottom: 56 }}>{<Outlet />}</div>

      {/* 底部 TabBar：固定定位并适配安全区 */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          background: "#fff",
          borderTop: "1px solid #eee",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <TabBar activeKey={getActiveKey()} onChange={(key) => navigate(key)}>
          {tabs.map((item) => (
            <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
          ))}
        </TabBar>
      </div>
    </div>
  );
}
