import { useCallback } from 'react';

/**
 * Custom hook for VirtualTable logic
 * @param {Object[]} data - Array of data items
 * @param {Object[]} columns - Column definitions
 * @param {Function} onRowClick - Row click handler
 */
export function useVirtualTable(data, columns, onRowClick) {
  // Data row renderer factory
  const createRowRenderer = useCallback(({ index, style }) => {
    const item = data[index];
    
    const handleClick = () => {
      onRowClick?.(item, index);
    };

    return {
      item,
      style,
      handleClick,
      index
    };
  }, [data, onRowClick]);

  return {
    createRowRenderer
  };
}
