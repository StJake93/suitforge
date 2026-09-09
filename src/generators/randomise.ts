// R-GEN-03 — randomise everything unlocked; never produce an invalid character.
import { SKIN_TONES } from '@/character/defaults';
import { SLOTS } from '@/character/slots';
import { SLOT_IDS, type Character, type LockId, type SlotId } from '@/character/types';
import type { ItemDefinition } from '@/library/types';
import { generateName } from './names';
import { randomPalette } from './palettes';
import { MAX_POWERS, POWER_CATEGORIES } from './powers';
import type { Rng } from './rng';

export interface Registry {
  bySlot: (slot: SlotId) => ItemDefinition[];
}

export function randomSlotItem(slot: SlotId, registry: Registry, rng: Rng): string | null {
  const items = registry.bySlot(slot);
  const allowEmpty = SLOTS[slot].allowEmpty;
  // ~18 % chance of empty for optional cosmetic slots, keep weapons/back rarer-empty for drama
  const emptyChance = allowEmpty ? (slot === 'weapon' || slot === 'back' ? 0.25 : 0.18) : 0;
  if (items.length === 0 || rng.chance(emptyChance)) return allowEmpty ? null : (items[0]?.id ?? null);
  return rng.pick(items).id;
}

export function randomPowerSet(rng: Rng): Character['powerSet'] {
  const cat = rng.pick(POWER_CATEGORIES);
  const n = 1 + rng.int(MAX_POWERS);
  const pool = [...cat.powers];
  const powers: string[] = [];
  for (let i = 0; i < n && pool.length; i++) powers.push(pool.splice(rng.int(pool.length), 1)[0]!);
  return { category: cat.id, powers };
}

export function randomiseAll(
  c: Character,
  locks: ReadonlySet<LockId>,
  registry: Registry,
  rng: Rng,
): Character {
  const loadout = { ...c.loadout };
  for (const slot of SLOT_IDS) if (!locks.has(slot)) loadout[slot] = randomSlotItem(slot, registry, rng);
  const body = locks.has('body')
    ? c.body
    : {
        sex: rng.chance(0.5) ? ('male' as const) : ('female' as const),
        skinTone: rng.pick(SKIN_TONES).hex,
        height: Math.round(rng.range(0.15, 0.9) * 100) / 100,
        musculature: Math.round(rng.range(0.1, 0.95) * 100) / 100,
      };
  const palette = locks.has('palette') ? c.palette : randomPalette(rng);
  const overrides = locks.has('palette') ? c.overrides : {};
  const powerSet = locks.has('power') ? c.powerSet : randomPowerSet(rng);
  const name = locks.has('name') ? c.name : generateName({ sex: body.sex, category: powerSet.category }, rng);
  return { ...c, name, body, palette, overrides, loadout, powerSet };
}

export function randomiseSlot(c: Character, slot: SlotId, registry: Registry, rng: Rng): Character {
  const current = c.loadout[slot];
  const items = registry.bySlot(slot).filter((i) => i.id !== current);
  const allowEmpty = SLOTS[slot].allowEmpty && current !== null;
  const pickEmpty = allowEmpty && rng.chance(0.1);
  const next = pickEmpty ? null : items.length ? rng.pick(items).id : current;
  return { ...c, loadout: { ...c.loadout, [slot]: next } };
}
