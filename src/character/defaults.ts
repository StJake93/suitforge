import type { Character, Loadout } from './types';
import { SLOT_IDS } from './types';

export const emptyLoadout = (): Loadout =>
  Object.fromEntries(SLOT_IDS.map((s) => [s, null])) as Loadout;

/** Deterministic first-load character (R-CHAR-08). Item ids must exist in the library. */
export const DEFAULT_CHARACTER: Character = {
  version: 1,
  name: 'Vanguard Prime',
  body: { sex: 'male', skinTone: '#c68642', height: 0.55, musculature: 0.6 },
  palette: { primary: '#2f6df6', secondary: '#1b1f2a', accent: '#ffcf4a' },
  loadout: {
    ...emptyLoadout(),
    helmet: 'helmet.vanguard-helm',
    torso: 'torso.vanguard-plate',
    bracers: 'bracers.vanguard-guards',
    gloves: 'gloves.vanguard-gauntlets',
    legs: 'legs.vanguard-greaves',
    boots: 'boots.vanguard-boots',
    weapon: 'weapon.pulse-rifle',
  },
  overrides: {},
  powerSet: { category: 'energy', powers: ['Plasma Lance', 'Overcharge'] },
};

export const SKIN_TONES: Array<{ name: string; hex: string }> = [
  { name: 'Porcelain', hex: '#f6e0d2' },
  { name: 'Fair', hex: '#f0c8a8' },
  { name: 'Light', hex: '#e3b58e' },
  { name: 'Medium', hex: '#cf9a6e' },
  { name: 'Tan', hex: '#c68642' },
  { name: 'Olive', hex: '#a7743f' },
  { name: 'Brown', hex: '#8d5524' },
  { name: 'Deep', hex: '#5c3a1e' },
  { name: 'Ebony', hex: '#3b2314' },
  { name: 'Ash', hex: '#8f9aa5' },
  { name: 'Cobalt', hex: '#4f7cff' },
  { name: 'Verdant', hex: '#5fbf6a' },
  { name: 'Gilded', hex: '#d4a634' },
  { name: 'Crimson', hex: '#c8384a' },
];
