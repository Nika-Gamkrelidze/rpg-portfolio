import React from "react";
import { backpack } from "@/data/mockData";
import WowTooltip from "@/components/WowTooltip";
import {
  Code, Github, Container, Figma, Send, ClipboardList,
  MessageCircle, Terminal, Package, Search, GitBranch,
  Monitor, Cloud, Database, Shield, Boxes
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  Code: <Code className="w-6 h-6" />,
  Github: <Github className="w-6 h-6" />,
  Container: <Container className="w-6 h-6" />,
  Figma: <Figma className="w-6 h-6" />,
  Send: <Send className="w-6 h-6" />,
  ClipboardList: <ClipboardList className="w-6 h-6" />,
  MessageCircle: <MessageCircle className="w-6 h-6" />,
  Terminal: <Terminal className="w-6 h-6" />,
  Package: <Package className="w-6 h-6" />,
  Search: <Search className="w-6 h-6" />,
  GitBranch: <GitBranch className="w-6 h-6" />,
  Monitor: <Monitor className="w-6 h-6" />,
  Cloud: <Cloud className="w-6 h-6" />,
  Database: <Database className="w-6 h-6" />,
  Shield: <Shield className="w-6 h-6" />,
  Boxes: <Boxes className="w-6 h-6" />,
};

const rarityColors: Record<string, string> = {
  common: "text-foreground border-border",
  uncommon: "text-wow-green border-wow-green/50",
  rare: "text-wow-blue border-wow-blue/50",
  epic: "text-purple-400 border-purple-400/50",
  legendary: "text-accent border-accent/50",
};

const rarityGlow: Record<string, string> = {
  legendary: "animate-talent-glow",
  epic: "",
  rare: "",
  uncommon: "",
  common: "",
};

const InventoryPage: React.FC = () => {
  // Fill grid to 24 slots
  const totalSlots = 24;
  const emptySlots = totalSlots - backpack.length;

  return (
    <div className="flex flex-col gap-6 h-full p-4 md:p-8 max-w-4xl mx-auto">
      <div className="text-center mb-2">
        <h1 className="font-heading text-2xl text-accent">Inventory</h1>
        <p className="text-xs text-muted-foreground tracking-widest uppercase mt-1">
          Backpack — {backpack.length}/{totalSlots} Slots Used
        </p>
      </div>

      <div className="border border-primary rounded bg-card/40 p-4">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {backpack.map((item) => (
            <WowTooltip
              key={item.id}
              title={item.name}
              description={item.description}
              rank={item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
            >
              <div
                className={`w-full aspect-square border-2 rounded-sm bg-secondary/40 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-secondary/70 transition-all ${rarityColors[item.rarity]} ${rarityGlow[item.rarity]}`}
              >
                <div className={rarityColors[item.rarity].split(" ")[0]}>
                  {iconMap[item.icon] || <Package className="w-6 h-6" />}
                </div>
                <span className="text-[8px] leading-tight text-center font-semibold px-0.5 truncate w-full">
                  {item.name}
                </span>
              </div>
            </WowTooltip>
          ))}
          {/* Empty slots */}
          {Array.from({ length: emptySlots }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="w-full aspect-square border border-border/30 rounded-sm bg-secondary/10"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
