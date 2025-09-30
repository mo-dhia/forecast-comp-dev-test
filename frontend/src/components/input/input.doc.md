# Input Component

## Overview
A versatile, reusable input component that supports multiple input types (text, number, select, range) with optional debouncing capabilities. It serves as the foundation for all form controls in the application.

## Purpose
- Provide a unified interface for all input types
- Handle debounced input changes to optimize performance and reduce API calls
- Integrate seamlessly with URL-backed state management
- Maintain consistent styling across the application

## Files
- `input.jsx` - Main component with conditional rendering for different input types
- `input.func.js` - Logic layer handling draft state, debouncing, and change handlers
- `input.module.css` - Responsive styles using vw units

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'text' \| 'number' \| 'select' \| 'range'` | `'text'` | Input type to render |
| `label` | `string` | - | Label text displayed above the input |
| `value` | `string \| number` | - | Controlled value |
| `onChange` | `function` | - | Immediate change handler (non-debounced) |
| `onDebouncedChange` | `function` | - | Debounced change handler |
| `debounceMs` | `number` | - | Debounce delay in milliseconds |
| `placeholder` | `string` | - | Placeholder text |
| `className` | `string` | - | Custom CSS class override |
| `children` | `ReactNode` | - | For `select` type: `<option>` elements |
| `rangeConfig` | `object` | - | Configuration for range slider (see RangeSlider docs) |
| `disabled` | `boolean` | `false` | Disable input |

## Usage Examples

### Basic Text Input
```jsx
<Input
  type="text"
  label="Search"
  value={searchTerm}
  onChange={setSearchTerm}
  placeholder="Search items..."
/>
```

### Debounced Search Input
```jsx
<Input
  type="text"
  label="Search"
  value={searchQuery}
  onDebouncedChange={(val) => setParam('q', val)}
  debounceMs={300}
  placeholder="Search..."
/>
```

### Select Dropdown
```jsx
<Input
  type="select"
  label="Category"
  value={category}
  onChange={setCategory}
>
  <option value="">All</option>
  <option value="electronics">Electronics</option>
  <option value="clothing">Clothing</option>
</Input>
```

### Range Slider (Price Filter)
```jsx
<Input
  type="range"
  label="Price"
  debounceMs={300}
  rangeConfig={{
    min: 0,
    max: 3000,
    step: 1,
    valueMin: priceMin,
    valueMax: priceMax,
    onDebouncedChangeMin: (val) => setParam('priceMin', val),
    onDebouncedChangeMax: (val) => setParam('priceMax', val)
  }}
/>
```

## Logic Hook: `useInput`
Located in `input.func.js`, this hook manages:
- **Draft State**: Local state for debounced inputs to prevent focus loss
- **Synchronization**: Keeps draft in sync with external `value` prop
- **Debouncing**: Triggers `onDebouncedChange` after specified delay
- **Display Value**: Returns appropriate value for rendering (draft or controlled)

## Styling
- Fully responsive using `vw` units (desktop: 1920px, tablet: 1024px, mobile: 393px)
- Consistent with global design tokens (`--color-surface-2`, `--radius-md`, etc.)
- Label and control wrapped in a `<div>` for consistent layout

## Integration
Used extensively by:
- `FiltersBar` - All filter controls
- `DataExplorer` - Via FiltersBar configuration
- Any form requiring consistent styling and debouncing

## Key Features
1. **Type Safety**: Conditional rendering ensures correct input type
2. **Focus Retention**: Draft state prevents input blur during debounced updates
3. **Accessibility**: Proper label association and semantic HTML
4. **Performance**: Debouncing reduces unnecessary re-renders and API calls
5. **Flexibility**: Single component handles all input needs
