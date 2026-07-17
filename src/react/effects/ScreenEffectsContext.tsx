import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { ScreenEffects } from './types';
import { DEFAULT_EFFECTS } from './types';

interface ScreenEffectsContextValue {
  effects: ScreenEffects;
  setEffects: (effects: ScreenEffects) => void;
  updateEffects: (partial: Partial<ScreenEffects>) => void;
  resetEffects: () => void;
}

const ScreenEffectsContext = createContext<ScreenEffectsContextValue | null>(null);

interface ScreenEffectsProviderProps {
  children: ReactNode;
  initialEffects?: Partial<ScreenEffects>;
}

export function ScreenEffectsProvider({
  children,
  initialEffects,
}: ScreenEffectsProviderProps) {
  const [effects, setEffects] = useState<ScreenEffects>({
    ...DEFAULT_EFFECTS,
    ...initialEffects,
  });

  const updateEffects = useCallback((partial: Partial<ScreenEffects>) => {
    setEffects((prev) => ({ ...prev, ...partial }));
  }, []);

  const resetEffects = useCallback(() => {
    setEffects({ ...DEFAULT_EFFECTS, ...initialEffects });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScreenEffectsContext.Provider value={{ effects, setEffects, updateEffects, resetEffects }}>
      {children}
    </ScreenEffectsContext.Provider>
  );
}

export function useScreenEffects(): ScreenEffectsContextValue {
  const ctx = useContext(ScreenEffectsContext);
  if (!ctx) {
    throw new Error('useScreenEffects must be used within ScreenEffectsProvider');
  }
  return ctx;
}
