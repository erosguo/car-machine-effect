# car-machine-effect

> [English](./README.en.md) | [中文](./README.zh-CN.md)

用于在浏览器中预览汽车人机交互（HMI/信息娱乐）屏幕的 React 组件。上传图片切片并在逼真的车机边框框架内渲染，支持模拟屏幕物理效果。

## 安装

```bash
npm install car-machine-effect
```

## 快速开始

### PhotoWall — 上传 + 预览（推荐）

```tsx
import { useState } from 'react';
import { PhotoWall } from 'car-machine-effect';

function App() {
  const [files, setFiles] = useState<(string | File)[]>([]);
  return (
    <PhotoWall files={files} onChange={setFiles} />
  );
}
```

### CarScreen — 直接渲染 Layer

```tsx
import { CarScreen } from 'car-machine-effect';

function Preview() {
  return (
    <CarScreen
      model="tesla-model-3"
      layers={[
        { src: '/slices/background.png', zIndex: 0, alt: 'background' },
        { src: '/slices/nav-bar.png', zIndex: 1, alt: 'navigation bar' },
      ]}
    />
  );
}
```

## PhotoWall

一站式组件，整合文件上传、缩略图管理和车机屏幕预览。

### 属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `files` | `(string \| File)[]` | — | 当前文件 — `File` 为新上传，`string` URL 为回显 |
| `onChange` | `(files) => void` | — | 文件变化时回调 |
| `multiple` | `boolean` | `false` | 是否允许多张上传 |
| `carPreview` | `boolean` | `true` | 是否显示车机预览框 |
| `carModel` | `string \| CarTemplate` | `'tesla-model-3'` | 车机预览车型 |
| `showToolbar` | `boolean` | `false` | 车机预览是否显示效果工具栏 |
| `carWidth` | `number` | `640` | 车机预览宽度（像素） |

### 示例

```tsx
// 上传模式 — onChange 返回 File[]
<PhotoWall files={[]} onChange={(files) => console.log(files)} />

// 回显模式 — 预置已有 URL
<PhotoWall
  files={['https://example.com/bg.png', 'https://example.com/nav.png']}
  onChange={(files) => console.log(files)}
  multiple
/>

// 带效果工具栏
<PhotoWall files={[]} onChange={setFiles} showToolbar carModel="byd-seal" />

// 纯上传（无车机预览）
<PhotoWall files={[]} onChange={setFiles} carPreview={false} />
```

## CarScreen

直接渲染车机屏幕预览，支持图片分层叠加。

### 属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `model` | `string \| CarTemplate` | — | 预构建的车型 key 或自定义模板对象 |
| `layers` | `Layer[]` | — | 要渲染的有序图片层 |
| `width` | `number` | `640` | 预览宽度（像素） |
| `theme` | `'dark' \| 'light'` | `'dark'` | 边框颜色主题 |
| `onLayerError` | `(layer, error) => void` | — | 图片加载失败时调用 |
| `showToolbar` | `boolean` | `false` | 显示浮动效果工具栏 |
| `defaultEffects` | `Partial<ScreenEffects>` | — | 初始屏幕效果值 |
| `toolbarPosition` | `'bottom-right' \| 'bottom-left'` | `'bottom-right'` | 工具栏屏幕角落 |
| `toolbarCollapsed` | `boolean` | `false` | 是否默认折叠工具栏 |

### Layer

| 字段 | 类型 | 描述 |
|------|------|------|
| `src` | `string \| File` | 图片 URL 或上传的 File 对象 |
| `zIndex` | `number` | 图层叠放顺序 |
| `alt` | `string` | 图片的替代文本 |
| `fallback` | `string` | 图片加载失败时的备用 URL |
| `style` | `CSSProperties` | 额外行内样式 |

## 屏幕效果

通过 CSS 模拟真实屏幕外观：

| 效果 | 范围 | 描述 |
|------|------|------|
| `brightness` | 0.5–1.5 | 屏幕亮度 |
| `contrast` | 0.5–1.5 | 屏幕对比度 |
| `glare` | 0–1 | 阳光眩光强度 |
| `viewingAngleX/Y` | -30–30° | 视角旋转 |
| `screenType` | default / oled / lcd | 屏幕技术叠加层 |
| `curvature` | 0–100 | 曲面屏暗角 |
| `ambientLight` | daylight / night / sunny / overcast | 环境光照 |
| `carAmbientColor` | hex 颜色 | 车内氛围灯颜色 |
| `carAmbientIntensity` | 0–1 | 车内氛围灯强度 |

### 内置预设

- **OLED 夜间** — 低亮度、高对比度、OLED 色调、夜间环境
- **LCD 日间** — 中性、LCD 色调、日间环境
- **阳光直射** — 增强亮度、低对比度、强眩光、晴天环境
- **阴天** — 降低亮度、轻微对比度提升、阴天环境

### 与工具栏一起使用

```tsx
<CarScreen
  model="tesla-model-3"
  layers={[...]}
  showToolbar
  defaultEffects={{ brightness: 0.7, screenType: 'oled', ambientLight: 'night' }}
/>
```

### 编程控制

```tsx
import { ScreenEffectsProvider, useScreenEffects, ScreenEffectsLayer } from 'car-machine-effect';

function MyCar() {
  const { effects, updateEffects } = useScreenEffects();
  return (
    <ScreenEffectsLayer>
      <CarScreen model="tesla-model-3" layers={[...]} />
    </ScreenEffectsLayer>
  );
}

function App() {
  return (
    <ScreenEffectsProvider initialEffects={{ brightness: 0.8 }}>
      <MyCar />
    </ScreenEffectsProvider>
  );
}
```

## 可用模板

| Key | 车型 | 分辨率 |
|-----|------|--------|
| `byd-seal` | 比亚迪海豹 / 汉 | 1920×1080 |
| `nio-et5` | 蔚来 ET5 / ET7 | 1728×1888 |
| `xpeng-g9` | 小鹏 G9 / P7i | 2400×1200 |
| `li-l9` | 理想 L9 / L8 | 2880×1600 |
| `tesla-model-3` | 特斯拉 Model 3 / Y | 1920×1080 |

## 自定义模板

```tsx
<CarScreen
  model={{
    name: 'My Car',
    screenWidth: 1280,
    screenHeight: 720,
    screenRadius: 8,
    accentColor: '#ff6600',
  }}
  layers={[...]}
/>
```

## 开发

```bash
npm install
npm run dev        # 监听模式自动构建
npm test           # 运行测试
npm run storybook  # 打开 Storybook
```

## 许可证

MIT
