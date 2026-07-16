import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CarScreen } from '../src/react/components/CarScreen';
import '../src/templates';
import type { Layer } from '../src/core/types';

describe('CarScreen', () => {
  const layers: Layer[] = [
    { src: 'bg.png', zIndex: 0, alt: 'bg' },
  ];

  it('should render with a valid model name', () => {
    const { container } = render(<CarScreen model="tesla-model-3" layers={layers} />);
    expect(container.querySelector('[aria-label*="Tesla"]')).toBeInTheDocument();
  });

  it('should render an image layer', () => {
    const { container } = render(<CarScreen model="tesla-model-3" layers={layers} />);
    expect(container.querySelector('img')).toHaveAttribute('src', 'bg.png');
  });

  it('should show error message for unknown model', () => {
    render(<CarScreen model="unknown-car" layers={layers} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
