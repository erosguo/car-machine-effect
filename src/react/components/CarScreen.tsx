import { useCarTemplate } from '../hooks/useCarTemplate';
import { ScreenFrame } from './ScreenFrame';
import { LayerStack } from './LayerStack';
import { ScreenEffectsProvider } from '../effects/ScreenEffectsContext';
import { ScreenEffectsLayer } from '../effects/ScreenEffectsLayer';
import { CarToolbar } from '../effects/CarToolbar';
import { templateNames } from '../../templates';
import type { Layer, CarTemplate } from '../../core/types';
import type { ScreenEffects } from '../effects/types';

export interface CarScreenProps {
  model: string | CarTemplate;
  layers: Layer[];
  width?: number;
  theme?: 'dark' | 'light';
  onLayerError?: (layer: Layer, err: Error) => void;
  showToolbar?: boolean;
  defaultEffects?: Partial<ScreenEffects>;
  toolbarPosition?: 'bottom-right' | 'bottom-left';
  toolbarCollapsed?: boolean;
}

export function CarScreen({
  model,
  layers,
  width = 640,
  theme = 'dark',
  onLayerError,
  showToolbar = false,
  defaultEffects,
  toolbarPosition = 'bottom-right',
  toolbarCollapsed = false,
}: CarScreenProps) {
  const template = useCarTemplate(model);

  if (!template) {
    return (
      <div
        style={{
          padding: 16,
          background: '#fef2f2',
          border: '1px solid #fee2e2',
          borderRadius: 8,
          color: '#991b1b',
          fontSize: 14,
        }}
        role="alert"
      >
        Unknown car model: <strong>{String(model)}</strong>. Use one of:{' '}
        {templateNames.join(', ')}
      </div>
    );
  }

  const screen = (
    <ScreenFrame template={template} width={width} theme={theme}>
      {showToolbar ? (
        <ScreenEffectsLayer>
          <LayerStack layers={layers} onLayerError={onLayerError} />
        </ScreenEffectsLayer>
      ) : (
        <LayerStack layers={layers} onLayerError={onLayerError} />
      )}
    </ScreenFrame>
  );

  if (!showToolbar) {
    return screen;
  }

  return (
    <ScreenEffectsProvider initialEffects={defaultEffects}>
      {screen}
      <CarToolbar position={toolbarPosition} collapsed={toolbarCollapsed} />
    </ScreenEffectsProvider>
  );
}
