import { useEffect, useState } from "react";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";

export function useInput({ value, debounceMs, onDebouncedChange, onChange }) {
  const [draft, setDraft] = useState(value ?? "");
  const debounced = useDebouncedValue(draft, debounceMs);

  useEffect(() => {
    setDraft(value ?? "");
  }, [value]);

  useEffect(() => {
    if (debounceMs == null) return;
    if (debounced !== value) onDebouncedChange?.(debounced);
  }, [debounced, value, debounceMs, onDebouncedChange]);

  const handleChange = (e) => {
    const v = e.target.value;
    if (debounceMs != null) {
      setDraft(v);
    } else {
      onChange?.(v);
    }
  };

  const displayValue = debounceMs != null ? draft : value ?? '';

  return { 
    draft, 
    setDraft, 
    handleChange, 
    displayValue 
  };
}


