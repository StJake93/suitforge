import type { Material, Object3D } from 'three';
import type { BodyMetrics } from '@/character/metrics';
import type { SocketId } from '@/character/slots';
import type { SlotId } from '@/character/types';
import type { Kit } from './kit';

export type MaterialRole = 'primary' | 'secondary' | 'accent' | 'metal' | 'dark' | 'glass' | 'glow' | 'skin';
export const MATERIAL_ROLES: readonly MaterialRole[] = [
  'primary',
  'secondary',
  'accent',
  'metal',
  'dark',
  'glass',
  'glow',
  'skin',
];

export const TAGS = [
  'tech',
  'armour',
  'stealth',
  'mystic',
  'cosmic',
  'nature',
  'retro',
  'heavy',
  'light',
  'elegant',
  'brutal',
  'ranged',
  'melee',
  'energy',
  'flight',
  'utility',
  'visor',
  'full-face',
  'open-face',
] as const;
export type Tag = (typeof TAGS)[number];

export interface BuildContext {
  ref: BodyMetrics;
  mat: (role: MaterialRole) => Material;
  kit: Kit;
}

export interface ItemPart {
  socket: SocketId;
  object: Object3D;
}

export interface ItemBuild {
  parts: ItemPart[];
}

export interface ItemDefinition {
  id: string;
  slot: SlotId;
  name: string;
  tags: Tag[];
  hands?: 1 | 2;
  hides?: SlotId[];
  build: (ctx: BuildContext) => ItemBuild;
}
