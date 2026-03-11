import React, { useState } from "react";
import { characterInfo, characterStats, coreAttributes, softSkills, languages, uniqueSkill, hobbies, religion } from "@/data/mockData";
import WowTooltip from "@/components/WowTooltip";
import ResourceBar from "@/components/ResourceBar";
import ContactModal from "@/components/ContactModal";
import {
  Shield, Sword, Star, BookOpen, Brain,
  MessageSquare, Smile, FolderTree, CheckCircle,
  Languages, Bot, Sparkles,
  Paintbrush, Music, Gamepad2, Dice5, ScrollText
} from "lucide-react";

const statIcons: Record<string, React.ReactNode> = {
  iq: <Brain className="w-4 h-4 text-wow-green" />,
  intellect: <BookOpen className="w-4 h-4 text-wow-green" />,
  troubleshooting: <Sword className="w-4 h-4 text-wow-green" />,
  "problem-solving": <Shield className="w-4 h-4 text-wow-green" />,
  "fast-learning": <Star className="w-4 h-4 text-wow-green" />,
};

const softSkillIcons: Record<string, React.ReactNode> = {
  "prompt-gen": <MessageSquare className="w-4 h-4" />,
  humor: <Smile className="w-4 h-4" />,
  organizing: <FolderTree className="w-4 h-4" />,
  responsible: <CheckCircle className="w-4 h-4" />,
};

const hobbyIcons: Record<string, React.ReactNode> = {
  painting: <Paintbrush className="w-4 h-4" />,
  musical: <Music className="w-4 h-4" />,
  "online-games": <Gamepad2 className="w-4 h-4" />,
  "board-games": <Dice5 className="w-4 h-4" />,
};

