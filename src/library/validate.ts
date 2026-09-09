// Machine-checkable parts of the asset contract (R-LIB-03). Runs in Node (vitest) — no DOM.
import { Box3, BufferGeometry, Mesh, Object3D } from 'three';
import { REF } from '@/character/metrics';
import { SLOTS, type SocketId } from '@/character/slots';
import { SLOT_IDS, type SlotId } from '@/character/types';
import { kit, roleStub } from './kit';
import { MATERIAL_ROLES, TAGS, type BuildContext, type ItemBuild, type ItemDefinition, type MaterialRole } from './types';

export const LIMITS = {
  maxMeshesPerItem: 24,
  maxTrianglesPerPart: 6000,
  maxTrianglesPerItem: 10000,
  maxNameLength: 24,
  minItemsPerSlot: 8,
  maxBuildMs: 30,
};

export const buildContext = (): BuildContext => ({ ref: REF, mat: roleStub, kit });

export function triangleCount(geometry: BufferGeometry): number {
  const index = geometry.getIndex();
  const pos = geometry.getAttribute('position');
  if (index) return index.count / 3;
  return pos ? pos.count / 3 : 0;
}

export interface BuildStats {
  meshes: number;
  triangles: number;
  buildMs: number;
}

export function statsFor(build: ItemBuild): BuildStats {
  let meshes = 0;
  let triangles = 0;
  for (const part of build.parts) {
    part.object.traverse((o: Object3D) => {
      const m = o as Mesh;
      if (m.isMesh) {
        meshes++;
        triangles += triangleCount(m.geometry);
      }
    });
  }
  return { meshes, triangles, buildMs: 0 };
}

