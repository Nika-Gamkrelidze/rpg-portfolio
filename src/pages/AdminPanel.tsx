import React, { useState, useEffect, useCallback } from "react";
import { adminApi } from "@/services/adminApi";
import {
  ChevronDown, ChevronRight, Save, Plus, Trash2, RefreshCw, AlertCircle, CheckCircle2,
  User, Swords, BookOpen, Languages as LangIcon, Heart, ScrollText, Briefcase, Backpack,
  Trophy, GitBranch, Globe, Settings, Link2
} from "lucide-react";

// ─── Types ───
interface SaveStatus { state: "idle" | "saving" | "saved" | "error"; message?: string }

// ─── Helpers ───
const cls = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(" ");

function CollapsibleSection({ title, icon: Icon, children, defaultOpen = false }: {
  title: string; icon: React.ElementType; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-primary/40 rounded bg-card/40 mb-3">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/30 transition-colors cursor-pointer">
        <Icon className="w-5 h-5 text-accent" />
        <span className="font-heading text-sm text-accent uppercase tracking-wider flex-1 text-left">{title}</span>
        {open ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && <div className="px-4 pb-4 border-t border-primary/20">{children}</div>}
    </div>
  );
}

function Input({ label, value, onChange, type = "text", className = "" }: {
  label: string; value: string | number; onChange: (v: string) => void; type?: string; className?: string;
}) {
  return (
    <label className={cls("block", className)}>
      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-0.5 w-full bg-background border border-border rounded px-2 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
      />
    </label>
  );
}

function Textarea({ label, value, onChange, rows = 3 }: {
  label: string; value: string; onChange: (v: string) => void; rows?: number;
}) {
  return (
    <label className="block">
      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="mt-0.5 w-full bg-background border border-border rounded px-2 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none resize-y"
      />
    </label>
  );
}