const CharacterSheet: React.FC = () => {
  const [showPriest, setShowPriest] = useState(false);

  return (
    <div className="flex flex-col gap-4 h-full p-4 md:p-6 max-w-7xl mx-auto">
      {/* Top row: Character Info + Avatar + Stats */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Column - Character Info */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="border border-primary rounded bg-card/60 p-5 animate-gold-pulse">
            <p className="text-xs text-muted-foreground tracking-widest uppercase mb-1">
              Level {characterInfo.level} {characterInfo.race} {characterInfo.class}
            </p>
            <h1 className="font-heading text-2xl md:text-3xl text-accent mb-1">
              {characterInfo.name}
            </h1>
            <p className="font-heading text-sm text-primary">
              {characterInfo.title}
            </p>
            <p className="text-xs text-wow-green mt-1">{characterInfo.guild}</p>
            <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
              <span>🏰 {characterInfo.kingdom}</span>
              <span>🏙️ {characterInfo.city}</span>
            </div>
          </div>

          <div className="border border-border rounded bg-card/40 p-4 flex-1">
            <h3 className="font-heading text-xs text-primary uppercase tracking-wider mb-2">
              Biography
            </h3>
            <p className="text-sm text-foreground leading-relaxed">
              {characterInfo.summary}
            </p>
          </div>
        </div>

        {/* Center - Avatar */}
        <div className="flex flex-col items-center justify-start gap-3 w-full lg:w-64">
          <div
            onClick={() => setShowPriest(!showPriest)}
            className="relative w-48 h-48 border-2 border-primary rounded-sm bg-card/30 flex items-center justify-center overflow-hidden cursor-pointer group hover:border-accent transition-all duration-300"
          >
            <img
              src={showPriest ? characterInfo.avatars.priest : characterInfo.avatars.real}
              alt={characterInfo.name}
              className="w-full h-full object-cover transition-opacity duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
              <span className="text-xs text-accent font-heading">Click to swap</span>
            </div>
            {/* Corner ornaments */}
            {["top-0 left-0", "top-0 right-0 rotate-90", "bottom-0 right-0 rotate-180", "bottom-0 left-0 -rotate-90"].map((pos) => (
              <div key={pos} className={`absolute ${pos} w-4 h-4 border-t-2 border-l-2 border-primary`} />
            ))}
          </div>

          {/* Resource Bars */}
          <div className="w-full space-y-2">
            <ResourceBar
              label="Stamina"
              current={coreAttributes.stamina}
              max={coreAttributes.staminaMax}
              variant="stamina"
              tooltip="Stress and deadline endurance. Higher stamina means greater tolerance for crunch periods."
            />
            <ResourceBar
              label="Mana"
              current={coreAttributes.mana}
              max={coreAttributes.manaMax}
              variant="mana"
              tooltip={`Work time per day. Mana Regen: ${coreAttributes.manaRegen}/hr. Increases by consuming mood-driving events.`}
            />
          </div>

          {/* Add to Friend List */}
          <ContactModal />
        </div>

        {/* Right Column - Stats */}
        <div className="flex-1">
          <div className="border border-primary rounded bg-card/60 p-4">
            <h3 className="font-heading text-xs text-primary uppercase tracking-wider mb-3">
              Attributes
            </h3>
            <div className="space-y-2">
              {characterStats.map((stat) => (
                <WowTooltip
                  key={stat.id}
                  title={stat.label}
                  description={stat.description}
                  stats={[{ label: "Rating", value: stat.value }]}
                >
                  <div className="flex items-center gap-3 p-2 rounded hover:bg-secondary/50 transition-colors cursor-pointer group">
                    <div className="w-7 h-7 border border-border rounded-sm bg-secondary flex items-center justify-center group-hover:border-primary transition-colors">
                      {statIcons[stat.id] || <Star className="w-4 h-4 text-wow-green" />}
                    </div>
                    <div className="flex-1">
                      <span className="text-sm text-foreground">{stat.label}</span>
                    </div>
                    <span className="text-sm font-bold text-wow-green">{stat.value}</span>
                  </div>
                </WowTooltip>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row: Passives & General */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Soft Skills */}
        <div className="border border-border rounded bg-card/40 p-4">
          <h3 className="font-heading text-xs text-primary uppercase tracking-wider mb-3">
            Soft Skills
          </h3>
          <div className="space-y-2">
            {softSkills.map((skill) => (
              <WowTooltip key={skill.id} title={skill.name} description={skill.description}>
                <div className="flex items-center gap-2 p-1.5 rounded hover:bg-secondary/50 transition-colors cursor-pointer">
                  <div className="w-6 h-6 border border-primary/50 rounded-sm bg-secondary/60 flex items-center justify-center text-accent">
                    {softSkillIcons[skill.id] || <Star className="w-3 h-3" />}
                  </div>
                  <span className="text-xs text-foreground">{skill.name}</span>
                </div>
              </WowTooltip>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div className="border border-border rounded bg-card/40 p-4">
          <h3 className="font-heading text-xs text-primary uppercase tracking-wider mb-3">
            Language Proficiencies
          </h3>
          <div className="space-y-2">
            {languages.map((lang) => (
              <WowTooltip key={lang.id} title={lang.name} description={`Proficiency: ${lang.proficiency}`}>
                <div className="flex items-center gap-2 p-1.5 rounded hover:bg-secondary/50 transition-colors cursor-pointer">
                  <div className="w-6 h-6 border border-primary/50 rounded-sm bg-secondary/60 flex items-center justify-center text-accent">
                    {lang.icon === "Bot" ? <Bot className="w-3 h-3" /> : <Languages className="w-3 h-3" />}
                  </div>
                  <span className="text-xs text-foreground flex-1">{lang.name}</span>
                  <span className="text-xs text-wow-green">{lang.proficiency}</span>
                </div>
              </WowTooltip>
            ))}
          </div>

          {/* Unique Skill */}
          <div className="mt-3 pt-3 border-t border-border">
            <WowTooltip title={uniqueSkill.name} description={uniqueSkill.description}>
              <div className="flex items-center gap-2 p-1.5 rounded hover:bg-secondary/50 transition-colors cursor-pointer animate-gold-pulse">
                <div className="w-6 h-6 border border-accent rounded-sm bg-accent/10 flex items-center justify-center text-accent">
                  <Sparkles className="w-3 h-3" />
                </div>
                <span className="text-xs text-accent font-semibold">{uniqueSkill.name}</span>
                <span className="text-[10px] text-muted-foreground ml-auto">Unique</span>
              </div>
            </WowTooltip>
          </div>
        </div>

        {/* Hobbies (Passive Buffs) */}
        <div className="border border-border rounded bg-card/40 p-4">
          <h3 className="font-heading text-xs text-primary uppercase tracking-wider mb-3">
            Active Buffs
          </h3>
          <div className="space-y-2">
            {hobbies.map((hobby) => (
              <WowTooltip key={hobby.id} title={hobby.name} description={`Passive effect: ${hobby.effect}`}>
                <div className="flex items-center gap-2 p-1.5 rounded hover:bg-secondary/50 transition-colors cursor-pointer">
                  <div className="w-6 h-6 border border-wow-green/50 rounded-sm bg-wow-green/5 flex items-center justify-center text-wow-green">
                    {hobbyIcons[hobby.id] || <Star className="w-3 h-3" />}
                  </div>
                  <div className="flex-1">
                    <span className="text-xs text-foreground">{hobby.name}</span>
                    <p className="text-[10px] text-wow-green">{hobby.effect}</p>
                  </div>
                </div>
              </WowTooltip>
            ))}
          </div>
        </div>

        {/* Religion (Methodologies) */}
        <div className="border border-border rounded bg-card/40 p-4">
          <h3 className="font-heading text-xs text-primary uppercase tracking-wider mb-3">
            Beliefs & Doctrines
          </h3>
          <div className="space-y-2">
            {religion.map((belief) => (
              <WowTooltip key={belief} title={belief} description={`Follows the path of ${belief}. Grants bonus efficiency to project workflows.`}>
                <div className="flex items-center gap-2 p-1.5 rounded hover:bg-secondary/50 transition-colors cursor-pointer">
                  <div className="w-6 h-6 border border-primary/50 rounded-sm bg-secondary/60 flex items-center justify-center text-primary">
                    <ScrollText className="w-3 h-3" />
                  </div>
                  <span className="text-xs text-foreground">{belief}</span>
                </div>
              </WowTooltip>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterSheet;
