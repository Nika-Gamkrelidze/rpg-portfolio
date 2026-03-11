import React from "react";
import { useTranslation } from "react-i18next";
import WowTooltip from "./WowTooltip";

interface ResourceBarProps {
  label: string;
  current: number;
  max: number;
  variant: "stamina" | "mana";
  tooltip?: string;
}

const ResourceBar: React.FC<ResourceBarProps> = ({ label, current, max, variant, tooltip }) => {
  const { t } = useTranslation();
  const pct = (current / max) * 100;
  const barColors = {
    stamina: "from-green-700 via-green-500 to-green-400",
    mana: "from-blue-800 via-blue-500 to-blue-400",
  };

  const bar = (
    <div className="relative h-6 rounded-sm border border-primary/50 bg-background overflow-hidden">
      <div
        className={`h-full rounded-sm bg-gradient-to-r ${barColors[variant]} transition-all duration-700`}
        style={{ width: `${pct}%` }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-foreground drop-shadow-md">
          {label}: {current} / {max}
        </span>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
    </div>
  );

  if (tooltip) {
    return (
      <WowTooltip title={label} description={tooltip} stats={[{ label: t("character.current"), value: `${current}/${max}` }]}>
        {bar}
      </WowTooltip>
    );
  }
  return bar;
};

export default ResourceBar;
