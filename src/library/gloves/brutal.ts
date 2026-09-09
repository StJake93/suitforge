import { DEG, type Kit } from '../kit';
import type { ItemBuild, ItemDefinition } from '../types';

const pair = ([right, left]: ReturnType<Kit['mirror']>): ItemBuild => ({
  parts: [
    { socket: 'handR', object: right },
    { socket: 'handL', object: left },
  ],
});

export const brutal: ItemDefinition[] = [
  {
    id: 'gloves.knuckle-dusters',
    slot: 'gloves',
    name: 'Knuckle Dusters',
    tags: ['brutal', 'melee', 'retro'],
    build: ({ ref, kit }) => {
      const s = ref.handSize,
        len = ref.handLen;
      return pair(
        kit.mirror(() => {
          const hand = kit.at(
            kit.mesh(kit.rbox(s * 0.5, len * 0.9, s * 0.26, s * 0.05), 'dark'),
            0,
            len * 0.48,
            0,
          );
          const cuff = kit.at(
            kit.mesh(kit.cyl(s * 0.32, s * 0.3, len * 0.16, 10), 'secondary'),
            0,
            len * 0.06,
            0,
          );
          const back = kit.at(
            kit.mesh(kit.rbox(s * 0.42, len * 0.45, s * 0.1, s * 0.03), 'primary'),
            0,
            len * 0.5,
            -s * 0.16,
          );
          const strap = kit.at(kit.mesh(kit.box(s * 0.56, len * 0.08, s * 0.3), 'primary'), 0, len * 0.26, 0);
          const bar = kit.at(
            kit.mesh(kit.rbox(s * 0.7, len * 0.18, s * 0.3, s * 0.04), 'metal'),
            0,
            len * 0.95,
            s * 0.02,
          );
          const studs = [-0.24, -0.08, 0.08, 0.24].map((x) =>
            kit.at(kit.mesh(kit.cone(s * 0.05, s * 0.14, 6), 'metal'), s * x, len * 1.08, s * 0.02),
          );
          return kit.group(hand, cuff, back, strap, bar, ...studs);
        }),
      );
    },
  },
  {
    id: 'gloves.talon-claws',
    slot: 'gloves',
    name: 'Talon Claws',
    tags: ['brutal', 'nature', 'melee'],
    build: ({ ref, kit }) => {
      const s = ref.handSize,
        len = ref.handLen;
      return pair(
        kit.mirror(() => {
          const hand = kit.at(
            kit.mesh(kit.rbox(s * 0.5, len * 0.85, s * 0.26, s * 0.05), 'primary'),
            0,
            len * 0.45,
            0,
          );
          const cuff = kit.at(
            kit.mesh(kit.cyl(s * 0.34, s * 0.3, len * 0.2, 8), 'secondary'),
            0,
            len * 0.06,
            0,
          );
          const knuckles = kit.at(
            kit.mesh(kit.rbox(s * 0.5, len * 0.2, s * 0.12, s * 0.03), 'secondary'),
            0,
            len * 0.8,
            -s * 0.14,
          );
          const ridge = kit.at(
            kit.mesh(kit.box(s * 0.1, len * 0.5, s * 0.08), 'metal'),
            0,
            len * 0.45,
            -s * 0.16,
          );
          // four long metal claws curving toward the palm
          const claws = [-0.18, -0.06, 0.06, 0.18].map((x) =>
            kit.at(
              kit.mesh(kit.cone(s * 0.06, s * 0.55, 6), 'metal'),
              s * x,
              len * 0.85 + s * 0.26,
              s * 0.02,
              20 * DEG,
            ),
          );
          const thumb = kit.at(
            kit.mesh(kit.cone(s * 0.06, s * 0.4, 6), 'metal'),
            -s * 0.34,
            len * 0.52,
            s * 0.08,
            20 * DEG,
            0,
            -50 * DEG,
          );
          return kit.group(hand, cuff, knuckles, ridge, ...claws, thumb);
        }),
      );
    },
  },
  {
    id: 'gloves.plate-gauntlet',
    slot: 'gloves',
    name: 'Plate Gauntlet',
    tags: ['armour', 'heavy', 'retro'],
    build: ({ ref, kit }) => {
      const s = ref.handSize,
        len = ref.handLen;
      return pair(
        kit.mirror(() => {
          // overlapping segmented plates down the back of the hand
          const plates = [0.58, 0.56, 0.54, 0.52].map((w, i) =>
            kit.at(
              kit.mesh(kit.rbox(s * w, len * 0.22, s * 0.34, s * 0.03), 'primary'),
              0,
              len * (0.16 + i * 0.19),
              -s * (0.02 + i * 0.01),
            ),
          );
          const fingers = kit.at(
            kit.mesh(kit.rbox(s * 0.5, len * 0.2, s * 0.24, s * 0.03), 'metal'),
            0,
            len * 0.95,
            0,
          );
          const flare = kit.at(
            kit.mesh(kit.cyl(s * 0.36, s * 0.5, len * 0.28, 8), 'primary'),
            0,
            len * 0.02,
            0,
          );
          const rim = kit.at(
            kit.mesh(kit.cyl(s * 0.52, s * 0.52, len * 0.05, 8), 'accent'),
            0,
            -len * 0.1,
            0,
          );
          const palm = kit.at(
            kit.mesh(kit.rbox(s * 0.42, len * 0.6, s * 0.06, s * 0.015), 'dark'),
            0,
            len * 0.5,
            s * 0.17,
          );
          const thumb = kit.at(
            kit.mesh(kit.rbox(s * 0.18, len * 0.32, s * 0.18, s * 0.03), 'secondary'),
            -s * 0.34,
            len * 0.4,
            s * 0.05,
            0,
            0,
            -30 * DEG,
          );
          const ridge = kit.at(
            kit.mesh(kit.box(s * 0.5, len * 0.05, s * 0.08), 'secondary'),
            0,
            len * 0.8,
            -s * 0.22,
          );
          return kit.group(...plates, fingers, flare, rim, palm, thumb, ridge);
        }),
      );
    },
  },
];
