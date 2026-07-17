# car-machine-preview

> [English](./README.en.md) | [中文](./README.zh-CN.md)

用于在浏览器中预览汽车人机交互（HMI/信息娱乐）屏幕的 React 组件。加载图片切片并在逼真的车机边框框架内渲染，支持模拟屏幕物理效果。

## 安装

```bash
npm install car-machine-preview
```

## 快速开始

```tsx
import { CarScreen } from 'car-machine-preview';

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

## 属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `model` | `string \| CarTemplate` | — | 预构建的车型 key 或自定义模板对象 |
| `layers` | `Layer[]` | `[]` | 要渲染的有序图片层 |
| `width` | `number` | `640` | 预览宽度（像素） |
| `theme` | `'dark' \| 'light'` | `'dark'` | 边框颜色主题 |
| `onLayerError` | `(layer, error) => void` | — | 图片加载失败时调用 |
| `showToolbar` | `boolean` | `false` | 显示浮动效果工具栏 |
| `defaultEffects` | `Partial<ScreenEffects>` | — | 初始屏幕效果值 |
| `toolbarPosition` | `'bottom-right' \| 'bottom-left'` | `'bottom-right'` | 工具栏屏幕角落 |
| `toolbarCollapsed` | `boolean` | `false` | 是否默认折叠工具栏 |

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
import { ScreenEffectsProvider, useScreenEffects, ScreenEffectsLayer } from 'car-machine-preview';

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
npm run dev        # 监听模式
npm test           # 运行测试
npm run storybook  # 打开 Storybook
```

## 许可证

Apache 2.0
