# mobile-h5 - 移动端 H5 通用脚手架

> 完全通用、无业务逻辑的移动端 H5 前端脚手架，基于 React 19 + TypeScript + Vite + Ant Design Mobile，可快速复用到多个项目。

## 技术栈

| 技术              | 版本                       |
| ----------------- | -------------------------- |
| React             | 19.x                       |
| TypeScript        | 6.x（严格模式）            |
| Vite              | 8.x                        |
| Ant Design Mobile | 5.x                        |
| React Router      | 7.x（单包 `react-router`） |
| Zustand           | 5.x                        |
| Axios             | 1.x                        |
| 包管理器          | pnpm                       |

## 目录结构

```
src/
├── api/                 # 请求相关（兼容层，实际实现在 utils/request.ts）
│   └── index.ts         # 统一出口（re-export）
├── assets/              # 静态资源
│   ├── images/          # 图片资源
│   └── icons/           # 图标资源
├── components/          # 公共组件
│   ├── PageContainer/   # 页面容器
│   ├── Loading/         # 加载组件
│   └── ErrorBoundary/   # 全局错误边界
├── constants/           # 通用常量
│   └── index.ts         # STORAGE_KEYS / CODE_SUCCESS 等
├── hooks/               # 公共 Hooks
├── layouts/             # 布局
│   └── TabBarLayout.tsx # 底部 TabBar 布局
├── pages/               # 示例页面
│   ├── Home/            # 首页
│   ├── Category/        # 分类
│   ├── Profile/         # 我的
│   └── NotFound/        # 404
├── router/              # 路由配置
├── stores/              # Zustand 状态
├── styles/              # 全局样式
│   ├── reset.css        # 重置样式
│   ├── variables.css    # CSS 变量
│   └── global.css       # 全局样式
├── utils/               # 工具函数
│   ├── request.ts       # 请求核心（baseURL / instance / request / get 等）
│   └── storage.ts       # 本地存储
├── App.tsx              # 根组件（包裹 ErrorBoundary + RouterProvider）
├── main.tsx             # 入口文件（ConfigProvider 中文包）
└── vite-env.d.ts        # 环境变量类型
```

## 快速开始

> 要求 Node >= 18，pnpm >= 9

```bash
# 1. 安装依赖
pnpm install

# 2. 启动开发环境
pnpm dev
# 访问 http://localhost:5173

# 3. 生产构建
pnpm build

# 4. 预览生产包
pnpm preview
```

### 创建项目（官方命令）

```bash
pnpm create vite@latest mobile-h5 --template react-ts
```

### 安装依赖（全部使用 pnpm）

```bash
# 运行时依赖
pnpm add antd-mobile antd-mobile-icons react-router zustand axios

# 开发依赖
pnpm add -D @types/node
```

> 说明：`antd-mobile@5.x` 的 peer 依赖声明为 `react ^18`，在 `react 19` 上会有 `unmet peer` 警告，不影响运行，仅 `react-spring` 动效相关。

## 环境变量

| 文件               | 说明               |
| ------------------ | ------------------ |
| `.env.development` | 开发环境           |
| `.env.production`  | 生产环境           |
| `.env.example`     | 示例模板（可提交） |

仅 `VITE_` 前缀的变量会暴露给客户端，通过 `import.meta.env.VITE_API_BASE_URL` 访问。

```ts
// 使用示例
const baseURL = import.meta.env.VITE_API_BASE_URL;
```

## 路由与布局

- 路由基于 `react-router` 的 `createBrowserRouter`
- 布局 `TabBarLayout` 包含底部 TabBar，子页面通过 `Outlet` 渲染
- 新增页面的三步：
  1. 在 `src/pages/` 下创建页面组件
  2. 在 `src/router/index.tsx` 中注册路由
  3. 如需 Tab，在 `TabBarLayout` 中添加配置

## 状态管理

使用 Zustand，示例见 `src/stores/useAppStore.ts`：

```ts
import { useAppStore } from '@/stores'

function Demo() {
  const { count, increase } = useAppStore()
  return <button onClick={increase}>{count}</button>
}
```

## 请求

请求核心位于 `src/utils/request.ts`，`src/api/` 仅为兼容 re-export。

核心导出：`baseURL` / `instance` / `request` / `get` / `post` / `put` / `del` / `patch` / `Data<T>`。

- 请求拦截：注入 Token（预留）
- 响应拦截：已预留 `CODE_SUCCESS` 校验与 `401` 跳转示例，见 `request.ts` 注释

```ts
import { request, get } from "@/utils/request";
import type { Data } from "@/utils/request";

// 通用方法
const res = await request<User>("/user/1", "get", { id: 1 });
// 便捷方法
const res2 = await get<User>("/user/1", { id: 1 });
```

## 常量

通用常量位于 `src/constants/index.ts`：

```ts
import { STORAGE_KEYS, CODE_SUCCESS } from "@/constants";
```

## 样式与适配

- `reset.css`：移动端重置、点击高亮去除
- `variables.css`：主题色、间距等 CSS 变量
- `global.css`：全局布局、安全区适配
- 视口配置：`viewport-fit=cover` 适配刘海屏，`env(safe-area-inset-*)` 处理安全区
- 使用 `100dvh` 替代 `100vh` 解决 iOS 浏览器工具栏遮挡

## 构建与部署

```bash
pnpm build  # 产物位于 dist/
```

- `vite.config.ts` 已配置 `manualChunks`（`vendor` / `antd` 分包）与 `sourcemap: false`
- 部署时需配置 `history` 模式回退（如 Nginx `try_files $uri /index.html`）
- 可按需配置 CDN、Gzip 等优化
