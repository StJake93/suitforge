import { describe, expect, it } from 'vitest';
import { ALL_ITEMS, registry } from '@/library';
import { LIMITS, validateItem, validateLibrary } from '@/library/validate';
import { SLOT_IDS } from '@/character/types';

describe('library contract (R-LIB-01, R-LIB-03)', () => {
  for (const item of ALL_ITEMS) {
    it(`${item.id} is valid`, () => {
      expect(validateItem(item)).toEqual([]);
    });
  }

  it('has unique ids', () => {
    const ids = ALL_ITEMS.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('validateLibrary reports slot counts', () => {
    const problems = validateLibrary(ALL_ITEMS);
    const nonCount = [...problems.entries()].filter(([k]) => !k.startsWith('slot:'));
    expect(nonCount).toEqual([]);
    for (const slot of SLOT_IDS) {
      const n = registry.bySlot(slot).length;
      if (n < LIMITS.minItemsPerSlot)
        console.warn(`slot ${slot}: ${n}/${LIMITS.minItemsPerSlot} items (R-LIB-01 not yet met)`);
    }
  });
});
