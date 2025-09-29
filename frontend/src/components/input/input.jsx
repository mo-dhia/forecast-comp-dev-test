import styles from './input.module.css'
import { useDebouncedControlledInput } from './input.func'
import RangeSlider from '../rangeSlider/rangeSlider'

export default function Input({
  type = 'text',
  label,
  value,
  onChange,
  onDebouncedChange,
  debounceMs,
  placeholder,
  className,
  children,
  rangeConfig,
  ...rest
}) {
  const { draft, setDraft } = useDebouncedControlledInput(value, debounceMs, onDebouncedChange)
  const rootClass = className || styles.root

  const handleChange = (e) => {
    const v = e.target.value
    if (debounceMs != null) setDraft(v)
    else onChange?.(v)
  }

  if (type === 'range' && rangeConfig) {
    return (
      <div>
        {label ? <label className={styles.label}>{label}</label> : null}
        <RangeSlider
          min={rangeConfig.min}
          max={rangeConfig.max}
          step={rangeConfig.step}
          valueMin={rangeConfig.valueMin}
          valueMax={rangeConfig.valueMax}
          onChangeMin={rangeConfig.onChangeMin}
          onChangeMax={rangeConfig.onChangeMax}
          onDebouncedChangeMin={rangeConfig.onDebouncedChangeMin}
          onDebouncedChangeMax={rangeConfig.onDebouncedChangeMax}
          debounceMs={debounceMs}
        />
      </div>
    )
  }

  return (
    <div>
      {label ? <label className={styles.label}>{label}</label> : null}
      {type === 'select' ? (
        <select className={rootClass} value={value ?? ''} onChange={(e) => onChange?.(e.target.value)} {...rest}>
          {children}
        </select>
      ) : (
        <input className={rootClass} type={type} value={debounceMs != null ? draft : value ?? ''} onChange={handleChange} placeholder={placeholder} {...rest} />
      )}
    </div>
  )
}


