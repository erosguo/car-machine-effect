# car-machine-preview

> [English](./README.en.md) | [中文](./README.zh-CN.md)

React component for previewing car machine (HMI/infotainment) screens in the browser. Load image slices and render them inside realistic car bezel frames.

## Install

```bash
npm install car-machine-preview
```

## Quick Start

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

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `model` | `string \| CarTemplate` | — | Pre-built car model key or custom template object |
| `layers` | `Layer[]` | `[]` | Ordered image layers to render |
| `width` | `number` | `640` | Preview width in px |
| `theme` | `'dark' \| 'light'` | `'dark'` | Bezel color theme |
| `onLayerError` | `(layer, error) => void` | — | Called when an image fails to load |

## Available Templates

| Key | Model | Resolution |
|-----|-------|-----------|
| `byd-seal` | BYD Seal / Han | 1920×1080 |
| `nio-et5` | NIO ET5 / ET7 | 1728×1888 |
| `xpeng-g9` | XPeng G9 / P7i | 2400×1200 |
| `li-l9` | Li Auto L9 / L8 | 2880×1600 |
| `tesla-model-3` | Tesla Model 3 / Y | 1920×1080 |

## Custom Template

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

## Development

```bash
npm install
npm run dev        # watch mode
npm test           # run tests
npm run storybook  # open Storybook
```

## License

Apache 2.0