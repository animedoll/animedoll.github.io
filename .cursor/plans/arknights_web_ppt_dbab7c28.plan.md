---
name: Arknights Web PPT
overview: 在空的 [index_arknights.html](E:\GitHub\animedoll.github.io\index_arknights.html) 中实现单文件「明日方舟主界面」风格 Web PPT：沿用本站 [index.html](E:\GitHub\animedoll.github.io\index.html) 的幻灯片交互逻辑，视觉与布局参考 mashirozx/arknights-ui 的版式与配色，用纯 CSS/SVG 还原氛围，不嵌入游戏逆向贴图。
todos:
  - id: tokens-layout
    content: 定义 CSS 变量（青/橙/灰/面板）、字体与全局背景；实现 HUD 框架（顶栏/左右分栏/装饰线）
    status: completed
  - id: slides-markup
    content: 编写 6～8 页幻灯片 HTML 结构与方舟风卡片组件（封面、目录、内容页、结尾）
    status: completed
  - id: nav-js
    content: 从 index.html 移植并精简幻灯片 JS（goToSlide、进度条、点、键盘/触摸/滚轮），对接新 class 名
    status: completed
  - id: motion-a11y
    content: 幻灯片过渡动画 + prefers-reduced-motion；自测桌面与移动端布局
    status: completed
isProject: false
---

# 明日方舟风格 Web PPT（index_arknights.html）

## 设计取向（对齐 arknights-ui，而非拷贝素材）

参考 [arknights-ui 的 `styles.css`](https://raw.githubusercontent.com/mashirozx/arknights-ui/master/css/styles.css) 中可抽象出的设计语言：

- **字体**：`Noto Sans SC`（正文、数据）+ `Noto Serif SC`（大标题/按钮字重感），与上游一致。
- **主色**：深青蓝氛围背景（接近 `#016d8d` / `#0a1f28` 系）、亮青蓝块（约 `#05a7dc`）、白/浅灰面板（`#fdfdfb`、`#ebeceb`）、深灰块（`#424242` / `#161919`）。
- **强调色**：橙条装饰（约 `#ff5e19`），用于当前页指示、卡片顶边、进度条端点。
- **版式**：宽屏下左右分栏——左侧「信息/章节/VOICE 条」式窄栏 + 中央主内容；右侧可弱化或收拢为装饰性 HUD（时间线、细线、假状态栏），呼应主界面透视菜单（可用 `perspective` + 轻微 `rotateY`，避免过度 3D 影响可读性）。
- **装饰**：细白分割线、半透明黑条（`rgba(0,0,0,.5)`）模拟顶部状态区；背景用 CSS 渐变 + 可选低对比网格/噪点（**不用** `UI_HOME.png` 等逆向贴图）。

README 中版权说明要求：**不将游戏拆包贴图纳入本仓库**；若需立绘/图标，仅用占位几何图形、CSS 或自绘 SVG。

## 技术结构（复用现有站点模式）

与 [index.html](E:\GitHub\animedoll.github.io\index.html) 保持一致，便于维护：

| 模块 | 做法 |
|------|------|
| 幻灯片 DOM | `.slides-wrapper` + 多个 `.slide`，首屏 `active` |
| 导航 | 顶或底 **进度条**、`goToSlide` / `nextSlide` / `prevSlide`、右侧 **竖点**（样式改为橙/青方块条，贴近 HUD） |
| 输入 | 键盘方向键/空格/Home/End、触摸滑动、滚轮节流（可从现有脚本精简复制，去掉与本主题无关的粒子画布若不需要） |
| 动画 | 保留 `exit-left` / `enter-from-right` 等类名逻辑，过渡时长与 easing 与方舟「硬朗」感略匹配（略短、少 blur 或不用 blur） |

实现为 **单文件** `index_arknights.html`（内联 `<style>` + `<script>`），不新增构建步骤，符合当前 GitHub Pages 部署方式。

## 页面内容（占位与可编辑）

因原文件为空且无指定文案，建议内置 **6～8 页** 演示结构（可后续替换为你的课题内容）：

1. **封面**：大标题 + 副标题 + 底部「开始 / 章节」式装饰。
2. **目录**：网格或竖条列表，橙顶卡片。
3. **若干内容页**：标题 + 要点列表 / 两栏对比，使用浅底卡片 + 左侧竖色条。
4. **结尾**：致谢 / Q&A，可缩小 HUD 装饰。

所有标题与列表使用中文占位，结构清晰，便于直接改字。

## 可选增强（按工时取舍）

- 左上角 **实时时间**（仅装饰，小字 Monospace 或 Noto Sans），呼应上游状态栏。
- **全屏**按钮（可选，`requestFullscreen`）。
- 不默认开启重粒子背景；若需要动感，用 **纯 CSS** 缓慢移动的渐变或网格平移，避免大段 Canvas 与主站 `index.html` 重复。

## 风险与边界

- **风格相似 ≠ 使用官方素材**：仅原创 CSS/SVG；不引用 arknights-ui 仓库内 `img/` 游戏资源。
- **可访问性**：保证对比度（浅灰底上的深字）、焦点可见（键盘 Tab 到导航点）、`prefers-reduced-motion` 时减弱动画。

## 交付物

- 填满并实现 [`index_arknights.html`](E:\GitHub\animedoll.github.io\index_arknights.html)：完整可运行的方舟风 Web PPT。
- 不修改 [`index.html`](E:\GitHub\animedoll.github.io\index.html)（除非你后续要求统一入口或互相链接）。
