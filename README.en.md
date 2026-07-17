# car-machine-preview

> [English](./README.en.md) | [中文](./README.zh-CN.md)

React component for previewing car machine (HMI/infotainment) screens in the browser. Load image slices and render them inside realistic car bezel frames with simulated screen physical effects.

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
| `showToolbar` | `boolean` | `false` | Show floating effects toolbar |
| `defaultEffects` | `Partial<ScreenEffects>` | — | Initial screen effects values |
| `toolbarPosition` | `'bottom-right' \| 'bottom-left'` | `'bottom-right'` | Toolbar screen corner |
| `toolbarCollapsed` | `boolean` | `false` | Start toolbar collapsed |

## Screen Effects

Simulate real-world screen appearance with CSS-based visual effects:

| Effect | Range | Description |
|--------|-------|-------------|
| `brightness` | 0.5–1.5 | Screen brightness |
| `contrast` | 0.5–1.5 | Screen contrast |
| `glare` | 0–1 | Sun glare intensity |
| `viewingAngleX/Y` | -30–30° | Perspective rotation |
| `screenType` | default / oled / lcd | Screen technology overlay |
| `curvature` | 0–100 | Curved screen vignette |
| `ambientLight` | daylight / night / sunny / overcast | Environment lighting |
| `carAmbientColor` | hex color | Cabin ambient light color |
| `carAmbientIntensity` | 0–1 | Cabin ambient light strength |

### Built-in Presets

- **OLED 夜间** — dimmed, high contrast, OLED tint, night ambient
- **LCD 日间** — neutral, LCD tint, daylight ambient
- **阳光直射** — boosted brightness, low contrast, strong glare, sunny ambient
- **阴天** — dimmed, slight contrast increase, overcast ambient

### Usage with Toolbar

```tsx
<CarScreen
  model="tesla-model-3"
  layers={[...]}
  showToolbar
  defaultEffects={{ brightness: 0.7, screenType: 'oled', ambientLight: 'night' }}
/>
```

### Programmatic Control

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
