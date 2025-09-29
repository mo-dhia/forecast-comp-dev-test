import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * URL-backed filter params with reset and replace behaviors.
 * @param {{ resetPageKeys?: string[], replaceKeys?: string[] }} [options]
 */
export function useUrlFilterParams(options = {}) {
  const { resetPageKeys = [], replaceKeys = [] } = options;
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useMemo(() => {
    const obj = Object.fromEntries(searchParams.entries());
    return obj;
  }, [searchParams]);

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value === undefined || value === null || value === "") next.delete(key);
    else next.set(key, String(value));
    if (resetPageKeys.includes(key)) next.set("page", "1");
    const replace = replaceKeys.includes(key);
    setSearchParams(next, { replace });
  };

  return { params, setParam };
}


