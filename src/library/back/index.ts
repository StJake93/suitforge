import type { ItemDefinition } from '../types';
import { mystic } from './mystic';
import { tech } from './tech';
import { vanguard } from './vanguard';
import { wings } from './wings';

export const backItems: ItemDefinition[] = [...vanguard, ...wings, ...tech, ...mystic];
