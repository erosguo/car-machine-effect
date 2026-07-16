import type { CarTemplate } from './types';

export function calcAspectRatio(w: number, h: number): number {
  return w / h;
}

export function validateTemplate(t: CarTemplate): boolean {
  return t.screenWidth > 0 && t.screenHeight > 0 && t.screenRadius >= 0;
}
