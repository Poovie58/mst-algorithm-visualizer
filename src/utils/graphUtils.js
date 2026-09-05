/**
 * Graph Utility Functions
 * 
 * Provides core algorithms for:
 * - Random graph generation with configurable density
 * - Connected graph validation using DFS
 * - Graph connectivity checks
 */

/**
 * Generate a random connected graph
 * 
 * Algorithm:
 * 1. Create nodes with unique IDs
 * 2. Generate random edges based on probability
 * 3. Ensure connectivity by adding edges between isolated components
 * 
 * @param {number} nodeCount - Number of nodes (5-100)
 * @param {number} edgeProbability - Probability of edge existence (0-1)
 * @returns {object} Graph object with nodes and edges arrays
 */
export const generateRandomGraph = (nodeCount, edgeProbability = 0.3) => {
  if (nodeCount < 2 || nodeCount > 100) {
    throw new Error('Node count must be between 2 and 100');
  }

  if (edgeProbability < 0 || edgeProbability > 1) {
    throw new Error('Edge probability must be between 0 and 1');
  }

  // Create nodes array
  const nodes = Array.from({ length: nodeCount }, (_, i) => ({
    id: i,
    label: `Node ${i}`,
  }));

  // Generate edges based on probability
  const edges = [];
  const edgeSet = new Set(); // Prevent duplicate edges

  for (let i = 0; i < nodeCount; i++) {
    for (let j = i + 1; j < nodeCount; j++) {
      // Random edge generation based on probability
      if (Math.random() < edgeProbability) {
        const weight = Math.floor(Math.random() * 90) + 10; // Weight between 10-100
        const edgeKey = `${i}-${j}`; // Normalize edge key

        if (!edgeSet.has(edgeKey)) {
          edges.push({
            source: i,
            target: j,
            weight: weight,
            id: `edge-${i}-${j}`,
          });
          edgeSet.add(edgeKey);
        }
      }
    }
  }

  // Ensure minimum connectivity - add edges if needed
  // This guarantees the graph has at least n-1 edges (tree structure)
  const minEdges = nodeCount - 1;
  while (edges.length < minEdges) {
    const i = Math.floor(Math.random() * nodeCount);
    const j = Math.floor(Math.random() * nodeCount);

    if (i !== j) {
      const edgeKey = i < j ? `${i}-${j}` : `${j}-${i}`;

      if (!edgeSet.has(edgeKey)) {
        const weight = Math.floor(Math.random() * 90) + 10;
        edges.push({
          source: Math.min(i, j),
          target: Math.max(i, j),
          weight: weight,
          id: `edge-${i}-${j}`,
        });
        edgeSet.add(edgeKey);
      }
    }
  }

  return { nodes, edges };
};

/**
 * Check if graph is connected using Depth-First Search (DFS)
 * 
 * Algorithm:
 * 1. Build adjacency list from edges
 * 2. Start DFS from node 0
 * 3. Count visited nodes
 * 4. If all nodes visited, graph is connected
 * 
 * Time Complexity: O(V + E) where V = vertices, E = edges
 * Space Complexity: O(V)
 * 
 * @param {object} graph - Graph object with nodes and edges
 * @returns {boolean} True if graph is connected, false otherwise
 */
export const isGraphConnected = (graph) => {
  const { nodes, edges } = graph;

  if (nodes.length === 0) return true;
  if (nodes.length === 1) return true;

  // Build adjacency list for efficient traversal
  const adjacencyList = new Map();
  
  // Initialize all nodes
  nodes.forEach(node => {
    adjacencyList.set(node.id, []);
  });

  // Add edges (both directions for undirected graph)
  edges.forEach(edge => {
    adjacencyList.get(edge.source).push(edge.target);
    adjacencyList.get(edge.target).push(edge.source);
  });

  // DFS to visit all reachable nodes from node 0
  const visited = new Set();
  const stack = [nodes[0].id]; // Start from first node

  while (stack.length > 0) {
    const nodeId = stack.pop();

    if (!visited.has(nodeId)) {
      visited.add(nodeId);

      // Add all unvisited neighbors to stack
      const neighbors = adjacencyList.get(nodeId) || [];
      neighbors.forEach(neighborId => {
        if (!visited.has(neighborId)) {
          stack.push(neighborId);
        }
      });
    }
  }

  // Graph is connected if all nodes were visited
  return visited.size === nodes.length;
};

/**
 * Get connected components in a graph
 * Useful for debugging and validation
 * 
 * @param {object} graph - Graph object with nodes and edges
 * @returns {array} Array of connected components (each component is array of node IDs)
 */
