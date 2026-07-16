# car-machine-preview

> [English](./README.en.md) | [中文](./README.zh-CN.md)

用于在浏览器中预览汽车人机交互（HMI/信息娱乐）屏幕的 React 组件。加载图片切片并在逼真的汽车边框框架内渲染。

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