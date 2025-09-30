// localStorage utility for saved views

const STORAGE_KEY = 'data-explorer-saved-views';

/**
 * Get all saved views from localStorage
 * @returns {Array<{id: string, name: string, url: string, createdAt: string}>}
 */
export function getSavedViews() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading saved views:', error);
    return [];
  }
}

/**
 * Save a new view to localStorage
 * @param {string} name - Name of the view
 * @param {string} url - Current URL with filters/params
 * @returns {object} The saved view object
 */
export function saveView(name, url) {
  try {
    const views = getSavedViews();
    const newView = {
      id: Date.now().toString(),
      name,
      url,
      createdAt: new Date().toISOString()
    };
    views.push(newView);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(views));
    return newView;
  } catch (error) {
    console.error('Error saving view:', error);
    throw error;
  }
}

/**
 * Delete a saved view
 * @param {string} id - ID of the view to delete
 */
export function deleteView(id) {
  try {
    const views = getSavedViews();
    const filtered = views.filter(v => v.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting view:', error);
    throw error;
  }
}

/**
 * Update a saved view's name
 * @param {string} id - ID of the view to update
 * @param {string} newName - New name for the view
 */
export function updateViewName(id, newName) {
  try {
    const views = getSavedViews();
    const view = views.find(v => v.id === id);
    if (view) {
      view.name = newName;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(views));
    }
  } catch (error) {
    console.error('Error updating view:', error);
    throw error;
  }
}
