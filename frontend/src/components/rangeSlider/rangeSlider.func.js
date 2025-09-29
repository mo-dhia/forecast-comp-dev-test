import { useState, useEffect } from 'react';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';

export function useDebouncedRangeInput(valueMin, valueMax, debounceMs, onDebouncedChangeMin, onDebouncedChangeMax) {
  const [draftMin, setDraftMin] = useState(valueMin ?? 0);
  const [draftMax, setDraftMax] = useState(valueMax ?? 100);
  const debouncedMin = useDebouncedValue(draftMin, debounceMs);
  const debouncedMax = useDebouncedValue(draftMax, debounceMs);

  useEffect(() => {
    setDraftMin(valueMin ?? 0);
  }, [valueMin]);

  useEffect(() => {
    setDraftMax(valueMax ?? 100);
  }, [valueMax]);

  useEffect(() => {
    if (debounceMs == null) return;
    if (debouncedMin !== valueMin) onDebouncedChangeMin?.(debouncedMin);
  }, [debouncedMin, valueMin, debounceMs, onDebouncedChangeMin]);

  useEffect(() => {
    if (debounceMs == null) return;
    if (debouncedMax !== valueMax) onDebouncedChangeMax?.(debouncedMax);
  }, [debouncedMax, valueMax, debounceMs, onDebouncedChangeMax]);

  return { draftMin, draftMax, setDraftMin, setDraftMax };
}
