import { DEG, type Kit } from '../kit';
import type { ItemBuild, ItemDefinition } from '../types';

const pair = ([right, left]: ReturnType<Kit['mirror']>): ItemBuild => ({
  parts: [
    { socket: 'forearmR', object: right },
    { socket: 'forearmL', object: left },
  ],
});

export const brutal: ItemDefinition[] = [
  {
    id: 'bracers.spiked-vambrace',
    slot: 'bracers',
    name: 'Spiked Vambrace',
    tags: ['brutal', 'heavy', 'armour'],
    build: ({ ref, kit }) => {
      const r = ref.forearmR,
        len = ref.forearmLen;
      return pair(
        kit.mirror(() => {
          const vambrace = kit.at(
            kit.mesh(kit.cyl(r * 1.45, r * 1.7, len * 0.66, 8), 'primary'),
            0,
            len * 0.5,
            0,
          );
          const spikes = [0.3, 0.5, 0.7].map((t) =>
            kit.at(kit.mesh(kit.cone(r * 0.36, r * 1.3, 6), 'metal'), r * 2.2, len * t, 0, 0, 0, -90 * DEG),
          );
          const strapA = kit.at(kit.mesh(kit.cyl(r * 1.76, r * 1.76, r * 0.3, 8), 'dark'), 0, len * 0.35, 0);
          const strapB = kit.at(kit.mesh(kit.cyl(r * 1.68, r * 1.68, r * 0.3, 8), 'dark'), 0, len * 0.66, 0);
          const studA = kit.at(kit.mesh(kit.sphere(r * 0.24, 6), 'metal'), 0, len * 0.4, r * 1.62);
          const studB = kit.at(kit.mesh(kit.sphere(r * 0.24, 6), 'metal'), 0, len * 0.6, r * 1.55);
          const wrist = kit.at(
            kit.mesh(kit.cyl(r * 1.35, r * 1.2, len * 0.14, 8), 'secondary'),
            0,
            len * 0.88,
            0,
          );
          return kit.group(vambrace, ...spikes, strapA, strapB, studA, studB, wrist);
        }),
      );
    },
  },
  {
    id: 'bracers.round-shield',
    slot: 'bracers',
    name: 'Round Shield Bracer',
    tags: ['armour', 'heavy', 'retro'],
    build: ({ ref, kit }) => {
      const r = ref.forearmR,
        len = ref.forearmLen;
      return pair(
        kit.mirror(() => {
          const sleeve = kit.at(
            kit.mesh(kit.cyl(r * 1.15, r * 1.25, len * 0.6, 10), 'secondary'),
            0,
            len * 0.5,
            0,
          );
          const mount = kit.at(
            kit.mesh(kit.box(r * 0.6, len * 0.35, r * 0.6), 'metal'),
            r * 1.3,
            len * 0.5,
            0,
          );
          const shield = kit.at(
            kit.mesh(kit.cyl(r * 2.3, r * 2.3, r * 0.26, 12), 'primary'),
            r * 1.62,
            len * 0.5,
            0,
            0,
            0,
            90 * DEG,
          );
          const rim = kit.at(
            kit.mesh(kit.ring(r * 2.3, r * 0.18, 16), 'metal'),
            r * 1.62,
            len * 0.5,
            0,
            0,
            90 * DEG,
            0,
          );
          const boss = kit.at(
            kit.mesh(kit.hemi(r * 0.62, 10), 'accent'),
            r * 1.75,
            len * 0.5,
            0,
            0,
            0,
            -90 * DEG,
          );
          const strapA = kit.at(kit.mesh(kit.cyl(r * 1.3, r * 1.3, r * 0.3, 10), 'dark'), 0, len * 0.28, 0);
          const strapB = kit.at(kit.mesh(kit.cyl(r * 1.3, r * 1.3, r * 0.3, 10), 'dark'), 0, len * 0.72, 0);
          return kit.group(sleeve, mount, shield, rim, boss, strapA, strapB);
        }),
      );
    },
  },
  {
    id: 'bracers.strap-wraps',
    slot: 'bracers',
    name: 'Strap Wraps',
    tags: ['brutal', 'retro', 'light'],
    build: ({ ref, kit }) => {
      const r = ref.forearmR,
        len = ref.forearmLen;
      return pair(
        kit.mirror(() => {
          const wrap = kit.at(
            kit.mesh(kit.cyl(r * 1.08, r * 1.14, len * 0.74, 10), 'primary'),
            0,
            len * 0.5,
            0,
          );
          const straps = [0.22, 0.4, 0.58, 0.76].map((t, i) =>
            kit.at(
              kit.mesh(kit.cyl(r * 1.24, r * 1.24, len * 0.09, 10), 'dark'),
              0,
              len * t,
              0,
              (i % 2 ? 7 : -7) * DEG,
            ),
          );
          const buckleA = kit.at(
            kit.mesh(kit.box(r * 0.4, len * 0.1, r * 0.2), 'metal'),
            0,
            len * 0.4,
            r * 1.28,
          );
          const buckleB = kit.at(
            kit.mesh(kit.box(r * 0.4, len * 0.1, r * 0.2), 'metal'),
            0,
            len * 0.76,
            r * 1.28,
          );
          const plate = kit.at(
            kit.mesh(kit.rbox(r * 1.0, len * 0.44, r * 0.34, r * 0.08), 'secondary'),
            0,
            len * 0.5,
            -r * 1.18,
          );
          return kit.group(wrap, ...straps, buckleA, buckleB, plate);
        }),
      );
    },
  },
];
