import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCarTemplate } from '../src/react/hooks/useCarTemplate';
import '../src/templates';
import type { CarTemplate } from '../src/core/types';

describe('useCarTemplate', () => {
  it('should resolve a registered template by name', () => {
    const { result } = renderHook(() => useCarTemplate('tesla-model-3'));
    expect(result.current).not.toBeNull();
    expect(result.current!.name).toContain('Tesla');
  });

  it('should return null for unknown name', () => {
    const { result } = renderHook(() => useCarTemplate('unknown-car'));
    expect(result.current).toBeNull();
  });

  it('should return the object directly when passed a CarTemplate', () => {
    const custom: CarTemplate = {
      name: 'custom',
      screenWidth: 800,
      screenHeight: 600,
      screenRadius: 5,
    };
    const { result } = renderHook(() => useCarTemplate(custom));
    expect(result.current).toBe(custom);
  });
});
