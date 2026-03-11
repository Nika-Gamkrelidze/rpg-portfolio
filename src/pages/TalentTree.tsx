import React, { useState, useMemo } from "react";
import { talentNodes, talentEdges } from "@/data/mockData";
import WowTooltip from "@/components/WowTooltip";
import {
  FileCode, Palette, Braces, Brush, Layout,
  Hexagon, Triangle, Database, Zap, Smartphone,
  Box, Gem, Layers, ArrowLeftRight, RefreshCw,
  Radio, Phone, PhoneCall, Video, Mic,
  Headphones, BarChart, Server, PhoneForwarded, Router
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  FileCode: <FileCode className="w-5 h-5" />,
  Palette: <Palette className="w-5 h-5" />,
  Braces: <Braces className="w-5 h-5" />,
  Brush: <Brush className="w-5 h-5" />,
  Layout: <Layout className="w-5 h-5" />,
  Hexagon: <Hexagon className="w-5 h-5" />,
  Triangle: <Triangle className="w-5 h-5" />,
  Database: <Database className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Smartphone: <Smartphone className="w-5 h-5" />,
  Box: <Box className="w-5 h-5" />,
  Gem: <Gem className="w-5 h-5" />,
  Layers: <Layers className="w-5 h-5" />,
  ArrowLeftRight: <ArrowLeftRight className="w-5 h-5" />,
  RefreshCw: <RefreshCw className="w-5 h-5" />,
  Radio: <Radio className="w-5 h-5" />,
  Phone: <Phone className="w-5 h-5" />,
  PhoneCall: <PhoneCall className="w-5 h-5" />,
  Video: <Video className="w-5 h-5" />,
  Mic: <Mic className="w-5 h-5" />,
  Headphones: <Headphones className="w-5 h-5" />,
  BarChart: <BarChart className="w-5 h-5" />,
  Server: <Server className="w-5 h-5" />,
  PhoneForwarded: <PhoneForwarded className="w-5 h-5" />,
  Router: <Router className="w-5 h-5" />,
};

const CELL = 100;
const NODE_SIZE = 56;
const OFFSET_X = 50;
const OFFSET_Y = 40;

const treeLabels: Record<string, { label: string; xCenter: number }> = {
  frontend: { label: "Frontend", xCenter: 1.5 },
  backend: { label: "Backend", xCenter: 5 },
  sql: { label: "SQL / NoSQL", xCenter: 8 },
  voip: { label: "VoIP / Telecom", xCenter: 10.5 },
};

