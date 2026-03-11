import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { User, Briefcase, GitBranch, Backpack, Trophy } from "lucide-react";

const tabs = [
  { to: "/", labelKey: "nav.character", icon: User },
  { to: "/professions", labelKey: "nav.professions", icon: Briefcase },
  { to: "/talents", labelKey: "nav.talents", icon: GitBranch },
  { to: "/inventory", labelKey: "nav.inventory", icon: Backpack },
  { to: "/achievements", labelKey: "nav.achievements", icon: Trophy },
];

const WowNavBar: React.FC = () => {
  const { t } = useTranslation();

  return (
    <nav className="flex items-center justify-center gap-1 py-2 px-4 bg-card/80 border-t border-primary">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === "/"}
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-sm text-xs font-heading uppercase tracking-wider transition-all duration-200
            ${
              isActive
                ? "bg-primary/20 text-accent border border-primary shadow-inner shadow-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 border border-transparent"
            }`
          }
        >
          <tab.icon className="w-4 h-4" />
          <span className="hidden sm:inline">{t(tab.labelKey)}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default WowNavBar;
