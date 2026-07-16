# Car Machine Screen Preview - Design Document

## 1. Product Overview

**Pain Point**: HMI（车载信息娱乐系统）前端开发中，UI 改动需要烧录到真机或模拟器才能验证效果，每次迭代耗时 5-15 分钟。设计师也无法在开发过程中直接预览车机效果，导致沟通返工成本高。

**Solution**: 一个 npm 包，前端开发者通过 `<CarScreen>` React 组件导入图片切片，即可在浏览器中秒级预览车机屏幕效果。无需真机、无需模拟器、无需部署。

**Target Users**:
- Primary: 前端开发者（React/TS 技术栈）正在开发车载 HMI 项目
- Secondary: UI/UX 设计师需要向团队或客户展示车机设计预览

## 2. Feasibility Analysis

### Market Validation
- **Confirmed gap**: No existing npm package provides car screen preview components. Existing HMI tools (Kanzi, FUXA, Crank) are heavy commercial frameworks; mockup tools (Mediamodifier, Figma) are static/design-only.
- **Market size**: Automotive HMI market: $27B (2025), growing to $29.5B (2026). Frontend devs building automotive HMI with web tech (React/Vue) is an emerging segment.
- **Comparable precedent**: `react-device-preview` (phone/tablet mockups) exists but is unmaintained and not car-specific.
- **Not competing with Storybook**: Storybook 是通用组件预览/文档工具，不提供车机边框模拟、图片切片分层渲染、多车型模板等车机特定功能。本包可在 Storybook 中以 addon 或 decorator 形式集成使用。

### Technical Validation
- **Image rendering**: Trivial - standard `<img>`, CSS layers, Canvas API. Complex layering possible with z-index stacking and CSS positioning.
- **Car frames**: SVG/CSS-based bezel overlays. Templates for specific models can be authored as pure CSS (border-radius, clip-path) or SVG overlays.
- **Integration**: Standard React component library pattern. Peer dependencies: React 16+.
- **Performance**: Minimal concern for static images. For many layers, React memo + lazy loading can mitigate.

### Key Risks
| Risk | Severity | Mitigation |
|------|----------|------------|
| Template maintenance cost | Medium | Community contributions; focus on popular models first |
| Niche market adoption | Medium | Target automotive HMI teams specifically; good docs + demo |
| Image source conventions | Low | Provide clear layer APIs with documentation |

## 3. Core API Design

```tsx
// Basic usage
import { CarScreen } from 'car-screen-preview';

<CarScreen
  model="byd-seal"
  layers={[
    { src: '/slices/background.png', zIndex: 0, alt: '主背景' },
    { src: '/slices/nav-bar.png', zIndex: 1, alt: '导航栏' },
    { src: '/slices/music-player.png', zIndex: 2, alt: '音乐播放器' },
  ]}
/>
```

