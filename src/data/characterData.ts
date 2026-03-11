export interface CoreAttributes {
  stamina: number;
  staminaMax: number;
  mana: number;
  manaMax: number;
  manaRegen: number;
}

export interface SoftSkill {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: string;
  icon: string;
}

export interface UniqueSkill {
  name: string;
  description: string;
  icon: string;
}

export interface Hobby {
  id: string;
  name: string;
  effect: string;
  icon: string;
}

export const characterInfo = {
  name: "Your Name",
  class: "Priest",
  race: "Human",
  kingdom: "Georgia",
  province: "Tbilisi",
  city: "Tbilisi",
  title: "Full-Stack Developer",
  level: 60,
  guild: "<Code Warriors>",
  avatars: {
    real: "/placeholder.svg",
    priest: "/placeholder.svg",
  },
  contact: {
    email: "your.email@example.com",
    mobile: "+995 555 123 456",
    linkedIn: "https://linkedin.com/in/yourname",
    gitHub: "https://github.com/yourname",
  },
  summary:
    "A seasoned full-stack developer with a passion for building immersive web experiences. Skilled in both frontend artistry and backend architecture, this developer combines creativity with technical precision to craft exceptional digital solutions.",
};

export const coreAttributes: CoreAttributes = {
  stamina: 100,
  staminaMax: 100,
  mana: 150,
  manaMax: 150,
  manaRegen: 10,
};

export interface CharacterStat {
  id: string;
  label: string;
  value: number;
  description: string;
}

export const characterStats: CharacterStat[] = [
  {
    id: "iq",
    label: "IQ",
    value: 142,
    description: "Raw cognitive processing power. Affects ability to learn new frameworks overnight.",
  },
  {
    id: "intellect",
    label: "Intellect",
    value: 96,
    description: "Deep understanding of complex systems. Increases critical thinking by 12%.",
  },
  {
    id: "troubleshooting",
    label: "Troubleshooting",
    value: 88,
    description: "Ability to diagnose and resolve bugs. Reduces debugging time by 40%.",
  },
  {
    id: "problem-solving",
    label: "Problem Solving",
    value: 91,
    description: "Creative approach to technical challenges. Grants a chance to find elegant solutions.",
  },
  {
    id: "fast-learning",
    label: "Fast Learning",
    value: 85,
    description: "Speed of acquiring new technologies. Increases XP gain from documentation by 25%.",
  },
];

export const softSkills: SoftSkill[] = [
  { id: "prompt-gen", name: "Prompt Generation", description: "Saves AI tokens, faster responses. Reduces mana cost of AI-assisted spells by 30%.", icon: "MessageSquare" },
  { id: "humor", name: "Humor", description: "Team communication, grants mana regen to party. +5 Mana Regen to all nearby allies.", icon: "Smile" },
  { id: "organizing", name: "Organizing", description: "Code architecture, documentation, schedules. Increases project completion speed by 20%.", icon: "FolderTree" },
  { id: "responsible", name: "Responsible", description: "Finishes chores, strictly adheres to deadlines. Grants immunity to 'Missed Deadline' debuff.", icon: "CheckCircle" },
];

export const languages: Language[] = [
  { id: "geo", name: "Georgian", proficiency: "Native", icon: "Languages" },
  { id: "ru", name: "Russian", proficiency: "Fluent", icon: "Languages" },
  { id: "en", name: "English", proficiency: "Professional", icon: "Languages" },
  { id: "ai", name: "AI", proficiency: "Advanced", icon: "Bot" },
];

export const uniqueSkill: UniqueSkill = {
  name: "Lazy Soul",
  description: "Routine jobs are automatically automated by code, scripts, or AI. Passive effect: All repetitive tasks have a 100% chance to be delegated to automation.",
  icon: "Sparkles",
};

export const hobbies: Hobby[] = [
  { id: "painting", name: "Painting", effect: "+10% Creativity", icon: "Paintbrush" },
  { id: "musical", name: "Musical", effect: "+5% Creativity, +2% Stamina", icon: "Music" },
  { id: "online-games", name: "Online Games", effect: "+5% Intellect", icon: "Gamepad2" },
  { id: "board-games", name: "Board Games", effect: "+5% Intellect", icon: "Dice5" },
];

export const religion: string[] = ["Agile", "Scrum", "Waterfall", "Clean Code"];
