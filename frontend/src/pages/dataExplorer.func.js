import { useMemo, useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useItems, useGlobalFacets, useMetadata } from "../utils/api/services/useItems";

export function useDataExplorer() {
  const [sp] = useSearchParams();
  const paramsObj = useMemo(() => Object.fromEntries(sp.entries()), [sp]);
  const [page, setPage] = useState(1);
  const [allItems, setAllItems] = useState([]);
  const [total, setTotal] = useState(0);
  const pageSize = 25;

  // Reset page and items when filters change
  const filterKey = JSON.stringify({ ...paramsObj, page: undefined, pageSize: undefined });
  useEffect(() => {
    setPage(1);
    setAllItems([]);
  }, [filterKey]);

  const query = useItems({ ...paramsObj, page, pageSize }, { 
    keepPreviousData: false
  });
  
  // Accumulate data when new page loads
  useEffect(() => {
    if (query.data) {
      if (page === 1) {
        setAllItems(query.data.items || []);
      } else {
        setAllItems(prev => {
          const newItems = query.data.items || [];
          // Avoid duplicates
          const existingIds = new Set(prev.map(item => item.id));
          const uniqueNewItems = newItems.filter(item => !existingIds.has(item.id));
          return [...prev, ...uniqueNewItems];
        });
      }
      setTotal(query.data.total || 0);
    }
  }, [query.data, page]);
  
  const facetsQuery = useGlobalFacets();
  const metadataQuery = useMetadata();
  
  const loadMore = useCallback(() => {
    if (!query.isFetching && allItems.length < total) {
      setPage(p => p + 1);
    }
  }, [query.isFetching, allItems.length, total]);
  
  // Return accumulated data instead of current page data
  const accumulatedQuery = {
    ...query,
    data: allItems.length > 0 || query.data ? { items: allItems, total } : undefined
  };

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

  const priceRange = useMemo(() => 
    metadataQuery.data?.priceRange || { min: 0, max: 200, step: 1 },
    [metadataQuery.data]
  );

  const fields = useMemo(() => {
    const priceMin = Number(paramsObj.priceMin) || priceRange.min;
    const priceMax = Number(paramsObj.priceMax) || priceRange.max;
    const isLoadingFilters = facetsQuery.isLoading || metadataQuery.isLoading;
    
    return [
      { key: 'q', label: 'Search', type: 'text', placeholder: 'Search…', debounceMs: 300, disabled: isLoadingFilters },
      { key: 'category', label: 'Category', type: 'select', options: categoryOptions, disabled: isLoadingFilters },
      { key: 'taxCategory', label: 'Tax', type: 'select', options: taxOptions, disabled: isLoadingFilters },
      { key: 'inStock', label: 'In stock', type: 'select', options: [
        { value: '', label: 'Any' },
        { value: 'true', label: 'Yes' },
        { value: 'false', label: 'No' },
      ], disabled: isLoadingFilters },
      {
        key: 'price',
        label: 'Price',
        type: 'range',
        debounceMs: 300,
        disabled: isLoadingFilters,
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
  }, [categoryOptions, taxOptions, paramsObj.priceMin, paramsObj.priceMax, priceRange, facetsQuery.isLoading, metadataQuery.isLoading]);

  return { query: accumulatedQuery, facetsQuery, fields, loadMore };
}


