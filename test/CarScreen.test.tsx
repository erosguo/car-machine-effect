import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { CarScreen } from '../src/react/components/CarScreen';
import '../src/templates';
import type { Layer } from '../src/core/types';

describe('CarScreen', () => {
  afterEach(cleanup);

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

  it('should not render toolbar by default', () => {
    render(<CarScreen model="tesla-model-3" layers={layers} />);
    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();
  });

  it('should render toolbar when showToolbar is true', () => {
    render(<CarScreen model="tesla-model-3" layers={layers} showToolbar />);
    expect(screen.getByRole('toolbar')).toBeInTheDocument();
    expect(screen.getByText('Screen Effects')).toBeInTheDocument();
  });

  it('should render toolbar collapsed when toolbarCollapsed is true', () => {
    render(<CarScreen model="tesla-model-3" layers={layers} showToolbar toolbarCollapsed />);
    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();
    expect(screen.getByTitle('Screen Effects')).toBeInTheDocument();
  });

  it('should apply defaultEffects to toolbar slider', () => {
    render(
      <CarScreen
        model="tesla-model-3"
        layers={layers}
        showToolbar
        defaultEffects={{ brightness: 0.75 }}
      />
    );
    const slider = screen.getByRole('slider', { name: /brightness/i });
    expect(slider).toHaveValue('0.75');
  });
});
