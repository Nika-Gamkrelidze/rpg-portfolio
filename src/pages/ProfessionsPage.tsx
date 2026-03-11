import React from "react";
import { professions } from "@/data/mockData";
import WowTooltip from "@/components/WowTooltip";
import { Monitor, Server, Phone } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  Monitor: <Monitor className="w-6 h-6 text-primary" />,
  Server: <Server className="w-6 h-6 text-primary" />,
  Phone: <Phone className="w-6 h-6 text-primary" />,
};

const ProfessionsPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 h-full p-4 md:p-8 max-w-4xl mx-auto">
      <div className="text-center mb-4">
        <h1 className="font-heading text-2xl text-accent">Professions</h1>
        <p className="text-xs text-muted-foreground tracking-widest uppercase mt-1">
          Primary Skills
        </p>
      </div>

      <div className="space-y-4">
        {professions.map((prof) => {
          const pct = (prof.level / prof.maxLevel) * 100;
          return (
            <WowTooltip
              key={prof.id}
              title={prof.name}
              description={prof.description}
              stats={[
                { label: "Skill Level", value: `${prof.level}/${prof.maxLevel}` },
              ]}
            >
              <div className="border border-border rounded bg-card/60 p-5 hover:border-primary transition-colors cursor-pointer group">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 border border-primary rounded-sm bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    {iconMap[prof.icon] || <Monitor className="w-6 h-6 text-primary" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-foreground">{prof.name}</h3>
                  </div>
                  <span className="text-sm font-bold text-wow-parchment">
                    {prof.level}/{prof.maxLevel}
                  </span>
                </div>
                {/* WoW-style progress bar */}
                <div className="relative h-5 rounded-sm border border-primary/50 bg-background overflow-hidden">
                  <div
                    className="h-full rounded-sm transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, hsl(210, 70%, 35%), hsl(210, 70%, 50%), hsl(36, 45%, 46%))`,
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-foreground drop-shadow-md">
                      {prof.level} / {prof.maxLevel}
                    </span>
                  </div>
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                </div>
              </div>
            </WowTooltip>
          );
        })}
      </div>
    </div>
  );
};

export default ProfessionsPage;
