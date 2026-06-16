import { createContext, useContext, useState, useCallback } from 'react';

const GenerationContext = createContext(null);

export function GenerationProvider({ children }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [onCancel, setOnCancel] = useState(null);

  const startGeneration = useCallback((cancelHandler) => {
    setOnCancel(() => cancelHandler);
    setIsGenerating(true);
  }, []);

  const stopGeneration = useCallback(() => {
    setIsGenerating(false);
    setOnCancel(null);
  }, []);

  const handleCancel = useCallback(() => {
    if (onCancel) onCancel();
    stopGeneration();
  }, [onCancel, stopGeneration]);

  return (
    <GenerationContext.Provider
      value={{ isGenerating, startGeneration, stopGeneration, handleCancel }}
    >
      {children}
    </GenerationContext.Provider>
  );
}

export const useGeneration = () => {
  const ctx = useContext(GenerationContext);
  if (!ctx) throw new Error('useGeneration must be used within GenerationProvider');
  return ctx;
};
