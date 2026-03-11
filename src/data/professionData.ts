export interface Profession {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  description: string;
  icon: string;
}

export const professions: Profession[] = [
  {
    id: "frontend",
    name: "Frontend Web Developer",
    level: 85,
    maxLevel: 100,
    description: "Master of the visual realm. Crafts pixel-perfect interfaces using React, TypeScript, and modern CSS. Specializes in responsive design and animation enchantments.",
    icon: "Monitor",
  },
  {
    id: "backend",
    name: "Backend Web Developer",
    level: 72,
    maxLevel: 100,
    description: "Architect of the server-side. Builds robust APIs and database systems using Node.js, PostgreSQL, and cloud infrastructure. Expert in RESTful sorcery.",
    icon: "Server",
  },
  {
    id: "voip",
    name: "VoIP Developer",
    level: 65,
    maxLevel: 100,
    description: "Specialist in real-time communications. Implements SIP, WebRTC, and telephony systems. Can establish voice channels across any network terrain.",
    icon: "Phone",
  },
];
