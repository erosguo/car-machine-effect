import type { Layer } from '../../core/types';

interface LayerStackProps {
  layers: Layer[];
  onLayerError?: (layer: Layer, err: Error) => void;
}

function resolveSrc(src: string | File): string {
  return src instanceof File ? URL.createObjectURL(src) : src;
}

export function LayerStack({ layers, onLayerError }: LayerStackProps) {
  const sorted = [...layers].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <>
      {sorted.map((layer, i) => (
        <img
          key={`${layer.src instanceof File ? layer.src.name : layer.src}-${i}`}
          src={resolveSrc(layer.src)}
          alt={layer.alt ?? (layer.src instanceof File ? layer.src.name : '')}
          onError={(e) => {
            if (layer.fallback) {
              (e.target as HTMLImageElement).src = layer.fallback;
            }
            onLayerError?.(layer, new Error(`Failed to load: ${layer.src instanceof File ? layer.src.name : layer.src}`));
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
