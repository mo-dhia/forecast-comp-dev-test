# VirtualTable Component

## Overview
A high-performance, accessible virtualized table built on `react-window` that renders large datasets efficiently with infinite scroll, keyboard navigation, ARIA support, and loading skeletons.

## Purpose
- Render thousands of rows without performance degradation
- Provide smooth scrolling with page-level scroll (not internal)
- Support infinite scroll pagination without external libraries
- Ensure full keyboard accessibility (arrow keys, Home/End, Enter)
- Display loading states with skeleton placeholders

## Files
- `virtualTable.jsx` - Main component with `FixedSizeList` integration
- `virtualTable.func.js` - Logic for scroll detection, keyboard navigation, focus management
- `virtualTable.module.css` - Responsive table styles with horizontal scroll on mobile
- `skeletonRow.jsx` - Skeleton placeholder component
- `skeletonRow.module.css` - Shimmer animation styles

## Core Technology: `react-window`
- **Library**: `react-window` (v1.8.10)
- **Component**: `FixedSizeList` - Renders only visible rows
- **Virtualization**: Only DOM nodes in viewport + overscan are rendered
- **Performance**: Handles 10,000+ rows smoothly

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `Array<object>` | `[]` | Array of data items (may include `_isSkeleton` placeholders) |
| `columns` | `Array<ColumnConfig>` | `[]` | Column definitions (see below) |
| `rowHeight` | `number` | `48` | Height of each row in pixels |
| `isLoading` | `boolean` | `false` | Initial loading state (shows 10 skeletons) |
| `isFetchingMore` | `boolean` | `false` | Loading more data (inline skeletons) |
| `hasMore` | `boolean` | `false` | Whether more data is available |
| `onLoadMore` | `function` | - | Callback to load next page |
| `onRowClick` | `function` | - | Callback when row is clicked/activated |

### ColumnConfig Structure
```typescript
{
  key: string,              // Data property key
  label: string,            // Column header text
  width?: string,           // Fixed width (e.g., '30%', '200px')
  flex?: number,            // Flex grow (if no width)
  render?: (value, item, index) => ReactNode  // Custom cell renderer
}
```

## Usage Example

```jsx
import VirtualTable from '../components/virtualTable/virtualTable';

const columns = [
  {
    key: 'name',
    label: 'Name',
    width: '30%',
    render: (value) => <strong>{value}</strong>
  },
  {
    key: 'price',
    label: 'Price',
    width: '15%',
    render: (value) => `$${Number(value).toFixed(2)}`
  },
  {
    key: 'category',
    label: 'Category',
    width: '20%'
  }
];

<VirtualTable
  data={items}
  columns={columns}
  rowHeight={48}
  isLoading={isInitialLoad}
  isFetchingMore={isLoadingMore && items.length > 0}
  hasMore={items.length < totalCount}
  onLoadMore={loadNextPage}
  onRowClick={(item, index) => console.log('Clicked:', item)}
/>
```

## Infinite Scroll Implementation

### Scroll Detection
Located in `virtualTable.func.js`:

```javascript
useEffect(() => {
  const handleScroll = () => {
    if (!hasMore || isFetchingMore || !containerRef.current) return;
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const scrollBottom = window.innerHeight;
    const containerBottom = rect.bottom;
    
    // Trigger 500px before reaching bottom
    if (containerBottom - scrollBottom < 500) {
      onLoadMore?.();
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Check immediately
  
  return () => window.removeEventListener('scroll', handleScroll);
}, [hasMore, isFetchingMore, onLoadMore]);
```

### Scroll Jump Prevention
Key technique: **Inline skeleton placeholders that get replaced 1:1 by data**

