import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { LayerStack } from '../src/react/components/LayerStack';
import type { Layer } from '../src/core/types';

describe('LayerStack', () => {
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
});
