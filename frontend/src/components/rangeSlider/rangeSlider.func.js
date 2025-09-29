import { useState, useEffect, useRef } from 'react';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';

export function useRangeSlider({ min, max, valueMin, valueMax, step, debounceMs, onChangeMin, onChangeMax, onDebouncedChangeMin, onDebouncedChangeMax }) {
  const [draftMin, setDraftMin] = useState(valueMin ?? min);
  const [draftMax, setDraftMax] = useState(valueMax ?? max);
  const debouncedMin = useDebouncedValue(draftMin, debounceMs);
  const debouncedMax = useDebouncedValue(draftMax, debounceMs);
  const minRef = useRef(null);
  const maxRef = useRef(null);

  useEffect(() => {
    setDraftMin(valueMin ?? min);
  }, [valueMin, min]);

  useEffect(() => {
    setDraftMax(valueMax ?? max);
  }, [valueMax, max]);

  useEffect(() => {
    if (debounceMs == null) return;
    if (debouncedMin !== valueMin) onDebouncedChangeMin?.(debouncedMin);
  }, [debouncedMin, valueMin, debounceMs, onDebouncedChangeMin]);

  useEffect(() => {
    if (debounceMs == null) return;
    if (debouncedMax !== valueMax) onDebouncedChangeMax?.(debouncedMax);
  }, [debouncedMax, valueMax, debounceMs, onDebouncedChangeMax]);

  const localMin = debounceMs != null ? draftMin : valueMin ?? min;
  const localMax = debounceMs != null ? draftMax : valueMax ?? max;

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), localMax - step);
    if (debounceMs != null) {
      setDraftMin(value);
    } else {
      onChangeMin?.(value);
    }
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), localMin + step);
    if (debounceMs != null) {
      setDraftMax(value);
    } else {
      onChangeMax?.(value);
    }
  };

  const minPercent = ((localMin - min) / (max - min)) * 100;
  const maxPercent = ((localMax - min) / (max - min)) * 100;

  return {
    minRef,
    maxRef,
    localMin,
    localMax,
    handleMinChange,
    handleMaxChange,
    minPercent,
    maxPercent
  };
}
