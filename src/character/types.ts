// R-CHAR-01 / R-SLOT-01 — the character schema. Versioned; see state/serialize.ts for migrations.

export const SLOT_IDS = [
  'helmet',
  'headgear',
  'glasses',
  'neck',
  'torso',
  'back',
  'bracers',
  'gloves',
  'weapon',
  'legs',
  'boots',
] as const;
export type SlotId = (typeof SLOT_IDS)[number];

export type Sex = 'male' | 'female';

export interface Body {
  sex: Sex;
  /** hex colour */
  skinTone: string;
  /** 0..1 → 1.55 m .. 2.10 m (R-CHAR-04) */
  height: number;
  /** 0..1 slender → heavyweight (R-CHAR-05) */
  musculature: number;
}

export interface Palette {
  primary: string;
  secondary: string;
  accent: string;
}

export interface PowerSet {
  category: string | null;
  powers: string[];
}

export type Loadout = Record<SlotId, string | null>;

export interface Character {
  version: 1;
  name: string;
  body: Body;
  palette: Palette;
  loadout: Loadout;
  overrides: Partial<Record<SlotId, Partial<Palette>>>;
  powerSet: PowerSet;
}

export const HEIGHT_MIN_M = 1.55;
export const HEIGHT_MAX_M = 2.1;
export const heightToMetres = (h: number): number => HEIGHT_MIN_M + clamp01(h) * (HEIGHT_MAX_M - HEIGHT_MIN_M);
export const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);

export type LockId = SlotId | 'body' | 'palette' | 'name' | 'power';
