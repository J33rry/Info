import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import CustomNode from './CustomNode';
import GourceNode from './GourceNode';
import SearchBar from './SearchBar';
import TreeControls from './TreeControls';
import initialTreeData from '../data/treeData';
import {
  flattenTree,
  getCollapsibleNodeIds,
  countDescendants,
  addChildNode,
  removeNode,
  renameNode,
} from '../utils/treeUtils';
import { getLayoutedElements } from '../utils/layoutEngine';
import { createForceSimulation } from '../utils/forceEngine';
import './TreeFlow.css';

const nodeTypes = {
  treeNode: CustomNode,
  gourceNode: GourceNode,
};

function getMaxDepth(nodes) {
  return nodes.reduce((max, node) => Math.max(max, node.data.depth || 0), 0);
}

function getTotalNodeCount(tree) {
  return 1 + countDescendants(tree);
}

const TreeFlow = () => {
  const [treeData, setTreeData] = useState(initialTreeData);
  const [collapsedNodes, setCollapsedNodes] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('tree'); // 'tree' | 'gource'
  const simulationRef = useRef(null);
  const { fitView } = useReactFlow();

  const totalNodeCount = useMemo(() => getTotalNodeCount(treeData), [treeData]);

  // ---- Collapse/Expand handlers ----
  const handleToggleCollapse = useCallback((nodeId) => {
    setCollapsedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  }, []);

  const handleExpandAll = useCallback(() => {
    setCollapsedNodes(new Set());
  }, []);

  const handleCollapseAll = useCallback(() => {
    const collapsible = getCollapsibleNodeIds(treeData);
    setCollapsedNodes(new Set(collapsible));
  }, [treeData]);

  // ---- Tree mutation handlers ----
  const handleAddChild = useCallback((parentId) => {
    setTreeData((prev) => addChildNode(prev, parentId));
    setCollapsedNodes((prev) => {
      if (prev.has(parentId)) {
        const next = new Set(prev);
        next.delete(parentId);
        return next;
      }
      return prev;
    });
  }, []);

  const handleDeleteNode = useCallback((nodeId) => {
    setTreeData((prev) => removeNode(prev, nodeId));
    setCollapsedNodes((prev) => {
      if (prev.has(nodeId)) {
        const next = new Set(prev);
        next.delete(nodeId);
        return next;
      }
      return prev;
    });
  }, []);

  const handleRenameNode = useCallback((nodeId, newLabel) => {
    setTreeData((prev) => renameNode(prev, nodeId, newLabel));
  }, []);

  // ---- Compute flat nodes and edges (shared between modes) ----
  const { flatNodesWithData, flatEdges, matchCount } = useMemo(() => {
    const { nodes: flatNodes, edges } = flattenTree(treeData, collapsedNodes);
    const lowerSearch = searchTerm.toLowerCase().trim();
    let matches = 0;

    const nodesWithData = flatNodes.map((node) => {
      const isMatch = lowerSearch.length > 0 && node.data.label.toLowerCase().includes(lowerSearch);
      if (isMatch) matches++;
      return {
        ...node,
        type: viewMode === 'gource' ? 'gourceNode' : 'treeNode',
        data: {
          ...node.data,
          isHighlighted: isMatch,
          onToggleCollapse: handleToggleCollapse,
          onAddChild: handleAddChild,
          onDeleteNode: handleDeleteNode,
          onRenameNode: handleRenameNode,
        },
      };
    });

    // Gource mode: smoothstep edges (same dotted style as tree mode)
    const styledEdges = viewMode === 'gource'
      ? edges.map((e) => ({
          ...e,
          type: 'smoothstep',
          style: { stroke: '#475569', strokeWidth: 2 },
          animated: false,
        }))
      : edges;

    return { flatNodesWithData: nodesWithData, flatEdges: styledEdges, matchCount: matches };
  }, [treeData, collapsedNodes, searchTerm, viewMode, handleToggleCollapse, handleAddChild, handleDeleteNode, handleRenameNode]);

  // ---- Layout computation (Tree mode only) ----
  const { layoutedNodes, layoutedEdges } = useMemo(() => {
    if (viewMode === 'gource') {
      // For Gource mode, return flat nodes with placeholder positions
      return { layoutedNodes: flatNodesWithData, layoutedEdges: flatEdges };
    }
    // Dagre layout
    const { nodes: positioned, edges: positionedEdges } = getLayoutedElements(flatNodesWithData, flatEdges, 'TB');
    return { layoutedNodes: positioned, layoutedEdges: positionedEdges };
  }, [viewMode, flatNodesWithData, flatEdges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  // ---- Sync dagre layout → React Flow (tree mode) ----
  useEffect(() => {
    if (viewMode === 'tree') {
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    }
  }, [viewMode, layoutedNodes, layoutedEdges, setNodes, setEdges]);

  // ---- Force simulation (Gource mode) ----
  useEffect(() => {
    if (viewMode !== 'gource') {
      // Stop simulation when leaving Gource mode
      if (simulationRef.current) {
        simulationRef.current.stop();
        simulationRef.current = null;
      }
      return;
    }

    // Set edges immediately
    setEdges(flatEdges);

    if (!simulationRef.current) {
      // Create new simulation
      const sim = createForceSimulation(
        flatNodesWithData,
        flatEdges,
        (positions) => {
          setNodes((prev) =>
            prev.map((n) => {
              const pos = positions[n.id];
              if (pos) {
                return { ...n, position: { x: pos.x, y: pos.y } };
              }
              return n;
            })
          );
        }
      );
      simulationRef.current = sim;
      // Set initial nodes
      setNodes(flatNodesWithData);
    } else {
      // Update existing simulation with new nodes/edges
      simulationRef.current.update(flatNodesWithData, flatEdges);
      setNodes(flatNodesWithData);
    }

    return () => {
      // Cleanup on unmount only
    };
  }, [viewMode, flatNodesWithData, flatEdges, setNodes, setEdges]);

  // Cleanup simulation on component unmount
  useEffect(() => {
    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
        simulationRef.current = null;
      }
    };
  }, []);

  // ---- Handle mode switching ----
  const handleViewModeChange = useCallback((mode) => {
    if (mode === viewMode) return;
    // Stop existing simulation when switching away from Gource
    if (simulationRef.current) {
      simulationRef.current.stop();
      simulationRef.current = null;
    }
    setViewMode(mode);
  }, [viewMode]);

  // ---- Keyboard shortcuts ----
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input (e.g. search bar or rename input)
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.code === 'Space') {
        e.preventDefault();
        fitView({ padding: 0.3, duration: 800 });
      } else if (e.shiftKey && e.code === 'KeyE') {
        e.preventDefault();
        handleExpandAll();
      } else if (e.shiftKey && e.code === 'KeyC') {
        e.preventDefault();
        handleCollapseAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fitView, handleExpandAll, handleCollapseAll]);

  // ---- Drag handlers for Gource mode (fix/unfix nodes in simulation) ----
  const handleNodeDragStart = useCallback((event, node) => {
    if (viewMode === 'gource' && simulationRef.current) {
      simulationRef.current.fixNode(node.id, node.position.x, node.position.y);
      simulationRef.current.reheat(0.3);
    }
  }, [viewMode]);

  const handleNodeDrag = useCallback((event, node) => {
    if (viewMode === 'gource' && simulationRef.current) {
      simulationRef.current.fixNode(node.id, node.position.x, node.position.y);
    }
  }, [viewMode]);

  const handleNodeDragStop = useCallback((event, node) => {
    if (viewMode === 'gource' && simulationRef.current) {
      simulationRef.current.unfixNode(node.id);
      simulationRef.current.reheat(0.3);
    }
  }, [viewMode]);

  const maxDepth = useMemo(() => getMaxDepth(nodes), [nodes]);

  const miniMapNodeColor = useCallback((node) => {
    if (node.data?.isHighlighted) return '#fbbf24';
    if (node.data?.depth === 0) return '#3b82f6';
    if (viewMode === 'gource') {
      const d = node.data?.depth || 0;
      if (d === 1) return '#10b981';
      if (d === 2) return '#14b8a6';
      if (d === 3) return '#8b5cf6';
      return '#f59e0b';
    }
    return '#475569';
  }, [viewMode]);

  return (
    <div className={`tree-flow-container ${viewMode === 'gource' ? 'tree-flow-container--gource' : ''}`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView={viewMode === 'tree'}
        fitViewOptions={{ padding: 0.3, maxZoom: 1.5 }}
        minZoom={0.1}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={viewMode === 'gource'}
        nodesConnectable={false}
        elementsSelectable={true}
        selectNodesOnDrag={false}
        onNodeDragStart={handleNodeDragStart}
        onNodeDrag={handleNodeDrag}
        onNodeDragStop={handleNodeDragStop}
      >
        <Background
          variant={viewMode === 'gource' ? BackgroundVariant.Cross : BackgroundVariant.Dots}
          gap={viewMode === 'gource' ? 40 : 20}
          size={1}
          color={viewMode === 'gource' ? '#0f172a' : '#1e293b'}
        />
        <Controls showInteractive={false} className="tree-flow__controls" />
        <MiniMap
          nodeColor={miniMapNodeColor}
          maskColor="rgba(15, 23, 42, 0.8)"
          className="tree-flow__minimap"
          pannable
          zoomable
        />

        <Panel position="top-left" className="tree-flow__panel tree-flow__panel--search">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} matchCount={matchCount} />
        </Panel>

        <Panel position="bottom-left" className="tree-flow__panel tree-flow__panel--help">
          <div className="tree-flow__help-box">
            <div className="tree-flow__help-item"><kbd>Space</kbd> Center tree</div>
            <div className="tree-flow__help-item"><kbd>⇧</kbd> + <kbd>E</kbd> Expand all</div>
            <div className="tree-flow__help-item"><kbd>⇧</kbd> + <kbd>C</kbd> Collapse all</div>
            <div className="tree-flow__help-item"><span>🖱️</span> Double-click to rename</div>
            <div className="tree-flow__help-item"><span>🖱️</span> Hover for +/-</div>
          </div>
        </Panel>

        <Panel position="top-right" className="tree-flow__panel tree-flow__panel--controls">
          <TreeControls
            onExpandAll={handleExpandAll}
            onCollapseAll={handleCollapseAll}
            totalNodes={totalNodeCount}
            visibleNodes={nodes.length}
            maxDepth={maxDepth}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
          />
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default TreeFlow;
