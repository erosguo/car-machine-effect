import { describe, it, expect } from 'vitest';
import { PRESETS, getPreset } from '../../src/react/effects/presets';

describe('PRESETS', () => {
  it('should have 4 presets', () => {
    expect(PRESETS).toHaveLength(4);
  });

  it('each preset should have name, label, and effects', () => {
    for (const p of PRESETS) {
      expect(p.name).toBeTruthy();
      expect(p.label).toBeTruthy();
      expect(p.effects).toBeTruthy();
    }
  });

  it('oled-night should set low brightness and high contrast', () => {
    const p = getPreset('oled-night')!;
    expect(p.effects.brightness).toBe(0.7);
    expect(p.effects.contrast).toBe(1.3);
    expect(p.effects.screenType).toBe('oled');
    expect(p.effects.ambientLight).toBe('night');
  });

  it('sunny-glare should set high glare', () => {
    const p = getPreset('sunny-glare')!;
    expect(p.effects.glare).toBe(0.6);
    expect(p.effects.brightness).toBe(1.3);
  });

  it('getPreset should return undefined for unknown name', () => {
    expect(getPreset('non-existent')).toBeUndefined();
  });
});
