# AnimeDoll — Web 演示（DESIGN.md）

面向 **GitHub Pages** 的全屏 HTML 幻灯片：产品策划叙事 + 交互式封面 3D。本文档是**视觉与交互的单一事实来源**；实现以 `css/theme-*.css`、`css/presentation-layout.css` 与 `index.html` 为准，变更主题 token 时**先改 CSS，再同步本节表格**。

---

## 1. 产品与氛围

| 维度 | 说明 |
|------|------|
| **受众** | 二次元、痛包/谷子、情绪消费与便携陪伴场景；文案可中英混排，语气偏产品路演而非同人站 |
| **形态** | 约 19 页线性演示；方向键 / 空格翻页；顶栏 HUD、进度条、侧栏章节、导航点与左下角控制（全屏、主题、BGM） |
| **默认入口** | `index.html`；主题由 `data-theme` 与 `localStorage` 键 `animeDollTheme` 协同（`verdant` \| `cyber`） |
| **气质** | **赛博青橙**：深空底、电青主强调、橙点缀，偏「终端 / 展台」感。**森意白金**：浅冷灰实验室底、科研向青绿主色、金色辅色，偏「简报 / 莱茵风」感 |

封面页使用 **Three.js** 加载 `model/*.fbx`；背景为渐变 + 48px 网格漂移（尊重 `prefers-reduced-motion`）。

---

## 2. 色彩系统（语义角色）

所有主题共用同一套 **CSS 变量名**（`--ak-*`）；换主题只换取值。下列为各角色的**语义**与当前 hex（Cyber / Verdant）。

### 2.1 核心色与文本

| Token | 角色 | Cyber Teal（`data-theme="cyber"` 或未设置时的回退） | Verdant（`data-theme="verdant"`） |
|--------|------|-----------------------------------------------------|-------------------------------------|
| `--ak-bg-deep` | 页面基底色 | `#061218` | `#e9e6e2` |
| `--ak-teal-dark` | 次级深面 / 滚动条轨一侧 | `#0a2430` | `#d8d8d6` |
| `--ak-cyan` | **主强调**（标签、高亮、链接感） | `#05a7dc` | `#1b940d` |
| `--ak-cyan-dim` | 主色暗部 / 渐变端 | `#016d8d` | `#0f7616` |
| `--ak-cyan-glow` | 光晕、进度条阴影 | `rgba(5,167,220,0.35)` | `rgba(13,116,106,0.11)` |
| `--ak-orange` | **辅强调**（进度渐变一端、页码当前位） | `#ff5e19` | `#c9a227` |
| `--ak-orange-deep` | 辅色深部 | `#cc4a12` | `#5c4810` |
| `--ak-panel` | 浅卡片面 | `#fdfdfb` | `#fdfdfd` |
| `--ak-panel-gray` | 浅灰面板 | `#ebeceb` | `#f0f0ef` |
| `--ak-dark` / `--ak-black` | 深灰 / 近黑 | `#424242` / `#161919` | `#2a2a2a` / `#141414` |
| `--ak-text` | 浅底上正文 | `#323232` | `#141414` |
| `--ak-text-muted` | 次级说明 | `#6a6a6a` | `#5a5a5a` |
| `--ak-text-light` | 深底上主文 | `#e8eef2` | `#f5f5f5` |
| `--ak-line` | HUD 装饰线、分割意象 | `rgba(255,255,255,0.85)` | `rgba(20,20,20,0.88)` |
| `--ak-link` | 幻灯片内链接 | `#0084ff` | `#1b940d` |

### 2.2 背景层（`body::before` / `::after`）

| Token | 用途 |
|--------|------|
| `--ak-bg-radial-a` / `--ak-bg-radial-b` | 顶部 / 角部径向光 |
| `--ak-bg-linear-top` / `--ak-bg-linear-bottom` | 纵向渐变端点 |
| `--ak-grid-line` / `--ak-grid-opacity` | 48×48px 网格线与整体透明度 |

### 2.3 半透明强调阶（`--ak-a06` … `--ak-a45`）

主强调色的 alpha 阶梯，用于边框、弱底、药丸标签等。**不要**在组件里手写新的 rgba 主色；应新增或复用已有 `--ak-a**` / `--ak-w**` 变量以保持双主题一致。

### 2.4 总结页磁贴（`.ak-tile-dark` 等）

由 `--ak-tile-bg`、`--ak-tile-fg`、`--ak-tile-border`、`--ak-tile-shadow` 及 phase / pill / quote 子 token 控制。Cyber 下为深底磁贴；Verdant 下为浅莱茵式面板，与全站浅底一致。

