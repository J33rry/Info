import React, { memo, useState, useRef, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import './GourceNode.css';

/**
 * Gource-style circular node component.
 * Glowing halo, depth-based color, label below, physics-friendly.
 */
const GourceNode = memo(({ data, selected, id }) => {
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

  // Scale circle size based on descendant count
  const baseSize = isRoot ? 48 : 36;
  const size = Math.min(baseSize + Math.sqrt(descendantCount) * 3, 64);

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
    if (e.key === 'Enter') commitRename();
    else if (e.key === 'Escape') setIsEditing(false);
  };

  const depthClass = `gource-node--depth-${Math.min(depth, 5)}`;

  const nodeClasses = [
    'gource-node',
    isRoot ? 'gource-node--root' : '',
    selected ? 'gource-node--selected' : '',
    isHighlighted ? 'gource-node--highlighted' : '',
    isCollapsed ? 'gource-node--collapsed' : '',
    depthClass,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={nodeClasses}
      onMouseEnter={() => !isEditing && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      style={{ width: size + 40, height: size + 48 }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="gource-node__handle"
        isConnectable={false}
        style={{ top: size / 2, left: '50%' }}
      />

      {/* Action buttons */}
      <div className="gource-node__actions">
        <button className="gource-node__action-btn gource-node__action-btn--add" onClick={handleAddChild} title="Add child">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        {!isRoot && (
          <button className="gource-node__action-btn gource-node__action-btn--delete" onClick={handleDelete} title="Delete node">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Glowing circle */}
      <div
        className="gource-node__circle"
        style={{ width: size, height: size }}
        onDoubleClick={handleDoubleClick}
        onClick={hasChildren ? handleToggle : undefined}
      >
        <div className="gource-node__glow" style={{ width: size + 20, height: size + 20 }} />
        {isCollapsed && <div className="gource-node__pulse" style={{ width: size + 16, height: size + 16 }} />}
      </div>

      {/* Label below circle */}
      <div className="gource-node__label-wrap nopan nodrag" onDoubleClick={handleDoubleClick}>
        {isEditing ? (
          <input
            ref={inputRef}
            className="gource-node__edit-input nopan nodrag"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={commitRename}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="gource-node__label">{label}</span>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="gource-node__handle"
        isConnectable={false}
        style={{ top: size / 2, left: '50%' }}
      />

      {/* Tooltip */}
      {showTooltip && !isEditing && (
        <div className="gource-node__tooltip">
          <div className="gource-node__tooltip-row">
            <span className="gource-node__tooltip-key">Depth:</span>
            <span className="gource-node__tooltip-val">{depth}</span>
          </div>
          <div className="gource-node__tooltip-row">
            <span className="gource-node__tooltip-key">Children:</span>
            <span className="gource-node__tooltip-val">{childCount}</span>
          </div>
          <div className="gource-node__tooltip-row">
            <span className="gource-node__tooltip-key">Total:</span>
            <span className="gource-node__tooltip-val">{descendantCount}</span>
          </div>
          {metadata?.type && (
            <div className="gource-node__tooltip-row">
              <span className="gource-node__tooltip-key">Type:</span>
              <span className="gource-node__tooltip-val">{metadata.type}</span>
            </div>
          )}
          <div className="gource-node__tooltip-hint">
            {hasChildren ? 'Click to toggle • ' : ''}Double-click to rename
          </div>
        </div>
      )}
    </div>
  );
});

GourceNode.displayName = 'GourceNode';

export default GourceNode;
