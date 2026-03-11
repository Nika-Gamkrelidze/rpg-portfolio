import React, { useState, useRef, useEffect } from "react";

interface WowTooltipProps {
  title: string;
  children: React.ReactNode;
  description?: string;
  stats?: { label: string; value: string | number }[];
  rank?: string;
}

const WowTooltip: React.FC<WowTooltipProps> = ({ title, children, description, stats, rank }) => {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const tooltip = tooltipRef.current;
    if (!tooltip) {
      setPos({ x: e.clientX + 16, y: e.clientY + 16 });
      return;
    }
    const rect = tooltip.getBoundingClientRect();
    let x = e.clientX + 16;
    let y = e.clientY + 16;
    if (x + rect.width > window.innerWidth - 8) x = e.clientX - rect.width - 8;
    if (y + rect.height > window.innerHeight - 8) y = e.clientY - rect.height - 8;
    setPos({ x, y });
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onMouseMove={handleMouseMove}
      className="inline-block"
    >
      {children}
      {visible && (
        <div
          ref={tooltipRef}
          className="fixed z-[100] pointer-events-none min-w-[220px] max-w-[320px] rounded border border-primary bg-popover/95 backdrop-blur-sm p-3 shadow-lg shadow-primary/20"
          style={{ left: pos.x, top: pos.y }}
        >
          <h4 className="font-heading text-sm font-bold text-accent mb-1">{title}</h4>
          {rank && (
            <p className="text-xs text-muted-foreground mb-1">{rank}</p>
          )}
          {description && (
            <p className="text-xs text-foreground leading-relaxed mb-2">{description}</p>
          )}
          {stats && stats.length > 0 && (
            <div className="space-y-0.5 border-t border-border pt-2">
              {stats.map((s) => (
                <div key={s.label} className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="text-wow-green font-semibold">{s.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WowTooltip;
