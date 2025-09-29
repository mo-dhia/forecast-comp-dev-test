import { useEffect, useRef } from 'react';

/**
 * Custom hook for VirtualTable logic
 * @param {boolean} hasMore - Whether there is more data to load
 * @param {boolean} isFetchingMore - Whether currently fetching more data
 * @param {Function} onLoadMore - Callback to load more data
 */
export function useVirtualTable(hasMore, isFetchingMore, onLoadMore) {
  const containerRef = useRef(null);
  
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

  return {
    containerRef
  };
}
