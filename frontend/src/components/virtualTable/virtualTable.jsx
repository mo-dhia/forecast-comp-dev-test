import { memo } from 'react';
import { FixedSizeList } from 'react-window';
import { useVirtualTable } from './virtualTable.func';
import SkeletonRow from './skeletonRow';
import styles from './virtualTable.module.css';

/**
 * VirtualTable - A virtualized table component using react-window
 * @param {Object[]} data - Array of data items to display
 * @param {Object[]} columns - Column definitions with key, label, width, render
 * @param {number} rowHeight - Height of each row in pixels
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
  const { containerRef, focusedRowIndex, setFocusedRowIndex, handleKeyDown } = useVirtualTable(hasMore, isFetchingMore, onLoadMore, onRowClick, data.length);

  // Header row renderer
  const renderHeader = () => (
    <div className={styles.headerRow} role="row">
      {columns.map((col) => (
        <div 
          key={col.key} 
          className={styles.headerCell}
          role="columnheader"
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
    const isFocused = index === focusedRowIndex;
    
    // Render skeleton row if this is a placeholder
    if (item?._isSkeleton) {
      return (
        <div className={styles.row} style={style} role="row">
          {columns.map((col) => (
            <div 
              key={col.key}
              className={styles.cell}
              style={{ 
                width: col.width || 'auto', 
                flex: col.width ? 'none' : (col.flex || 1),
                flexShrink: 0
              }}
              role="gridcell"
            >
              <div className={styles.skeleton}></div>
            </div>
          ))}
        </div>
      );
    }
    
    const handleClick = () => {
      setFocusedRowIndex(index);
      onRowClick?.(item, index);
    };

    const handleKeyDownLocal = (e) => {
      handleKeyDown(e, data);
    };

    return (
      <div 
        className={`${styles.row} ${isFocused ? styles.focused : ''}`}
        style={style}
        onClick={handleClick}
        onKeyDown={handleKeyDownLocal}
        role="row"
        aria-rowindex={index + 2}
        aria-selected={isFocused}
        tabIndex={isFocused ? 0 : -1}
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
            role="gridcell"
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
    <div 
      className={styles.container} 
      ref={containerRef}
      role="grid"
      aria-label="Data table"
      aria-rowcount={data.length + 1}
      aria-colcount={columns.length}
    >
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
    </div>
  );
}

export default memo(VirtualTable);
