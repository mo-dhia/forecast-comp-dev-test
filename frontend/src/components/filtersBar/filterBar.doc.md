# FiltersBar Component

## Overview
A highly reusable, configuration-driven filter bar that renders a collection of input controls and manages their state through URL search parameters. It's the primary filtering interface for the Data Explorer.

## Purpose
- Provide a unified filtering interface driven by configuration
- Sync all filter values with URL search parameters for shareable/bookmarkable state
- Support multiple input types (text, select, number, range) through a single API
- Handle smart URL updates (reset page on filter change, replace vs push history)

## Files
- `filtersBar.jsx` - Main component rendering configured fields
- `filtersBar.func.js` - URL parameter management logic (`useUrlFilterParams` hook)
- `filtersBar.module.css` - Responsive grid layout and input styling

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fields` | `Array<FieldConfig>` | - | Array of field configurations (see below) |
| `resetPageKeys` | `string[]` | `[]` | Keys that reset `page` to 1 when changed |
| `replaceKeys` | `string[]` | `[]` | Keys that replace history instead of pushing |

### FieldConfig Structure
```typescript
{
  key: string,              // URL param key (e.g., 'q', 'category')
  label: string,            // Display label
  type: 'text' | 'select' | 'number' | 'range',
  placeholder?: string,     // For text/number inputs
  options?: Array<{         // For select inputs
    value: string,
    label: string
  }>,
  debounceMs?: number,      // Debounce delay for this field
  rangeConfig?: object,     // For range inputs (see below)
  disabled?: boolean        // Disable the input
}
```

### RangeConfig Structure (for type='range')
```typescript
{
  min: number,
  max: number,
  step: number,
  valueMin: number,
  valueMax: number
  // onDebouncedChangeMin/Max are auto-wired by FiltersBar
}
```

## Usage Example

```jsx
import FiltersBar from '../components/filtersBar/filtersBar';

const fields = [
  {
    key: 'q',
    label: 'Search',
    type: 'text',
    placeholder: 'Search…',
    debounceMs: 300
  },
  {
    key: 'category',
    label: 'Category',
    type: 'select',
    options: [
      { value: '', label: 'All' },
      { value: 'electronics', label: 'Electronics' },
      { value: 'clothing', label: 'Clothing' }
    ]
  },
  {
    key: 'price',
    label: 'Price',
    type: 'range',
    debounceMs: 300,
    rangeConfig: {
      min: 0,
      max: 3000,
      step: 1,
      valueMin: priceMin,
      valueMax: priceMax
    }
  }
];

<FiltersBar
  fields={fields}
  resetPageKeys={['q', 'category', 'priceMin', 'priceMax']}
  replaceKeys={['q', 'priceMin', 'priceMax']}
/>
```

## Logic Hook: `useUrlFilterParams`
Located in `filtersBar.func.js`, this hook:
- **Reads**: Extracts all URL params into a memoized object
- **Writes**: Updates URL params with `setParam(key, value)`
- **Smart Reset**: Automatically sets `page=1` for specified keys
- **History Management**: Uses `replace` for specified keys to avoid polluting history

### Hook API
```javascript
const { params, setParam } = useUrlFilterParams({
  resetPageKeys: ['q', 'category'],
  replaceKeys: ['q']  // Don't push history for search
});

// params: { q: 'laptop', category: 'electronics', page: '2' }
// setParam('q', 'phone') → URL updates, page resets to 1, replaces history
```

## Layout & Styling
- **Desktop Grid**: `1.5fr repeat(3, minmax(0, 9.38vw)) 1.5fr`
  - Search and Price get more space (1.5fr each)
  - Other inputs: equal columns
- **Tablet**: 2 columns
- **Mobile**: 1 column (stacked)
- **Z-index Management**: Ensures select dropdowns render correctly
- **Custom Select Arrows**: SVG arrows with proper alignment

## Performance Optimizations
1. **React.memo**: Prevents re-renders when parent updates
2. **Stable References**: Memoized `params` object from `useUrlFilterParams`
3. **Debouncing**: Per-field debounce configuration

## Integration Pattern
Typically configured in a page's `.func.js` file:

```jsx
// dataExplorer.func.js
const fields = useMemo(() => [
  { key: 'q', label: 'Search', type: 'text', debounceMs: 300 },
  { key: 'category', label: 'Category', type: 'select', options: categoryOptions }
], [categoryOptions]);

// DataExplorer.jsx
<FiltersBar fields={fields} resetPageKeys={[...]} replaceKeys={[...]} />
```

## Key Features
1. **URL-Backed State**: All filters persist in URL (shareable, bookmarkable)
2. **Declarative Configuration**: Define fields, not implementation
3. **Type Flexibility**: Supports all input types through single interface
4. **Smart Pagination**: Auto-reset page on filter change
5. **History-Aware**: Control when to push vs replace history
6. **Responsive**: Adapts layout for all screen sizes
7. **Accessible**: Proper labels, semantic HTML
8. **Loading States**: Support for disabled state during data fetching
