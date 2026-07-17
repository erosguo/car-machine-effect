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
    effects: {
      brightness: 0.7,
      contrast: 1.3,
      screenType: 'oled',
      ambientLight: 'night',
    },
  },
  {
    name: 'lcd-daylight',
    label: 'LCD 日间',
    effects: {
      brightness: 1.0,
      contrast: 1.0,
      screenType: 'lcd',
      ambientLight: 'daylight',
    },
  },
  {
    name: 'sunny-glare',
    label: '阳光直射',
    effects: {
      brightness: 1.3,
      contrast: 0.8,
      glare: 0.6,
      ambientLight: 'sunny',
    },
  },
  {
    name: 'overcast',
    label: '阴天',
    effects: {
      brightness: 0.8,
      contrast: 1.1,
      ambientLight: 'overcast',
    },
  },
];

export function getPreset(name: string): Preset | undefined {
  return PRESETS.find((p) => p.name === name);
}
