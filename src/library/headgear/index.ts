import type { ItemDefinition } from '../types';
import { regal } from './regal';
import { tech } from './tech';
import { vanguard } from './vanguard';
import { wild } from './wild';

export const headgearItems: ItemDefinition[] = [...vanguard, ...tech, ...regal, ...wild];
