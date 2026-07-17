# Phase 2 Implementation Plan — Screen Effects & Toolbar

- **Version**: 0.2.0
- **Prerequisite**: Phase 1 (MVP) complete — all 24 tests green

---

## Task List

### Group I: Effects Types & Presets (2 tasks)

---

### Task I1 — ScreenEffects 类型定义

**File**: `src/react/effects/types.ts`

```ts
export type ScreenType = 'default' | 'oled' | 'lcd';
export type AmbientLightPreset = 'daylight' | 'night' | 'sunny' | 'overcast';

export interface ScreenEffects {
  brightness: number;          // 0.5–1.5
  contrast: number;            // 0.5–1.5
  viewingAngleX: number;       // –30–30 (deg)
  viewingAngleY: number;       // –30–30 (deg)
  glare: number;               // 0–1
  screenType: ScreenType;
  curvature: number;           // 0–100
  ambientLight: AmbientLightPreset;
  carAmbientColor: string;     // hex
  carAmbientIntensity: number; // 0–1
}

export const DEFAULT_EFFECTS: ScreenEffects = {
  brightness: 1.0,
  contrast: 1.0,
  viewingAngleX: 0,
  viewingAngleY: 0,
  glare: 0,
  screenType: 'default',
  curvature: 0,
  ambientLight: 'daylight',
  carAmbientColor: '#000000',
  carAmbientIntensity: 0,
};
```

**Verification**: `tsc --noEmit` passes; import and check `DEFAULT_EFFECTS` has all fields.

---

### Task I2 — 效果预设

**File**: `src/react/effects/presets.ts`

```ts
import type { ScreenEffects } from './types';

export interface Preset {
  name: string;
  label: string;
  effects: Partial<ScreenEffects>;
}

export const PRESETS: Preset[] = [
  {
    name: 'oled-night',
    label: 'OLED 夜间',
    effects: { brightness: 0.7, contrast: 1.3, screenType: 'oled', ambientLight: 'night' },
  },
  {
    name: 'lcd-daylight',
    label: 'LCD 日间',
    effects: { brightness: 1.0, contrast: 1.0, screenType: 'lcd', ambientLight: 'daylight' },
  },
  {
    name: 'sunny-glare',
    label: '阳光直射',
    effects: { brightness: 1.3, contrast: 0.8, glare: 0.6, ambientLight: 'sunny' },
  },
  {
    name: 'overcast',
    label: '阴天',
    effects: { brightness: 0.8, contrast: 1.1, ambientLight: 'overcast' },
  },
];

export function getPreset(name: string): Preset | undefined {
  return PRESETS.find(p => p.name === name);
}
```

**Verification**: `getPreset('oled-night')` returns correct object; `getPreset('xxx')` returns undefined.

---

### Group J: Effects Context & Layer (2 tasks)

---

### Task J1 — ScreenEffectsContext + useScreenEffects

**File**: `src/react/effects/ScreenEffectsContext.tsx`

- Create `ScreenEffectsContext` with `React.createContext`
- `ScreenEffectsProvider` — wraps children, manages state via `useState<ScreenEffects>`
- Provider value: `{ effects, setEffects, updateEffects, resetEffects }`
- `updateEffects(partial)` — shallow merge with current effects
- `resetEffects()` — reset to `DEFAULT_EFFECTS`
- Export `useScreenEffects()` hook — throws if used outside provider

**Verification**: Wrap component in provider, call `useScreenEffects()`, verify `effects` has defaults, `updateEffects({ brightness: 0.5 })` updates only brightness.

---

### Task J2 — ScreenEffectsLayer

**File**: `src/react/effects/ScreenEffectsLayer.tsx`

- Props: `children: ReactNode`
- Reads effects from `useScreenEffects()`
- Wraps children in a `div` with:

**CSS filter**:
```
filter: brightness(N) contrast(N)
```

**Viewing angle transform** (if angle !== 0):
```
transform: perspective(800px) rotateX(Ndeg) rotateY(Ndeg)
```

**Ambient light overlay** (absolute positioned div):
| Preset | Background |
|--------|-----------|
| daylight | transparent |
| night | `rgba(0,0,50,0.15)` |
| sunny | `rgba(255,200,150,0.08)` |
| overcast | `rgba(200,200,220,0.12)` |

**Glare overlay** (if glare > 0):
- `radial-gradient(ellipse at 30% 20%, rgba(255,255,255,N) 0%, transparent 70%)`
- `mix-blend-mode: overlay`, opacity = `glare`

**Car ambient overlay** (if intensity > 0):
- Solid `backgroundColor` = `carAmbientColor`, opacity = `carAmbientIntensity * 0.1`

**Screen type**:
- `oled`: extra dark overlay (`rgba(0,0,0,0.03)`) for deeper blacks
- `lcd`: slight black lift (`rgba(255,255,255,0.03)`)

**Curvature** (if > 0):
- Edge vignette: `radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,N) 100%)`

**Verification**: Render with `brightness=0.5, contrast=1.2` → computed `filter` string correct; `glare=0.5` → glare overlay in DOM with correct opacity.

---

### Group K: Toolbar UI (1 task)

---

