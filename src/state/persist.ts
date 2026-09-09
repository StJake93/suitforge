// R-SAVE-01 / R-SAVE-02 — localStorage autosave and named save slots. All reads are defensive.
import type { Character } from '@/character/types';

export const AUTOSAVE_KEY = 'suitforge.current.v1';
export const SAVES_KEY = 'suitforge.saves.v1';

export interface SaveEntry {
  id: string;
  name: string;
  savedAt: number;
  thumb: string | null;
  character: Character;
}

function storage(): Storage | null {
  try {
    return typeof localStorage !== 'undefined' ? localStorage : null;
  } catch {
    return null;
  }
}

export function readAutosave(): unknown | null {
  const s = storage();
  if (!s) return null;
  try {
    const raw = s.getItem(AUTOSAVE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeAutosave(c: Character): void {
  storage()?.setItem(AUTOSAVE_KEY, JSON.stringify(c));
}

export function listSaves(): SaveEntry[] {
  const s = storage();
  if (!s) return [];
  try {
    const raw = s.getItem(SAVES_KEY);
    const arr = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(arr)
      ? (arr.filter((e) => e && typeof e === 'object' && 'id' in e && 'character' in e) as SaveEntry[])
      : [];
  } catch {
    return [];
  }
}

function writeSaves(entries: SaveEntry[]): void {
  storage()?.setItem(SAVES_KEY, JSON.stringify(entries));
}

export function addSave(name: string, character: Character, thumb: string | null): SaveEntry {
  const entry: SaveEntry = {
    id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`,
    name,
    savedAt: Date.now(),
    thumb,
    character,
  };
  writeSaves([entry, ...listSaves()]);
  return entry;
}

export function deleteSave(id: string): void {
  writeSaves(listSaves().filter((e) => e.id !== id));
}

export function renameSave(id: string, name: string): void {
  writeSaves(listSaves().map((e) => (e.id === id ? { ...e, name } : e)));
}
