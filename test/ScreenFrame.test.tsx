import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScreenFrame } from '../src/react/components/ScreenFrame';
import type { CarTemplate } from '../src/core/types';

const mockTemplate: CarTemplate = {
  name: 'test',
  screenWidth: 1920,
  screenHeight: 1080,
  screenRadius: 10,
};

describe('ScreenFrame', () => {
  it('should render children inside the frame', () => {
    render(
      <ScreenFrame template={mockTemplate} width={640}>
        <div data-testid="content">hello</div>
      </ScreenFrame>
    );
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('should maintain correct aspect ratio', () => {
    const { container } = render(
      <ScreenFrame template={mockTemplate} width={640}>
        <div />
      </ScreenFrame>
    );
    const frame = container.firstChild as HTMLElement;
    expect(frame.style.width).toBe('640px');
  });
});
