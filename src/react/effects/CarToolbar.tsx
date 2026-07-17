import { useState } from 'react';
import { useScreenEffects } from './ScreenEffectsContext';
import { PRESETS } from './presets';
import type { ScreenType, AmbientLightPreset } from './types';

export interface CarToolbarProps {
  position?: 'bottom-right' | 'bottom-left';
  collapsed?: boolean;
  showPresets?: boolean;
}

const containerStyle: Record<string, string> = {
  position: 'fixed',
  zIndex: '999',
  background: '#1a1a2e',
  borderRadius: '12px',
  padding: '16px',
  boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
  color: '#e0e0e0',
  fontSize: '13px',
  fontFamily: 'system-ui, sans-serif',
  maxHeight: '80vh',
  overflowY: 'auto',
  minWidth: '220px',
};

const labelStyle: Record<string, string> = {
  display: 'block',
  marginBottom: '2px',
  fontSize: '11px',
  color: '#888',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const sectionStyle: Record<string, string> = {
  marginBottom: '12px',
};

const btnStyle = (active: boolean): Record<string, string> => ({
  display: 'inline-block',
  padding: '4px 8px',
  margin: '2px',
  fontSize: '11px',
  border: active ? '1px solid #4a9eff' : '1px solid #333',
  borderRadius: '6px',
  background: active ? '#4a9eff22' : 'transparent',
  color: active ? '#4a9eff' : '#aaa',
  cursor: 'pointer',
});

const sliderStyle: Record<string, string> = {
  width: '100%',
  margin: '4px 0',
  accentColor: '#4a9eff',
};

const selectStyle: Record<string, string> = {
  width: '100%',
  padding: '4px 8px',
  fontSize: '12px',
  borderRadius: '6px',
  border: '1px solid #333',
  background: '#16213e',
  color: '#e0e0e0',
};

const toggleBtnStyle: Record<string, string> = {
  position: 'fixed',
  zIndex: '999',
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  border: '1px solid #333',
  background: '#1a1a2e',
  color: '#e0e0e0',
  fontSize: '18px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export function CarToolbar({
  position = 'bottom-right',
  collapsed: initialCollapsed = false,
  showPresets = true,
}: CarToolbarProps) {
  const [open, setOpen] = useState(!initialCollapsed);
  const { effects, updateEffects, resetEffects } = useScreenEffects();

  const isRight = position === 'bottom-right';
  const pos: Record<string, string> = {
    bottom: '24px',
    [isRight ? 'right' : 'left']: '24px',
  };

  if (!open) {
    return (
      <button
        style={{ ...toggleBtnStyle, ...pos }}
        onClick={() => setOpen(true)}
        aria-label="Toggle effects toolbar"
        title="Screen Effects"
      >
        <span style={{ transform: 'scaleX(-1)' }}>⚙</span>
      </button>
    );
  }

  return (
    <div style={{ ...containerStyle, ...pos }} role="toolbar" aria-label="Screen effects controls">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <strong style={{ fontSize: 14 }}>Screen Effects</strong>
        <button
          style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: 16, padding: '0 4px' }}
          onClick={() => setOpen(false)}
          aria-label="Toggle effects toolbar"
        >
          ✕
        </button>
      </div>

      {/* Presets */}
      {showPresets && (
        <div style={sectionStyle}>
          <span style={labelStyle}>Presets</span>
          <div>
            {PRESETS.map((p) => (
              <button
                key={p.name}
                style={btnStyle(false)}
                onClick={() => updateEffects(p.effects)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Brightness */}
      <div style={sectionStyle}>
        <label style={labelStyle} aria-label="Brightness">
          Brightness: {effects.brightness.toFixed(2)}
        </label>
        <input
          type="range"
          min="0.5"
          max="1.5"
          step="0.05"
          value={effects.brightness}
          onChange={(e) => updateEffects({ brightness: +e.target.value })}
          style={sliderStyle}
          aria-label="brightness"
        />
      </div>

      {/* Contrast */}
      <div style={sectionStyle}>
        <label style={labelStyle} aria-label="Contrast">
          Contrast: {effects.contrast.toFixed(2)}
        </label>
        <input
          type="range"
          min="0.5"
          max="1.5"
          step="0.05"
          value={effects.contrast}
          onChange={(e) => updateEffects({ contrast: +e.target.value })}
          style={sliderStyle}
          aria-label="contrast"
        />
      </div>

      {/* Glare */}
      <div style={sectionStyle}>
        <label style={labelStyle} aria-label="Glare">
          Glare: {effects.glare.toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={effects.glare}
          onChange={(e) => updateEffects({ glare: +e.target.value })}
          style={sliderStyle}
          aria-label="glare"
        />
      </div>

      {/* Viewing Angle */}
      <div style={sectionStyle}>
        <span style={labelStyle}>Viewing Angle</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 1 }}>
            <label style={{ ...labelStyle, fontSize: 10 }}>X: {effects.viewingAngleX}°</label>
            <input
              type="range"
              min="-30"
              max="30"
              value={effects.viewingAngleX}
              onChange={(e) => updateEffects({ viewingAngleX: +e.target.value })}
              style={sliderStyle}
              aria-label="viewing angle X"
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ ...labelStyle, fontSize: 10 }}>Y: {effects.viewingAngleY}°</label>
            <input
              type="range"
              min="-30"
              max="30"
              value={effects.viewingAngleY}
              onChange={(e) => updateEffects({ viewingAngleY: +e.target.value })}
              style={sliderStyle}
              aria-label="viewing angle Y"
            />
          </div>
        </div>
      </div>

      {/* Screen Type */}
      <div style={sectionStyle}>
        <label style={labelStyle} aria-label="Screen Type">Screen Type</label>
        <select
          value={effects.screenType}
          onChange={(e) => updateEffects({ screenType: e.target.value as ScreenType })}
          style={selectStyle}
          aria-label="screen type"
        >
          <option value="default">Default</option>
          <option value="oled">OLED</option>
          <option value="lcd">LCD</option>
        </select>
      </div>

      {/* Ambient Light */}
      <div style={sectionStyle}>
        <label style={labelStyle} aria-label="Ambient Light">Ambient Light</label>
        <select
          value={effects.ambientLight}
          onChange={(e) => updateEffects({ ambientLight: e.target.value as AmbientLightPreset })}
          style={selectStyle}
          aria-label="ambient light"
        >
          <option value="daylight">Daylight</option>
          <option value="night">Night</option>
          <option value="sunny">Sunny</option>
          <option value="overcast">Overcast</option>
        </select>
      </div>

      {/* Car Ambient */}
      <div style={sectionStyle}>
        <span style={labelStyle}>Car Ambient</span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="color"
            value={effects.carAmbientColor}
            onChange={(e) => updateEffects({ carAmbientColor: e.target.value })}
            style={{ width: 32, height: 32, border: 'none', cursor: 'pointer', background: 'none' }}
            aria-label="car ambient color"
          />
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={effects.carAmbientIntensity}
            onChange={(e) => updateEffects({ carAmbientIntensity: +e.target.value })}
            style={{ flex: 1, ...sliderStyle }}
            aria-label="car ambient intensity"
          />
        </div>
      </div>

      {/* Reset */}
      <button
        style={{
          width: '100%',
          padding: '6px',
          fontSize: '12px',
          borderRadius: '6px',
          border: '1px solid #e74c3c',
          background: 'transparent',
          color: '#e74c3c',
          cursor: 'pointer',
          marginTop: 4,
        }}
        onClick={resetEffects}
      >
        Reset
      </button>
    </div>
  );
}
