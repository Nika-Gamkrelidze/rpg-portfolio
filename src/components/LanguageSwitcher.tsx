import React from "react";
import { useTranslation } from "react-i18next";

const supportedLanguages = [
  { code: "en", label: "En" },
  { code: "ka", label: "ქა" },
  { code: "ru", label: "Ру" },
];

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  return (
    <div className="flex items-center gap-1">
      {supportedLanguages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          className={`px-2 py-1 text-xs font-heading uppercase tracking-wider rounded-sm border transition-all duration-200 cursor-pointer
            ${i18n.language === lang.code
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
