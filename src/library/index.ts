// Library registry (ARCHITECTURE §1). Each slot folder exports ItemDefinition[]; agents add theme files
// under the slot folder and list them in that folder's index.ts.
import type { SlotId } from '@/character/types';
import { SLOT_IDS } from '@/character/types';
import { backItems } from './back';
import { bootsItems } from './boots';
import { bracersItems } from './bracers';
import { glassesItems } from './glasses';
import { glovesItems } from './gloves';
import { headgearItems } from './headgear';
import { helmetItems } from './helmet';
import { legsItems } from './legs';
import { neckItems } from './neck';
import { torsoItems } from './torso';
import type { ItemDefinition } from './types';
import { weaponItems } from './weapon';

export const ALL_ITEMS: ItemDefinition[] = [
  ...helmetItems,
  ...headgearItems,
  ...glassesItems,
  ...neckItems,
  ...torsoItems,
  ...backItems,
  ...bracersItems,
  ...glovesItems,
  ...weaponItems,
  ...legsItems,
  ...bootsItems,
];

const byIdMap = new Map(ALL_ITEMS.map((i) => [i.id, i]));
const bySlotMap = new Map<SlotId, ItemDefinition[]>(
  SLOT_IDS.map((s) => [s, ALL_ITEMS.filter((i) => i.slot === s)]),
);

export const registry = {
  all: ALL_ITEMS,
  byId: (id: string): ItemDefinition | undefined => byIdMap.get(id),
  bySlot: (slot: SlotId): ItemDefinition[] => bySlotMap.get(slot) ?? [],
};