function Select({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-0.5 w-full bg-background border border-border rounded px-2 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

function SaveButton({ status, onClick }: { status: SaveStatus; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={status.state === "saving"}
      className={cls(
        "flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-heading uppercase tracking-wider border transition-all cursor-pointer",
        status.state === "saving" && "opacity-50 cursor-wait",
        status.state === "saved" ? "border-wow-green text-wow-green bg-wow-green/10" :
        status.state === "error" ? "border-red-500 text-red-400 bg-red-500/10" :
        "border-primary text-accent bg-primary/20 hover:bg-primary/30"
      )}
    >
      {status.state === "saving" ? <RefreshCw className="w-3 h-3 animate-spin" /> :
       status.state === "saved" ? <CheckCircle2 className="w-3 h-3" /> :
       status.state === "error" ? <AlertCircle className="w-3 h-3" /> :
       <Save className="w-3 h-3" />}
      {status.state === "saving" ? "Saving..." : status.state === "saved" ? "Saved!" : status.state === "error" ? "Error" : "Save"}
    </button>
  );
}

// ─── Main Admin Panel ───
const AdminPanel: React.FC = () => {
  const [character, setCharacter] = useState<any>(null);
  const [talents, setTalents] = useState<any>(null);
  const [professions, setProfessions] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [activeLang, setActiveLang] = useState("en");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatuses, setSaveStatuses] = useState<Record<string, SaveStatus>>({});

  const setSaveStatus = useCallback((key: string, status: SaveStatus) => {
    setSaveStatuses((prev) => ({ ...prev, [key]: status }));
    if (status.state === "saved") {
      setTimeout(() => setSaveStatuses((prev) => ({ ...prev, [key]: { state: "idle" } })), 2000);
    }
  }, []);

  const saveSection = useCallback(async (key: string, saveFn: () => Promise<any>) => {
    setSaveStatus(key, { state: "saving" });
    try {
      await saveFn();
      setSaveStatus(key, { state: "saved" });
    } catch (e: any) {
      setSaveStatus(key, { state: "error", message: e.message });
    }
  }, [setSaveStatus]);

  // Sync translation keys: scans all current data and ensures stubs exist for every item's ID
  // Must be defined here (before early returns) to satisfy Rules of Hooks
  const syncTranslationKeys = useCallback(() => {
    setTranslations((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      const required: Record<string, string> = {};

      if (character?.characterStats) {
        for (const stat of character.characterStats) {
          required[`data.stats.${stat.id}.label`] = stat.label || "";
          required[`data.stats.${stat.id}.description`] = stat.description || "";
        }
      }
      if (character?.softSkills) {
        for (const skill of character.softSkills) {
          required[`data.softSkills.${skill.id}.name`] = skill.name || "";
          required[`data.softSkills.${skill.id}.description`] = skill.description || "";
        }
      }
      if (character?.languages) {
        for (const lang of character.languages) {
          required[`data.languages.${lang.id}.name`] = lang.name || "";
          required[`data.languages.${lang.id}.proficiency`] = lang.proficiency || "";
        }
      }
      if (character?.hobbies) {
        for (const hobby of character.hobbies) {
          required[`data.hobbies.${hobby.id}.name`] = hobby.name || "";
          required[`data.hobbies.${hobby.id}.effect`] = hobby.effect || "";
        }
      }
      for (const prof of professions) {
        required[`data.professions.${prof.id}.name`] = prof.name || "";
        required[`data.professions.${prof.id}.description`] = prof.description || "";
      }
      if (talents?.nodes) {
        for (const node of talents.nodes) {
          required[`data.talentDescriptions.${node.id}`] = node.description || "";
        }
      }
      for (const item of inventory) {
        required[`data.backpack.${item.id}.name`] = item.name || "";
        required[`data.backpack.${item.id}.description`] = item.description || "";
      }
      for (const ach of achievements) {
        required[`data.achievements.${ach.id}.title`] = ach.title || "";
        required[`data.achievements.${ach.id}.description`] = ach.description || "";
      }

      let changed = false;
      for (const langKey of ["en", "ka", "ru"]) {
        if (!clone[langKey]) continue;
        for (const [path, defaultValue] of Object.entries(required)) {
          const keys = path.split(".");
          let obj = clone[langKey];
          for (let i = 0; i < keys.length - 1; i++) {
            if (!obj[keys[i]]) { obj[keys[i]] = {}; changed = true; }
            obj = obj[keys[i]];
          }
          const lastKey = keys[keys.length - 1];
          if (obj[lastKey] === undefined) {
            obj[lastKey] = langKey === "en" ? defaultValue : "";
            changed = true;
          }
        }
      }

      return changed ? clone : prev;
    });
  }, [character, professions, talents, inventory, achievements]);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [charData, talData, profData, invData, achData, enData, kaData, ruData] = await Promise.all([
          adminApi.getCharacter(),
          adminApi.getTalents(),
          adminApi.getProfessions(),
          adminApi.getInventory(),
          adminApi.getAchievements(),
          adminApi.getTranslation("en"),
          adminApi.getTranslation("ka"),
          adminApi.getTranslation("ru"),
        ]);
        setCharacter(charData);
        setTalents(talData);
        setProfessions(profData);
        setInventory(invData);
        setAchievements(achData);
        setTranslations({ en: enData, ka: kaData, ru: ruData });
        setError(null);
      } catch (e: any) {
        setError(`Failed to connect to admin API: ${e.message}. Make sure the server is running on port 3001.`);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-accent animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Connecting to Admin API...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center max-w-md border border-red-500/50 rounded bg-card/60 p-6">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
          <h2 className="font-heading text-accent mb-2">Connection Failed</h2>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <code className="block text-xs bg-background p-2 rounded text-foreground mb-4">
            cd server && npm install && npm start
          </code>
          <button onClick={() => window.location.reload()} className="px-4 py-2 border border-primary rounded text-xs text-accent hover:bg-primary/20 cursor-pointer">
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const updateCharField = (path: string, value: any) => {
    setCharacter((prev: any) => {
      const clone = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let obj = clone;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return clone;
    });
  };

  const updateTranslation = (path: string, value: string) => {
    setTranslations((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let obj = clone[activeLang];
      for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) obj[keys[i]] = {};
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return clone;
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-primary/40 bg-background/95 backdrop-blur-sm px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-accent" />
            <h1 className="font-heading text-lg text-accent">Admin Panel</h1>
            <span className="text-[10px] text-muted-foreground bg-primary/20 px-2 py-0.5 rounded">RPG Portfolio</span>
          </div>
          <a href="/" className="text-xs text-muted-foreground hover:text-accent transition-colors">← Back to Portfolio</a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* ═══ CHARACTER INFO ═══ */}
        <CollapsibleSection title="Character Info" icon={User} defaultOpen={true}>
          <div className="flex justify-end mb-3 mt-3">
            <SaveButton status={saveStatuses.character || { state: "idle" }} onClick={() => { saveSection("character", () => adminApi.saveCharacter(character)); syncTranslationKeys(); }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input label="Name" value={character.characterInfo.name} onChange={(v) => updateCharField("characterInfo.name", v)} />
            <Input label="Title" value={character.characterInfo.title} onChange={(v) => updateCharField("characterInfo.title", v)} />
            <Input label="Class" value={character.characterInfo.class} onChange={(v) => updateCharField("characterInfo.class", v)} />
            <Input label="Race" value={character.characterInfo.race} onChange={(v) => updateCharField("characterInfo.race", v)} />
            <Input label="Level" value={character.characterInfo.level} onChange={(v) => updateCharField("characterInfo.level", parseInt(v) || 0)} type="number" />
            <Input label="Guild" value={character.characterInfo.guild} onChange={(v) => updateCharField("characterInfo.guild", v)} />
            <Input label="Kingdom" value={character.characterInfo.kingdom} onChange={(v) => updateCharField("characterInfo.kingdom", v)} />
            <Input label="Province" value={character.characterInfo.province} onChange={(v) => updateCharField("characterInfo.province", v)} />
            <Input label="City" value={character.characterInfo.city} onChange={(v) => updateCharField("characterInfo.city", v)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <Input label="Avatar (Real)" value={character.characterInfo.avatars.real} onChange={(v) => updateCharField("characterInfo.avatars.real", v)} />
            <Input label="Avatar (Priest)" value={character.characterInfo.avatars.priest} onChange={(v) => updateCharField("characterInfo.avatars.priest", v)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <Input label="Email" value={character.characterInfo.contact.email} onChange={(v) => updateCharField("characterInfo.contact.email", v)} />
            <Input label="Mobile" value={character.characterInfo.contact.mobile} onChange={(v) => updateCharField("characterInfo.contact.mobile", v)} />
            <Input label="LinkedIn" value={character.characterInfo.contact.linkedIn} onChange={(v) => updateCharField("characterInfo.contact.linkedIn", v)} />
            <Input label="GitHub" value={character.characterInfo.contact.gitHub} onChange={(v) => updateCharField("characterInfo.contact.gitHub", v)} />
          </div>
          <div className="mt-3">
            <Textarea label="Summary / Biography" value={character.characterInfo.summary} onChange={(v) => updateCharField("characterInfo.summary", v)} />
          </div>
        </CollapsibleSection>

        {/* ═══ CORE ATTRIBUTES ═══ */}
        <CollapsibleSection title="Core Attributes (Stamina / Mana)" icon={Heart}>
          <div className="flex justify-end mb-3 mt-3">
            <SaveButton status={saveStatuses.character || { state: "idle" }} onClick={() => { saveSection("character", () => adminApi.saveCharacter(character)); syncTranslationKeys(); }} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Input label="Stamina" value={character.coreAttributes.stamina} onChange={(v) => updateCharField("coreAttributes.stamina", parseInt(v) || 0)} type="number" />
            <Input label="Stamina Max" value={character.coreAttributes.staminaMax} onChange={(v) => updateCharField("coreAttributes.staminaMax", parseInt(v) || 0)} type="number" />
            <Input label="Mana" value={character.coreAttributes.mana} onChange={(v) => updateCharField("coreAttributes.mana", parseInt(v) || 0)} type="number" />
            <Input label="Mana Max" value={character.coreAttributes.manaMax} onChange={(v) => updateCharField("coreAttributes.manaMax", parseInt(v) || 0)} type="number" />
            <Input label="Mana Regen" value={character.coreAttributes.manaRegen} onChange={(v) => updateCharField("coreAttributes.manaRegen", parseInt(v) || 0)} type="number" />
          </div>
        </CollapsibleSection>

        {/* ═══ CHARACTER STATS ═══ */}
        <CollapsibleSection title="Character Stats / Attributes" icon={Swords}>
          <div className="flex justify-end mb-3 mt-3">
            <SaveButton status={saveStatuses.character || { state: "idle" }} onClick={() => { saveSection("character", () => adminApi.saveCharacter(character)); syncTranslationKeys(); }} />
          </div>
          {character.characterStats.map((stat: any, i: number) => (
            <div key={stat.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2 p-2 border border-border/50 rounded bg-background/30">
              <Input label="ID" value={stat.id} onChange={(v) => { const s = [...character.characterStats]; s[i] = { ...s[i], id: v }; updateCharField("characterStats", s); }} />
              <Input label="Label" value={stat.label} onChange={(v) => { const s = [...character.characterStats]; s[i] = { ...s[i], label: v }; updateCharField("characterStats", s); }} />
              <Input label="Value" value={stat.value} onChange={(v) => { const s = [...character.characterStats]; s[i] = { ...s[i], value: parseInt(v) || 0 }; updateCharField("characterStats", s); }} type="number" />
              <div className="flex items-end gap-1">
                <Input label="Description" value={stat.description} onChange={(v) => { const s = [...character.characterStats]; s[i] = { ...s[i], description: v }; updateCharField("characterStats", s); }} className="flex-1" />
                <button onClick={() => { const s = character.characterStats.filter((_: any, j: number) => j !== i); updateCharField("characterStats", s); }} className="mb-0.5 p-1.5 text-red-400 hover:bg-red-500/10 rounded cursor-pointer"><Trash2 className="w-3 h-3" /></button>
              </div>
            </div>
          ))}
          <button onClick={() => updateCharField("characterStats", [...character.characterStats, { id: `stat-${Date.now()}`, label: "New Stat", value: 50, description: "Description" }])} className="flex items-center gap-1 text-xs text-accent hover:bg-primary/20 px-3 py-1.5 rounded border border-primary/30 mt-2 cursor-pointer">
            <Plus className="w-3 h-3" /> Add Stat
          </button>
        </CollapsibleSection>

        {/* ═══ SOFT SKILLS ═══ */}
        <CollapsibleSection title="Soft Skills" icon={BookOpen}>
          <div className="flex justify-end mb-3 mt-3">
            <SaveButton status={saveStatuses.character || { state: "idle" }} onClick={() => { saveSection("character", () => adminApi.saveCharacter(character)); syncTranslationKeys(); }} />
          </div>
          {character.softSkills.map((skill: any, i: number) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2 p-2 border border-border/50 rounded bg-background/30">
              <Input label="ID" value={skill.id} onChange={(v) => { const s = [...character.softSkills]; s[i] = { ...s[i], id: v }; updateCharField("softSkills", s); }} />
              <Input label="Name" value={skill.name} onChange={(v) => { const s = [...character.softSkills]; s[i] = { ...s[i], name: v }; updateCharField("softSkills", s); }} />
              <Input label="Icon" value={skill.icon} onChange={(v) => { const s = [...character.softSkills]; s[i] = { ...s[i], icon: v }; updateCharField("softSkills", s); }} />
              <div className="flex items-end gap-1">
                <Input label="Description" value={skill.description} onChange={(v) => { const s = [...character.softSkills]; s[i] = { ...s[i], description: v }; updateCharField("softSkills", s); }} className="flex-1" />
                <button onClick={() => updateCharField("softSkills", character.softSkills.filter((_: any, j: number) => j !== i))} className="mb-0.5 p-1.5 text-red-400 hover:bg-red-500/10 rounded cursor-pointer"><Trash2 className="w-3 h-3" /></button>
              </div>
            </div>
          ))}
          <button onClick={() => updateCharField("softSkills", [...character.softSkills, { id: `skill-${Date.now()}`, name: "New Skill", description: "Description", icon: "Star" }])} className="flex items-center gap-1 text-xs text-accent hover:bg-primary/20 px-3 py-1.5 rounded border border-primary/30 mt-2 cursor-pointer">
            <Plus className="w-3 h-3" /> Add Soft Skill
          </button>
        </CollapsibleSection>

        {/* ═══ LANGUAGES ═══ */}
        <CollapsibleSection title="Language Proficiencies" icon={LangIcon}>
          <div className="flex justify-end mb-3 mt-3">
            <SaveButton status={saveStatuses.character || { state: "idle" }} onClick={() => { saveSection("character", () => adminApi.saveCharacter(character)); syncTranslationKeys(); }} />
          </div>
          {character.languages.map((lang: any, i: number) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2 p-2 border border-border/50 rounded bg-background/30">
              <Input label="ID" value={lang.id} onChange={(v) => { const s = [...character.languages]; s[i] = { ...s[i], id: v }; updateCharField("languages", s); }} />
              <Input label="Name" value={lang.name} onChange={(v) => { const s = [...character.languages]; s[i] = { ...s[i], name: v }; updateCharField("languages", s); }} />
              <Input label="Proficiency" value={lang.proficiency} onChange={(v) => { const s = [...character.languages]; s[i] = { ...s[i], proficiency: v }; updateCharField("languages", s); }} />
              <div className="flex items-end gap-1">
                <Input label="Icon" value={lang.icon} onChange={(v) => { const s = [...character.languages]; s[i] = { ...s[i], icon: v }; updateCharField("languages", s); }} className="flex-1" />
                <button onClick={() => updateCharField("languages", character.languages.filter((_: any, j: number) => j !== i))} className="mb-0.5 p-1.5 text-red-400 hover:bg-red-500/10 rounded cursor-pointer"><Trash2 className="w-3 h-3" /></button>
              </div>
            </div>
          ))}
          <button onClick={() => updateCharField("languages", [...character.languages, { id: `lang-${Date.now()}`, name: "New Language", proficiency: "Basic", icon: "Languages" }])} className="flex items-center gap-1 text-xs text-accent hover:bg-primary/20 px-3 py-1.5 rounded border border-primary/30 mt-2 cursor-pointer">
            <Plus className="w-3 h-3" /> Add Language
          </button>
        </CollapsibleSection>

        {/* ═══ UNIQUE SKILL ═══ */}
        <CollapsibleSection title="Unique Skill" icon={Swords}>
          <div className="flex justify-end mb-3 mt-3">
            <SaveButton status={saveStatuses.character || { state: "idle" }} onClick={() => { saveSection("character", () => adminApi.saveCharacter(character)); syncTranslationKeys(); }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="Name" value={character.uniqueSkill.name} onChange={(v) => updateCharField("uniqueSkill.name", v)} />
            <Input label="Icon" value={character.uniqueSkill.icon} onChange={(v) => updateCharField("uniqueSkill.icon", v)} />
          </div>
          <div className="mt-3">
            <Textarea label="Description" value={character.uniqueSkill.description} onChange={(v) => updateCharField("uniqueSkill.description", v)} />
          </div>
        </CollapsibleSection>

        {/* ═══ HOBBIES ═══ */}
        <CollapsibleSection title="Hobbies" icon={Heart}>
          <div className="flex justify-end mb-3 mt-3">
            <SaveButton status={saveStatuses.character || { state: "idle" }} onClick={() => { saveSection("character", () => adminApi.saveCharacter(character)); syncTranslationKeys(); }} />
          </div>
          {character.hobbies.map((hobby: any, i: number) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2 p-2 border border-border/50 rounded bg-background/30">
              <Input label="ID" value={hobby.id} onChange={(v) => { const s = [...character.hobbies]; s[i] = { ...s[i], id: v }; updateCharField("hobbies", s); }} />
              <Input label="Name" value={hobby.name} onChange={(v) => { const s = [...character.hobbies]; s[i] = { ...s[i], name: v }; updateCharField("hobbies", s); }} />
              <Input label="Effect" value={hobby.effect} onChange={(v) => { const s = [...character.hobbies]; s[i] = { ...s[i], effect: v }; updateCharField("hobbies", s); }} />
              <div className="flex items-end gap-1">
                <Input label="Icon" value={hobby.icon} onChange={(v) => { const s = [...character.hobbies]; s[i] = { ...s[i], icon: v }; updateCharField("hobbies", s); }} className="flex-1" />
                <button onClick={() => updateCharField("hobbies", character.hobbies.filter((_: any, j: number) => j !== i))} className="mb-0.5 p-1.5 text-red-400 hover:bg-red-500/10 rounded cursor-pointer"><Trash2 className="w-3 h-3" /></button>
              </div>
            </div>
          ))}
          <button onClick={() => updateCharField("hobbies", [...character.hobbies, { id: `hobby-${Date.now()}`, name: "New Hobby", effect: "+5% Something", icon: "Star" }])} className="flex items-center gap-1 text-xs text-accent hover:bg-primary/20 px-3 py-1.5 rounded border border-primary/30 mt-2 cursor-pointer">
            <Plus className="w-3 h-3" /> Add Hobby
          </button>
        </CollapsibleSection>

        {/* ═══ RELIGION / BELIEFS ═══ */}
        <CollapsibleSection title="Beliefs & Doctrines" icon={ScrollText}>
          <div className="flex justify-end mb-3 mt-3">
            <SaveButton status={saveStatuses.character || { state: "idle" }} onClick={() => { saveSection("character", () => adminApi.saveCharacter(character)); syncTranslationKeys(); }} />
          </div>
          {character.religion.map((belief: string, i: number) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                value={belief}
                onChange={(e) => { const r = [...character.religion]; r[i] = e.target.value; updateCharField("religion", r); }}
                className="flex-1 bg-background border border-border rounded px-2 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
              />
              <button onClick={() => updateCharField("religion", character.religion.filter((_: any, j: number) => j !== i))} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded cursor-pointer"><Trash2 className="w-3 h-3" /></button>
            </div>
          ))}
          <button onClick={() => updateCharField("religion", [...character.religion, "New Belief"])} className="flex items-center gap-1 text-xs text-accent hover:bg-primary/20 px-3 py-1.5 rounded border border-primary/30 mt-2 cursor-pointer">
            <Plus className="w-3 h-3" /> Add Belief
          </button>
        </CollapsibleSection>

        {/* ═══ PROFESSIONS ═══ */}
        <CollapsibleSection title="Professions" icon={Briefcase}>
          <div className="flex justify-end mb-3 mt-3">
            <SaveButton status={saveStatuses.professions || { state: "idle" }} onClick={() => { saveSection("professions", () => adminApi.saveProfessions(professions)); syncTranslationKeys(); }} />
          </div>
          {professions.map((prof, i) => (
            <div key={i} className="p-3 border border-border/50 rounded bg-background/30 mb-3">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
                <Input label="ID" value={prof.id} onChange={(v) => { const p = [...professions]; p[i] = { ...p[i], id: v }; setProfessions(p); }} />
                <Input label="Name" value={prof.name} onChange={(v) => { const p = [...professions]; p[i] = { ...p[i], name: v }; setProfessions(p); }} />
                <Input label="Level" value={prof.level} onChange={(v) => { const p = [...professions]; p[i] = { ...p[i], level: parseInt(v) || 0 }; setProfessions(p); }} type="number" />
                <div className="flex items-end gap-1">
                  <Input label="Max Level" value={prof.maxLevel} onChange={(v) => { const p = [...professions]; p[i] = { ...p[i], maxLevel: parseInt(v) || 0 }; setProfessions(p); }} type="number" className="flex-1" />
                  <button onClick={() => setProfessions(professions.filter((_, j) => j !== i))} className="mb-0.5 p-1.5 text-red-400 hover:bg-red-500/10 rounded cursor-pointer"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Input label="Icon" value={prof.icon} onChange={(v) => { const p = [...professions]; p[i] = { ...p[i], icon: v }; setProfessions(p); }} />
                <Input label="Description" value={prof.description} onChange={(v) => { const p = [...professions]; p[i] = { ...p[i], description: v }; setProfessions(p); }} />
              </div>
            </div>
          ))}
          <button onClick={() => setProfessions([...professions, { id: `prof-${Date.now()}`, name: "New Profession", level: 1, maxLevel: 100, description: "Description", icon: "Star" }])} className="flex items-center gap-1 text-xs text-accent hover:bg-primary/20 px-3 py-1.5 rounded border border-primary/30 mt-2 cursor-pointer">
            <Plus className="w-3 h-3" /> Add Profession
          </button>
        </CollapsibleSection>

        {/* ═══ TALENT TREE ═══ */}
        <CollapsibleSection title="Talent Tree (Nodes & Edges)" icon={GitBranch}>
          <div className="flex justify-end mb-3 mt-3">
            <SaveButton status={saveStatuses.talents || { state: "idle" }} onClick={() => { saveSection("talents", () => adminApi.saveTalents(talents)); syncTranslationKeys(); }} />
          </div>

          <h4 className="text-xs text-primary uppercase tracking-wider mb-2 mt-2">Nodes ({talents.nodes.length})</h4>
          <div className="max-h-[500px] overflow-y-auto border border-border/30 rounded p-2 mb-4">
            {talents.nodes.map((node: any, i: number) => (
              <div key={i} className="grid grid-cols-2 md:grid-cols-8 gap-1.5 mb-2 p-2 border border-border/50 rounded bg-background/30 text-xs">
                <Input label="ID" value={node.id} onChange={(v) => { const n = [...talents.nodes]; n[i] = { ...n[i], id: v }; setTalents({ ...talents, nodes: n }); }} />
                <Input label="Name" value={node.name} onChange={(v) => { const n = [...talents.nodes]; n[i] = { ...n[i], name: v }; setTalents({ ...talents, nodes: n }); }} />
                <Input label="Icon" value={node.icon} onChange={(v) => { const n = [...talents.nodes]; n[i] = { ...n[i], icon: v }; setTalents({ ...talents, nodes: n }); }} />
                <Select label="Tree" value={node.tree} onChange={(v) => { const n = [...talents.nodes]; n[i] = { ...n[i], tree: v }; setTalents({ ...talents, nodes: n }); }}
                  options={[{ value: "frontend", label: "Frontend" }, { value: "backend", label: "Backend" }, { value: "sql", label: "SQL" }, { value: "voip", label: "VoIP" }, { value: "shared", label: "Shared" }]} />
                <Input label="X" value={node.x} onChange={(v) => { const n = [...talents.nodes]; n[i] = { ...n[i], x: parseFloat(v) || 0 }; setTalents({ ...talents, nodes: n }); }} type="number" />
                <Input label="Y" value={node.y} onChange={(v) => { const n = [...talents.nodes]; n[i] = { ...n[i], y: parseFloat(v) || 0 }; setTalents({ ...talents, nodes: n }); }} type="number" />
                <Select label="Learned" value={node.learned ? "true" : "false"} onChange={(v) => { const n = [...talents.nodes]; n[i] = { ...n[i], learned: v === "true" }; setTalents({ ...talents, nodes: n }); }}
                  options={[{ value: "true", label: "Yes" }, { value: "false", label: "No" }]} />
                <div className="flex items-end">
                  <button onClick={() => setTalents({ ...talents, nodes: talents.nodes.filter((_: any, j: number) => j !== i) })} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded cursor-pointer w-full flex items-center justify-center"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setTalents({ ...talents, nodes: [...talents.nodes, { id: `node-${Date.now()}`, name: "New Skill", description: "Description", icon: "Zap", tree: "frontend", x: 0, y: 0, learned: true, prerequisites: [] }] })} className="flex items-center gap-1 text-xs text-accent hover:bg-primary/20 px-3 py-1.5 rounded border border-primary/30 mb-4 cursor-pointer">
            <Plus className="w-3 h-3" /> Add Node
          </button>

          <h4 className="text-xs text-primary uppercase tracking-wider mb-2">Edges ({talents.edges.length})</h4>
          <div className="max-h-[300px] overflow-y-auto border border-border/30 rounded p-2">
            {talents.edges.map((edge: any, i: number) => (
              <div key={i} className="flex gap-2 mb-1.5 items-center">
                <select value={edge.from} onChange={(e) => { const ed = [...talents.edges]; ed[i] = { ...ed[i], from: e.target.value }; setTalents({ ...talents, edges: ed }); }}
                  className="flex-1 bg-background border border-border rounded px-2 py-1 text-xs text-foreground focus:border-primary focus:outline-none">
                  {talents.nodes.map((n: any) => <option key={n.id} value={n.id}>{n.name} ({n.id})</option>)}
                </select>
                <Link2 className="w-3 h-3 text-muted-foreground" />
                <select value={edge.to} onChange={(e) => { const ed = [...talents.edges]; ed[i] = { ...ed[i], to: e.target.value }; setTalents({ ...talents, edges: ed }); }}
                  className="flex-1 bg-background border border-border rounded px-2 py-1 text-xs text-foreground focus:border-primary focus:outline-none">
                  {talents.nodes.map((n: any) => <option key={n.id} value={n.id}>{n.name} ({n.id})</option>)}
                </select>
                <button onClick={() => setTalents({ ...talents, edges: talents.edges.filter((_: any, j: number) => j !== i) })} className="p-1 text-red-400 hover:bg-red-500/10 rounded cursor-pointer"><Trash2 className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
          <button onClick={() => setTalents({ ...talents, edges: [...talents.edges, { from: talents.nodes[0]?.id || "", to: talents.nodes[1]?.id || "" }] })} className="flex items-center gap-1 text-xs text-accent hover:bg-primary/20 px-3 py-1.5 rounded border border-primary/30 mt-2 cursor-pointer">
            <Plus className="w-3 h-3" /> Add Edge
          </button>
        </CollapsibleSection>

        {/* ═══ INVENTORY ═══ */}
        <CollapsibleSection title="Inventory / Backpack" icon={Backpack}>
          <div className="flex justify-end mb-3 mt-3">
            <SaveButton status={saveStatuses.inventory || { state: "idle" }} onClick={() => { saveSection("inventory", () => adminApi.saveInventory(inventory)); syncTranslationKeys(); }} />
          </div>
          {inventory.map((item, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-2 p-2 border border-border/50 rounded bg-background/30">
              <Input label="ID" value={item.id} onChange={(v) => { const s = [...inventory]; s[i] = { ...s[i], id: v }; setInventory(s); }} />
              <Input label="Name" value={item.name} onChange={(v) => { const s = [...inventory]; s[i] = { ...s[i], name: v }; setInventory(s); }} />
              <Input label="Icon" value={item.icon} onChange={(v) => { const s = [...inventory]; s[i] = { ...s[i], icon: v }; setInventory(s); }} />
              <Select label="Rarity" value={item.rarity} onChange={(v) => { const s = [...inventory]; s[i] = { ...s[i], rarity: v }; setInventory(s); }}
                options={[{ value: "common", label: "Common" }, { value: "uncommon", label: "Uncommon" }, { value: "rare", label: "Rare" }, { value: "epic", label: "Epic" }, { value: "legendary", label: "Legendary" }]} />
              <div className="flex items-end gap-1">
                <Input label="Description" value={item.description} onChange={(v) => { const s = [...inventory]; s[i] = { ...s[i], description: v }; setInventory(s); }} className="flex-1" />
                <button onClick={() => setInventory(inventory.filter((_, j) => j !== i))} className="mb-0.5 p-1.5 text-red-400 hover:bg-red-500/10 rounded cursor-pointer"><Trash2 className="w-3 h-3" /></button>
              </div>
            </div>
          ))}
          <button onClick={() => setInventory([...inventory, { id: `item-${Date.now()}`, name: "New Item", description: "Description", icon: "Star", rarity: "common" }])} className="flex items-center gap-1 text-xs text-accent hover:bg-primary/20 px-3 py-1.5 rounded border border-primary/30 mt-2 cursor-pointer">
            <Plus className="w-3 h-3" /> Add Item
          </button>
        </CollapsibleSection>

        {/* ═══ ACHIEVEMENTS ═══ */}
        <CollapsibleSection title="Achievements" icon={Trophy}>
          <div className="flex justify-end mb-3 mt-3">
            <SaveButton status={saveStatuses.achievements || { state: "idle" }} onClick={() => { saveSection("achievements", () => adminApi.saveAchievements(achievements)); syncTranslationKeys(); }} />
          </div>
          {achievements.map((ach, i) => (
            <div key={i} className="p-3 border border-border/50 rounded bg-background/30 mb-3">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-2">
                <Input label="ID" value={ach.id} onChange={(v) => { const s = [...achievements]; s[i] = { ...s[i], id: v }; setAchievements(s); }} />
                <Input label="Title" value={ach.title} onChange={(v) => { const s = [...achievements]; s[i] = { ...s[i], title: v }; setAchievements(s); }} />
                <Input label="Year" value={ach.year} onChange={(v) => { const s = [...achievements]; s[i] = { ...s[i], year: v }; setAchievements(s); }} />
                <Input label="Team Size" value={ach.teamSize} onChange={(v) => { const s = [...achievements]; s[i] = { ...s[i], teamSize: parseInt(v) || 1 }; setAchievements(s); }} type="number" />
                <div className="flex items-end gap-1">
                  <Input label="Icon" value={ach.icon} onChange={(v) => { const s = [...achievements]; s[i] = { ...s[i], icon: v }; setAchievements(s); }} className="flex-1" />
                  <button onClick={() => setAchievements(achievements.filter((_, j) => j !== i))} className="mb-0.5 p-1.5 text-red-400 hover:bg-red-500/10 rounded cursor-pointer"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Textarea label="Description" value={ach.description} onChange={(v) => { const s = [...achievements]; s[i] = { ...s[i], description: v }; setAchievements(s); }} rows={2} />
                <Select label="Completed" value={ach.completed ? "true" : "false"} onChange={(v) => { const s = [...achievements]; s[i] = { ...s[i], completed: v === "true" }; setAchievements(s); }}
                  options={[{ value: "true", label: "Yes" }, { value: "false", label: "No" }]} />
              </div>
            </div>
          ))}
          <button onClick={() => setAchievements([...achievements, { id: `ach-${Date.now()}`, title: "New Achievement", description: "Description", year: "2024", teamSize: 1, icon: "Trophy", completed: false }])} className="flex items-center gap-1 text-xs text-accent hover:bg-primary/20 px-3 py-1.5 rounded border border-primary/30 mt-2 cursor-pointer">
            <Plus className="w-3 h-3" /> Add Achievement
          </button>
        </CollapsibleSection>

        {/* ═══ TRANSLATIONS ═══ */}
        <CollapsibleSection title="Translations (i18n)" icon={Globe}>
          <div className="flex items-center justify-between mb-3 mt-3">
            <div className="flex gap-1">
              {(["en", "ka", "ru"] as const).map((lang) => (
                <button key={lang} onClick={() => setActiveLang(lang)}
                  className={cls("px-3 py-1.5 text-xs font-heading uppercase tracking-wider rounded-sm border transition-all cursor-pointer",
                    activeLang === lang ? "border-primary bg-primary/20 text-accent" : "border-border text-muted-foreground hover:text-foreground")}>
                  {lang === "en" ? "English" : lang === "ka" ? "Georgian" : "Russian"}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={syncTranslationKeys}
                className="flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-heading uppercase tracking-wider border border-blue-500/50 text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 transition-all cursor-pointer">
                <RefreshCw className="w-3 h-3" /> Sync Keys
              </button>
              <SaveButton status={saveStatuses[`trans-${activeLang}`] || { state: "idle" }} onClick={() => saveSection(`trans-${activeLang}`, () => adminApi.saveTranslation(activeLang, translations[activeLang]))} />
            </div>
          </div>

          {translations[activeLang] && (
            <div className="max-h-[600px] overflow-y-auto border border-border/30 rounded p-2">
              <TranslationEditor data={translations[activeLang]} path="" onChange={updateTranslation} />
            </div>
          )}
        </CollapsibleSection>
      </div>
    </div>
  );
};

// ─── Recursive Translation Editor ───
function TranslationEditor({ data, path, onChange }: { data: any; path: string; onChange: (path: string, value: string) => void }) {
  if (typeof data === "string") {
    return (
      <div className="flex gap-2 items-start mb-1">
        <span className="text-[10px] text-muted-foreground min-w-[200px] pt-1.5 font-mono break-all">{path}</span>
        <input
          value={data}
          onChange={(e) => onChange(path, e.target.value)}
          className="flex-1 bg-background border border-border rounded px-2 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
        />
      </div>
    );
  }
  if (typeof data === "object" && data !== null) {
    return (
      <div className="ml-0">
        {Object.entries(data).map(([key, value]) => {
          const fullPath = path ? `${path}.${key}` : key;
          if (typeof value === "object" && value !== null) {
            return (
              <details key={key} className="mb-1">
                <summary className="text-xs text-accent cursor-pointer hover:text-primary py-1 font-heading uppercase tracking-wider">{key}</summary>
                <div className="ml-3 pl-3 border-l border-border/30">
                  <TranslationEditor data={value} path={fullPath} onChange={onChange} />
                </div>
              </details>
            );
          }
          return <TranslationEditor key={key} data={value} path={fullPath} onChange={onChange} />;
        })}
      </div>
    );
  }
  return null;
}

export default AdminPanel;
