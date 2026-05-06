import React from 'react';
import './TreeControls.css';

/**
 * Control panel: Mode toggle, Expand/Collapse All, tree stats.
 */
const TreeControls = ({ onExpandAll, onCollapseAll, totalNodes, visibleNodes, maxDepth, viewMode, onViewModeChange }) => {
  return (
    <div className="tree-controls">
      <div className="tree-controls__title">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="5" r="3" />
          <line x1="12" y1="8" x2="12" y2="14" />
          <line x1="6" y1="18" x2="6" y2="14" />
          <line x1="18" y1="18" x2="18" y2="14" />
          <line x1="6" y1="14" x2="18" y2="14" />
          <circle cx="6" cy="20" r="2" />
          <circle cx="18" cy="20" r="2" />
        </svg>
        <span>Tree View</span>
      </div>

      {/* Mode toggle */}
      <div className="tree-controls__mode-toggle">
        <button
          className={`tree-controls__mode-btn ${viewMode === 'tree' ? 'tree-controls__mode-btn--active' : ''}`}
          onClick={() => onViewModeChange('tree')}
          title="Dagre tree layout"
        >
          {/* Tree icon */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="8" y="2" width="8" height="6" rx="1" />
            <rect x="1" y="16" width="8" height="6" rx="1" />
            <rect x="15" y="16" width="8" height="6" rx="1" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="5" y1="16" x2="5" y2="12" />
            <line x1="19" y1="16" x2="19" y2="12" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Tree
        </button>
        <button
          className={`tree-controls__mode-btn ${viewMode === 'gource' ? 'tree-controls__mode-btn--active' : ''}`}
          onClick={() => onViewModeChange('gource')}
          title="Gource physics mode"
        >
          {/* Atom/orbit icon */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <ellipse cx="12" cy="12" rx="10" ry="4" />
            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
          </svg>
          Gource
        </button>
      </div>

      <div className="tree-controls__buttons">
        <button id="expand-all-btn" className="tree-controls__btn" onClick={onExpandAll} title="Expand all nodes">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
          Expand All
        </button>
        <button id="collapse-all-btn" className="tree-controls__btn" onClick={onCollapseAll} title="Collapse all nodes">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 14 10 14 10 20" />
            <polyline points="20 10 14 10 14 4" />
            <line x1="14" y1="10" x2="21" y2="3" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
          Collapse All
        </button>
      </div>

      <div className="tree-controls__stats">
        <div className="tree-controls__stat">
          <span className="tree-controls__stat-label">Visible</span>
          <span className="tree-controls__stat-value">{visibleNodes}</span>
        </div>
        <div className="tree-controls__stat-divider" />
        <div className="tree-controls__stat">
          <span className="tree-controls__stat-label">Total</span>
          <span className="tree-controls__stat-value">{totalNodes}</span>
        </div>
        <div className="tree-controls__stat-divider" />
        <div className="tree-controls__stat">
          <span className="tree-controls__stat-label">Depth</span>
          <span className="tree-controls__stat-value">{maxDepth}</span>
        </div>
      </div>
    </div>
  );
};

export default TreeControls;
