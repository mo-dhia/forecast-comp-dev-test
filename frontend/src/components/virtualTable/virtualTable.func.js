import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Custom hook for VirtualTable logic
 * @param {boolean} hasMore - Whether there is more data to load
 * @param {boolean} isFetchingMore - Whether currently fetching more data
 * @param {Function} onLoadMore - Callback to load more data
 * @param {Function} onRowClick - Callback when a row is clicked
 * @param {number} dataLength - Number of data items
 */
export function useVirtualTable(hasMore, isFetchingMore, onLoadMore, onRowClick, dataLength) {
  const containerRef = useRef(null);
  const [focusedRowIndex, setFocusedRowIndex] = useState(-1);
  
  // Listen to window scroll to trigger load more
  useEffect(() => {
    const handleScroll = () => {
      if (!hasMore || isFetchingMore || !containerRef.current) return;
      
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const scrollBottom = window.innerHeight;
      const containerBottom = rect.bottom;
      
      // Load more when container bottom is 500px above viewport bottom (earlier trigger)
      if (containerBottom - scrollBottom < 500) {
        onLoadMore?.();
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    // Check immediately in case we need to load
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, isFetchingMore, onLoadMore]);

  // Keyboard navigation handler
  const handleKeyDown = useCallback((e, data) => {
    if (!data || dataLength === 0) return;

    switch(e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedRowIndex(prev => Math.min(prev + 1, dataLength - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedRowIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Home':
        e.preventDefault();
        setFocusedRowIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setFocusedRowIndex(dataLength - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedRowIndex >= 0 && focusedRowIndex < dataLength) {
          onRowClick?.(data[focusedRowIndex], focusedRowIndex);
        }
        break;
      default:
        break;
    }
  }, [dataLength, focusedRowIndex, onRowClick]);

  return {
    containerRef,
    focusedRowIndex,
    setFocusedRowIndex,
    handleKeyDown
  };
}
