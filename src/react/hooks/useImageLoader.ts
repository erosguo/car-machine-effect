import { useState, useEffect, useRef } from 'react';

type LoadStatus = 'loading' | 'loaded' | 'error';

interface UseImageLoaderResult {
  status: LoadStatus;
  error: Error | null;
  src: string;
}

export function useImageLoader(src: string | File, fallback?: string): UseImageLoaderResult {
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [error, setError] = useState<Error | null>(null);
  const prevUrlRef = useRef<string>('');

  const url = src instanceof File ? URL.createObjectURL(src) : src;

  useEffect(() => {
    if (prevUrlRef.current && prevUrlRef.current !== url && prevUrlRef.current.startsWith('blob:')) {
      URL.revokeObjectURL(prevUrlRef.current);
    }
    prevUrlRef.current = url;

    let cancelled = false;
    const img = new Image();

    img.onload = () => {
      if (!cancelled) setStatus('loaded');
    };
    img.onerror = () => {
      if (!cancelled) {
        setStatus('error');
        setError(new Error(`Failed to load image: ${src instanceof File ? src.name : src}`));
      }
    };
    img.src = url;

    return () => {
      cancelled = true;
    };
  }, [src instanceof File ? src : url]);

  return {
    status,
    error,
    src: status === 'error' && fallback ? fallback : url,
  };
}
