import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getSavedViews, saveView, deleteView } from './savedViewsStorage';
import styles from './SavedViewsManager.module.css';

export default function SavedViewsManager() {
  const [views, setViews] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [viewName, setViewName] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Load saved views on mount
  useEffect(() => {
    loadViews();
  }, []);

  const loadViews = () => {
    setViews(getSavedViews());
  };

  const handleSave = () => {
    if (!viewName.trim()) return;
    
    try {
      const currentUrl = window.location.pathname + window.location.search;
      saveView(viewName.trim(), currentUrl);
      setViewName('');
      setShowSaveForm(false);
      loadViews();
    } catch (error) {
      alert('Error saving view');
    }
  };

  const handleLoad = (view) => {
    // Extract search params from saved URL
    const url = new URL(view.url, window.location.origin);
    navigate(url.pathname + url.search);
    setIsOpen(false);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (confirm('Delete this saved view?')) {
      deleteView(id);
      loadViews();
    }
  };

  const handleShareLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    } catch (error) {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    }
  };

  return (
    <div className={styles.container}>
      <button 
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Saved Views"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
        Saved Views {views.length > 0 && `(${views.length})`}
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.header}>
            <h3>Saved Views</h3>
            <button 
              className={styles.closeBtn}
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div className={styles.actions}>
            {!showSaveForm ? (
              <button 
                className={styles.saveBtn}
                onClick={() => setShowSaveForm(true)}
              >
                + Save Current View
              </button>
            ) : (
              <div className={styles.saveForm}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="View name..."
                  value={viewName}
                  onChange={(e) => setViewName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  autoFocus
                />
                <button 
                  className={styles.confirmBtn}
                  onClick={handleSave}
                  disabled={!viewName.trim()}
                >
                  Save
                </button>
                <button 
                  className={styles.cancelBtn}
                  onClick={() => {
                    setShowSaveForm(false);
                    setViewName('');
                  }}
                >
                  Cancel
                </button>
              </div>
            )}

            <button 
              className={`${styles.shareBtn} ${shareSuccess ? styles.success : ''}`}
              onClick={handleShareLink}
            >
              {shareSuccess ? '✓ Copied!' : '🔗 Share Link'}
            </button>
          </div>

          {views.length > 0 ? (
            <div className={styles.viewsList}>
              {views.map((view) => (
                <div 
                  key={view.id}
                  className={styles.viewItem}
                  onClick={() => handleLoad(view)}
                >
                  <div className={styles.viewInfo}>
                    <div className={styles.viewName}>{view.name}</div>
                    <div className={styles.viewDate}>
                      {new Date(view.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    className={styles.deleteBtn}
                    onClick={(e) => handleDelete(view.id, e)}
                    aria-label="Delete view"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              No saved views yet. Save your current filters to quickly access them later.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
