import type { CSSProperties } from 'react';

export interface Layer {
  src: string | File;
  zIndex: number;
  alt?: string;
  fallback?: string;
  style?: CSSProperties;
}

export interface CarTemplate {
  name: string;
  screenWidth: number;
  screenHeight: number;
  screenRadius: number;
  bezelImage?: string;
  bezelCSS?: Record<string, string>;
  accentColor?: string;
}
