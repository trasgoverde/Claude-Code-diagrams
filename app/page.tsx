"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { GraphNode } from "@/lib/graph-data";

// Dynamically import the 3D visualization to avoid SSR issues with Three.js
const ForceGraph3DVisualization = dynamic(
  () => import("@/components/force-graph-3d"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen flex items-center justify-center bg-[#0a0a12]">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-[#4a9eff] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <h1 className="text-[#e0e0e0] text-2xl font-bold mb-2">Claude Code Architecture</h1>
          <p className="text-[#888] text-lg">Initializing 3D Visualization...</p>
        </div>
      </div>
    ),
  }
);

export default function Home() {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  return (
    <main className="w-full h-screen overflow-hidden">
      <ForceGraph3DVisualization
        onNodeClick={(node) => setSelectedNode(node)}
      />

      {/* Node Detail Modal */}
      {selectedNode && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedNode(null)}
        >
          <div
            className="bg-[#12121e] border border-[#2a2a3e] rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-[#e0e0e0]">{selectedNode.name}</h2>
                <p className="text-[#888] text-sm">{selectedNode.group}</p>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-[#888] hover:text-[#e0e0e0] transition-colors text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            {selectedNode.description && (
              <p className="text-[#e0e0e0] mb-4">{selectedNode.description}</p>
            )}

            <div className="flex flex-wrap gap-2">
              <span
                className="text-xs px-3 py-1 rounded-full capitalize font-medium"
                style={{
                  backgroundColor: getCategoryColor(selectedNode.category) + "22",
                  color: getCategoryColor(selectedNode.category),
                  border: `1px solid ${getCategoryColor(selectedNode.category)}44`,
                }}
              >
                {selectedNode.category}
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-[#1a1a2e] text-[#888] border border-[#2a2a3e]">
                ID: {selectedNode.id}
              </span>
            </div>

            <div className="mt-6 pt-4 border-t border-[#2a2a3e]">
              <p className="text-[#888] text-xs">
                Click outside or press the X to close
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    entry: "#17a2b8",
    ui: "#6f42c1",
    core: "#e83e8c",
    tool: "#28a745",
    context: "#fd7e14",
    permission: "#dc3545",
    state: "#4a9eff",
    extension: "#ffc107",
    external: "#888888",
    process: "#4a9eff",
    decision: "#ffc107",
    api: "#28a745",
    response: "#fd7e14",
  };
  return colors[category] || "#4a9eff";
}
