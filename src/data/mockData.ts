// Central data hub — re-exports all data modules.
// Will be replaced by API calls to an admin panel in the future.

export type { CharacterStat, CoreAttributes, SoftSkill, Language, UniqueSkill, Hobby } from "./characterData";
export { characterInfo, characterStats, coreAttributes, softSkills, languages, uniqueSkill, hobbies, religion } from "./characterData";

export type { Profession } from "./professionData";
export { professions } from "./professionData";

export type { TalentNode, TalentEdge } from "./talentData";
export { talentNodes, talentEdges } from "./talentData";

export type { BackpackItem } from "./inventoryData";
export { backpack } from "./inventoryData";

export type { Achievement } from "./achievementData";
export { dungeonsConquered } from "./achievementData";
