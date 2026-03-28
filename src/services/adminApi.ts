const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json();
}

export const adminApi = {
  // Character
  getCharacter: () => apiFetch<any>("/character"),
  saveCharacter: (data: any) => apiFetch<any>("/character", { method: "PUT", body: JSON.stringify(data) }),

  // Talents
  getTalents: () => apiFetch<any>("/talents"),
  saveTalents: (data: any) => apiFetch<any>("/talents", { method: "PUT", body: JSON.stringify(data) }),

  // Professions
  getProfessions: () => apiFetch<any[]>("/professions"),
  saveProfessions: (data: any[]) => apiFetch<any>("/professions", { method: "PUT", body: JSON.stringify(data) }),

  // Inventory
  getInventory: () => apiFetch<any[]>("/inventory"),
  saveInventory: (data: any[]) => apiFetch<any>("/inventory", { method: "PUT", body: JSON.stringify(data) }),

  // Achievements
  getAchievements: () => apiFetch<any[]>("/achievements"),
  saveAchievements: (data: any[]) => apiFetch<any>("/achievements", { method: "PUT", body: JSON.stringify(data) }),

  // Translations
  getTranslation: (lang: string) => apiFetch<any>(`/translations/${lang}`),
  saveTranslation: (lang: string, data: any) => apiFetch<any>(`/translations/${lang}`, { method: "PUT", body: JSON.stringify(data) }),
};
