# Implementation Plan - Car Machine Preview

## Overview

- **Package name**: `car-machine-preview`
- **Version**: 0.1.0
- **Tech stack**: TypeScript 5.5+, React 16+/17+/18+/19+, Vite 6 (library mode), Vitest 3
- **Output**: ESM + CJS dual format, `.d.ts` declarations

---

## Task List

### Group A: Project Scaffolding (3 tasks)

---

### Task A1 — 初始化 package.json

**File**: `package.json`

- name, version, description, author, license
- `type: "module"`
- exports: `.` → dist/index.{js,cjs,d.ts}
- peerDeps: `react`, `react-dom` (^16.8+)
- devDeps: `typescript`, `vite`, `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, `@types/react`, `@types/react-dom`
- scripts: `build`, `dev`, `test`, `typecheck`, `prepublishOnly`
- `files: ["dist"]`

**Verification**: `npm install` succeeds with no warnings.

---

### Task A2 — 初始化 tsconfig + vite 构建

**Files**: `tsconfig.json`, `vite.config.ts`

- `tsconfig.json`: target ES2020, jsx react-jsx, declaration → dist, strict mode, emitDeclarationOnly
- `vite.config.ts`: library mode, entry `src/index.ts`, formats `['es', 'cjs']`, externals `['react', 'react-dom']`

**Verification**: `npx tsc --noEmit` passes on empty src.

---

### Task A3 — 初始化 Vitest 测试环境

**File**: `vitest.config.ts` (or inline in vite.config.ts)

- Use `jsdom` environment
- Setup file for `@testing-library/jest-dom` matchers
- `test/` directory as test root

**Verification**: Add a dummy `test/placeholder.test.ts` with `expect(1+1).toBe(2)`, run `npm test` passes.

---

### Group B: Core Types & Logic (3 tasks)

---

### Task B1 — 定义 Layer 和 CarTemplate 类型

**File**: `src/core/types.ts`

```ts
import type { CSSProperties } from 'react';

export interface Layer {
  src: string;
  zIndex: number;
  alt?: string;
  fallback?: string;
  style?: CSSProperties;
}

export interface CarTemplate {
  name: string;
  screenWidth: number;
  screenHeight: number;
  screenRadius: number;
  bezelImage?: string;
  bezelCSS?: Record<string, string>;
  accentColor?: string;
}
```

**Verification**: `tsc --noEmit` passes; import types in test and verify instanceof.

---

### Task B2 — 工具函数

**File**: `src/core/utils.ts`

```ts
export function calcAspectRatio(w: number, h: number): number {
  return w / h;
}

export function validateTemplate(t: CarTemplate): boolean {
  return t.screenWidth > 0 && t.screenHeight > 0 && t.screenRadius >= 0;
}
```

**Verification**: Write `test/utils.test.ts`, test `calcAspectRatio(1920, 1080)` returns `1.777...`; `validateTemplate` rejects invalid.

---

### Task B3 — 模板注册表

**File**: `src/core/registry.ts`

- `const registry = new Map<string, CarTemplate>()`
- `registerTemplate(name, template)` — 注册并返回 name
- `getTemplate(name)` — 按 name 获取，找不到返回 null
- `getAllTemplates()` — 返回所有模板

**Verification**: Register mock template, retrieve by name, verify match.

---

### Group C: Pre-built Templates (4 tasks)

Each template file exports a `CarTemplate` object and auto-registers itself.

---

### Task C1 — 比亚迪模板

**File**: `src/templates/byd.ts`

- key: `"byd-seal"`, name: `"BYD Seal / Han"`
- screenWidth: 1920, screenHeight: 1080, screenRadius: 12
- accentColor: `"#4A90D9"`
- 旋转屏在 v2 中通过 custom template 实现，v1 只固定横屏

### Task C2 — 蔚来 + 小鹏模板

**File**: `src/templates/nio.ts`, `src/templates/xpeng.ts`

- NIO: `"nio-et5"`, 1728x1888 (竖屏), radius 8, accent `"#000000"`
- XPeng: `"xpeng-g9"`, 2400x1200, radius 16, accent `"#5C3CFA"`

### Task C3 — 理想 + Tesla 模板

**File**: `src/templates/li-auto.ts`, `src/templates/tesla.ts`

- Li Auto: `"li-l9"`, 2880x1600, radius 20, accent `"#00A3FF"`
- Tesla: `"tesla-model-3"`, 1920x1080, radius 10, accent `"#E82127"`

### Task C4 — 模板索引

**File**: `src/templates/index.ts`

- Import and register all templates
- Export `templateList` array + `templateNames` array

```ts
export const templateNames = [
  'byd-seal', 'nio-et5', 'xpeng-g9', 'li-l9', 'tesla-model-3',
];
```

**Verification for Group C**: `getTemplate('byd-seal')` returns correct object; `getAllTemplates().length === 5`.

---

### Group D: React Components (5 tasks)

---

### Task D1 — useImageLoader hook

**File**: `src/react/hooks/useImageLoader.ts`

```ts
export function useImageLoader(src: string, fallback?: string) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setStatus('loaded');
    img.onerror = (e) => { setStatus('error'); setError(new Error(`Failed: ${src}`)); };
    img.src = src;
    return () => { img.onload = null; img.onerror = null; };
  }, [src]);

  return { status, error, src: status === 'error' && fallback ? fallback : src };
}
```

(For task brevity: export types, handle cleanup, return resolved src)

**Verification**: Render component using hook with a real image URL → status is `'loaded'`.

---

### Task D2 — useCarTemplate hook

**File**: `src/react/hooks/useCarTemplate.ts`

```ts
export function useCarTemplate(model: string | CarTemplate): CarTemplate | null {
  return typeof model === 'string' ? getTemplate(model) : model;
}
```

**Verification**: Pass string → returns template; pass object → returns same object.

---

### Task D3 — ScreenFrame 组件

**File**: `src/react/components/ScreenFrame.tsx`

- Renders the car bezel/frame using CSS + SVG
- Props: `template: CarTemplate`, `width: number`, `children`, `className?`
- Outer container: relative positioned with the `width`, calculated height from aspect ratio
- Inner screen area: rounded corners via `borderRadius: template.screenRadius`
- Bezel: CSS box-shadow + border to simulate frame
- If `template.bezelImage`, render as an absolutely-positioned `<img>` overlay

**Verification**: Render with tesla template → matches 1920x1080 aspect ratio, correct border-radius.

---

### Task D4 — LayerStack 组件

**File**: `src/react/components/LayerStack.tsx`

- Props: `layers: Layer[]`, `onLayerError?: (layer: Layer, err: Error) => void`
- Maps over layers, renders `<img>` for each
- Sorts by `layer.zIndex` ascending
- Each `<img>` has `alt={layer.alt}`, onError handler calls `onLayerError`
- If layer has `fallback`, show that on error

**Verification**: Render 3 layers → DOM has 3 `<img>` elements in correct z-order.

---

### Task D5 — CarScreen 主组件

**File**: `src/react/components/CarScreen.tsx`

```tsx
export interface CarScreenProps {
  model: string | CarTemplate;
  layers: Layer[];
  width?: number;
  interactive?: boolean;
  theme?: 'light' | 'dark';
  onLayerError?: (layer: Layer, err: Error) => void;
}
```

- Uses `useCarTemplate(model)` to resolve template
- Uses `ScreenFrame` as outer container, `LayerStack` inside
- If template not found, renders error message (dev-friendly)
- `role="img"` + `aria-label` generated from template name
- `theme` controls bezel color (dark = `#1a1a1a`, light = `#e0e0e0`)

