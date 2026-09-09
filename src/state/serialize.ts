// R-SAVE-03 / R-SAVE-05 — compact share encoding and defensive JSON validation.
import { DEFAULT_CHARACTER, emptyLoadout } from '@/character/defaults';
import { SLOT_IDS, clamp01, type Character, type Palette, type SlotId } from '@/character/types';
import { POWER_CATEGORIES, powerCategoryById } from '@/generators/powers';
import { LEGACY_IDS } from '@/library/legacy';
import type { ItemDefinition } from '@/library/types';

export interface LookupRegistry {
  byId: (id: string) => ItemDefinition | undefined;
  bySlot: (slot: SlotId) => ItemDefinition[];
}

const HEX = /^#[0-9a-f]{6}$/i;
const isHex = (v: unknown): v is string => typeof v === 'string' && HEX.test(v);
const strip = (hex: string) => hex.replace('#', '').toLowerCase();
const unstrip = (h: string) => (HEX.test(`#${h}`) ? `#${h.toLowerCase()}` : null);

export interface LoadResult {
  character: Character;
  /** item ids that were unknown and dropped */
  dropped: string[];
}

/** Resolve an item id through the legacy map; returns undefined if unknown. */
export function resolveItemId(id: string | null, slot: SlotId, registry: LookupRegistry): string | null | undefined {
  if (id === null) return null;
  const mapped = id in LEGACY_IDS ? LEGACY_IDS[id] : id;
  if (mapped === null) return null;
  const item = registry.byId(mapped!);
  return item && item.slot === slot ? item.id : undefined;
}

/** Coerce arbitrary JSON into a valid Character, dropping unknown items (never throws on bad shape). */
export function sanitise(input: unknown, registry: LookupRegistry): LoadResult {
  const src = (typeof input === 'object' && input !== null ? input : {}) as Record<string, unknown>;
  const dropped: string[] = [];
  const body = (src.body ?? {}) as Record<string, unknown>;
  const pal = (src.palette ?? {}) as Record<string, unknown>;
  const lo = (src.loadout ?? {}) as Record<string, unknown>;
  const ov = (src.overrides ?? {}) as Record<string, unknown>;
  const ps = (src.powerSet ?? {}) as Record<string, unknown>;
  const d = DEFAULT_CHARACTER;

  const loadout = emptyLoadout();
  for (const slot of SLOT_IDS) {
    const raw = lo[slot];
    const id = typeof raw === 'string' ? raw : null;
    const resolved = resolveItemId(id, slot, registry);
    if (resolved === undefined) {
      if (id) dropped.push(id);
      loadout[slot] = null;
    } else loadout[slot] = resolved;
    if (loadout[slot] === null && !allowEmpty(slot)) loadout[slot] = registry.bySlot(slot)[0]?.id ?? null;
  }

  const overrides: Character['overrides'] = {};
  for (const slot of SLOT_IDS) {
    const o = ov[slot];
    if (typeof o !== 'object' || o === null) continue;
    const entry: Partial<Palette> = {};
    for (const role of ['primary', 'secondary', 'accent'] as const) {
      const v = (o as Record<string, unknown>)[role];
      if (isHex(v)) entry[role] = v.toLowerCase();
    }
    if (Object.keys(entry).length) overrides[slot] = entry;
  }

  const category = typeof ps.category === 'string' && powerCategoryById(ps.category) ? ps.category : null;
  const cat = powerCategoryById(category);
  const powers = Array.isArray(ps.powers) && cat ? ps.powers.filter((p): p is string => typeof p === 'string' && cat.powers.includes(p)).slice(0, 3) : [];

  const character: Character = {
    version: 1,
    name: typeof src.name === 'string' && src.name.trim() ? src.name.slice(0, 40) : d.name,
    body: {
      sex: body.sex === 'female' ? 'female' : 'male',
      skinTone: isHex(body.skinTone) ? body.skinTone.toLowerCase() : d.body.skinTone,
      height: typeof body.height === 'number' && Number.isFinite(body.height) ? clamp01(body.height) : d.body.height,
      musculature: typeof body.musculature === 'number' && Number.isFinite(body.musculature) ? clamp01(body.musculature) : d.body.musculature,
    },
    palette: {
      primary: isHex(pal.primary) ? pal.primary.toLowerCase() : d.palette.primary,
      secondary: isHex(pal.secondary) ? pal.secondary.toLowerCase() : d.palette.secondary,
      accent: isHex(pal.accent) ? pal.accent.toLowerCase() : d.palette.accent,
    },
    loadout,
    overrides,
    powerSet: { category, powers },
  };
  return { character, dropped };
}

