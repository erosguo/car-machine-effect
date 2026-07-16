import type { ReactNode } from 'react';
import type { CarTemplate } from '../../core/types';
import { calcAspectRatio } from '../../core/utils';

interface ScreenFrameProps {
  template: CarTemplate;
  width: number;
  children: ReactNode;
  theme?: 'dark' | 'light';
}

const themeStyles = {
  dark: {
    frameBg: '#1a1a1a',
    frameShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.08)',
    screenBg: '#000',
  },
  light: {
    frameBg: '#e0e0e0',
    frameShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(0,0,0,0.08)',
    screenBg: '#fff',
  },
};

export function ScreenFrame({ template, width, children, theme = 'dark' }: ScreenFrameProps) {
  const aspectRatio = calcAspectRatio(template.screenWidth, template.screenHeight);
  const height = width / aspectRatio;
  const screenBorderRadius = Math.min(template.screenRadius, width * 0.05);
  const t = themeStyles[theme];

  return (
    <div
      style={{
        borderRadius: '24px',
        background: t.frameBg,
        padding: '16px',
        boxShadow: t.frameShadow,
        boxSizing: 'border-box',
        width: `${width}px`,
      }}
    >
      <div
        style={{
          overflow: 'hidden',
          position: 'relative',
          background: t.screenBg,
          width: '100%',
          height: `${height}px`,
          borderRadius: `${screenBorderRadius}px`,
        }}
        aria-label={`${template.name} screen preview`}
      >
        {children}
      </div>
    </div>
  );
}
