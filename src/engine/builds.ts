// Item build cache + baked (merged) part cache. Built once per item id, shared by the viewport and thumbnails.
import { Object3D } from 'three';
import { registry } from '@/library';
import { buildContext } from '@/library/validate';
import type { ItemBuild } from '@/library/types';
import type { SocketId } from '@/character/slots';
import { bakePart } from './bake';

export interface BakedItem {
  parts: Array<{ socket: SocketId; object: Object3D }>;
  hands: 1 | 2 | undefined;
}

const raw = new Map<string, ItemBuild>();
const baked = new Map<string, BakedItem>();

export function getBuild(itemId: string): ItemBuild | null {
  const hit = raw.get(itemId);
  if (hit) return hit;
  const item = registry.byId(itemId);
  if (!item) return null;
  const b = item.build(buildContext());
  raw.set(itemId, b);
  return b;
}

/** Baked parts are templates: callers clone() them before adding to the scene. */
export function getBaked(itemId: string): BakedItem | null {
  const hit = baked.get(itemId);
  if (hit) return hit;
  const b = getBuild(itemId);
  if (!b) return null;
  const item = registry.byId(itemId)!;
  const out: BakedItem = {
    parts: b.parts.map((p) => ({ socket: p.socket, object: bakePart(p.object) })),
    hands: item.hands,
  };
  baked.set(itemId, out);
  return out;
}

export function bakeBuild(key: string, build: ItemBuild, smooth = false): BakedItem {
  const hit = baked.get(key);
  if (hit) return hit;
  const out: BakedItem = {
    parts: build.parts.map((p) => ({ socket: p.socket, object: bakePart(p.object, smooth) })),
    hands: undefined,
  };
  baked.set(key, out);
  return out;
}
