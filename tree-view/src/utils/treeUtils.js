/**
 * Utility functions for converting hierarchical tree data
 * into flat React Flow nodes and edges.
 */

/**
 * Count total descendants of a node (recursive).
 */
function countDescendants(node) {
  if (!node.children || node.children.length === 0) return 0;
  return node.children.reduce(
    (sum, child) => sum + 1 + countDescendants(child),
    0
  );
}

/**
 * Find a node in the tree by ID.
 */
function findNodeInTree(nodeId, tree) {
  if (tree.id === nodeId) return tree;
  if (!tree.children) return null;
  for (const child of tree.children) {
    const result = findNodeInTree(nodeId, child);
    if (result) return result;
  }
  return null;
}

/**
 * Get all descendant IDs of a node.
 */
function getAllDescendantIds(node) {
  if (!node.children || node.children.length === 0) return [];
  const ids = [];
  for (const child of node.children) {
    ids.push(child.id);
    ids.push(...getAllDescendantIds(child));
  }
  return ids;
}

/**
 * Get all node IDs that have children (can be collapsed).
 */
function getCollapsibleNodeIds(tree) {
  const ids = [];
  function walk(node) {
    if (node.children && node.children.length > 0) {
      ids.push(node.id);
      node.children.forEach(walk);
    }
  }
  walk(tree);
  return ids;
}

/**
 * Flatten the tree into React Flow nodes and edges.
 * Respects collapsedSet to hide children of collapsed nodes.
 */
function flattenTree(tree, collapsedSet = new Set()) {
  const nodes = [];
  const edges = [];

  function walk(node, depth = 0) {
    const hasChildren = node.children && node.children.length > 0;
    const isCollapsed = collapsedSet.has(node.id);
    const childCount = hasChildren ? node.children.length : 0;
    const descendantCount = countDescendants(node);

    nodes.push({
      id: node.id,
      type: 'treeNode',
      data: {
        label: node.label,
        hasChildren,
        isCollapsed,
        depth,
        childCount,
        descendantCount,
        metadata: node.metadata || {},
      },
      position: { x: 0, y: 0 },
    });

    if (hasChildren && !isCollapsed) {
      for (const child of node.children) {
        edges.push({
          id: `e-${node.id}-${child.id}`,
          source: node.id,
          target: child.id,
          type: 'smoothstep',
          animated: false,
          style: { stroke: '#475569', strokeWidth: 2 },
        });
        walk(child, depth + 1);
      }
    }
  }

  walk(tree);
  return { nodes, edges };
}

/**
 * Deep clone the entire tree (immutable updates for React state).
 */
function deepCloneTree(node) {
  return {
    ...node,
    metadata: node.metadata ? { ...node.metadata } : {},
    children: node.children ? node.children.map(deepCloneTree) : [],
  };
}

let _nodeCounter = 100;

/**
 * Add a new child node to the parent with the given ID.
 * Returns a new tree (immutable).
 */
function addChildNode(tree, parentId) {
  const newTree = deepCloneTree(tree);
  const parent = findNodeInTree(parentId, newTree);
  if (!parent) return newTree;

  _nodeCounter++;
  const newNode = {
    id: `node-${_nodeCounter}-${Date.now()}`,
    label: 'New Node',
    metadata: { type: 'Node', description: 'Newly added node' },
    children: [],
  };

  if (!parent.children) parent.children = [];
  parent.children.push(newNode);
  return newTree;
}

/**
 * Remove a node (and its subtree) by ID.
 * Cannot remove the root node.
 * Returns a new tree (immutable).
 */
function removeNode(tree, nodeId) {
  if (tree.id === nodeId) return tree; // Can't remove root
  const newTree = deepCloneTree(tree);

  function removeFromChildren(parent) {
    if (!parent.children) return false;
    const idx = parent.children.findIndex((c) => c.id === nodeId);
    if (idx !== -1) {
      parent.children.splice(idx, 1);
      return true;
    }
    for (const child of parent.children) {
      if (removeFromChildren(child)) return true;
    }
    return false;
  }

  removeFromChildren(newTree);
  return newTree;
}

/**
 * Rename a node by ID.
 * Returns a new tree (immutable).
 */
function renameNode(tree, nodeId, newLabel) {
  const newTree = deepCloneTree(tree);
  const node = findNodeInTree(nodeId, newTree);
  if (node) {
    node.label = newLabel;
  }
  return newTree;
}

export {
  flattenTree,
  findNodeInTree,
  getAllDescendantIds,
  getCollapsibleNodeIds,
  countDescendants,
  deepCloneTree,
  addChildNode,
  removeNode,
  renameNode,
};