### Task K1 — CarToolbar 组件

**File**: `src/react/effects/CarToolbar.tsx`

- Props: `position?: 'bottom-right' | 'bottom-left'`, `collapsed?: boolean`, `showPresets?: boolean`
- Floating panel with toggle button (chevron icon via CSS/Triangle)
- When collapsed: small button showing "⚙" or "Tuning"
- When expanded, sections:

1. **Presets** (if `showPresets`): 4 buttons showing each preset name/label, clicking → `updateEffects(preset.effects)`
2. **Brightness**: `<input type="range" min="0.5" max="1.5" step="0.05" />`
3. **Contrast**: same pattern
4. **Glare**: range 0–1
5. **Viewing Angle**: X range –30–30, Y range –30–30
6. **Screen Type**: `<select>` — default / OLED / LCD
7. **Ambient Light**: `<select>` — daylight / night / sunny / overcast
8. **Reset** button

- Styled with inline styles (no external CSS)
- `position: fixed`, `z-index: 999`, bottom-right/bottom-left positioning
- Section backgrounds, rounded corners, shadow for floating look

**Verification**: Render toolbar → preset buttons visible; click preset → effects update; slider drag → value changes.

---

### Group L: CarScreen Integration (2 tasks)

---

### Task L1 — 更新 CarScreen

**File**: `src/react/components/CarScreen.tsx`

- Add props: `toolbar?: boolean | 'bottom-right' | 'bottom-left'`, `defaultEffects?: Partial<ScreenEffects>`, `onEffectsChange?: (e: ScreenEffects) => void`
- Wrap return value in `<ScreenEffectsProvider initialEffects={mergedDefaults}>`
- Use `ScreenEffectsLayer` instead of direct `ScreenFrame > LayerStack` nesting
- If `toolbar` is truthy, render `<CarToolbar position={...} />` inside
- If `onEffectsChange` provided, subscribe to effects changes via `useEffect`

```tsx
// Simplified structure
<ScreenEffectsProvider initialEffects={merged}>
  <ScreenFrame template={template} width={width} theme={theme}>
    <ScreenEffectsLayer>
      <LayerStack layers={layers} onLayerError={onLayerError} />
    </ScreenEffectsLayer>
  </ScreenFrame>
  {toolbar && <CarToolbar position={toolbar === true ? 'bottom-right' : toolbar} />}
</ScreenEffectsProvider>
```

**Verification**: Render `<CarScreen toolbar />` → Toolbar visible; adjust slider → effects applied; render without toolbar prop → no Toolbar.

---

### Task L2 — 更新导出

**File**: `src/react/index.ts`, `src/index.ts`

Add exports:
- `ScreenEffectsProvider`, `useScreenEffects`
- `ScreenEffectsLayer`
- `CarToolbar`
- `ScreenEffects` type, `DEFAULT_EFFECTS`
- `PRESETS`, `getPreset`

**Verification**: All new exports available via `import { ... } from 'car-machine-preview'`.

---

### Group M: Tests (2 tasks)

---

### Task M1 — Effects 逻辑测试

**Files**: `test/effects/ScreenEffectsContext.test.tsx`, `test/effects/presets.test.ts`

- presets: verify all 4 presets have correct structure, each has non-empty label
- Context: default values match `DEFAULT_EFFECTS`
- Context: `updateEffects` merges correctly
- Context: `resetEffects` restores defaults
- Layer: CSS filter string computed correctly
- Layer: glare overlay opacity matches input

### Task M2 — Toolbar + 集成测试

**File**: `test/effects/CarToolbar.test.tsx`

- Render toolbar → preset buttons visible
- Click preset → effects change
- Slider interaction → effects change
- CarScreen with `toolbar` → Toolbar rendered
- CarScreen without `toolbar` → no Toolbar
- CarScreen with `defaultEffects` → initial effects match

**Verification**: `npm test` — all Phase 1 + Phase 2 tests green.

---

### Group N: Storybook (1 task)

---

### Task N1 — Effects Stories

**File**: `stories/Effects.stories.tsx`

- `WithToolbar` — default CarScreen with toolbar enabled
- `OLEDNight` — CarScreen with oled-night preset
- `LCDDaylight` — CarScreen with lcd-daylight preset
- `SunnyGlare` — CarScreen with sunny-glare preset
- `Overcast` — CarScreen with overcast preset
- `ComparisonGrid` — 2×2 grid showing all 4 presets side-by-side
- `CustomEffects` — programmatic useScreenEffects with custom values

**Verification**: `npm run storybook` — all stories load without error.

---

## Summary

| Group | Tasks | Files |
|-------|-------|-------|
| I — Types & Presets | 2 | effects/types.ts, effects/presets.ts |
| J — Context & Layer | 2 | effects/ScreenEffectsContext.tsx, effects/ScreenEffectsLayer.tsx |
| K — Toolbar UI | 1 | effects/CarToolbar.tsx |
| L — Integration | 2 | CarScreen.tsx, barrel exports |
| M — Tests | 2 | effects/*.test.tsx |
| N — Storybook | 1 | Effects.stories.tsx |
| **Total** | **10** | **~8 new + 3 modified files** |
