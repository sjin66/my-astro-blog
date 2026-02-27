# Astro Sidebar Components

这是纯 Astro 实现的 Sidebar 组件，不依赖 React。

## 组件结构

- `SidebarProvider.astro` - 主容器，管理 sidebar 状态
- `Sidebar.astro` - 侧边栏主体组件
- `SidebarContent.astro` - 侧边栏内容区域
- `SidebarFooter.astro` - 侧边栏底部区域
- `SidebarTrigger.astro` - 触发按钮
- `SidebarRail.astro` - 侧边栏轨道（用于拖拽调整）
- `AppSidebar.astro` - 应用特定的侧边栏实现
- `sidebar-client.ts` - 客户端脚本，处理交互逻辑

## 使用方法

### 基本用法

```astro
---
import SidebarProvider from '@/components/astro-sidebar/SidebarProvider.astro';
import Sidebar from '@/components/astro-sidebar/Sidebar.astro';
import SidebarContent from '@/components/astro-sidebar/SidebarContent.astro';
import SidebarTrigger from '@/components/astro-sidebar/SidebarTrigger.astro';
---

<SidebarProvider defaultOpen={true}>
  <Sidebar collapsible="offcanvas">
    <SidebarContent>
      <!-- 你的内容 -->
    </SidebarContent>
  </Sidebar>
  
  <main>
    <SidebarTrigger />
    <!-- 主内容 -->
  </main>
</SidebarProvider>
```

### 使用 AppSidebar

```astro
---
import SidebarProvider from '@/components/astro-sidebar/SidebarProvider.astro';
import AppSidebar from '@/components/astro-sidebar/AppSidebar.astro';
import SidebarTrigger from '@/components/astro-sidebar/SidebarTrigger.astro';
---

<SidebarProvider>
  <AppSidebar />
  <main>
    <SidebarTrigger />
    <!-- 你的内容 -->
  </main>
</SidebarProvider>
```

## 功能特性

- ✅ 响应式设计（移动端使用 Sheet，桌面端使用固定侧边栏）
- ✅ 状态持久化（使用 Cookie 保存展开/收起状态）
- ✅ 键盘快捷键（Cmd/Ctrl + B 切换）
- ✅ 平滑动画过渡
- ✅ 完全使用 Astro 实现，无需 React

## Props

### SidebarProvider
- `defaultOpen?: boolean` - 默认是否展开（默认: true）
- `class?: string` - 额外的 CSS 类

### Sidebar
- `side?: 'left' | 'right'` - 侧边栏位置（默认: 'left'）
- `variant?: 'sidebar' | 'floating' | 'inset'` - 样式变体（默认: 'sidebar'）
- `collapsible?: 'offcanvas' | 'icon' | 'none'` - 折叠方式（默认: 'offcanvas'）
- `class?: string` - 额外的 CSS 类

## 注意事项

- 客户端脚本会自动初始化 sidebar 功能
- 状态会保存在 Cookie 中，有效期 7 天
- 移动端（< 768px）会自动使用 Sheet 组件
- 桌面端使用固定定位的侧边栏