### 2.5 历史说明

类名中的 `cyan` / `ak-card--cyan` 表示 **「主强调色」**，在 Verdant 下实际为青绿色相，**禁止**仅为改名而大改类名（破坏既有 HTML）。

---

## 3. 字体与排版

| 用途 | 字体栈 | 备注 |
|------|--------|------|
| **正文 UI** | `'Noto Sans SC', system-ui, sans-serif` | `html, body` 默认 |
| **数字 / 时间 / 页码** | `'IBM Plex Mono', 'Noto Sans SC', monospace` | HUD 时间、`.slide-counter`、部分技术标签 |
| **可选标题加重** | Noto Serif SC（已在 `index.html` 引入 700/900） | 按页用于强调块，勿堆叠过多字重 |

**层级（原则）**

- 封面主标题：大号 `clamp`，字重偏 bold；副标题与 tagline 逐级减小、透明度递减（赛博深底上常用半透明白）。
- 内页标题：`.slide-frame` 内标题与侧栏 `.ak-sidebar` 层级分明；侧栏字号略小于主标题。
- 正文条目标题与说明：用 `clamp` 与 `vmin` 混排以保证 **16:9 投屏** 与 **窄屏** 可读性。

**链接**：`color: var(--ak-link)`；hover 显示下划线（`.slide a[href]`）。

---

## 4. 布局与间距

| Token / 规则 | 值 / 说明 |
|--------------|-----------|
| `--content-max` | `1100px`，主内容最大宽 |
| `--hud-pad` | `clamp(12px, 2.5vw, 28px)`，边距与安全区 |
| `--hud-ctl-gap` | `14px`，左下角全屏 / 主题 / 音乐间距 |
| `--slide-transition` | `0.48s cubic-bezier(0.22, 1, 0.36, 1)` |
| `safe-area-*` | 顶栏、进度条、页码、导航需叠加 `env(safe-area-inset-*)` |

**幻灯片栅格**

- 默认 `.slide-frame`：侧栏 + 主区；**宽屏横屏**（`min-width: 821px` 且 `landscape`）保留双列。
- **≤820px 或竖屏平板**（`portrait` 且 `max-width: 1100px`）：强制单列，侧栏融入垂直流。

---

## 5. 组件样式要点

### 5.1 顶栏 `.ak-topbar`

- 固定顶栏；半透明深底 + `backdrop-filter: blur(8px)`（Cyber）；Verdant 下需与浅底对比足够（实现已随主题变量走）。
- 左横线 + `ANIMEDOLL` 标签（`--ak-cyan`）+ 右横线（`--ak-line`）；状态点中间点为强调色 + 微光。
- 时间块：IBM Plex Mono、约 13px。

### 5.2 进度条 `.progress-bar`

- 固定顶部细条；渐变 `var(--ak-orange)` → `var(--ak-cyan)`；`box-shadow` 使用 `--ak-cyan-glow`。
- 必须保留 `role="progressbar"` 与 `aria-*` 与页数一致。

### 5.3 翻页与导航

- **侧箭头** `.nav-arrow`：大点击区域，细线框风格，hover / active 有强调色反馈。
- **导航点** `.nav-dots`：当前页用强调色 + 尺度变化；右侧固定，垂直居中。
- **页码** `.slide-counter`：当前页大号、`--ak-orange` + 轻 `text-shadow`（`--ak-w35`）。

### 5.4 左下角 HUD `.hud-ctl-row`

- 全屏按钮、主题切换（显示「森意」/「赛博」文案）、BGM 开关与音量条。
- BGM 图标旋转动画在 `prefers-reduced-motion: reduce` 下关闭。

### 5.5 封面 `.cover-slide`

- 3D 画布区：`role="img"` 与加载中 `aria-live`；加载环与百分比为装饰/状态分离。
- 标题块与底部操作提示（方向键 / 空格）用短横条装饰对齐品牌感。
- IP 声明块：小字、可读对比，链接走 `--ak-link`。

### 5.6 内容卡片与列表

- 白/浅底卡片（`--ak-panel`）上正文用 `--ak-text`；图标条、语音条、章节 pill（`.chapter-pill`）遵循 `presentation-layout.css` 中既有 hover / active（如 `--ak-shadow-voice-hover`、`--ak-shadow-tilt-active`）。

### 5.7 图标与装饰（SVG）

