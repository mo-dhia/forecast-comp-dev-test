import { memo } from "react";
import styles from "./filtersBar.module.css";
import { useUrlFilterParams } from "./filtersBar.func";
import Input from "../input/input";

/**
 * Reusable FiltersBar
 * @param {Object} props
 * @param {Array<{key:string,label:string,type:'text'|'select'|'number'|'range',placeholder?:string,options?:Array<{value:string,label:string}>,debounceMs?:number,rangeConfig?:Object}>} props.fields
 * @param {string[]} [props.resetPageKeys] - Keys that reset page to 1 on change
 * @param {string[]} [props.replaceKeys] - Keys that replace history instead of push
 */
function FiltersBar({ fields, resetPageKeys = [], replaceKeys = [] }) {
  const { params, setParam } = useUrlFilterParams({ resetPageKeys, replaceKeys });

  return (
    <div className={styles.bar}>
      {fields.map((f) => {
        let rangeConfig = f.rangeConfig;
        if (f.type === 'range' && f.rangeConfig) {
          rangeConfig = {
            ...f.rangeConfig,
            onDebouncedChangeMin: (val) => setParam('priceMin', val),
            onDebouncedChangeMax: (val) => setParam('priceMax', val)
          };
        }
        
        return (
          <div className={styles.field} key={f.key}>
            <Input
              className={f.type === 'range' ? undefined : styles.control}
              type={f.type}
              label={f.label}
              value={params[f.key] || ""}
              placeholder={f.placeholder}
              debounceMs={f.debounceMs}
              onChange={(val) => setParam(f.key, val)}
              onDebouncedChange={(val) => setParam(f.key, val)}
              inputMode={f.type === "number" ? "decimal" : undefined}
              rangeConfig={rangeConfig}
              disabled={f.disabled}
            >
              {f.type === "select" && (f.options || []).map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Input>
          </div>
        );
      })}
    </div>
  );
}

export default memo(FiltersBar);