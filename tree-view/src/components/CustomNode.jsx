import React, { memo, useState, useRef, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import './CustomNode.css';

/**
 * Custom tree node component for React Flow.
 * Features: expand/collapse, hover tooltip, search highlight,
 *           inline rename (double-click), add child (+), delete (×).
 */
const CustomNode = memo(({ data, selected, id }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef(null);
  const {
    label,
    hasChildren,
    isCollapsed,
    depth,
    childCount,
    descendantCount,
    metadata,
    isHighlighted,
    onToggleCollapse,
    onAddChild,
    onDeleteNode,
    onRenameNode,
  } = data;

  const isRoot = depth === 0;

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleToggle = (e) => {
    e.stopPropagation();
    if (onToggleCollapse) onToggleCollapse(id);
  };

  const handleAddChild = (e) => {
    e.stopPropagation();
    if (onAddChild) onAddChild(id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDeleteNode) onDeleteNode(id);
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    setEditValue(label);
    setIsEditing(true);
    setShowTooltip(false);
  };

  const commitRename = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== label && onRenameNode) {
      onRenameNode(id, trimmed);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      commitRename();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const nodeClasses = [
    'tree-node',
    isRoot ? 'tree-node--root' : '',
    selected ? 'tree-node--selected' : '',
    isHighlighted ? 'tree-node--highlighted' : '',
    isCollapsed ? 'tree-node--collapsed' : '',
    isEditing ? 'tree-node--editing' : '',
    `tree-node--depth-${Math.min(depth, 4)}`,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={nodeClasses}
      onMouseEnter={() => !isEditing && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="tree-node__handle tree-node__handle--target"
        isConnectable={false}
      />

      {/* Action buttons — visible on hover */}
      <div className="tree-node__actions">
        <button
          className="tree-node__action-btn tree-node__action-btn--add"
          onClick={handleAddChild}
          title="Add child node"
          aria-label="Add child node"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        {!isRoot && (
          <button
            className="tree-node__action-btn tree-node__action-btn--delete"
            onClick={handleDelete}
            title="Delete node"
            aria-label="Delete node"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Node content — label or inline edit input */}
      <div className="tree-node__content nopan nodrag" onDoubleClick={handleDoubleClick}>
        {isEditing ? (
          <input
            ref={inputRef}
            className="tree-node__edit-input nopan nodrag"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={commitRename}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="tree-node__label" title="Double-click to rename">
            {label}
          </span>
        )}
      </div>

      {/* Expand/collapse toggle dot */}
      {hasChildren && (
        <button
          className={`tree-node__toggle ${isCollapsed ? 'tree-node__toggle--collapsed' : ''}`}
          onClick={handleToggle}
          aria-label={isCollapsed ? 'Expand node' : 'Collapse node'}
          title={isCollapsed ? `Expand (${descendantCount} hidden)` : 'Collapse'}
        >
          <span className="tree-node__toggle-dot" />
        </button>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="tree-node__handle tree-node__handle--source"
        isConnectable={false}
      />

      {/* Metadata tooltip */}
      {showTooltip && !isEditing && (
        <div className="tree-node__tooltip">
          <div className="tree-node__tooltip-row">
            <span className="tree-node__tooltip-label">Depth:</span>
            <span className="tree-node__tooltip-value">{depth}</span>
          </div>
          <div className="tree-node__tooltip-row">
            <span className="tree-node__tooltip-label">Children:</span>
            <span className="tree-node__tooltip-value">{childCount}</span>
          </div>
          <div className="tree-node__tooltip-row">
            <span className="tree-node__tooltip-label">Total:</span>
            <span className="tree-node__tooltip-value">{descendantCount}</span>
          </div>
          {metadata?.type && (
            <div className="tree-node__tooltip-row">
              <span className="tree-node__tooltip-label">Type:</span>
              <span className="tree-node__tooltip-value">{metadata.type}</span>
            </div>
          )}
          <div className="tree-node__tooltip-hint">
            Double-click to rename • Hover for actions
          </div>
        </div>
      )}
    </div>
  );
});

CustomNode.displayName = 'CustomNode';

export default CustomNode;
