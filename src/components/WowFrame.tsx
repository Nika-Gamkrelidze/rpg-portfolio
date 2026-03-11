import React, { useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";

const WowFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState("en");

  return (
    <div className="fixed inset-0 flex flex-col bg-background">
      {/* Top ornate border with language switcher */}
      <div className="relative h-10 flex items-center justify-between px-4 border-b border-primary/30">
        <div className="h-[2px] absolute bottom-0 left-0 right-0 bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />
        <div className="text-xs font-heading text-primary tracking-widest uppercase opacity-70">
          WoW Portfolio
        </div>
        <LanguageSwitcher current={lang} onChange={setLang} />
      </div>

      {/* Main content with side borders */}
      <div className="flex-1 flex overflow-hidden">
        <div className="w-1 bg-gradient-to-b from-primary/40 via-primary/20 to-primary/40" />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
        <div className="w-1 bg-gradient-to-b from-primary/40 via-primary/20 to-primary/40" />
      </div>

      {/* Bottom border */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />
    </div>
  );
};

export default WowFrame;
