import React from "react";
import { dungeonsConquered } from "@/data/mockData";
import WowTooltip from "@/components/WowTooltip";
import {
  MessageSquare, Phone, ShoppingCart, Users, Network, Activity, Trophy
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  MessageSquare: <MessageSquare className="w-8 h-8" />,
  Phone: <Phone className="w-8 h-8" />,
  ShoppingCart: <ShoppingCart className="w-8 h-8" />,
  Users: <Users className="w-8 h-8" />,
  Network: <Network className="w-8 h-8" />,
  Activity: <Activity className="w-8 h-8" />,
};

const AchievementsPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 h-full p-4 md:p-8 max-w-4xl mx-auto">
      <div className="text-center mb-2">
        <h1 className="font-heading text-2xl text-accent">Achievements</h1>
        <p className="text-xs text-muted-foreground tracking-widest uppercase mt-1">
          Dungeons Conquered — {dungeonsConquered.filter((d) => d.completed).length}/{dungeonsConquered.length}
        </p>
      </div>

      <div className="space-y-3">
        {dungeonsConquered.map((achievement) => (
          <WowTooltip
            key={achievement.id}
            title={achievement.title}
            description={achievement.description}
            stats={[
              { label: "Year", value: achievement.year },
              { label: "Party Size", value: achievement.teamSize },
            ]}
            rank={achievement.completed ? "Completed" : "In Progress"}
          >
            <div
              className={`border rounded bg-card/60 p-4 flex items-center gap-4 cursor-pointer transition-all duration-300 group ${
                achievement.completed
                  ? "border-primary hover:border-accent"
                  : "border-border opacity-60"
              }`}
            >
              <div className={`w-14 h-14 border-2 rounded-sm flex items-center justify-center ${
                achievement.completed
                  ? "border-primary bg-secondary/60 text-accent group-hover:border-accent group-hover:animate-talent-glow"
                  : "border-border bg-muted/40 text-muted-foreground"
              }`}>
                {iconMap[achievement.icon] || <Trophy className="w-8 h-8" />}
              </div>
              <div className="flex-1">
                <h3 className={`text-sm font-semibold ${achievement.completed ? "text-foreground" : "text-muted-foreground"}`}>
                  {achievement.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {achievement.year} · Party of {achievement.teamSize}
                </p>
              </div>
              {achievement.completed && (
                <div className="text-wow-green text-xs font-bold uppercase tracking-wider">
                  ✓ Cleared
                </div>
              )}
            </div>
          </WowTooltip>
        ))}
      </div>
    </div>
  );
};

export default AchievementsPage;
