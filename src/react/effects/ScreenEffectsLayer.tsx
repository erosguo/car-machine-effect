import type { ReactNode } from 'react';
import { useScreenEffects } from './ScreenEffectsContext';

interface ScreenEffectsLayerProps {
  children: ReactNode;
}

const ambientColors: Record<string, string> = {
  daylight: 'transparent',
  night: 'rgba(0,0,50,0.15)',
  sunny: 'rgba(255,200,150,0.08)',
  overcast: 'rgba(200,200,220,0.12)',
};

export function ScreenEffectsLayer({ children }: ScreenEffectsLayerProps) {
  const { effects } = useScreenEffects();
  const {
    brightness,
    contrast,
    viewingAngleX,
    viewingAngleY,
    glare,
    screenType,
    curvature,
    ambientLight,
    carAmbientColor,
    carAmbientIntensity,
  } = effects;

  const filter = `brightness(${brightness}) contrast(${contrast})`;

  const hasAngle = viewingAngleX !== 0 || viewingAngleY !== 0;
  const transform = hasAngle
    ? `perspective(800px) rotateX(${viewingAngleX}deg) rotateY(${viewingAngleY}deg)`
    : undefined;

  const screenTypeOverlay =
    screenType === 'oled' ? 'rgba(0,0,0,0.03)' :
    screenType === 'lcd' ? 'rgba(255,255,255,0.03)' :
    undefined;

  return (
    <div
      style={{
        filter,
        transform,
        width: '100%',
        height: '100%',
        position: 'relative',
        transformStyle: 'preserve-3d',
        willChange: 'transform, filter',
      }}
    >
      {children}

      {/* Screen type overlay */}
      {screenTypeOverlay && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: screenTypeOverlay,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Glare overlay */}
      {glare > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse at 30% 20%, rgba(255,255,255,${glare * 0.3}) 0%, transparent 70%)`,
            mixBlendMode: 'overlay',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Ambient light overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: ambientColors[ambientLight] ?? 'transparent',
          pointerEvents: 'none',
        }}
      />

      {/* Car ambient color */}
      {carAmbientIntensity > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: carAmbientColor,
            opacity: carAmbientIntensity * 0.1,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Curvature vignette */}
      {curvature > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse at center, transparent ${60 - curvature * 0.3}%, rgba(0,0,0,${curvature * 0.004}) 100%)`,
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
}
