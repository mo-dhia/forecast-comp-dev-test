import { useRef } from 'react';
import styles from './rangeSlider.module.css';
import { useDebouncedRangeInput } from './rangeSlider.func';

export default function RangeSlider({ min = 0, max = 100, valueMin, valueMax, onChangeMin, onChangeMax, onDebouncedChangeMin, onDebouncedChangeMax, step = 1, debounceMs }) {
  const { draftMin, draftMax, setDraftMin, setDraftMax } = useDebouncedRangeInput(valueMin, valueMax, debounceMs, onDebouncedChangeMin, onDebouncedChangeMax);
  const minRef = useRef(null);
  const maxRef = useRef(null);

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

  return (
    <div className={styles.container}>
      <span className={styles.value}>${localMin.toFixed(0)}</span>
      <div className={styles.sliderContainer}>
        <div className={styles.track} />
        <div className={styles.range} style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }} />
        <input ref={minRef} type="range" min={min} max={max} value={localMin} step={step} onChange={handleMinChange} className={styles.thumb} style={{ zIndex: localMin > max - 100 ? 5 : 3 }} />
        <input ref={maxRef} type="range" min={min} max={max} value={localMax} step={step} onChange={handleMaxChange} className={styles.thumb} />
      </div>
      <span className={styles.value}>${localMax.toFixed(0)}</span>
    </div>
  );
}
