// R-GEN-04 — curated palettes plus a generated triad.
import type { Palette } from '@/character/types';
import type { Rng } from './rng';

export interface PalettePreset extends Palette {
  name: string;
}

export const PALETTE_PRESETS: PalettePreset[] = [
  { name: 'Vanguard', primary: '#2f6df6', secondary: '#1b1f2a', accent: '#ffcf4a' },
  { name: 'Midnight', primary: '#1c2233', secondary: '#0d1017', accent: '#5ee1ff' },
  { name: 'Crimson Guard', primary: '#b3202f', secondary: '#2a2a2e', accent: '#f2d16b' },
  { name: 'Arctic', primary: '#e6edf5', secondary: '#7f97b3', accent: '#3ec5ff' },
  { name: 'Ember', primary: '#f26b1d', secondary: '#33201b', accent: '#ffd166' },
  { name: 'Verdigris', primary: '#2f8f7a', secondary: '#1f2b2a', accent: '#d8f5a2' },
  { name: 'Royal', primary: '#5b3fd6', secondary: '#20183d', accent: '#ffd76a' },
  { name: 'Gunmetal', primary: '#4d5561', secondary: '#23272e', accent: '#ff7a3d' },
  { name: 'Solar', primary: '#f5c531', secondary: '#3a2f14', accent: '#ff5e3a' },
  { name: 'Rose Steel', primary: '#d96a9a', secondary: '#2b1e28', accent: '#7ff0e0' },
  { name: 'Hazard', primary: '#f4d000', secondary: '#151515', accent: '#ff3b3b' },
  { name: 'Phantom', primary: '#2a2f3a', secondary: '#12151c', accent: '#b56dff' },
  { name: 'Jade Court', primary: '#1f7a4d', secondary: '#0f2a1c', accent: '#f0e7b0' },
  { name: 'Copper Wire', primary: '#b8622c', secondary: '#2f2420', accent: '#6dd6ff' },
];

function hslToHex(h: number, s: number, l: number): string {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const to = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`;
}

/** Generated triad: saturated primary, dark desaturated secondary, bright complementary accent. */
export function generateTriad(rng: Rng): Palette {
  const h = rng.range(0, 360);
  return {
    primary: hslToHex(h, rng.range(0.55, 0.85), rng.range(0.42, 0.56)),
    secondary: hslToHex((h + rng.range(-25, 25) + 360) % 360, rng.range(0.15, 0.35), rng.range(0.1, 0.2)),
    accent: hslToHex((h + 180 + rng.range(-30, 30)) % 360, rng.range(0.8, 1), rng.range(0.55, 0.68)),
  };
}

export function randomPalette(rng: Rng): Palette {
  if (rng.chance(0.2)) return generateTriad(rng);
  const p = rng.pick(PALETTE_PRESETS);
  return { primary: p.primary, secondary: p.secondary, accent: p.accent };
}
