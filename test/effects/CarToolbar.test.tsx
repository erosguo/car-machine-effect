import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ScreenEffectsProvider } from '../../src/react/effects/ScreenEffectsContext';
import { CarToolbar } from '../../src/react/effects/CarToolbar';
import type { ReactNode } from 'react';

function wrapper({ children }: { children: ReactNode }) {
  return <ScreenEffectsProvider>{children}</ScreenEffectsProvider>;
}

describe('CarToolbar', () => {
  afterEach(cleanup);

  it('should render preset buttons', () => {
    render(<CarToolbar />, { wrapper });
    expect(screen.getByText('OLED 夜间')).toBeInTheDocument();
    expect(screen.getByText('LCD 日间')).toBeInTheDocument();
    expect(screen.getByText('阳光直射')).toBeInTheDocument();
    expect(screen.getByText('阴天')).toBeInTheDocument();
  });

  it('should render a brightness slider', () => {
    render(<CarToolbar />, { wrapper });
    const slider = screen.getByRole('slider', { name: /brightness/i });
    expect(slider).toBeInTheDocument();
  });

  it('should render screen type selector', () => {
    render(<CarToolbar />, { wrapper });
    const select = screen.getByRole('combobox', { name: /screen type/i });
    expect(select).toBeInTheDocument();
  });

  it('should render reset button', () => {
    render(<CarToolbar />, { wrapper });
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
  });

  it('should be collapsible via toggle', () => {
    render(<CarToolbar collapsed />, { wrapper });
    const toggle = screen.getByRole('button', { name: /toggle/i });
    fireEvent.click(toggle);
    expect(screen.getByText('OLED 夜间')).toBeInTheDocument();
  });
});
