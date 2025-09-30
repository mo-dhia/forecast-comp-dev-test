# Saved Views Feature

## Overview
A complete feature that allows users to save, load, delete, and share their current filter configurations. All data persists in `localStorage`, and URLs can be copied to clipboard for sharing.

## Purpose
- Enable users to save frequently-used filter combinations
- Provide quick access to saved configurations
- Share exact filter states via URL
- Persist user preferences across sessions

## Files
- `SavedViewsManager.jsx` - UI component with dropdown, save form, view list
- `savedViewsStorage.js` - Utility functions for localStorage operations
- `SavedViewsManager.module.css` - Responsive dropdown and button styles

## Storage Utility (`savedViewsStorage.js`)

### Data Structure
Each saved view is stored as:
```typescript
{
  id: string,           // Timestamp-based unique ID
  name: string,         // User-provided name
  url: string,          // Full path + search params
  createdAt: string     // ISO timestamp
}
```

### Functions
| Function | Parameters | Returns | Description |
|----------|-----------|---------|-------------|
| `getSavedViews()` | - | `Array<View>` | Retrieve all views from localStorage |
| `saveView(name, url)` | `string, string` | `View` | Save a new view |
| `deleteView(id)` | `string` | `void` | Delete a view by ID |
| `updateViewName(id, newName)` | `string, string` | `void` | Rename a view |

### Storage Key
`'data-explorer-saved-views'`

### Error Handling
All functions include try-catch blocks with console errors. Returns empty array on read errors, throws on write errors.

## Component (`SavedViewsManager.jsx`)

### State Management
```javascript
const [views, setViews] = useState([]);          // All saved views
const [isOpen, setIsOpen] = useState(false);     // Dropdown visibility
const [viewName, setViewName] = useState('');    // Input for new view name
const [showSaveForm, setShowSaveForm] = useState(false);
const [shareSuccess, setShareSuccess] = useState(false);
```

### Core Features

#### 1. Save Current View
- Click "+ Save Current View" button
- Enter name in inline form
- Press Enter or click Save
- Captures: `window.location.pathname + window.location.search`
- Saves to localStorage
- Reloads view list

#### 2. Load Saved View
- Click any view in the list
- Extracts search params from saved URL
- Uses `navigate(url.pathname + url.search)` to apply filters
- Closes dropdown automatically

#### 3. Delete View
- Click trash icon (🗑️) on any view
- Confirms with native `confirm()` dialog
- Removes from localStorage
- Reloads view list
- Event propagation stopped to prevent loading the view

#### 4. Share Link
- Click "🔗 Share Link" button
- Copies current URL (`window.location.href`) to clipboard
- Shows "✓ Copied!" feedback for 2 seconds
- Falls back to `document.execCommand('copy')` for older browsers

### UI Structure
```
[Trigger Button: "Saved Views (count)"]
  ↓ (when open)
[Dropdown Panel]
  ├─ Header: "Saved Views" [×]
  ├─ Actions:
  │  ├─ "+ Save Current View" (or inline form)
  │  └─ "🔗 Share Link" (or "✓ Copied!")
  └─ Views List:
     ├─ View 1: [Name] [Date] [🗑️]
     ├─ View 2: [Name] [Date] [🗑️]
     └─ ...
```

## Usage Example

### Integration in Page
```jsx
import SavedViewsManager from '../features/savedViews/SavedViewsManager';

function DataExplorer() {
  return (
    <main>
      <FiltersBar fields={fields} />
      <section>
        <div className={styles.header}>
          <h1>Data Explorer</h1>
          <SavedViewsManager />
        </div>
        <VirtualTable {...tableProps} />
      </section>
    </main>
  );
}
```

### Typical User Flow
1. User applies filters: `?q=laptop&category=electronics&priceMax=1500`
2. Clicks "Saved Views" → "+ Save Current View"
3. Enters "Laptops under $1500" → Saves
4. Later: Opens "Saved Views" → Clicks "Laptops under $1500"
5. Filters instantly applied, URL updated
6. Shares with colleague: Clicks "🔗 Share Link" → Pastes in chat

## Styling & Layout

### Trigger Button
- Inline bookmark icon (SVG)
- Shows count badge: "Saved Views (3)"
- Hover: Lighter background

### Dropdown
- Position: `absolute`, aligned to right of trigger
- Width: 20.83vw (desktop), 39.06vw (tablet), 101.78vw (mobile)
- Max height: Scrollable view list
- Background: Dark surface with border
- Box shadow: Elevated appearance

### View Items
- Hover: Subtle background change
- Layout: Flex (name/date on left, delete on right)
- Name: Bold, truncated with ellipsis
- Date: Smaller, muted color
- Delete button: Hidden until hover (mobile: always visible)

## Accessibility
- Trigger button has `aria-label="Saved Views"`
- Close button has `aria-label="Close"`
- Delete buttons have `aria-label="Delete view"`
- Keyboard support: Enter to save, Escape to close (via native browser)
- Focus management: Input auto-focuses when save form opens

## Responsive Design
- **Desktop**: Wide dropdown, small text
- **Tablet**: Larger dropdown, readable text
- **Mobile**: Full-width dropdown, touch-friendly buttons

## Integration with React Router
Uses React Router hooks:
- `useNavigate()` - Apply saved view filters
- `useLocation()` - Access current URL for saving

## Key Features
1. **Persistent Storage**: Survives page reloads and sessions
2. **URL-Based**: Captures all filter state via search params
3. **Shareable**: Copy link to clipboard for collaboration
4. **Quick Access**: Dropdown UI for fast switching
5. **Inline Editing**: Save form appears in-place
6. **Visual Feedback**: Success animations, hover states
7. **Error Handling**: Graceful degradation if localStorage fails
8. **Fully Responsive**: Adapts to all screen sizes

## Limitations & Considerations
- **localStorage Only**: Not synced across devices/browsers
- **No Backend**: Views are client-side only
- **No Collaboration**: Shared links work, but no multi-user view sharing
- **Capacity**: localStorage has ~5-10MB limit (unlikely to hit with filter URLs)

## Future Enhancements (Not Implemented)
- Backend persistence for cross-device sync
- View renaming UI
- Default/favorite view
- View categories/tags
- Export/import views
- View previews (thumbnails or stats)
