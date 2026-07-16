import type { Layer } from '../../core/types';

interface LayerStackProps {
  layers: Layer[];
  onLayerError?: (layer: Layer, err: Error) => void;
}

export function LayerStack({ layers, onLayerError }: LayerStackProps) {
  const sorted = [...layers].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <>
      {sorted.map((layer, i) => (
        <img
          key={`${layer.src}-${i}`}
          src={layer.src}
          alt={layer.alt ?? ''}
          onError={(e) => {
            if (layer.fallback) {
              (e.target as HTMLImageElement).src = layer.fallback;
            }
            onLayerError?.(layer, new Error(`Failed to load: ${layer.src}`));
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            zIndex: layer.zIndex,
            ...layer.style,
          }}
          draggable={false}
        />
      ))}
    </>
  );
}
