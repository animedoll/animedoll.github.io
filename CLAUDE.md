# AnimeDoll — 项目说明（给 Claude / 协作者）

## 项目是什么

**AnimeDoll** 是一款「嵌入 AI 的二次元智能公仔挂件」的产品策划：约 10cm、可挂在痛包/背包上，强调便携与情绪陪伴；设想能力包括云端大模型、语音交互、微型摄像头视觉等（端云协同，具体以策划与演示页为准）。

本仓库**当前实现**是面向 **GitHub Pages** 的**静态站点**：根目录 `index.html` 为全屏类 PPT 演示（约 19 页），含方向键/空格翻页、导航点、全屏、双主题切换；封面页用 **Three.js** 加载 `model/` 下的 FBX 做可拖拽旋转预览。无后端、无构建步骤。

---

## 仓库结构（以实际目录为准）

| 路径 | 说明 |
|------|------|
| `index.html` | 演示主文件：幻灯片 DOM、内联交互与封面 3D 脚本 |
| `arknights_template.html` | 独立的「罗德岛简报」风格 Web 模板（实验/参考用，非站点默认入口） |
| `css/presentation-layout.css` | 版式、幻灯片框架、导航与通用组件 |
| `css/theme-cyber-teal.css` | 赛博青橙主题变量与样式 |
| `css/theme-verdant-wisdom.css` | 森意白金主题变量与样式 |
| `docs/presentation_slides.md` | 幻灯片信息架构与逐页策划文案（改页面前宜与此对齐） |
| `images/` | 配图、Logo、场景与漫画分镜等；含 `images_prompt.md`、`effect_picture.md` 等说明 |
| `model/model.fbx`、`model/model_lowpoly.fbx` | 封面 3D：先低模再切高模，路径在 `index.html` 内 `MODEL_BASE` |
| `README.md` | 仓库简述 |

依赖通过 **import map** 从 CDN（如 jsDelivr）加载 **three@0.170**，无需 `package.json`。仓库内**没有**专用 Python 启动脚本；本地调试用任意静态 HTTP 服务即可（避免部分环境下 `file://` 与模块加载差异）。

---

## 如何本地查看演示

1. **部署后**：将仓库作为 GitHub Pages 源时，站点入口一般为仓库默认页对应的 `index.html`。
2. **本机**：在仓库根目录用静态服务器托管（例如 IDE 的 Live Server、或任意等价工具），浏览器打开服务根路径。
3. **直接双击 `index.html`**：多数情况下可用；若 ES 模块或资源路径异常，仍改用 HTTP 访问。

封面 3D 需拉取 FBX 与 Three 相关模块，请保持网络可达 CDN。

---

## 修改代码时的约定

- **改幻灯片文案与结构**：主要编辑 `index.html` 中 `.slides-wrapper` 内的各 `.slide`；页数、进度条等与脚本联动处一并检查（如 `aria-valuemax`、`totalSlides` 等）。
- **改视觉主题**：在 `css/theme-*.css` 与 `presentation-layout.css` 中保持一致；`data-theme` 取 `verdant`（森意）或 `cyber`（赛博），主题偏好可存 `localStorage` 键 `animeDollTheme`。
- **改策划大纲或逐页说明**：先更新 `docs/presentation_slides.md`，再同步 `index.html`，避免策划与页面脱节。
- **新增平面素材**：放入 `images/`，在 HTML 中用相对路径引用（如 `images/...`）。
- **更换或新增 3D**：替换或扩展 `model/` 下文件，并修改 `index.html` 中 `MODEL_BASE` / `MODEL_URL_*` 与加载逻辑。
- **产品叙事**：面向二次元、痛包、谷子与情绪消费场景；中英混排时注意语气统一。

---

## Html Presentation 结构（策划大纲）

以下为 `docs/presentation_slides.md` 中的信息架构；实现以 `index.html` 实际分页为准。

```text
AnimeDoll_Presentation/
├── 1. 封面 (Cover)
├── 2. 目录 (Table of Contents)
├── 3. 需求分析 (Requirement Analysis)
│   ├── 3.1 前期调研 (背景引入、5W1H、市场数据)
│   ├── 3.2 行业调研与 SWOT
│   ├── 3.3 竞品分析 (四象限：情感温度 × AI 能力)
│   ├── 3.4 用户调研 (画像、问卷与访谈)
│   ├── 3.5 需求分析 (痛点转需求)
│   └── 3.6 机会点总结
├── 4. 概念设计 (Concept Design)
│   ├── 4.1 概念转化与产品定义
│   ├── 4.2 商业模式画布 (BMC)
│   ├── 4.3 核心功能定义 (看·说·记 等)
│   ├── 4.4 系统图与技术路线
│   └── 4.5 体验流程与故事版
├── 5. 方案展示 (Solution Display)
│   ├── 5.1 外观与 CMF
│   ├── 5.2 三视图与隐藏摄像头
│   ├── 5.3 内部结构与硬件布局
│   ├── 5.4 交互界面 (Companion App)
│   └── 5.5 渲染图与使用场景
├── 6. 社区与数据飞轮 (Community & Data Flywheel)
│   ├── 6.1 UGC 生态
│   ├── 6.2 数据飞轮
│   └── 6.3 社区运营
└── 7. 总结与展望 (Conclusion & Future)
    ├── 7.1 产品路标
    └── 7.2 愿景致辞
```

---

## 摘要（产品一句话）

这是一款嵌入 AI 的二次元智能公仔挂件，挂在背包或痛包上使用（约 10cm）；设想语音对话与视觉模块、端云协同，强调便携与「跨次元陪伴」。

---

## 给 AI 助手的提示

- 用户环境可能使用 **conda**；本仓库不依赖本地 Python 脚本，无需为此引入 `requirements.txt`。
- 本仓库**不是**嵌入式固件或手机 App 工程；硬件与 App 以策划与演示文案为准。
- 大改幻灯片前先对照 `docs/presentation_slides.md` 对应小节，再改 `index.html`，减少结构漂移。
- 涉及无障碍时，保留或补强 `aria-*`、`aria-live` 等与翻页、加载状态相关的属性。
