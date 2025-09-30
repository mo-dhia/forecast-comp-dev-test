import styles from './rangeSlider.module.css';
import { useRangeSlider } from './rangeSlider.func';

export default function RangeSlider({ min = 0, max = 100, valueMin, valueMax, onChangeMin, onChangeMax, onDebouncedChangeMin, onDebouncedChangeMax, step = 1, debounceMs, disabled = false }) {
  const { minRef, maxRef, localMin, localMax, handleMinChange, handleMaxChange, minPercent, maxPercent } = useRangeSlider({ min, max, valueMin, valueMax, step, debounceMs, onChangeMin, onChangeMax, onDebouncedChangeMin, onDebouncedChangeMax });

  return (
    <div className={`${styles.container} ${disabled ? styles.disabled : ''}`}>
      <span className={styles.value}>${localMin.toFixed(0)}</span>
      <div className={styles.sliderContainer}>
        <div className={styles.track} />
        <div className={styles.range} style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }} />
        <input ref={minRef} type="range" min={min} max={max} value={localMin} step={step} onChange={handleMinChange} className={styles.thumb} style={{ zIndex: localMin > max - 100 ? 5 : 3 }} disabled={disabled} />
        <input ref={maxRef} type="range" min={min} max={max} value={localMax} step={step} onChange={handleMaxChange} className={styles.thumb} disabled={disabled} />
      </div>
      <span className={styles.value}>${localMax.toFixed(0)}</span>
    </div>
  );
}
