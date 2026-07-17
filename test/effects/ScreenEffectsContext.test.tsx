import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ScreenEffectsProvider, useScreenEffects } from '../../src/react/effects/ScreenEffectsContext';
import { DEFAULT_EFFECTS } from '../../src/react/effects/types';
import type { ReactNode } from 'react';

function wrapper({ children }: { children: ReactNode }) {
  return <ScreenEffectsProvider>{children}</ScreenEffectsProvider>;
}

describe('useScreenEffects', () => {
  it('should return default effects', () => {
    const { result } = renderHook(() => useScreenEffects(), { wrapper });
    expect(result.current.effects).toEqual(DEFAULT_EFFECTS);
  });

  it('should update a single field with updateEffects', () => {
    const { result } = renderHook(() => useScreenEffects(), { wrapper });

    act(() => {
      result.current.updateEffects({ brightness: 0.5 });
    });

    expect(result.current.effects.brightness).toBe(0.5);
    expect(result.current.effects.contrast).toBe(1.0);
  });

  it('should reset to defaults with resetEffects', () => {
    const { result } = renderHook(() => useScreenEffects(), { wrapper });

    act(() => {
      result.current.updateEffects({ brightness: 0.5, contrast: 1.5, glare: 0.8 });
    });
    act(() => {
      result.current.resetEffects();
    });

    expect(result.current.effects).toEqual(DEFAULT_EFFECTS);
  });

  it('should accept initial effects via props', () => {
    const { result } = renderHook(() => useScreenEffects(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <ScreenEffectsProvider initialEffects={{ brightness: 0.7, ambientLight: 'night' }}>
          {children}
        </ScreenEffectsProvider>
      ),
    });

    expect(result.current.effects.brightness).toBe(0.7);
    expect(result.current.effects.ambientLight).toBe('night');
    expect(result.current.effects.contrast).toBe(1.0);
  });
});
