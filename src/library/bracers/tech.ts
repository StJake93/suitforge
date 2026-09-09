import { DEG, type Kit } from '../kit';
import type { ItemBuild, ItemDefinition } from '../types';

// Right forearm is authored; +X is the outside (lateral) of the right arm, +Y runs elbow → wrist.
const pair = ([right, left]: ReturnType<Kit['mirror']>): ItemBuild => ({
  parts: [
    { socket: 'forearmR', object: right },
    { socket: 'forearmL', object: left },
  ],
});

export const tech: ItemDefinition[] = [
  {
    id: 'bracers.wrist-blaster',
    slot: 'bracers',
    name: 'Wrist Blaster',
    tags: ['tech', 'ranged', 'energy'],
    build: ({ ref, kit }) => {
      const r = ref.forearmR,
        len = ref.forearmLen;
      return pair(
        kit.mirror(() => {
          const sleeve = kit.at(
            kit.mesh(kit.cyl(r * 1.15, r * 1.25, len * 0.7, 10), 'secondary'),
            0,
            len * 0.5,
            0,
          );
          const housing = kit.at(
            kit.mesh(kit.rbox(r * 1.1, len * 0.58, r * 1.2, r * 0.12), 'primary'),
            r * 1.55,
            len * 0.5,
            0,
          );
          const barrel = kit.at(
            kit.mesh(kit.cyl(r * 0.28, r * 0.3, len * 0.5, 8), 'metal'),
            r * 1.55,
            len * 0.86,
            0,
          );
          const muzzle = kit.at(
            kit.mesh(kit.cyl(r * 0.42, r * 0.42, r * 0.3, 8), 'glow'),
            r * 1.55,
            len * 1.1,
            0,
          );
          const cell = kit.at(
            kit.mesh(kit.box(r * 0.3, len * 0.26, r * 0.6), 'glow'),
            r * 1.55,
            len * 0.42,
            r * 0.62,
          );
          const strapA = kit.at(kit.mesh(kit.cyl(r * 1.3, r * 1.3, r * 0.4, 10), 'dark'), 0, len * 0.22, 0);
          const strapB = kit.at(kit.mesh(kit.cyl(r * 1.3, r * 1.3, r * 0.4, 10), 'dark'), 0, len * 0.78, 0);
          return kit.group(sleeve, housing, barrel, muzzle, cell, strapA, strapB);
        }),
      );
    },
  },
  {
    id: 'bracers.fin-cuff',
    slot: 'bracers',
    name: 'Fin Cuff',
    tags: ['tech', 'armour', 'light'],
    build: ({ ref, kit }) => {
      const r = ref.forearmR,
        len = ref.forearmLen;
      return pair(
        kit.mirror(() => {
          const cuff = kit.at(
            kit.mesh(kit.cyl(r * 1.2, r * 1.35, len * 0.5, 10), 'primary'),
            0,
            len * 0.55,
            0,
          );
          const elbow = kit.at(
            kit.mesh(kit.cyl(r * 1.4, r * 1.25, len * 0.16, 10), 'secondary'),
            0,
            len * 0.2,
            0,
          );
          const wrist = kit.at(
            kit.mesh(kit.cyl(r * 1.15, r * 1.1, len * 0.12, 10), 'secondary'),
            0,
            len * 0.9,
            0,
          );
          const finA = kit.at(
            kit.mesh(kit.plate(r * 1.8, len * 0.36, r * 0.14), 'primary'),
            r * 2.1,
            len * 0.55,
            r * 0.55,
            0,
            20 * DEG,
            0,
          );
          const finB = kit.at(
            kit.mesh(kit.plate(r * 1.8, len * 0.36, r * 0.14), 'primary'),
            r * 2.1,
            len * 0.55,
            -r * 0.55,
            0,
            -20 * DEG,
            0,
          );
          const strip = kit.at(
            kit.mesh(kit.box(r * 0.16, len * 0.38, r * 0.5), 'glow'),
            r * 1.32,
            len * 0.55,
            0,
          );
          const back = kit.at(
            kit.mesh(kit.rbox(r * 1.4, len * 0.4, r * 0.4, r * 0.1), 'secondary'),
            0,
            len * 0.55,
            r * 1.2,
          );
          return kit.group(cuff, elbow, wrist, finA, finB, strip, back);
        }),
      );
    },
  },
  {
    id: 'bracers.pulse-rings',
    slot: 'bracers',
    name: 'Pulse Rings',
    tags: ['energy', 'tech', 'light'],
    build: ({ ref, kit }) => {
      const r = ref.forearmR,
        len = ref.forearmLen;
      return pair(
        kit.mirror(() => {
          const sleeve = kit.at(
            kit.mesh(kit.cyl(r * 1.08, r * 1.12, len * 0.76, 10), 'dark'),
            0,
            len * 0.5,
            0,
          );
          const rings = [0.3, 0.5, 0.7].map((t) =>
            kit.at(kit.mesh(kit.ring(r * 1.35, r * 0.18, 16), 'glow'), 0, len * t, 0, 90 * DEG),
          );
          const spacers = [0.4, 0.6].map((t) =>
            kit.at(kit.mesh(kit.cyl(r * 1.25, r * 1.25, r * 0.3, 10), 'secondary'), 0, len * t, 0),
          );
          const front = kit.at(
            kit.mesh(kit.rbox(r * 0.9, len * 0.56, r * 0.5, r * 0.1), 'primary'),
            0,
            len * 0.5,
            r * 1.25,
          );
          const rear = kit.at(
            kit.mesh(kit.rbox(r * 0.9, len * 0.56, r * 0.5, r * 0.1), 'primary'),
            0,
            len * 0.5,
            -r * 1.25,
          );
          const wrist = kit.at(
            kit.mesh(kit.cyl(r * 1.2, r * 1.1, len * 0.12, 10), 'primary'),
            0,
            len * 0.9,
            0,
          );
          return kit.group(sleeve, ...rings, ...spacers, front, rear, wrist);
        }),
      );
    },
  },
];
