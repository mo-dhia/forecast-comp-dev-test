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
  const focusedRowRef = useRef(null);
  
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

    let newIndex = focusedRowIndex;
    
    switch(e.key) {
      case 'ArrowDown':
        e.preventDefault();
        e.stopPropagation();
        newIndex = Math.min(focusedRowIndex + 1, dataLength - 1);
        setFocusedRowIndex(newIndex);
        break;
      case 'ArrowUp':
        e.preventDefault();
        e.stopPropagation();
        newIndex = Math.max(focusedRowIndex - 1, 0);
        setFocusedRowIndex(newIndex);
        break;
      case 'Home':
        e.preventDefault();
        e.stopPropagation();
        setFocusedRowIndex(0);
        break;
      case 'End':
        e.preventDefault();
        e.stopPropagation();
        setFocusedRowIndex(dataLength - 1);
        break;
      case 'Enter':
        e.preventDefault();
        e.stopPropagation();
        if (focusedRowIndex >= 0 && focusedRowIndex < dataLength) {
          onRowClick?.(data[focusedRowIndex], focusedRowIndex);
        }
        break;
      default:
        break;
    }
  }, [dataLength, focusedRowIndex, onRowClick]);

  // Scroll focused row into view and set DOM focus
  useEffect(() => {
    if (focusedRowRef.current && focusedRowIndex >= 0) {
      // Set DOM focus to prevent browser from handling arrow keys
      focusedRowRef.current.focus({ preventScroll: true });
      
      // Then smoothly scroll into view
      focusedRowRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [focusedRowIndex]);

  return {
    containerRef,
    focusedRowIndex,
    setFocusedRowIndex,
    handleKeyDown,
    focusedRowRef
  };
}