export const getConnectedComponents = (graph) => {
  const { nodes, edges } = graph;
  const adjacencyList = new Map();

  nodes.forEach(node => {
    adjacencyList.set(node.id, []);
  });

  edges.forEach(edge => {
    adjacencyList.get(edge.source).push(edge.target);
    adjacencyList.get(edge.target).push(edge.source);
  });

  const visited = new Set();
  const components = [];

  const dfs = (nodeId, component) => {
    visited.add(nodeId);
    component.push(nodeId);

    const neighbors = adjacencyList.get(nodeId) || [];
    neighbors.forEach(neighborId => {
      if (!visited.has(neighborId)) {
        dfs(neighborId, component);
      }
    });
  };

  nodes.forEach(node => {
    if (!visited.has(node.id)) {
      const component = [];
      dfs(node.id, component);
      components.push(component);
    }
  });

  return components;
};

/**
 * Validate graph structure and integrity
 * 
 * Checks:
 * - All edges reference valid node IDs
 * - No self-loops
 * - No duplicate edges
 * - All weights are positive
 * 
 * @param {object} graph - Graph object with nodes and edges
 * @returns {object} Validation result {valid: boolean, errors: array}
 */
export const validateGraph = (graph) => {
  const { nodes, edges } = graph;
  const errors = [];
  const nodeIds = new Set(nodes.map(n => n.id));

  edges.forEach((edge, index) => {
    // Check if nodes exist
    if (!nodeIds.has(edge.source)) {
      errors.push(`Edge ${index}: Invalid source node ID ${edge.source}`);
    }
    if (!nodeIds.has(edge.target)) {
      errors.push(`Edge ${index}: Invalid target node ID ${edge.target}`);
    }

    // Check for self-loops
    if (edge.source === edge.target) {
      errors.push(`Edge ${index}: Self-loop detected (node ${edge.source})`);
    }

    // Check weight
    if (!edge.weight || edge.weight <= 0) {
      errors.push(`Edge ${index}: Invalid weight ${edge.weight}`);
    }
  });

  // Check for duplicate edges
  const edgeSet = new Set();
  edges.forEach((edge, index) => {
    const normalizedKey = edge.source < edge.target 
      ? `${edge.source}-${edge.target}` 
      : `${edge.target}-${edge.source}`;

    if (edgeSet.has(normalizedKey)) {
      errors.push(`Duplicate edge: ${normalizedKey}`);
    }
    edgeSet.add(normalizedKey);
  });

  return {
    valid: errors.length === 0,
    errors: errors,
  };
};

/**
 * Calculate graph statistics
 * 
 * @param {object} graph - Graph object with nodes and edges
 * @returns {object} Statistics object
 */
export const getGraphStats = (graph) => {
  const { nodes, edges } = graph;

  if (nodes.length === 0 || edges.length === 0) {
    return {
      nodeCount: nodes.length,
      edgeCount: edges.length,
      density: 0,
      avgDegree: 0,
      minWeight: 0,
      maxWeight: 0,
      avgWeight: 0,
    };
  }

  // Calculate degree for each node
  const degrees = new Array(nodes.length).fill(0);
  edges.forEach(edge => {
    degrees[edge.source]++;
    degrees[edge.target]++;
  });

  // Calculate weights
  const weights = edges.map(e => e.weight);

  // Density = 2m / (n * (n-1)) for undirected graph
  const density = (2 * edges.length) / (nodes.length * (nodes.length - 1));

  return {
    nodeCount: nodes.length,
    edgeCount: edges.length,
    density: density.toFixed(4),
    avgDegree: (degrees.reduce((a, b) => a + b, 0) / nodes.length).toFixed(2),
    minWeight: Math.min(...weights),
    maxWeight: Math.max(...weights),
    avgWeight: (weights.reduce((a, b) => a + b, 0) / weights.length).toFixed(2),
  };
};

/**
 * Export graph to JSON format
 * Useful for saving/sharing graphs
 * 
 * @param {object} graph - Graph object with nodes and edges
 * @returns {string} JSON string representation
 */
export const exportGraphJSON = (graph) => {
  return JSON.stringify(graph, null, 2);
};

/**
 * Import graph from JSON format
 * 
 * @param {string} jsonString - JSON string representation
 * @returns {object} Graph object
 */
export const importGraphJSON = (jsonString) => {
  try {
    const graph = JSON.parse(jsonString);
    const validation = validateGraph(graph);

    if (!validation.valid) {
      throw new Error(`Invalid graph: ${validation.errors.join(', ')}`);
    }

    return graph;
  } catch (error) {
    throw new Error(`Failed to import graph: ${error.message}`);
  }
};
