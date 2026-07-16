import { describe, it, expect } from 'vitest';
import { calcAspectRatio, validateTemplate } from '../src/core/utils';
import type { CarTemplate } from '../src/core/types';

describe('calcAspectRatio', () => {
  it('should return 16/9 for 1920x1080', () => {
    expect(calcAspectRatio(1920, 1080)).toBeCloseTo(16 / 9, 5);
  });

  it('should return ~0.915 for 1728x1888 (vertical screen)', () => {
    expect(calcAspectRatio(1728, 1888)).toBeCloseTo(0.915, 2);
  });

  it('should return 1 for square', () => {
    expect(calcAspectRatio(100, 100)).toBe(1);
  });
});

describe('validateTemplate', () => {
  it('should return true for a valid template', () => {
    const t: CarTemplate = {
      name: 'test',
      screenWidth: 1920,
      screenHeight: 1080,
      screenRadius: 10,
    };
    expect(validateTemplate(t)).toBe(true);
  });

  it('should return false when width is 0', () => {
    const t: CarTemplate = {
      name: 'test',
      screenWidth: 0,
      screenHeight: 1080,
      screenRadius: 10,
    };
    expect(validateTemplate(t)).toBe(false);
  });

  it('should return false when height is 0', () => {
    const t: CarTemplate = {
      name: 'test',
      screenWidth: 1920,
      screenHeight: 0,
      screenRadius: 10,
    };
    expect(validateTemplate(t)).toBe(false);
  });

  it('should return false when radius is negative', () => {
    const t: CarTemplate = {
      name: 'test',
      screenWidth: 1920,
      screenHeight: 1080,
      screenRadius: -1,
    };
    expect(validateTemplate(t)).toBe(false);
  });
});
