import { memo, useEffect, useRef } from 'react';
import { FixedSizeList } from 'react-window';
import { useVirtualTable } from './virtualTable.func';
import SkeletonRow from './skeletonRow';
import styles from './virtualTable.module.css';

/**
 * VirtualTable - A virtualized table component using react-window
 * @param {Object[]} data - Array of data items to display
 * @param {Object[]} columns - Column definitions with key, label, width, render
 * @param {number} rowHeight - Height of each row in pixels
 * @param {number} height - Total height of the table container
 * @param {boolean} isLoading - Loading state
 * @param {boolean} isFetchingMore - Fetching more data state
 * @param {boolean} hasMore - Whether there is more data to load
 * @param {Function} onLoadMore - Callback to load more data
 * @param {Function} onRowClick - Callback when a row is clicked
 */
function VirtualTable({ 
  data = [], 
  columns = [], 
  rowHeight = 48, 
  isLoading = false,
  isFetchingMore = false,
  hasMore = false,
  onLoadMore,
  onRowClick 
}) {
  const { createRowRenderer } = useVirtualTable(data, columns, onRowClick);
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

  // Header row renderer
  const renderHeader = () => (
    <div className={styles.headerRow}>
      {columns.map((col) => (
        <div 
          key={col.key} 
          className={styles.headerCell}
          style={{ 
            width: col.width || 'auto', 
            flex: col.width ? 'none' : (col.flex || 1),
            flexShrink: 0
          }}
        >
          {col.label}
        </div>
      ))}
    </div>
  );

  // Data row renderer
  const Row = ({ index, style }) => {
    const item = data[index];
    
    const handleClick = () => {
      onRowClick?.(item, index);
    };

    return (
      <div 
        className={styles.row} 
        style={style}
        onClick={handleClick}
        role="row"
        aria-rowindex={index + 2}
        tabIndex={0}
      >
        {columns.map((col) => (
          <div 
            key={col.key}
            className={styles.cell}
            style={{ 
              width: col.width || 'auto', 
              flex: col.width ? 'none' : (col.flex || 1),
              flexShrink: 0
            }}
            role="cell"
          >
            {col.render ? col.render(item[col.key], item, index) : item[col.key]}
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className={styles.container} ref={containerRef}>
        {renderHeader()}
        <div className={styles.skeletonContainer}>
          {Array.from({ length: 10 }).map((_, idx) => (
            <SkeletonRow key={idx} columns={columns} />
          ))}
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className={styles.container} ref={containerRef}>
        {renderHeader()}
        <div className={styles.empty}>No data available</div>
      </div>
    );
  }

  const tableHeight = data.length * rowHeight;

  return (
    <div className={styles.container} ref={containerRef}>
      {renderHeader()}
      <FixedSizeList
        height={tableHeight}
        itemCount={data.length}
        itemSize={rowHeight}
        width="100%"
        overscanCount={10}
        style={{ overflow: 'visible' }}
      >
        {Row}
      </FixedSizeList>
      {isFetchingMore && (
        <div className={styles.skeletonContainer}>
          {Array.from({ length: 5 }).map((_, idx) => (
            <SkeletonRow key={idx} columns={columns} />
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(VirtualTable);
