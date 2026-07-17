import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ScreenEffectsProvider } from '../../src/react/effects/ScreenEffectsContext';
import { ScreenEffectsLayer } from '../../src/react/effects/ScreenEffectsLayer';

describe('ScreenEffectsLayer', () => {
  function renderWithEffects(initialEffects: Record<string, unknown>) {
    return render(
      <ScreenEffectsProvider initialEffects={initialEffects}>
        <ScreenEffectsLayer>
          <div data-testid="content">hello</div>
        </ScreenEffectsLayer>
      </ScreenEffectsProvider>
    );
  }

  it('should render children', () => {
    const { getByTestId } = renderWithEffects({});
    expect(getByTestId('content')).toBeInTheDocument();
  });

  it('should apply brightness and contrast via filter', () => {
    const { container } = renderWithEffects({ brightness: 0.5, contrast: 1.2 });
    const layer = container.firstChild as HTMLElement;
    expect(layer.style.filter).toContain('brightness(0.5)');
    expect(layer.style.filter).toContain('contrast(1.2)');
  });

  it('should apply viewing angle transform', () => {
    const { container } = renderWithEffects({ viewingAngleX: 10, viewingAngleY: -5 });
    const layer = container.firstChild as HTMLElement;
    expect(layer.style.transform).toContain('rotateX(10deg)');
    expect(layer.style.transform).toContain('rotateY(-5deg)');
  });

  it('should render glare overlay when glare > 0', () => {
    const { container } = renderWithEffects({ glare: 0.5 });
    const overlays = container.querySelectorAll('[style*="radial-gradient"]');
    expect(overlays.length).toBeGreaterThan(0);
  });
});
