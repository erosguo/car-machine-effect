import { describe, it, expect, vi, afterEach, beforeAll, afterAll } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { LayerStack } from '../src/react/components/LayerStack';
import type { Layer } from '../src/core/types';

describe('LayerStack', () => {
  afterEach(cleanup);

  beforeAll(() => {
    vi.stubGlobal('URL', { createObjectURL: vi.fn(() => 'blob:mock'), revokeObjectURL: vi.fn() });
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it('should render all layers as images', () => {
    const layers: Layer[] = [
      { src: 'bg.png', zIndex: 0, alt: 'background' },
      { src: 'overlay.png', zIndex: 1, alt: 'overlay' },
    ];
    const { container } = render(<LayerStack layers={layers} />);
    const imgs = container.querySelectorAll('img');
    expect(imgs).toHaveLength(2);
  });

  it('should set alt text on images', () => {
    const layers: Layer[] = [
      { src: 'test.png', zIndex: 0, alt: 'test alt' },
    ];
    const { container } = render(<LayerStack layers={layers} />);
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('alt', 'test alt');
  });

  it('should sort layers by zIndex', () => {
    const layers: Layer[] = [
      { src: 'top.png', zIndex: 10 },
      { src: 'bottom.png', zIndex: 0 },
      { src: 'middle.png', zIndex: 5 },
    ];
    const { container } = render(<LayerStack layers={layers} />);
    const imgs = container.querySelectorAll('img');
    expect(imgs[0]).toHaveAttribute('src', 'bottom.png');
    expect(imgs[1]).toHaveAttribute('src', 'middle.png');
    expect(imgs[2]).toHaveAttribute('src', 'top.png');
  });

  it('should render a File object via object URL', () => {
    const file = new File([''], 'photo.jpg', { type: 'image/jpeg' });
    const layers: Layer[] = [{ src: file, zIndex: 0, alt: 'photo' }];
    const { container } = render(<LayerStack layers={layers} />);
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('src', 'blob:mock');
    expect(img).toHaveAttribute('alt', 'photo');
    expect(URL.createObjectURL).toHaveBeenCalledWith(file);
  });

  it('should set alt from file name when not provided', () => {
    const file = new File([''], 'upload.jpg', { type: 'image/jpeg' });
    const layers: Layer[] = [{ src: file, zIndex: 0 }];
    const { container } = render(<LayerStack layers={layers} />);
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('alt', 'upload.jpg');
  });
});