const ID_RE = /^[a-z]+\.[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Fit envelope per socket at REF, in socket-local metres (ASSET_CONTRACT §3). Parts must stay inside so
 * they never float away from the body or stab through neighbouring limbs. Tuned generously.
 */
type Bounds = { x: [number, number]; y: [number, number]; z: [number, number] };
const B = (x: [number, number], y: [number, number], z: [number, number]): Bounds => ({ x, y, z });
export const SOCKET_BOUNDS: Record<SocketId, Bounds> = {
  head: B([-0.3, 0.3], [-0.26, 0.5], [-0.3, 0.3]),
  neck: B([-0.3, 0.3], [-0.16, 0.22], [-0.3, 0.3]),
  chest: B([-0.55, 0.55], [-0.5, 0.45], [-0.4, 0.4]),
  back: B([-1.1, 1.1], [-1.0, 1.0], [-0.12, 1.0]),
  pelvis: B([-0.4, 0.4], [-0.4, 0.35], [-0.3, 0.3]),
  upperArmL: B([-0.22, 0.22], [-0.16, 0.42], [-0.22, 0.22]),
  upperArmR: B([-0.22, 0.22], [-0.16, 0.42], [-0.22, 0.22]),
  forearmL: B([-0.16, 0.16], [-0.08, 0.36], [-0.16, 0.16]),
  forearmR: B([-0.16, 0.16], [-0.08, 0.36], [-0.16, 0.16]),
  handL: B([-0.16, 0.16], [-0.06, 0.26], [-0.16, 0.16]),
  handR: B([-0.16, 0.16], [-0.06, 0.26], [-0.16, 0.16]),
  weapon: B([-0.4, 0.4], [-0.4, 1.4], [-0.4, 0.4]),
  thighL: B([-0.24, 0.24], [-0.16, 0.52], [-0.24, 0.24]),
  thighR: B([-0.24, 0.24], [-0.16, 0.52], [-0.24, 0.24]),
  shinL: B([-0.2, 0.2], [-0.12, 0.52], [-0.2, 0.2]),
  shinR: B([-0.2, 0.2], [-0.12, 0.52], [-0.2, 0.2]),
  footL: B([-0.16, 0.16], [-0.12, 0.4], [-0.18, 0.32]),
  footR: B([-0.16, 0.16], [-0.12, 0.4], [-0.18, 0.32]),
};

export function partBounds(object: Object3D): Box3 {
  object.updateMatrixWorld(true);
  return new Box3().setFromObject(object);
}

function checkBounds(socket: SocketId, box: Box3): string | null {
  const b = SOCKET_BOUNDS[socket];
  const out: string[] = [];
  const f = (v: number) => v.toFixed(2);
  if (box.min.x < b.x[0] || box.max.x > b.x[1]) out.push(`x ${f(box.min.x)}..${f(box.max.x)} outside ${b.x}`);
  if (box.min.y < b.y[0] || box.max.y > b.y[1]) out.push(`y ${f(box.min.y)}..${f(box.max.y)} outside ${b.y}`);
  if (box.min.z < b.z[0] || box.max.z > b.z[1]) out.push(`z ${f(box.min.z)}..${f(box.max.z)} outside ${b.z}`);
  return out.length ? `part ${socket} exceeds fit envelope: ${out.join('; ')}` : null;
}

/** Returns a list of violations for one item; empty means valid. */
export function validateItem(item: ItemDefinition): string[] {
  const errors: string[] = [];
  const meta = SLOTS[item.slot];
  if (!meta) errors.push(`unknown slot "${item.slot as string}"`);
  if (!ID_RE.test(item.id)) errors.push(`id "${item.id}" must match <slot>.<kebab-name>`);
  if (!item.id.startsWith(`${item.slot}.`)) errors.push(`id "${item.id}" must start with "${item.slot}."`);
  if (!item.name || item.name.length > LIMITS.maxNameLength) errors.push(`name must be 1..${LIMITS.maxNameLength} chars`);
  if (!item.tags?.length) errors.push('at least one tag required');
  for (const t of item.tags ?? []) if (!(TAGS as readonly string[]).includes(t)) errors.push(`unknown tag "${t}"`);
  if (item.slot === 'weapon' && item.hands !== 1 && item.hands !== 2) errors.push('weapon must declare hands: 1 | 2');
  if (item.slot !== 'weapon' && item.hands !== undefined) errors.push('only weapons declare hands');
  for (const h of item.hides ?? []) if (!(SLOT_IDS as readonly string[]).includes(h)) errors.push(`hides unknown slot "${h}"`);
  if (!meta) return errors;

  let build: ItemBuild;
  const t0 = performance.now();
  try {
    build = item.build(buildContext());
  } catch (e) {
    errors.push(`build threw: ${(e as Error).message}`);
    return errors;
  }
  const buildMs = performance.now() - t0;
  if (buildMs > LIMITS.maxBuildMs * 4) errors.push(`build took ${buildMs.toFixed(1)} ms (limit ${LIMITS.maxBuildMs} ms warm)`);
  if (!build.parts?.length) errors.push('build returned no parts');
  const seenSockets = new Set<string>();
  for (const part of build.parts ?? []) {
    if (!meta.sockets.includes(part.socket)) errors.push(`socket "${part.socket}" not allowed for slot ${item.slot}`);
    if (seenSockets.has(part.socket)) errors.push(`duplicate part for socket "${part.socket}"`);
    seenSockets.add(part.socket);
    if (!part.object) errors.push(`part ${part.socket} has no object`);
    let partTris = 0;
    part.object?.traverse((o: Object3D) => {
      const m = o as Mesh;
      if (!m.isMesh) return;
      partTris += triangleCount(m.geometry);
      const role = m.material && 'userData' in m.material ? (m.material.userData.role as MaterialRole | undefined) : undefined;
      if (!role || !MATERIAL_ROLES.includes(role)) errors.push(`mesh "${m.name || '(unnamed)'}" in ${part.socket} does not use a material role`);
    });
    if (partTris > LIMITS.maxTrianglesPerPart) errors.push(`part ${part.socket} has ${partTris} triangles (limit ${LIMITS.maxTrianglesPerPart})`);
    if (part.object && SOCKET_BOUNDS[part.socket]) {
      const err = checkBounds(part.socket, partBounds(part.object));
      if (err) errors.push(err);
    }
  }
  if (meta.paired) {
    const sides = [...seenSockets];
    const hasL = sides.some((s) => s.endsWith('L'));
    const hasR = sides.some((s) => s.endsWith('R'));
    if (!(hasL && hasR)) errors.push('paired slot item must provide both L and R parts');
  }
  const stats = statsFor(build);
  if (stats.meshes > LIMITS.maxMeshesPerItem) errors.push(`${stats.meshes} meshes (limit ${LIMITS.maxMeshesPerItem})`);
  if (stats.triangles > LIMITS.maxTrianglesPerItem) errors.push(`${stats.triangles} triangles (limit ${LIMITS.maxTrianglesPerItem})`);
  return errors;
}

export function validateLibrary(items: ItemDefinition[]): Map<string, string[]> {
  const problems = new Map<string, string[]>();
  const ids = new Set<string>();
  const perSlot = new Map<SlotId, number>();
  for (const item of items) {
    const errs = validateItem(item);
    if (ids.has(item.id)) errs.push('duplicate id');
    ids.add(item.id);
    perSlot.set(item.slot, (perSlot.get(item.slot) ?? 0) + 1);
    if (errs.length) problems.set(item.id, errs);
  }
  for (const slot of SLOT_IDS) {
    const n = perSlot.get(slot) ?? 0;
    if (n < LIMITS.minItemsPerSlot) problems.set(`slot:${slot}`, [`${n} items (R-LIB-01 requires ≥ ${LIMITS.minItemsPerSlot})`]);
  }
  return problems;
}
