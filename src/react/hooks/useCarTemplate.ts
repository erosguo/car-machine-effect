import { useMemo } from 'react';
import { getTemplate } from '../../core/registry';
import type { CarTemplate } from '../../core/types';

export function useCarTemplate(model: string | CarTemplate): CarTemplate | null {
  return useMemo(() => {
    if (typeof model === 'string') {
      return getTemplate(model);
    }
    return model;
  }, [model]);
}