const allowEmpty = (slot: SlotId) => slot !== 'torso' && slot !== 'legs';

// ---- compact share string ------------------------------------------------------------------------

const b64url = (s: string) => btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64url = (s: string) => decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (s.length % 4)) % 4))));

export function toShareString(c: Character): string {
  const shortId = (slot: SlotId) => (c.loadout[slot] ? c.loadout[slot]!.slice(slot.length + 1) : '');
  const overrides = SLOT_IDS.map((slot, i) => {
    const o = c.overrides[slot];
    if (!o) return null;
    return `${i}:${o.primary ? strip(o.primary) : ''}.${o.secondary ? strip(o.secondary) : ''}.${o.accent ? strip(o.accent) : ''}`;
  }).filter(Boolean);
  const cat = powerCategoryById(c.powerSet.category);
  const power = cat ? `${POWER_CATEGORIES.indexOf(cat)}:${c.powerSet.powers.map((p) => cat.powers.indexOf(p)).filter((i) => i >= 0).join(',')}` : '';
  const fields = [
    '1',
    encodeURIComponent(c.name),
    c.body.sex === 'female' ? 'f' : 'm',
    strip(c.body.skinTone),
    String(Math.round(c.body.height * 100)),
    String(Math.round(c.body.musculature * 100)),
    strip(c.palette.primary),
    strip(c.palette.secondary),
    strip(c.palette.accent),
    SLOT_IDS.map(shortId).join(','),
    overrides.join(','),
    power,
  ];
  return b64url(fields.join('|'));
}

export function fromShareString(s: string, registry: LookupRegistry): LoadResult | null {
  let raw: string;
  try {
    raw = unb64url(s);
  } catch {
    return null;
  }
  const f = raw.split('|');
  if (f[0] !== '1' || f.length < 12) return null;
  const ids = (f[9] ?? '').split(',');
  const loadout: Record<string, string | null> = {};
  SLOT_IDS.forEach((slot, i) => {
    const short = ids[i];
    loadout[slot] = short ? `${slot}.${short}` : null;
  });
  const overrides: Record<string, Partial<Palette>> = {};
  for (const entry of (f[10] ?? '').split(',').filter(Boolean)) {
    const [idx, hexes] = entry.split(':');
    const slot = SLOT_IDS[Number(idx)];
    if (!slot || !hexes) continue;
    const [p, sec, a] = hexes.split('.');
    const o: Partial<Palette> = {};
    if (p) o.primary = unstrip(p) ?? undefined;
    if (sec) o.secondary = unstrip(sec) ?? undefined;
    if (a) o.accent = unstrip(a) ?? undefined;
    overrides[slot] = o;
  }
  let powerSet: { category: string | null; powers: string[] } = { category: null, powers: [] };
  if (f[11]) {
    const [ci, pis] = f[11].split(':');
    const cat = POWER_CATEGORIES[Number(ci)];
    if (cat) powerSet = { category: cat.id, powers: (pis ?? '').split(',').filter(Boolean).map((i) => cat.powers[Number(i)]).filter((p): p is string => !!p) };
  }
  const json = {
    version: 1,
    name: decodeURIComponent(f[1] ?? ''),
    body: { sex: f[2] === 'f' ? 'female' : 'male', skinTone: unstrip(f[3] ?? ''), height: Number(f[4]) / 100, musculature: Number(f[5]) / 100 },
    palette: { primary: unstrip(f[6] ?? ''), secondary: unstrip(f[7] ?? ''), accent: unstrip(f[8] ?? '') },
    loadout,
    overrides,
    powerSet,
  };
  return sanitise(json, registry);
}

export const SHARE_PARAM = 'c';

export function shareUrlFor(c: Character, base: string = typeof location !== 'undefined' ? location.href.split('#')[0]! : ''): string {
  return `${base}#${SHARE_PARAM}=${toShareString(c)}`;
}

export function shareStringFromHash(hash: string): string | null {
  const m = /[#&]c=([A-Za-z0-9_-]+)/.exec(hash);
  return m ? m[1]! : null;
}