In `dataExplorer.func.js`:
```javascript
// When loading more, append skeleton placeholders
const itemsWithSkeletons = useMemo(() => {
  if (!isLoadingMore || allItems.length === 0) return allItems;
  
  const skeletons = Array.from({ length: pageSize }, (_, i) => ({
    id: `skeleton-${i}`,
    _isSkeleton: true
  }));
  return [...allItems, ...skeletons];
}, [allItems, isLoadingMore, pageSize]);

// When new data arrives, remove skeletons and add real items
useEffect(() => {
  if (query.data && page > 1) {
    setAllItems(prev => {
      const realItems = prev.filter(item => !item._isSkeleton);
      const newItems = query.data.items || [];
      // Avoid duplicates
      const existingIds = new Set(realItems.map(item => item.id));
      const uniqueNewItems = newItems.filter(item => !existingIds.has(item.id));
      return [...realItems, ...uniqueNewItems];
    });
  }
}, [query.data, page]);
```

**Why this works**: Total row count stays constant during data fetch, preventing document height changes and scroll jumps.

## Keyboard Navigation

### Supported Keys
| Key | Action |
|-----|--------|
| **ArrowDown** | Move focus to next row |
| **ArrowUp** | Move focus to previous row |
| **Home** | Jump to first row |
| **End** | Jump to last row |
| **Enter** | Activate focused row (calls `onRowClick`) |
| **Tab** | Focus first row (if none focused), then exit table |

### Implementation Details
```javascript
const handleKeyDown = useCallback((e, data) => {
  switch(e.key) {
    case 'ArrowDown':
      e.preventDefault();
      e.stopPropagation();  // Prevent page scroll
      setFocusedRowIndex(Math.min(focusedRowIndex + 1, dataLength - 1));
      break;
    // ... other cases
  }
}, [focusedRowIndex, dataLength]);
```

### Focus Management
- **DOM Focus**: `focusedRowRef.current.focus({ preventScroll: true })`
- **Scroll Into View**: `focusedRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })`
- **Roving Tabindex**: Only focused row (or first row) has `tabIndex={0}`, others have `tabIndex={-1}`

## Accessibility (ARIA)

### Table Structure
```jsx
<div role="grid" aria-label="Data table" aria-rowcount={...} aria-colcount={...}>
  <div role="row">
    <div role="columnheader">Name</div>
    <div role="columnheader">Price</div>
  </div>
  <div role="row" aria-rowindex={2} aria-selected={true} tabIndex={0}>
    <div role="gridcell">Laptop</div>
    <div role="gridcell">$999</div>
  </div>
</div>
```

### Key ARIA Attributes
- `role="grid"` - Identifies as data grid
- `aria-label="Data table"` - Screen reader label
- `aria-rowcount` - Total row count (including header)
- `aria-colcount` - Total column count
- `aria-rowindex` - Row position (1-based, header is 1)
- `aria-selected` - Whether row is focused
- `tabIndex` - Roving tabindex for keyboard nav

## Loading States

### Initial Load (10 Skeleton Rows)
```jsx
if (isLoading) {
  return (
    <div className={styles.container}>
      {renderHeader()}
      <div className={styles.skeletonContainer}>
        {Array.from({ length: 10 }).map((_, idx) => (
          <SkeletonRow key={idx} columns={columns} />
        ))}
      </div>
    </div>
  );
}
```

### Loading More (Inline Skeletons)
Skeleton items are added to `data` array with `_isSkeleton: true`:
```jsx
const Row = ({ index, style }) => {
  const item = data[index];
  
  if (item?._isSkeleton) {
    return (
      <div className={styles.row} style={style}>
        {columns.map((col) => (
          <div className={styles.cell}>
            <div className={styles.skeleton}></div>
          </div>
        ))}
      </div>
    );
  }
  // ... normal row rendering
};
```

