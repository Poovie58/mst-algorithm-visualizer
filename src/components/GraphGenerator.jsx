import React, { useState } from 'react';
import { generateRandomGraph, isGraphConnected } from '../utils/graphUtils';

/**
 * GraphGenerator Component
 * 
 * Responsive graph generation interface supporting:
 * - Mobile (<768px): Stacked vertical layout, full-width inputs
 * - Tablet (768-1024px): Horizontal layout with flexbox
 * - Desktop (>1024px): Side-by-side layout with sidebar
 * 
 * Features:
 * - Node count slider (5-100) with real-time preview
 * - Graph density selection (sparse/dense/custom)
 * - Connected graph validation using DFS
 * - Touch-friendly controls for mobile (44x44px minimum tap targets)
 */
const GraphGenerator = ({ onGraphGenerated }) => {
  // State management
  const [nodeCount, setNodeCount] = useState(10);
  const [density, setDensity] = useState('medium'); // 'sparse', 'medium', 'dense', 'custom'
  const [customEdgeProbability, setCustomEdgeProbability] = useState(0.3);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [graphStats, setGraphStats] = useState(null);

  /**
   * Handle node count change from slider
   * Real-time update for both desktop and mobile
   */
  const handleNodeCountChange = (e) => {
    const value = parseInt(e.target.value);
    setNodeCount(value);
    setError(''); // Clear error on input change
  };

  /**
   * Handle density preset selection
   * Updates custom probability slider when custom is selected
   */
  const handleDensityChange = (e) => {
    const value = e.target.value;
    setDensity(value);
    setError('');
    
    // Auto-set probability for presets
    if (value === 'sparse') setCustomEdgeProbability(0.2);
    if (value === 'medium') setCustomEdgeProbability(0.3);
    if (value === 'dense') setCustomEdgeProbability(0.6);
  };

  /**
   * Map density label to edge probability
   * Used when generating the random graph
   */
  const getDensityProbability = () => {
    const probabilities = {
      sparse: 0.2,
      medium: 0.3,
      dense: 0.6,
      custom: customEdgeProbability,
    };
    return probabilities[density] || 0.3;
  };

  /**
   * Main graph generation handler
   * 1. Generates random graph with specified parameters
   * 2. Validates if graph is connected (no isolated components)
   * 3. Retries up to 5 times if validation fails
   * 4. Calls parent callback with generated graph
   */
  const handleGenerateGraph = async () => {
    setIsGenerating(true);
    setError('');
    setGraphStats(null);

    try {
      const edgeProbability = getDensityProbability();
      let generatedGraph = null;
      let attempts = 0;
      const maxAttempts = 5;

      // Retry logic: ensure connected graph
      while (attempts < maxAttempts) {
        generatedGraph = generateRandomGraph(nodeCount, edgeProbability);
        
        // Validate: graph must be connected
        if (isGraphConnected(generatedGraph)) {
          break;
        }
        attempts++;
      }

      // Error handling: if still not connected after retries
      if (!isGraphConnected(generatedGraph)) {
        setError(
          `Failed to generate connected graph after ${maxAttempts} attempts. ` +
          'Try increasing edge density or node count.'
        );
        setIsGenerating(false);
        return;
      }

      // Calculate and display graph statistics
      const stats = {
        nodeCount: generatedGraph.nodes.length,
        edgeCount: generatedGraph.edges.length,
        density: (
          (2 * generatedGraph.edges.length) /
          (generatedGraph.nodes.length * (generatedGraph.nodes.length - 1))
        ).toFixed(3),
        minWeight: Math.min(...generatedGraph.edges.map(e => e.weight)),
        maxWeight: Math.max(...generatedGraph.edges.map(e => e.weight)),
      };

      setGraphStats(stats);
      
      // Notify parent component with generated graph
      if (onGraphGenerated) {
        onGraphGenerated(generatedGraph);
      }

      // Simulate network delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      {/* Main container - responsive grid layout */}
      <div className="max-w-7xl mx-auto">
        {/* Header - responsive text sizing */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          Graph Generator
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mb-8">
          Configure and generate a random connected graph for algorithm comparison
        </p>

        {/* Main content - responsive flex layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Control Panel - Column 1 (mobile: full width, tablet/desktop: sidebar) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                  ⚙️
                </span>
                Configuration
              </h2>

              {/* Node Count Slider */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Number of Nodes: <span className="text-indigo-600 font-bold">{nodeCount}</span>
                </label>
                
                {/* Slider - touch-optimized for mobile */}
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="1"
                  value={nodeCount}
                  onChange={handleNodeCountChange}
                  className="
                    w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer
                    accent-indigo-600 hover:accent-indigo-700
                    transition-colors duration-200
                    [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
                    [&::-webkit-slider-thumb]:bg-indigo-600 [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md
                    [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6
                    [&::-moz-range-thumb]:bg-indigo-600 [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0
                  "
                  aria-label="Number of nodes slider"
                />
                
                {/* Slider range display */}
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>5</span>
                  <span>100</span>
                </div>
              </div>

              {/* Graph Density Selection */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Edge Density
                </label>

                {/* Radio buttons - responsive stack on mobile */}
                <div className="space-y-3">
                  {/* Sparse option */}
                  <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-indigo-400 transition-colors duration-200" style={{minHeight: '44px'}}>
                    <input
                      type="radio"
                      name="density"
                      value="sparse"
                      checked={density === 'sparse'}
                      onChange={handleDensityChange}
                      className="w-5 h-5 text-indigo-600 cursor-pointer"
                      aria-label="Sparse edge density"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-gray-800">Sparse</div>
                      <div className="text-xs text-gray-500">~20% edges</div>
                    </div>
                  </label>

                  {/* Medium option */}
                  <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-indigo-400 transition-colors duration-200" style={{minHeight: '44px'}}>
                    <input
                      type="radio"
                      name="density"
                      value="medium"
                      checked={density === 'medium'}
                      onChange={handleDensityChange}
                      className="w-5 h-5 text-indigo-600 cursor-pointer"
                      aria-label="Medium edge density"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-gray-800">Medium</div>
                      <div className="text-xs text-gray-500">~30% edges</div>
                    </div>
                  </label>

                  {/* Dense option */}
                  <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-indigo-400 transition-colors duration-200" style={{minHeight: '44px'}}>
                    <input
                      type="radio"
                      name="density"
                      value="dense"
                      checked={density === 'dense'}
                      onChange={handleDensityChange}
                      className="w-5 h-5 text-indigo-600 cursor-pointer"
                      aria-label="Dense edge density"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-gray-800">Dense</div>
                      <div className="text-xs text-gray-500">~60% edges</div>
                    </div>
                  </label>

                  {/* Custom option */}
                  <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-indigo-400 transition-colors duration-200" style={{minHeight: '44px'}}>
                    <input
                      type="radio"
                      name="density"
                      value="custom"
                      checked={density === 'custom'}
                      onChange={handleDensityChange}
                      className="w-5 h-5 text-indigo-600 cursor-pointer"
                      aria-label="Custom edge density"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-gray-800">Custom</div>
                      <div className="text-xs text-gray-500">Manual setting</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Custom Probability Slider - Shows only when custom is selected */}
              {density === 'custom' && (
                <div className="mb-8 p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-600">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Edge Probability: <span className="text-indigo-600 font-bold">{(customEdgeProbability * 100).toFixed(0)}%</span>
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={customEdgeProbability}
                    onChange={(e) => setCustomEdgeProbability(parseFloat(e.target.value))}
                    className="
                      w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                      accent-indigo-600 hover:accent-indigo-700
                      [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                      [&::-webkit-slider-thumb]:bg-indigo-600 [&::-webkit-slider-thumb]:rounded-full
                      [&::-webkit-slider-thumb]:cursor-pointer
                      [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5
                      [&::-moz-range-thumb]:bg-indigo-600 [&::-moz-range-thumb]:rounded-full
                      [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0
                    "
                    aria-label="Custom edge probability slider"
                  />
                </div>
              )}

              {/* Generate Button - Touch-friendly size (44px minimum) */}
              <button
                onClick={handleGenerateGraph}
                disabled={isGenerating}
                className="
                  w-full py-3 sm:py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400
                  text-white font-semibold rounded-lg shadow-md
                  transition-all duration-200 transform hover:scale-105 active:scale-95
                  disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100
                  text-sm sm:text-base
                  flex items-center justify-center gap-2
                  min-h-[44px]
                "
                aria-busy={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Generating...
                  </>
                ) : (
                  <>
                    ✨ Generate Graph
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Panel - Columns 2-3 (mobile: full width below control, tablet/desktop: side-by-side) */}
          <div className="lg:col-span-2">
            {/* Error Message - responsive styling */}
            {error && (
              <div className="mb-6 p-4 sm:p-6 bg-red-50 border-l-4 border-red-600 rounded-lg animate-pulse">
                <h3 className="text-sm sm:text-base font-semibold text-red-800 flex items-center gap-2">
                  <span className="text-lg">⚠️</span> Error
                </h3>
                <p className="text-red-700 mt-2 text-sm sm:text-base">{error}</p>
              </div>
            )}

            {/* Graph Statistics - responsive cards */}
            {graphStats && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    ✓
                  </span>
                  Graph Statistics
                </h2>

                {/* Stats Grid - responsive columns */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Node Count Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border-l-4 border-blue-600">
                    <div className="text-xs sm:text-sm text-gray-600 font-medium mb-1">Nodes</div>
                    <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                      {graphStats.nodeCount}
                    </div>
                  </div>

                  {/* Edge Count Card */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border-l-4 border-green-600">
                    <div className="text-xs sm:text-sm text-gray-600 font-medium mb-1">Edges</div>
                    <div className="text-2xl sm:text-3xl font-bold text-green-600">
                      {graphStats.edgeCount}
                    </div>
                  </div>

                  {/* Density Card */}
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border-l-4 border-purple-600">
                    <div className="text-xs sm:text-sm text-gray-600 font-medium mb-1">Density</div>
                    <div className="text-2xl sm:text-3xl font-bold text-purple-600">
                      {graphStats.density}
                    </div>
                  </div>

                  {/* Min Weight Card */}
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border-l-4 border-orange-600">
                    <div className="text-xs sm:text-sm text-gray-600 font-medium mb-1">Min Weight</div>
                    <div className="text-2xl sm:text-3xl font-bold text-orange-600">
                      {graphStats.minWeight}
                    </div>
                  </div>

                  {/* Max Weight Card */}
                  <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border-l-4 border-red-600">
                    <div className="text-xs sm:text-sm text-gray-600 font-medium mb-1">Max Weight</div>
                    <div className="text-2xl sm:text-3xl font-bold text-red-600">
                      {graphStats.maxWeight}
                    </div>
                  </div>

                  {/* Edge Count / Node Ratio Card */}
                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 border-l-4 border-indigo-600">
                    <div className="text-xs sm:text-sm text-gray-600 font-medium mb-1">E/N Ratio</div>
                    <div className="text-2xl sm:text-3xl font-bold text-indigo-600">
                      {(graphStats.edgeCount / graphStats.nodeCount).toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Info Box */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                  <p className="text-xs sm:text-sm text-blue-800">
                    <span className="font-semibold">✓ Graph is connected</span> - Ready for algorithm comparison!
                  </p>
                </div>
              </div>
            )}

            {/* Empty State - when no graph generated yet */}
            {!graphStats && !error && (
              <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                  No Graph Generated Yet
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  Configure the parameters on the left and click "Generate Graph" to create a random connected graph.
                </p>
                <div className="text-xs sm:text-sm text-gray-500 bg-gray-50 rounded p-3 inline-block">
                  The graph will automatically be validated to ensure all nodes are connected.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphGenerator;
