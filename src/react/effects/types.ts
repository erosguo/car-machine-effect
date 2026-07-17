export type ScreenType = 'default' | 'oled' | 'lcd';
export type AmbientLightPreset = 'daylight' | 'night' | 'sunny' | 'overcast';

export interface ScreenEffects {
  brightness: number;
  contrast: number;
  viewingAngleX: number;
  viewingAngleY: number;
  glare: number;
  screenType: ScreenType;
  curvature: number;
  ambientLight: AmbientLightPreset;
  carAmbientColor: string;
  carAmbientIntensity: number;
}

export const DEFAULT_EFFECTS: ScreenEffects = {
  brightness: 1.0,
  contrast: 1.0,
  viewingAngleX: 0,
  viewingAngleY: 0,
  glare: 0,
  screenType: 'default',
  curvature: 0,
  ambientLight: 'daylight',
  carAmbientColor: '#000000',
  carAmbientIntensity: 0,
};
