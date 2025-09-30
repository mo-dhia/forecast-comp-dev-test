# RangeSlider Component

## Overview
A dual-thumb range slider component for selecting min/max numeric ranges (e.g., price filters). Features live value display, smooth interaction, and optional debouncing.

## Purpose
- Provide intuitive range selection with visual feedback
- Display current min/max values inline
- Support debounced updates to prevent excessive API calls
- Match the visual design of other input controls

## Files
- `rangeSlider.jsx` - Main component with dual-range inputs
- `rangeSlider.func.js` - Logic for draft state, debouncing, and thumb collision
- `rangeSlider.module.css` - Styled track, range highlight, thumbs, and values

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `min` | `number` | `0` | Minimum value of the range |
| `max` | `number` | `100` | Maximum value of the range |
| `valueMin` | `number` | `min` | Current minimum selected value |
| `valueMax` | `number` | `max` | Current maximum selected value |
| `onChangeMin` | `function` | - | Immediate change handler for min |
| `onChangeMax` | `function` | - | Immediate change handler for max |
| `onDebouncedChangeMin` | `function` | - | Debounced change handler for min |
| `onDebouncedChangeMax` | `function` | - | Debounced change handler for max |
| `step` | `number` | `1` | Step increment |
| `debounceMs` | `number` | - | Debounce delay in milliseconds |
| `disabled` | `boolean` | `false` | Disable the slider |

## Usage Example

### Basic (Non-debounced)
```jsx
<RangeSlider
  min={0}
  max={1000}
  valueMin={priceMin}
  valueMax={priceMax}
  onChangeMin={setPriceMin}
  onChangeMax={setPriceMax}
  step={10}
/>
```

### Debounced (Recommended for filters)
```jsx
<RangeSlider
  min={0}
  max={3000}
  valueMin={priceMin}
  valueMax={priceMax}
  onDebouncedChangeMin={(val) => setParam('priceMin', val)}
  onDebouncedChangeMax={(val) => setParam('priceMax', val)}
  debounceMs={300}
  step={1}
/>
```

### With Disabled State
```jsx
<RangeSlider
  min={metadata.min}
  max={metadata.max}
  valueMin={priceMin}
  valueMax={priceMax}
  disabled={isLoadingMetadata}
  debounceMs={300}
/>
```

## Logic Hook: `useRangeSlider`
Located in `rangeSlider.func.js`, this hook manages:

### State Management
- **Draft State**: Local state for debounced sliders to prevent jitter
- **Synchronization**: Keeps draft values in sync with external props
- **Debouncing**: Triggers callbacks after specified delay

### Collision Prevention
- Min thumb cannot exceed max thumb (enforced by `step`)
- Max thumb cannot go below min thumb (enforced by `step`)

### Visual Calculations
- **Percentage Positions**: Calculates `minPercent` and `maxPercent` for visual range highlight
- **Z-Index Logic**: Ensures correct thumb is on top when they're close

## Visual Design

### Layout (Single Horizontal Line)
```
[$250] ━━━━━━━●═══════●━━━━━━━ [$2500]
  min     track  range  track    max
```

### Components
1. **Value Display**: Min/max values with `$` formatting
2. **Track**: Full-width gray background track
3. **Range**: Highlighted section between thumbs (primary color)
4. **Thumbs**: Two circular sliders (one for min, one for max)

### Styling Details
- Container matches other input styling (border, background, padding)
- Track is subtle (8% opacity white)
- Range highlight uses `--color-primary`
- Thumbs have hover scale effect and active state
- Disabled state: 50% opacity, grayed background, no interaction

## Responsive Behavior
- Fully responsive using `vw` units
- Adjusts thumb size, track height, and spacing for tablet/mobile
- Value labels remain readable at all sizes

## Integration with Input Component
Typically used via the `Input` component with `type='range'`:

```jsx
<Input
  type="range"
  label="Price Range"
  debounceMs={300}
  rangeConfig={{
    min: 0,
    max: 3000,
    valueMin: priceMin,
    valueMax: priceMax
  }}
  disabled={isLoadingMetadata}
/>
```

The `Input` component:
- Renders the label above the slider
- Passes through `rangeConfig` props
- Wires up `onDebouncedChangeMin/Max` to URL params

## Key Features
1. **Dual Thumbs**: Independent min/max control
2. **Visual Feedback**: Live value display and range highlight
3. **Collision Handling**: Thumbs cannot cross each other
4. **Debouncing**: Smooth UX without excessive updates
5. **Accessibility**: Native `<input type="range">` for keyboard support
6. **Responsive**: Adapts to all screen sizes
7. **Consistent Design**: Matches other input controls
8. **Loading States**: Visual feedback during data fetching

## Accessibility
- Uses native `<input type="range">` elements (keyboard accessible)
- Proper ARIA roles inherited from native inputs
- Visual focus indicators on thumb hover/active
- Disabled state prevents interaction and provides visual feedback

## Performance Considerations
- Draft state prevents parent re-renders during dragging
- Debouncing reduces URL updates and API calls
- Memoized percentage calculations in the hook
- CSS transitions for smooth visual updates
