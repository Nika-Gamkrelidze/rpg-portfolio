import React from "react";

const supportedLanguages = [
  { code: "en", label: "En" },
  { code: "ge", label: "ქა" },
  { code: "ru", label: "Ру" },
];

interface LanguageSwitcherProps {
  current: string;
  onChange: (code: string) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ current, onChange }) => {
  return (
    <div className="flex items-center gap-1">
      {supportedLanguages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => onChange(lang.code)}
          className={`px-2 py-1 text-xs font-heading uppercase tracking-wider rounded-sm border transition-all duration-200 cursor-pointer
            ${current === lang.code
              ? "border-primary bg-primary/20 text-accent shadow-inner shadow-primary/20"
              : "border-border text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-secondary/50"
            }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
