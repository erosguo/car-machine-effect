import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useImageLoader } from '../src/react/hooks/useImageLoader';

class MockImage {
  onload: (() => void) | null = null;
  onerror: ((e: unknown) => void) | null = null;
  src: string = '';
  constructor() { setTimeout(() => this.onload?.(), 0); }
}

describe('useImageLoader', () => {
  beforeAll(() => {
    vi.stubGlobal('Image', MockImage);
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it('should start with loading status', () => {
    const { result } = renderHook(() => useImageLoader('test.png'));
    expect(result.current.status).toBe('loading');
  });

  it('should transition to loaded when image loads', async () => {
    const { result } = renderHook(() => useImageLoader('test.png'));

    await waitFor(() => {
      expect(result.current.status).toBe('loaded');
    });
  });

  it('should return fallback src on error', async () => {
    class ErrorImage {
      onload: (() => void) | null = null;
      onerror: ((e: unknown) => void) | null = null;
      src: string = '';
      constructor() { setTimeout(() => this.onerror?.(new Event('error')), 0); }
    }
    vi.stubGlobal('Image', ErrorImage);

    const { result } = renderHook(() => useImageLoader('bad.png', 'fallback.png'));

    await waitFor(() => {
      expect(result.current.status).toBe('error');
    });
    expect(result.current.src).toBe('fallback.png');
  });
});
