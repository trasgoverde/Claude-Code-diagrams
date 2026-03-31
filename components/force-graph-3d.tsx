"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { buildGraphData, categoryColors, getGroups, type GraphData, type GraphNode } from "@/lib/graph-data";
import SpriteText from "three-spritetext";

// Dynamically import ForceGraph3D to avoid SSR issues
const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-[#0a0a12]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#4a9eff] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#e0e0e0] text-lg">Loading 3D Visualization...</p>
      </div>
    </div>
  ),
});

interface ForceGraph3DVisualizationProps {
  onNodeClick?: (node: GraphNode) => void;
}

export default function ForceGraph3DVisualization({ onNodeClick }: ForceGraph3DVisualizationProps) {
  const fgRef = useRef<any>();
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Build graph data
  useEffect(() => {
    const data = buildGraphData();
    setGraphData(data);
  }, []);

  // Handle window resize
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Filter data by group
  const filteredData = useMemo(() => {
    if (selectedGroup === "all") return graphData;

    const filteredNodes = graphData.nodes.filter((n) => n.group === selectedGroup);
    const nodeIds = new Set(filteredNodes.map((n) => n.id));
    const filteredLinks = graphData.links.filter(
      (l) =>
        nodeIds.has(typeof l.source === "string" ? l.source : (l.source as any).id) &&
        nodeIds.has(typeof l.target === "string" ? l.target : (l.target as any).id)
    );

    return { nodes: filteredNodes, links: filteredLinks };
  }, [graphData, selectedGroup]);

  const groups = useMemo(() => getGroups(graphData), [graphData]);

  // Camera auto-rotation
  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.cameraPosition({ x: 0, y: 0, z: 400 });
      
      // Auto-rotate
      let angle = 0;
      const rotationInterval = setInterval(() => {
        if (fgRef.current && !hoveredNode) {
          angle += 0.002;
          const distance = 400;
          fgRef.current.cameraPosition({
            x: distance * Math.sin(angle),
            y: 50,
            z: distance * Math.cos(angle),
          });
        }
      }, 30);

      return () => clearInterval(rotationInterval);
    }
  }, [hoveredNode]);

  // Custom node appearance
  const nodeThreeObject = useCallback((node: any) => {
    const sprite = new SpriteText(node.name);
    sprite.color = categoryColors[node.category] || "#ffffff";
    sprite.textHeight = 4;
    sprite.fontWeight = "bold";
    sprite.backgroundColor = "rgba(10, 10, 18, 0.8)";
    sprite.padding = 2;
    sprite.borderRadius = 3;
    return sprite;
  }, []);

  // Node color based on category
  const nodeColor = useCallback((node: any) => {
    return categoryColors[node.category] || "#4a9eff";
  }, []);

  // Handle node click
  const handleNodeClick = useCallback(
    (node: any) => {
      if (fgRef.current) {
        // Aim at node from outside
        const distance = 100;
        const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
        fgRef.current.cameraPosition(
          { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
          node,
          2000
        );
      }
      onNodeClick?.(node as GraphNode);
    },
    [onNodeClick]
  );

  return (
    <div className="relative w-full h-screen bg-[#0a0a12]">
      {/* Controls Panel */}
      <div className="absolute top-4 left-4 z-10 bg-[#12121e]/90 backdrop-blur-sm rounded-lg p-4 border border-[#2a2a3e] max-w-xs">
        <h2 className="text-[#4a9eff] font-bold text-lg mb-3">Claude Code Architecture</h2>
        <p className="text-[#888] text-sm mb-4">Internal codename: Tengu</p>
        
        <label className="block text-[#e0e0e0] text-sm mb-2">Filter by System:</label>
        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="w-full bg-[#1a1a2e] text-[#e0e0e0] border border-[#2a2a3e] rounded-md p-2 text-sm focus:outline-none focus:border-[#4a9eff]"
        >
          <option value="all">All Systems</option>
          {groups.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>

        <div className="mt-4 text-xs text-[#888]">
          <p className="mb-1">Nodes: {filteredData.nodes.length}</p>
          <p>Connections: {filteredData.links.length}</p>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 z-10 bg-[#12121e]/90 backdrop-blur-sm rounded-lg p-4 border border-[#2a2a3e]">
        <h3 className="text-[#e0e0e0] font-semibold text-sm mb-3">Categories</h3>
        <div className="space-y-2 text-xs">
          {Object.entries(categoryColors).slice(0, 9).map(([category, color]) => (
            <div key={category} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-[#e0e0e0] capitalize">{category}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hovered Node Info */}
      {hoveredNode && (
        <div className="absolute bottom-4 left-4 z-10 bg-[#12121e]/95 backdrop-blur-sm rounded-lg p-4 border border-[#2a2a3e] max-w-sm">
          <h3 className="text-lg font-bold" style={{ color: categoryColors[hoveredNode.category] }}>
            {hoveredNode.name}
          </h3>
          <p className="text-[#888] text-sm mt-1">{hoveredNode.group}</p>
          {hoveredNode.description && (
            <p className="text-[#e0e0e0] text-sm mt-2">{hoveredNode.description}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs px-2 py-1 rounded-full capitalize" style={{ backgroundColor: categoryColors[hoveredNode.category] + "33", color: categoryColors[hoveredNode.category] }}>
              {hoveredNode.category}
            </span>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-4 right-4 z-10 text-[#888] text-xs">
        <p>Click nodes to focus | Scroll to zoom | Drag to rotate</p>
      </div>

      {/* 3D Graph */}
      <ForceGraph3D
        ref={fgRef}
        graphData={filteredData}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="#0a0a12"
        nodeLabel={(node: any) => `<div style="background: #12121e; padding: 8px; border-radius: 4px; border: 1px solid #2a2a3e;">
          <strong style="color: ${categoryColors[(node as GraphNode).category]}">${node.name}</strong>
          ${node.description ? `<br/><span style="color: #888; font-size: 11px;">${node.description}</span>` : ""}
        </div>`}
        nodeColor={nodeColor}
        nodeVal={(node: any) => node.val || 10}
        nodeOpacity={0.9}
        nodeThreeObject={nodeThreeObject}
        nodeThreeObjectExtend={true}
        linkColor={() => "#4a9eff22"}
        linkWidth={0.5}
        linkOpacity={0.4}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={1}
        linkDirectionalParticleSpeed={0.005}
        linkDirectionalParticleColor={() => "#4a9eff"}
        onNodeClick={handleNodeClick}
        onNodeHover={(node: any) => setHoveredNode(node as GraphNode | null)}
        enableNodeDrag={true}
        enableNavigationControls={true}
        showNavInfo={false}
      />
    </div>
  );
}
