import type { ItemDefinition } from '../types';
import { heavy } from './heavy';
import { mystic } from './mystic';
import { suits } from './suits';
import { vanguard } from './vanguard';

export const torsoItems: ItemDefinition[] = [...vanguard, ...suits, ...heavy, ...mystic];