### Layer
```ts
interface Layer {
  src: string;
  zIndex: number;
  alt?: string;
  fallback?: string;          // 图片加载失败时的占位图
  style?: React.CSSProperties; // 额外样式（位置偏移、透明度等）
}
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `model` | `string \| CarTemplate` | `'generic'` | Pre-built car model or custom template |
| `layers` | `Layer[]` | `[]` | Ordered image layers to render |
| `width` | `number` | `640` | Preview width in px |
| `interactive` | `boolean` | `false` | Enable click-through/hotspots |
| `theme` | `'light' \| 'dark'` | `'dark'` | Frame color theme |
| `onLayerError` | `(layer: Layer, error: Error) => void` | - | 图片加载失败回调 |

### CarTemplate
```ts
interface CarTemplate {
  name: string;
  screenWidth: number;
  screenHeight: number;
  /** 屏幕圆角 (px) */
  screenRadius: number;
  /** 边框装饰图片 URL */
  bezelImage?: string;
  /** CSS 降级方案（无 bezelImage 时使用） */
  bezelCSS?: Record<string, string>;
  /** 品牌标签色 */
  accentColor?: string;
}
// aspectRatio 由 screenWidth / screenHeight 计算得出，不单独存储
```

## 4. Pre-built Car Templates (v1)

### 国产车型（重点覆盖）
| 车型 | 屏幕 | 分辨率 | 特点 |
|------|------|--------|------|
| 比亚迪 海豹/汉 | 15.6" 旋转屏 | 1920x1080 | 可横竖旋转，需适配两种模式 |
| 蔚来 ET7/ET5 | 12.8" AMOLED | 1728x1888 | 竖屏，极窄边框 |
| 小鹏 G9/P7i | 14.96" 2K | 2400x1200 | 横屏，副驾娱乐屏联动 |
| 理想 L9/L8 | 双 15.7" OLED | 2880x1600 | 双联屏布局（仪表+中控） |
| 问界 M9 | 三联屏 | 1920x720 x3 | 三屏贯穿式布局 |

### 海外车型
- Tesla Model 3 / Model Y (landscape, 15", 1920x1080)
- Tesla Model S / X (landscape, 17", 2200x1300)
- BMW iDrive (generic, 1920x720)
- Mercedes MBUX (generic, 1880x720)
- Generic (configurable dimensions)

> 模板采用 SVG 边框 + CSS 样式组合，社区可通过 PR 贡献新车型模板。

## 5. Architecture

```
car-screen-preview/
├── src/
│   ├── core/                    # 框架无关的核心逻辑
│   │   ├── types.ts            # Layer, CarTemplate 等类型定义
│   │   ├── registry.ts         # 模板注册表
│   │   └── utils.ts            # 工具函数（aspectRatio 计算等）
│   ├── react/                   # React 绑定层
│   │   ├── components/
│   │   │   ├── CarScreen.tsx    # Main component
│   │   │   ├── ScreenFrame.tsx  # Bezel/frame rendering
│   │   │   └── LayerStack.tsx   # Image layer manager
│   │   ├── hooks/
│   │   │   ├── useImageLoader.ts
│   │   │   └── useCarTemplate.ts
│   │   └── index.ts
│   ├── templates/
│   │   ├── index.ts
│   │   ├── byd.ts
│   │   ├── nio.ts
│   │   ├── xpeng.ts
│   │   ├── li-auto.ts
│   │   ├── tesla.ts
│   │   ├── bmw.ts
│   │   └── mercedes.ts
│   └── index.ts                 # 统一导出入口
├── test/                        # 测试
│   ├── CarScreen.test.tsx
│   ├── LayerStack.test.tsx
│   └── utils.test.ts
├── .storybook/                  # Storybook
├── stories/
│   ├── CarScreen.stories.tsx
│   └── Templates.stories.tsx
├── package.json                 # main, module, types 指向 dist/
├── tsconfig.json
├── vite.config.ts               # 构建配置：ESM + CJS 双格式输出
└── README.md
```

## 6. Development Phases

### Phase 1 - MVP (Core)
- 项目初始化：TypeScript + Vitest + ESM/CJS 构建配置
- `core/types.ts` 类型定义（Layer, CarTemplate）
- `core/registry.ts` + `core/utils.ts`
- React binding: `CarScreen` + `ScreenFrame` + `LayerStack`
- `useImageLoader` + `useCarTemplate` hooks
- 5 个预置车机模板（比亚迪、蔚来、小鹏、理想、Tesla）
- CSS-based bezel frames
- 图片加载失败处理 + `alt` 支持
- 单元测试：组件渲染 + 模板计算 + 图片加载
- Storybook demo stories
- npm publish + README

### Phase 2 - Enhancements
- Additional car templates
- Remote URL image loading
- SVG-based bezels for higher fidelity
- Custom template API

### Phase 3 - Interactivity
- Clickable hotspot zones
- Image slice switching (simulate screen changes)
- Animation support
- Vue/Angular adapters

## 7. Build & Export

- **Output formats**: ESM (`dist/index.mjs`) + CommonJS (`dist/index.js`) 双格式
- **TypeScript**: 生成 `.d.ts` 类型声明文件
- **Minimal runtime deps**: 零运行时依赖（MV P），仅 `react` / `react-dom` 作为 peerDependencies
- **Dev deps**: Vitest, Testing Library, Storybook, TypeScript
- **Tree-shaking**: 支持，按需导入仅打包使用的模板和组件

## 8. Accessibility

- 每个 `Layer` 输出 `<img>` 时携带 `alt` 属性
- `CarScreen` 根元素带 `role="img"` 和 `aria-label`（如 `"Tesla Model 3 屏幕预览"`）
- 交互模式（v3）下支持键盘导航（Tab / Enter / Escape）

## 9. Verdict

**可行 (FEASIBLE)** ✅

The product idea fills a genuine gap in the frontend tooling space for automotive HMI development. The technical scope is well-bounded, the API surface is clean, and the MVP can be delivered with minimal dependencies. Key success factors are:
1. Quality pre-built car templates (visual appeal matters)
2. Clear developer documentation
3. Active engagement with automotive HMI developer community
