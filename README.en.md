# car-machine-effect

> [English](./README.en.md) | [中文](./README.zh-CN.md)

React component for previewing car machine (HMI/infotainment) screens in the browser. Upload image slices and render them inside realistic car bezel frames with simulated screen physical effects.

## Install

```bash
npm install car-machine-effect
```

## Quick Start

### PhotoWall — upload + preview (recommended)

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

### CarScreen — direct layer rendering

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

All-in-one component combining file upload, thumbnail management, and car screen preview.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `files` | `(string \| File)[]` | — | Current items — `File` for new uploads, `string` URL for echo/edit |
| `onChange` | `(files) => void` | — | Called when items are added or removed |
| `multiple` | `boolean` | `false` | Allow multiple image upload |
| `carPreview` | `boolean` | `true` | Show car frame preview |
| `carModel` | `string \| CarTemplate` | `'tesla-model-3'` | Car model for preview |
| `showToolbar` | `boolean` | `false` | Show effects toolbar on the car preview |
| `carWidth` | `number` | `640` | Car preview width in px |

### Examples

```tsx
// Upload mode — onChange returns File[]
<PhotoWall files={[]} onChange={(files) => console.log(files)} />

// Echo mode — pre-populate with existing URLs
<PhotoWall
  files={['https://example.com/bg.png', 'https://example.com/nav.png']}
  onChange={(files) => console.log(files)}
  multiple
/>

// With effects toolbar
<PhotoWall files={[]} onChange={setFiles} showToolbar carModel="byd-seal" />

// Standalone upload (no car preview)
<PhotoWall files={[]} onChange={setFiles} carPreview={false} />
```

## CarScreen

Direct car screen preview with layer stacking.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `model` | `string \| CarTemplate` | — | Pre-built car model key or custom template object |
| `layers` | `Layer[]` | — | Ordered image layers to render |
| `width` | `number` | `640` | Preview width in px |
| `theme` | `'dark' \| 'light'` | `'dark'` | Bezel color theme |
| `onLayerError` | `(layer, error) => void` | — | Called when an image fails to load |
| `showToolbar` | `boolean` | `false` | Show floating effects toolbar |
| `defaultEffects` | `Partial<ScreenEffects>` | — | Initial screen effects values |
| `toolbarPosition` | `'bottom-right' \| 'bottom-left'` | `'bottom-right'` | Toolbar screen corner |
| `toolbarCollapsed` | `boolean` | `false` | Start toolbar collapsed |

### Layer

| Field | Type | Description |
|-------|------|-------------|
| `src` | `string \| File` | Image URL or `File` object for uploaded images |
| `zIndex` | `number` | Layer stacking order |
| `alt` | `string` | Alt text for the image |
| `fallback` | `string` | Fallback URL when image fails to load |
| `style` | `CSSProperties` | Additional inline styles |

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
npm run dev        # watch mode rebuild
npm test           # run tests
npm run storybook  # open Storybook
```

## License

MIT
