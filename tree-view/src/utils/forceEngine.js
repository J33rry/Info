/**
 * Force-directed layout engine using d3-force.
 * Provides a physics simulation for Gource-like visualization.
 */
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  forceRadial,
} from 'd3-force';

const DEFAULT_CONFIG = {
  linkDistance: 120,
  linkStrength: 0.5,
  chargeStrength: -500,
  collideRadius: 48,
  radialStrength: 0.15,
  radialRadiusPerDepth: 160,
  centerX: 0,
  centerY: 0,
  alphaDecay: 0.012,    // Slow decay = longer settling animation
  velocityDecay: 0.3,
};

/**
 * Create and return a d3-force simulation.
 * @param {Array} nodes - React Flow nodes (must have .id, .data.depth)
 * @param {Array} edges - React Flow edges (must have .source, .target)
 * @param {Function} onTick - Called every simulation tick with updated node positions
 * @param {Object} config - Optional config overrides
 * @returns {Object} simulation controller { simulation, reheat, fixNode, unfixNode, stop }
 */
function createForceSimulation(nodes, edges, onTick, config = {}) {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  // Build simulation nodes (d3 mutates these in-place)
  const simNodes = nodes.map((n) => ({
    id: n.id,
    x: n.position?.x || Math.random() * 400 - 200,
    y: n.position?.y || Math.random() * 400 - 200,
    depth: n.data?.depth || 0,
    rfNode: n, // reference back to React Flow node
  }));

  // Build simulation links
  const simLinks = edges.map((e) => ({
    source: e.source,
    target: e.target,
  }));

  const simulation = forceSimulation(simNodes)
    .force(
      'link',
      forceLink(simLinks)
        .id((d) => d.id)
        .distance(cfg.linkDistance)
        .strength(cfg.linkStrength)
    )
    .force('charge', forceManyBody().strength(cfg.chargeStrength))
    .force('center', forceCenter(cfg.centerX, cfg.centerY))
    .force('collide', forceCollide().radius(cfg.collideRadius).iterations(2))
    .force(
      'radial',
      forceRadial(
        (d) => d.depth * cfg.radialRadiusPerDepth,
        cfg.centerX,
        cfg.centerY
      ).strength(cfg.radialStrength)
    )
    .alphaDecay(cfg.alphaDecay)
    .velocityDecay(cfg.velocityDecay);

  // Tick handler — batched with rAF
  let rafId = null;
  simulation.on('tick', () => {
    if (rafId) return; // Skip if a frame is already pending
    rafId = requestAnimationFrame(() => {
      rafId = null;
      const positions = {};
      simNodes.forEach((sn) => {
        positions[sn.id] = { x: sn.x, y: sn.y };
      });
      onTick(positions);
    });
  });

  return {
    simulation,

    /** Re-energize the simulation (e.g., after adding/removing nodes). */
    reheat(alpha = 0.8) {
      simulation.alpha(alpha).restart();
    },

    /** Fix a node in place (for dragging). */
    fixNode(nodeId, x, y) {
      const sn = simNodes.find((n) => n.id === nodeId);
      if (sn) {
        sn.fx = x;
        sn.fy = y;
      }
    },

    /** Unfix a node (release from drag). */
    unfixNode(nodeId) {
      const sn = simNodes.find((n) => n.id === nodeId);
      if (sn) {
        sn.fx = null;
        sn.fy = null;
      }
    },

    /** Update simulation with new nodes/edges (full rebuild). */
    update(newNodes, newEdges) {
      // Preserve existing positions where possible
      const existingPositions = {};
      simNodes.forEach((sn) => {
        existingPositions[sn.id] = { x: sn.x, y: sn.y, vx: sn.vx, vy: sn.vy };
      });

      simNodes.length = 0;
      newNodes.forEach((n) => {
        const existing = existingPositions[n.id];
        simNodes.push({
          id: n.id,
          x: existing?.x || Math.random() * 200 - 100,
          y: existing?.y || Math.random() * 200 - 100,
          vx: existing?.vx || 0,
          vy: existing?.vy || 0,
          depth: n.data?.depth || 0,
          rfNode: n,
        });
      });

      const newSimLinks = newEdges.map((e) => ({
        source: e.source,
        target: e.target,
      }));

      simulation.nodes(simNodes);
      simulation.force('link').links(newSimLinks);
      simulation.force(
        'radial',
        forceRadial(
          (d) => d.depth * cfg.radialRadiusPerDepth,
          cfg.centerX,
          cfg.centerY
        ).strength(cfg.radialStrength)
      );
      simulation.alpha(0.6).restart();
    },

    /** Stop the simulation and clean up. */
    stop() {
      if (rafId) cancelAnimationFrame(rafId);
      simulation.stop();
    },
  };
}

export { createForceSimulation };