const TalentTree: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeTree, setActiveTree] = useState<string | null>(null);

  const trees = ["frontend", "backend", "sql", "voip"];

  const nodePositions = useMemo(() => {
    const map: Record<string, { cx: number; cy: number }> = {};
    talentNodes.forEach((n) => {
      map[n.id] = {
        cx: OFFSET_X + n.x * CELL + NODE_SIZE / 2,
        cy: OFFSET_Y + n.y * CELL + NODE_SIZE / 2,
      };
    });
    return map;
  }, []);

  const highlightSet = useMemo(() => {
    if (!hoveredId) return new Set<string>();
    const node = talentNodes.find((n) => n.id === hoveredId);
    if (!node) return new Set<string>();
    // Recursively find all prerequisites
    const s = new Set<string>([hoveredId]);
    const addPrereqs = (id: string) => {
      const n = talentNodes.find((t) => t.id === id);
      if (!n) return;
      n.prerequisites.forEach((p) => {
        s.add(p);
        addPrereqs(p);
      });
    };
    addPrereqs(hoveredId);
    return s;
  }, [hoveredId]);

  const filteredNodes = activeTree
    ? talentNodes.filter((n) => n.tree === activeTree)
    : talentNodes;

  const filteredNodeIds = new Set(filteredNodes.map((n) => n.id));
  const filteredEdges = talentEdges.filter(
    (e) => filteredNodeIds.has(e.from) && filteredNodeIds.has(e.to)
  );

  // Calculate SVG bounds
  const maxX = Math.max(...filteredNodes.map((n) => n.x));
  const maxY = Math.max(...filteredNodes.map((n) => n.y));
  const svgWidth = OFFSET_X * 2 + (maxX + 1) * CELL + NODE_SIZE;
  const svgHeight = OFFSET_Y * 2 + (maxY + 1) * CELL + NODE_SIZE;

  return (
    <div className="flex flex-col h-full p-4 md:p-6">
      <div className="text-center mb-3">
        <h1 className="font-heading text-2xl text-accent">Talent Tree</h1>
        <p className="text-xs text-muted-foreground tracking-widest uppercase mt-1">
          Technology Specializations
        </p>
      </div>

      {/* Tree filter tabs */}
      <div className="flex items-center justify-center gap-1 mb-3 flex-wrap">
        <button
          onClick={() => setActiveTree(null)}
          className={`px-3 py-1.5 text-xs font-heading uppercase tracking-wider rounded-sm border transition-all cursor-pointer ${
            !activeTree
              ? "border-primary bg-primary/20 text-accent"
              : "border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
          }`}
        >
          All Trees
        </button>
        {trees.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTree(t)}
            className={`px-3 py-1.5 text-xs font-heading uppercase tracking-wider rounded-sm border transition-all cursor-pointer ${
              activeTree === t
                ? "border-primary bg-primary/20 text-accent"
                : "border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
            }`}
          >
            {treeLabels[t]?.label || t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto flex items-start justify-center">
        <div className="border border-primary rounded bg-card/30 p-2 inline-block">
          <svg
            width={svgWidth}
            height={svgHeight}
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="block"
          >
            {/* Tree labels */}
            {Object.entries(treeLabels).map(([key, val]) => {
              if (activeTree && activeTree !== key) return null;
              return (
                <text
                  key={key}
                  x={OFFSET_X + val.xCenter * CELL}
                  y={OFFSET_Y - 14}
                  textAnchor="middle"
                  className="fill-primary font-heading"
                  fontSize="11"
                >
                  {val.label}
                </text>
              );
            })}

            {/* Edges */}
            {filteredEdges.map((edge) => {
              const from = nodePositions[edge.from];
              const to = nodePositions[edge.to];
              if (!from || !to) return null;
              const isHighlighted = highlightSet.has(edge.from) && highlightSet.has(edge.to);
              return (
                <line
                  key={`${edge.from}-${edge.to}`}
                  x1={from.cx} y1={from.cy}
                  x2={to.cx} y2={to.cy}
                  stroke={isHighlighted ? "hsl(51, 100%, 50%)" : "hsl(36, 30%, 30%)"}
                  strokeWidth={isHighlighted ? 3 : 1.5}
                  opacity={isHighlighted ? 1 : 0.5}
                  className="transition-all duration-300"
                />
              );
            })}

            {/* Nodes */}
            {filteredNodes.map((node) => {
              const pos = nodePositions[node.id];
              if (!pos) return null;
              const isLearned = node.learned;
              const isHovered = hoveredId === node.id;
              const isInHighlight = highlightSet.has(node.id);

              return (
                <g key={node.id}>
                  <foreignObject
                    x={pos.cx - NODE_SIZE / 2}
                    y={pos.cy - NODE_SIZE / 2}
                    width={NODE_SIZE}
                    height={NODE_SIZE}
                  >
                    <WowTooltip
                      title={node.name}
                      description={node.description}
                      rank={isLearned ? "Learned" : "Locked"}
                      stats={[
                        { label: "Tree", value: node.tree.charAt(0).toUpperCase() + node.tree.slice(1) },
                        { label: "Status", value: isLearned ? "Active" : "Requires prerequisites" },
                      ]}
                    >
                      <div
                        onMouseEnter={() => setHoveredId(node.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        className={`
                          w-14 h-14 border-2 rounded-sm flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-all duration-300
                          ${isLearned
                            ? isHovered || isInHighlight
                              ? "border-accent bg-secondary/80 animate-talent-glow"
                              : "border-primary bg-secondary/60 hover:border-accent"
                            : "border-border bg-muted/40 opacity-50 grayscale"
                          }
                        `}
                      >
                        <div className={isLearned ? "text-accent" : "text-muted-foreground"}>
                          {iconMap[node.icon] || <Zap className="w-5 h-5" />}
                        </div>
                        <span className={`text-[8px] leading-tight text-center font-semibold ${isLearned ? "text-foreground" : "text-muted-foreground"}`}>
                          {node.name}
                        </span>
                      </div>
                    </WowTooltip>
                  </foreignObject>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default TalentTree;
