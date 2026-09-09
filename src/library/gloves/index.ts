import type { ItemDefinition } from '../types';
import { brutal } from './brutal';
import { mystic } from './mystic';
import { tech } from './tech';
import { vanguard } from './vanguard';

export const glovesItems: ItemDefinition[] = [...vanguard, ...tech, ...mystic, ...brutal];
