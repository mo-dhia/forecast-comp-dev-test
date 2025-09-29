import { useEffect, useState } from "react";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";

export function useDebouncedControlledInput(value, delayMs, onDebouncedChange) {
  const [draft, setDraft] = useState(value ?? "");
  const debounced = useDebouncedValue(draft, delayMs);

  useEffect(() => {
    setDraft(value ?? "");
  }, [value]);

  useEffect(() => {
    if (delayMs == null) return;
    if (debounced !== value) onDebouncedChange?.(debounced);
  }, [debounced, value, delayMs, onDebouncedChange]);

  return { draft, setDraft };
}