- **界面图标**：目录跳转、BMC 标题、功能卡、架构流、故事版时间轴、CMF 统计、硬件清单、App 示意、飞轮卡等使用 **统一 SVG 精灵**（[Heroicons](https://heroicons.com) 风格描边，`currentColor` 继承主题色），禁止用 Emoji 充当可识别 UI 图标（避免跨平台渲染不一致与无障碍噪声）。
- **资源路径**：`images/ak-presentation-sprite.svg`，在页面内通过 `<svg class="ak-icon …"><use href="images/ak-presentation-sprite.svg#ak-i-…"/></svg>` 引用；新增符号时在该文件追加 `<symbol id="ak-i-…">` 并在此节或实现索引中登记用途。
- **样式类**：尺寸与语义色由 `presentation-layout.css` 中 `.ak-icon`、`.ak-icon--lg`、`.ak-feature-icon`、`.arch-icon-wrap`、`.story-time` 等组合控制；强调色默认走 `--ak-cyan` / `--ak-orange`，与双主题 token 一致。
- **本地预览**：外部 SVG 片段在部分环境的 `file://` 下可能不渲染，请以 HTTP 静态服务打开站点根目录（与 `CLAUDE.md` 一致）。

---

## 6. 深度与 elevation

| Token | 典型用途 |
|--------|----------|
| `--ak-shadow-tilt-active` | 卡片/条目前倾交互 |
| `--ak-shadow-voice-hover` | 语音条 hover 复合阴影 |
| `--ak-tile-shadow` | 总结磁贴整体浮起 |

**原则**：Cyber 阴影可带轻微色光（青）；Verdant 阴影偏中性、低扩散，避免「发光塑料感」。

---

## 7. 动效与无障碍

- **幻灯片切换**：`.slide` 使用 opacity / transform 类（如 `enter-from-right`）；`prefers-reduced-motion: reduce` 时取消位移动画，直接显示。
- **背景网格**：`gridDrift` 80s 线性循环；同样尊重 reduced motion。
- **焦点**：所有可交互控件保留键盘可操作与可见焦点环（新增按钮不得用 `outline: none` 而不替代方案）。
- ** live 区域**：翻页与 3D 加载状态使用 `aria-live` 适度播报，避免刷屏。

---

## 8. 响应式与触控

- 窄屏降级单列；封面标题等使用 `clamp` 与 `@media (max-width: 700px)`、`max-height: 860px` 断点微调（见 `presentation-layout.css`）。
- 触控设备上导航箭头与点仍保留足够点击目标；`hover: hover` 媒体查询内才启用纯 hover 强化效果。

---

## 9. Do / Don’t

**Do**

- 新页面复用 `.slide` → `.slide-inner` / `.slide-frame` 结构，保持与 `docs/presentation_slides.md` 信息架构一致后再改 `index.html`。
- 颜色只用主题变量；图表端色用 `--ak-chart-fill-end` 等已有 token。
- 双主题下都检查对比度（尤其 Verdant 浅底上的灰字与金辅色）。

**Don’t**

- 不要引入第三套未文档化的配色，除非同步新增 `theme-*.css` 与本 DESIGN.md 章节。
- 不要用高饱和大块面背景抢过主叙事；封面 3D 与标题应是视觉焦点。
- 不要移除同人免责声明与合规链接类文案（封面 `cover-ip-disclaimer` 区域）。
- 不要用 Emoji 作为幻灯片内的**功能性图标**（导航性块、图表旁注、列表装饰等）；应使用 `ak-presentation-sprite.svg` 中的 SVG 或等价矢量资源。

---

## 10. 实现索引（给协作者 / Agent）

| 需求 | 优先查阅 |
|------|----------|
| 改色 / 新语义色 | `css/theme-cyber-teal.css`, `css/theme-verdant-wisdom.css` |
| 版式、动画、组件、`.ak-icon` 等 | `css/presentation-layout.css` |
| UI 图标精灵（`<symbol>` / `#ak-i-*`） | `images/ak-presentation-sprite.svg` |
| 幻灯片 DOM 与页数 | `index.html`（`.slides-wrapper`）、`aria-valuemax` / `totalSlides` |
| 策划大纲与文案源 | `docs/presentation_slides.md` |
| 主题初始与持久化 | `js/theme-boot.js`, `localStorage` `animeDollTheme` |
| 产品背景 | `CLAUDE.md` |

**一句话品牌**：嵌入 AI 的二次元智能公仔挂件——便携、跨次元陪伴；演示 UI 应同时支撑「展台科幻」与「实验室简报」两种观感，由双主题切换完成。