**Verification**: Render `<CarScreen model="tesla-model-3" layers={[...]} />` → correct structure in DOM.

---

### Group E: Entry Points & Export (2 tasks)

---

### Task E1 — React barrel export

**File**: `src/react/index.ts`

```ts
export { CarScreen } from './components/CarScreen';
export { ScreenFrame } from './components/ScreenFrame';
export { LayerStack } from './components/LayerStack';
export { useImageLoader } from './hooks/useImageLoader';
export { useCarTemplate } from './hooks/useCarTemplate';
```

### Task E2 — Root barrel export

**File**: `src/index.ts`

```ts
export type { Layer, CarTemplate } from './core/types';
export { calcAspectRatio, validateTemplate } from './core/utils';
export { getTemplate, getAllTemplates, registerTemplate } from './core/registry';
export { templateNames } from './templates';
export { CarScreen, ScreenFrame, LayerStack, useImageLoader, useCarTemplate } from './react';
```

---

### Group F: Tests (2 tasks)

---

### Task F1 — 核心逻辑测试

**File**: `test/utils.test.ts`

- `calcAspectRatio(1920, 1080)` → `16/9`
- `calcAspectRatio(1728, 1888)` → ~0.915
- `validateTemplate({...})` → true/false
- `getTemplate('unknown')` → null
- `registerTemplate + getTemplate` roundtrip

### Task F2 — 组件渲染测试

**File**: `test/CarScreen.test.tsx`

- Render with valid model → screen frame exists
- Render with unknown model → shows error fallback
- Render 2 layers → both images appear in DOM
- `alt` attribute propagated to `<img>`
- `onLayerError` fires on broken image src

**Verification**: `npm test` — all tests green.

---

### Group G: Documentation & Demo (2 tasks)

---

### Task G1 — Storybook 配置 + Stories

**Files**: `.storybook/main.ts`, `.storybook/preview.ts`, `stories/CarScreen.stories.tsx`

- main: stories pattern `../stories/**/*.stories.@(tsx)`, framework react-vite
- Stories:
  - Default (tesla with sample layers)
  - All templates gallery (one CarScreen per template)
  - Custom template example
  - Error state (bad image src)

### Task G2 — README

**File**: `README.md`

- Badge: npm version, license
- Quick start: install, import, basic usage
- Props table (copy from design.md)
- Template list
- Custom template example
- Local development instructions

---

### Group H: Build & Publish (1 task)

---

### Task H1 — 构建验证 + 发布准备

- `npm run build` → verify `dist/` has `index.js`, `index.cjs`, `index.d.ts`
- `npm test` → all pass
- `npm pack --dry-run` → verify included files
- `npm publish` (when ready)

---

## Summary

| Group | Tasks | Files |
|-------|-------|-------|
| A — Scaffolding | 3 | package.json, tsconfig, vite, vitest |
| B — Core Logic | 3 | types, utils, registry |
| C — Templates | 4 | byd, nio, xpeng, li-auto, tesla + index |
| D — React Components | 5 | 2 hooks + 3 components |
| E — Entry Points | 2 | react/index, src/index |
| F — Tests | 2 | utils, CarScreen |
| G — Docs & Demo | 2 | Storybook, README |
| H — Publish | 1 | build, verify, publish |
| **Total** | **22** | **~25 source files** |
