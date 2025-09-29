import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useItems, useGlobalFacets } from "../utils/api/services/useItems";

export function useDataExplorer() {
  const [sp] = useSearchParams();
  const paramsObj = useMemo(() => Object.fromEntries(sp.entries()), [sp]);
  const page = Number(paramsObj.page || 1);
  const pageSize = Number(paramsObj.pageSize || 10);

  const query = useItems({ ...paramsObj, page, pageSize }, { keepPreviousData: true });
  const facetsQuery = useGlobalFacets();

  const categoryOptions = useMemo(() => {
    const opts = [{ value: '', label: 'All' }];
    const keys = Object.keys(facetsQuery.data?.facets?.category || {});
    for (const c of keys) opts.push({ value: c, label: c });
    return opts;
  }, [facetsQuery.data]);

  const taxOptions = useMemo(() => {
    const opts = [{ value: '', label: 'All' }];
    const keys = Object.keys(facetsQuery.data?.facets?.taxCategory || {});
    for (const t of keys) opts.push({ value: t, label: t });
    return opts;
  }, [facetsQuery.data]);

  const priceRange = { min: 0, max: 2000, step: 1 };

  const fields = useMemo(() => {
    const priceMin = Number(paramsObj.priceMin) || priceRange.min;
    const priceMax = Number(paramsObj.priceMax) || priceRange.max;
    
    return [
      { key: 'q', label: 'Search', type: 'text', placeholder: 'Search…', debounceMs: 300 },
      { key: 'category', label: 'Category', type: 'select', options: categoryOptions },
      { key: 'taxCategory', label: 'Tax', type: 'select', options: taxOptions },
      { key: 'inStock', label: 'In stock', type: 'select', options: [
        { value: '', label: 'Any' },
        { value: 'true', label: 'Yes' },
        { value: 'false', label: 'No' },
      ] },
      {
        key: 'price',
        label: 'Price',
        type: 'range',
        debounceMs: 300,
        rangeConfig: {
          min: priceRange.min,
          max: priceRange.max,
          step: priceRange.step,
          valueMin: priceMin,
          valueMax: priceMax,
          onDebouncedChangeMin: (val) => {},
          onDebouncedChangeMax: (val) => {}
        }
      }
    ];
  }, [categoryOptions, taxOptions, paramsObj.priceMin, paramsObj.priceMax, priceRange]);

  return { query, facetsQuery, fields };
}


