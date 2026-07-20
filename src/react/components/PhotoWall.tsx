import { useRef, useCallback, useState } from 'react';
import { CarScreen } from './CarScreen';
import type { CarTemplate } from '../../core/types';

export type PhotoWallItem = string | File;

interface PhotoWallProps {
  files: PhotoWallItem[];
  onChange: (files: PhotoWallItem[]) => void;
  multiple?: boolean;
  carPreview?: boolean;
  carModel?: string | CarTemplate;
  showToolbar?: boolean;
  carWidth?: number;
}

const uploadBoxStyle: Record<string, string> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '200px',
  border: '2px dashed #444',
  borderRadius: '12px',
  color: '#888',
  cursor: 'pointer',
  transition: 'border-color 0.2s',
  padding: '24px',
  boxSizing: 'border-box',
};

const thumbnailStyle: Record<string, string> = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: '8px',
};

const thumbnailWrapperStyle: Record<string, string> = {
  position: 'relative',
  width: '100px',
  height: '100px',
  borderRadius: '8px',
  overflow: 'hidden',
  border: '1px solid #333',
  flexShrink: '0',
};

const deleteBtnStyle: Record<string, string> = {
  position: 'absolute',
  top: '4px',
  right: '4px',
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  border: 'none',
  background: 'rgba(0,0,0,0.6)',
  color: '#fff',
  fontSize: '12px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: '1',
};

const addBoxStyle: Record<string, string> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100px',
  height: '100px',
  border: '2px dashed #444',
  borderRadius: '8px',
  color: '#666',
  fontSize: '28px',
  cursor: 'pointer',
  flexShrink: '0',
};

const wallStyle: Record<string, string> = {
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
  padding: '16px',
};

function getItemSrc(item: PhotoWallItem): string {
  return item instanceof File ? URL.createObjectURL(item) : item;
}

function getItemName(item: PhotoWallItem): string {
  return item instanceof File ? item.name : item.split('/').pop() || item;
}

export function PhotoWall({
  files,
  onChange,
  multiple = false,
  carPreview = true,
  carModel = 'tesla-model-3',
  showToolbar = false,
  carWidth = 640,
}: PhotoWallProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = useCallback((incoming: FileList | File[]) => {
    const arr = Array.from(incoming).filter(f => f.type.startsWith('image/'));
    if (arr.length === 0) return;
    if (multiple) {
      onChange([...files, ...arr]);
    } else {
      onChange([arr[0]]);
    }
  }, [files, multiple, onChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleRemove = useCallback((index: number) => {
    const next = files.filter((_, i) => i !== index);
    onChange(next);
  }, [files, onChange]);

  const openPicker = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const isEmpty = files.length === 0;

  const dropStyle = dragOver
    ? { ...uploadBoxStyle, borderColor: '#4a9eff', background: 'rgba(74,158,255,0.05)' }
    : uploadBoxStyle;

  const uploadArea = isEmpty ? (
    <div
      style={dropStyle}
      onClick={openPicker}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      role="button"
      aria-label="Upload images"
    >
      <div style={{ fontSize: 40, marginBottom: 8, lineHeight: 1 }}>+</div>
      <div>Click or drag to upload</div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        style={{ display: 'none' }}
        onChange={handleInputChange}
      />
    </div>
  ) : null;

  const thumbnailArea = !isEmpty ? (
    <div style={wallStyle}>
      {files.map((file, i) => (
        <div key={`${getItemName(file)}-${i}`} style={thumbnailWrapperStyle}>
          <img src={getItemSrc(file)} alt={getItemName(file)} style={thumbnailStyle} />
          <button
            style={deleteBtnStyle}
            onClick={(e) => { e.stopPropagation(); handleRemove(i); }}
            aria-label={`Remove ${getItemName(file)}`}
          >
            ✕
          </button>
        </div>
      ))}
      {multiple && (
        <div style={addBoxStyle} onClick={openPicker} role="button" aria-label="Add more images">
          +
        </div>
      )}
      {!multiple && (
        <div style={{ ...addBoxStyle, width: 'auto', padding: '0 16px', fontSize: 13 }} onClick={openPicker} role="button" aria-label="Replace image">
          Replace
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        style={{ display: 'none' }}
        onChange={handleInputChange}
      />
    </div>
  ) : null;

  const layers = !isEmpty
    ? files.map((file, i) => ({
        src: file,
        zIndex: i,
        alt: getItemName(file),
      }))
    : [];

  if (isEmpty) {
    return uploadArea;
  }

  if (!carPreview) {
    return thumbnailArea;
  }

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <CarScreen model={carModel} layers={layers} width={carWidth} showToolbar={showToolbar} />
      {thumbnailArea}
    </div>
  );
}
