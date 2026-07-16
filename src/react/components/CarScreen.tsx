import { useCarTemplate } from '../hooks/useCarTemplate';
import { ScreenFrame } from './ScreenFrame';
import { LayerStack } from './LayerStack';
import { templateNames } from '../../templates';
import type { Layer, CarTemplate } from '../../core/types';

export interface CarScreenProps {
  model: string | CarTemplate;
  layers: Layer[];
  width?: number;
  theme?: 'dark' | 'light';
  onLayerError?: (layer: Layer, err: Error) => void;
}

export function CarScreen({
  model,
  layers,
  width = 640,
  theme = 'dark',
  onLayerError,
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

  return (
    <ScreenFrame template={template} width={width} theme={theme}>
      <LayerStack layers={layers} onLayerError={onLayerError} />
    </ScreenFrame>
  );
}
