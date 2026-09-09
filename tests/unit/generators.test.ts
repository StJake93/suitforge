import { describe, expect, it } from 'vitest';
import { DEFAULT_CHARACTER } from '@/character/defaults';
import { SLOTS } from '@/character/slots';
import { SLOT_IDS, type LockId } from '@/character/types';
import { generateName, generateNameSeeded, NAME_PATTERNS, nameSpaceSize, rollName } from '@/generators/names';
import { generateTriad, PALETTE_PRESETS, randomPalette } from '@/generators/palettes';
import { MAX_POWERS, POWER_CATEGORIES, powerCategoryById } from '@/generators/powers';
import { randomiseAll, randomiseSlot } from '@/generators/randomise';
import { mulberry32 } from '@/generators/rng';
import { registry } from '@/library';

describe('name generator (R-GEN-01)', () => {
  it('is deterministic for a seed', () => {
    const a = generateNameSeeded({ sex: 'male', category: 'energy' }, 42);
    const b = generateNameSeeded({ sex: 'male', category: 'energy' }, 42);
    expect(a).toBe(b);
    expect(a.length).toBeGreaterThan(2);
  });
  it('has ≥ 5 patterns and ≥ 60 000 possible outputs', () => {
    expect(NAME_PATTERNS).toBeGreaterThanOrEqual(5);
    expect(nameSpaceSize()).toBeGreaterThanOrEqual(60_000);
  });
  it('20 consecutive UI rolls are all distinct', () => {
    for (let trial = 0; trial < 20; trial++) {
      const names = new Set<string>();
      for (let i = 0; i < 20; i++)
        names.add(rollName({ sex: 'female', category: 'stealth' }, mulberry32(trial * 1000 + i * 7919)));
      expect(names.size).toBe(20);
    }
  });
  it('uses sex-specific titles and category vocab', () => {
    const rng = mulberry32(4);
    const seen = new Set<string>();
    for (let i = 0; i < 300; i++) seen.add(generateName({ sex: 'female', category: 'nature' }, rng));
    const joined = [...seen].join(' ');
    expect(joined).toMatch(/Lady|Miss|Dame|Baroness/);
    expect(joined).not.toMatch(/\bLord\b|\bMister\b|\bSir\b|\bBaron\b/);
    expect(joined).toMatch(/Thorn|Bloom|Fang|Root|Vine|Talon|Wild|Feral|Verdant|Briar|Moss/);
  });
});

describe('power sets (R-GEN-02)', () => {
  it('has ≥ 10 categories with ≥ 6 powers and a colour each', () => {
    expect(POWER_CATEGORIES.length).toBeGreaterThanOrEqual(10);
    for (const c of POWER_CATEGORIES) {
      expect(c.powers.length).toBeGreaterThanOrEqual(6);
      expect(c.colour).toMatch(/^#[0-9a-f]{6}$/i);
      expect(new Set(c.powers).size).toBe(c.powers.length);
    }
    expect(new Set(POWER_CATEGORIES.map((c) => c.id)).size).toBe(POWER_CATEGORIES.length);
    expect(powerCategoryById('nope')).toBeUndefined();
  });
});

describe('palettes (R-GEN-04)', () => {
  it('has ≥ 12 presets and valid generated triads', () => {
    expect(PALETTE_PRESETS.length).toBeGreaterThanOrEqual(12);
    const rng = mulberry32(9);
    for (let i = 0; i < 50; i++) {
      const p = generateTriad(rng);
      for (const v of [p.primary, p.secondary, p.accent]) expect(v).toMatch(/^#[0-9a-f]{6}$/);
    }
    const r = randomPalette(mulberry32(1));
    expect(r.primary).toMatch(/^#[0-9a-f]{6}$/);
  });
});

describe('randomiser (R-GEN-03)', () => {
  const valid = (c: typeof DEFAULT_CHARACTER) => {
    for (const slot of SLOT_IDS) {
      const id = c.loadout[slot];
      if (id === null) expect(SLOTS[slot].allowEmpty).toBe(true);
      else expect(registry.byId(id)?.slot).toBe(slot);
    }
    expect(c.body.height).toBeGreaterThanOrEqual(0);
    expect(c.body.height).toBeLessThanOrEqual(1);
    expect(c.powerSet.powers.length).toBeLessThanOrEqual(MAX_POWERS);
    if (c.powerSet.category) {
      const cat = powerCategoryById(c.powerSet.category)!;
      for (const p of c.powerSet.powers) expect(cat.powers).toContain(p);
    }
  };

  it('always produces a valid character', () => {
    const rng = mulberry32(123);
    let c = DEFAULT_CHARACTER;
    for (let i = 0; i < 200; i++) {
      c = randomiseAll(c, new Set(), registry, rng);
      valid(c);
    }
  });

  it('respects every lock', () => {
    const rng = mulberry32(7);
    const locks = new Set<LockId>(['torso', 'weapon', 'body', 'palette', 'name', 'power']);
    for (let i = 0; i < 50; i++) {
      const c = randomiseAll(DEFAULT_CHARACTER, locks, registry, rng);
      expect(c.loadout.torso).toBe(DEFAULT_CHARACTER.loadout.torso);
      expect(c.loadout.weapon).toBe(DEFAULT_CHARACTER.loadout.weapon);
      expect(c.body).toEqual(DEFAULT_CHARACTER.body);
      expect(c.palette).toEqual(DEFAULT_CHARACTER.palette);
      expect(c.name).toBe(DEFAULT_CHARACTER.name);
      expect(c.powerSet).toEqual(DEFAULT_CHARACTER.powerSet);
    }
  });

  it('randomiseSlot changes only that slot and never empties torso/legs', () => {
    const rng = mulberry32(3);
    for (let i = 0; i < 100; i++) {
      const c = randomiseSlot(DEFAULT_CHARACTER, 'legs', registry, rng);
      expect(c.loadout.legs).not.toBeNull();
      const { legs: _a, ...rest } = c.loadout;
      const { legs: _b, ...restD } = DEFAULT_CHARACTER.loadout;
      expect(rest).toEqual(restD);
    }
  });
});
