import type { ItemDefinition } from '../types';
import { armour } from './armour';
import { mystic } from './mystic';
import { tech } from './tech';
import { vanguard } from './vanguard';

export const legsItems: ItemDefinition[] = [...vanguard, ...armour, ...tech, ...mystic];
