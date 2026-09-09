import type { ItemDefinition } from '../types';
import { classic } from './classic';
import { exotic } from './exotic';
import { tactical } from './tactical';
import { vanguard } from './vanguard';

export const glassesItems: ItemDefinition[] = [...vanguard, ...classic, ...tactical, ...exotic];
