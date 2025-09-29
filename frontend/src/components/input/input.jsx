import styles from './input.module.css'
import { useDebouncedControlledInput } from './input.func'

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
  ...rest
}) {
  const { draft, setDraft } = useDebouncedControlledInput(value, debounceMs, onDebouncedChange)
  const rootClass = className || styles.root

  const handleChange = (e) => {
    const v = e.target.value
    if (debounceMs != null) setDraft(v)
    else onChange?.(v)
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


