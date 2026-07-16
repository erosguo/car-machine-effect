import { useState, useEffect } from 'react';

type LoadStatus = 'loading' | 'loaded' | 'error';

interface UseImageLoaderResult {
  status: LoadStatus;
  error: Error | null;
  src: string;
}

export function useImageLoader(src: string, fallback?: string): UseImageLoaderResult {
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();

    img.onload = () => {
      if (!cancelled) setStatus('loaded');
    };
    img.onerror = () => {
      if (!cancelled) {
        setStatus('error');
        setError(new Error(`Failed to load image: ${src}`));
      }
    };
    img.src = src;

    return () => { cancelled = true; };
  }, [src]);

  return {
    status,
    error,
    src: status === 'error' && fallback ? fallback : src,
  };
}