### Skeleton Animation
CSS shimmer effect in `skeletonRow.module.css`:
```css
.skeleton {
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0.05) 25%,
    rgba(255,255,255,0.1) 50%,
    rgba(255,255,255,0.05) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

## Responsive Design

### Desktop (1920px base)
- Text wraps with `word-wrap: break-word`
- Fixed column widths using percentages
- No horizontal scroll
- Full table visible

### Tablet (1024px)
- Horizontal scroll enabled (`overflow-x: auto`)
- Min-width on rows: `68.36vw` (700px equivalent)
- Text truncates with ellipsis (`white-space: nowrap`)
- Touch-friendly row heights

### Mobile (393px)
- Horizontal scroll with wider min-width: `152.67vw` (600px equivalent)
- Larger text and spacing
- Touch-optimized

### React-Window Override
Forces min-width on inner container:
```css
.container > div:last-child > div {
  min-width: 100% !important; /* Desktop */
}

@media (max-width: 1024px) {
  .container > div:last-child > div {
    min-width: 700px !important;
  }
}
```

## Styling Highlights

### Row States
- **Default**: Transparent background
- **Hover**: `background: rgba(255,255,255,0.02)`
- **Focused**: Blue outline + lighter background
  ```css
  .row.focused {
    outline: 0.10vw solid var(--color-primary);
    outline-offset: -0.10vw;
    background: rgba(255,255,255,0.04);
  }
  ```
- **Click**: Sets focused state immediately

### Empty State
```jsx
if (!data.length) {
  return (
    <div className={styles.container}>
      {renderHeader()}
      <div className={styles.empty}>No data available</div>
    </div>
  );
}
```

## Performance Optimizations

1. **Virtualization**: Only renders visible rows (+ overscan of 10)
2. **React.memo**: Component wrapped to prevent unnecessary re-renders
3. **Page-Level Scroll**: Uses window scroll instead of internal scrolling
4. **Fixed Row Height**: Enables efficient layout calculations
5. **Skeleton 1:1 Replacement**: Prevents scroll jumps
6. **Stable Column Definitions**: Memoized in parent component

## Integration Example

From `DataExplorer.jsx`:
```jsx
const columns = useMemo(() => [
  { key: 'name', label: 'Name', width: '30%', render: (v) => <strong>{v}</strong> },
  { key: 'price', label: 'Price', width: '15%', render: (v) => `$${v.toFixed(2)}` },
  // ... more columns
], []);

<VirtualTable
  data={data?.items || []}
  columns={columns}
  rowHeight={48}
  isLoading={isLoading && !data}
  isFetchingMore={isFetching && data}
  hasMore={data ? (data.items?.length < data.total) : false}
  onLoadMore={loadMore}
  onRowClick={(item) => console.log('Clicked:', item)}
/>
```

## Key Features
1. **High Performance**: Handles 10,000+ rows smoothly
2. **Infinite Scroll**: Manual implementation, no extra libraries
3. **No Scroll Jumps**: Skeleton placeholders maintain document height
4. **Full Keyboard Support**: Arrow keys, Home/End, Enter
5. **Accessible**: Complete ARIA grid implementation
6. **Responsive**: Horizontal scroll on mobile, text wrap on desktop
7. **Loading States**: Initial skeletons + inline loading indicators
8. **Focus Management**: Roving tabindex, visual focus indicators
9. **Page Scroll**: Natural browser scrolling, not trapped
10. **Customizable**: Flexible column definitions with custom renderers

## Common Issues & Solutions

### Issue: Horizontal scroll on desktop
**Solution**: Ensure column widths sum to 100%, remove padding from `.row`, add to `:first-child/:last-child` cells

### Issue: Scroll position jumps when loading more
**Solution**: Use inline skeleton placeholders that get replaced 1:1 by data, maintaining constant row count

### Issue: Arrow keys scroll the page
**Solution**: `e.preventDefault()` and `e.stopPropagation()` in keyboard handler

### Issue: Can't tab to table rows
**Solution**: Roving tabindex pattern - only focused row (or first) has `tabIndex={0}`

### Issue: Focus visible after tabbing away
**Solution**: `onBlur` handler checks if focus left table entirely, then clears `focusedRowIndex`
