import { DEG, type Kit } from '../kit';
import type { ItemBuild, ItemDefinition } from '../types';

const pair = ([right, left]: ReturnType<Kit['mirror']>): ItemBuild => ({
  parts: [
    { socket: 'handR', object: right },
    { socket: 'handL', object: left },
  ],
});

export const mystic: ItemDefinition[] = [
  {
    id: 'gloves.bound-palms',
    slot: 'gloves',
    name: 'Bound Palms',
    tags: ['mystic', 'light', 'melee'],
    build: ({ ref, kit }) => {
      const s = ref.handSize,
        len = ref.handLen;
      return pair(
        kit.mirror(() => {
          // stacked bandage wraps, alternately twisted around the hand axis
          const wraps = [0.12, 0.29, 0.46, 0.63].map((t, i) =>
            kit.at(
              kit.mesh(kit.rbox(s * 0.56, len * 0.17, s * 0.26, s * 0.03), 'primary'),
              0,
              len * t,
              0,
              0,
              (i % 2 ? 9 : -9) * DEG,
            ),
          );
          const tieA = kit.at(
            kit.mesh(kit.rbox(s * 0.6, len * 0.06, s * 0.3, s * 0.015), 'dark'),
            0,
            len * 0.21,
            0,
            0,
            12 * DEG,
          );
          const tieB = kit.at(
            kit.mesh(kit.rbox(s * 0.6, len * 0.06, s * 0.3, s * 0.015), 'dark'),
            0,
            len * 0.55,
            0,
            0,
            -12 * DEG,
          );
          const fingers = kit.at(
            kit.mesh(kit.rbox(s * 0.5, len * 0.28, s * 0.2, s * 0.04), 'secondary'),
            0,
            len * 0.92,
            0,
          );
          const palm = kit.at(
            kit.mesh(kit.cyl(s * 0.16, s * 0.16, s * 0.03, 10), 'glow'),
            0,
            len * 0.46,
            s * 0.14,
            90 * DEG,
          );
          const wristRing = kit.at(
            kit.mesh(kit.ring(s * 0.3, s * 0.04, 12), 'dark'),
            0,
            len * 0.02,
            0,
            90 * DEG,
          );
          return kit.group(...wraps, tieA, tieB, fingers, palm, wristRing);
        }),
      );
    },
  },
  {
    id: 'gloves.crystal-knuckles',
    slot: 'gloves',
    name: 'Crystal Knuckles',
    tags: ['mystic', 'nature', 'melee'],
    build: ({ ref, kit }) => {
      const s = ref.handSize,
        len = ref.handLen;
      return pair(
        kit.mirror(() => {
          const hand = kit.at(
            kit.mesh(kit.rbox(s * 0.55, len * 0.95, s * 0.3, s * 0.06), 'primary'),
            0,
            len * 0.5,
            0,
          );
          const cuff = kit.at(
            kit.mesh(kit.cyl(s * 0.34, s * 0.3, len * 0.2, 8), 'secondary'),
            0,
            len * 0.06,
            0,
          );
          const palm = kit.at(
            kit.mesh(kit.rbox(s * 0.4, len * 0.5, s * 0.05, s * 0.015), 'dark'),
            0,
            len * 0.5,
            s * 0.16,
          );
          // crystal shards growing off the knuckles, angled up and away from the palm
          const shardSpec: Array<[number, number]> = [
            [-0.2, 0.3],
            [-0.07, 0.42],
            [0.07, 0.42],
            [0.2, 0.3],
          ];
          const shards = shardSpec.map(([x, h]) =>
            kit.at(kit.mesh(kit.cone(s * 0.07, s * h, 5), 'glass'), s * x, len * 0.9, -s * 0.2, -60 * DEG),
          );
          const core = kit.at(kit.mesh(kit.sphere(s * 0.09, 8), 'glow'), 0, len * 0.62, -s * 0.18);
          return kit.group(hand, cuff, palm, ...shards, core);
        }),
      );
    },
  },
  {
    id: 'gloves.sorcerer-cuffs',
    slot: 'gloves',
    name: 'Sorcerer Cuffs',
    tags: ['mystic', 'elegant'],
    build: ({ ref, kit }) => {
      const s = ref.handSize,
        len = ref.handLen;
      return pair(
        kit.mirror(() => {
          const hand = kit.at(
            kit.mesh(kit.rbox(s * 0.48, len * 0.9, s * 0.24, s * 0.05), 'secondary'),
            0,
            len * 0.5,
            0,
          );
          // cuff flares back toward the forearm
          const flare = kit.at(
            kit.mesh(kit.cyl(s * 0.32, s * 0.55, len * 0.3, 12), 'primary'),
            0,
            len * 0.04,
            0,
          );
          const rim = kit.at(kit.mesh(kit.ring(s * 0.55, s * 0.04, 16), 'metal'), 0, -len * 0.1, 0, 90 * DEG);
          const gem = kit.at(
            kit.mesh(kit.prism(6, s * 0.12, s * 0.08), 'accent'),
            0,
            len * 0.55,
            -s * 0.16,
            90 * DEG,
          );
          const halo = kit.at(kit.mesh(kit.ring(s * 0.16, s * 0.02, 12), 'glow'), 0, len * 0.55, -s * 0.17);
          const caps = kit.at(kit.mesh(kit.box(s * 0.5, len * 0.12, s * 0.22), 'metal'), 0, len * 0.95, 0);
          const thumb = kit.at(
            kit.mesh(kit.capsule(s * 0.07, len * 0.18), 'secondary'),
            -s * 0.3,
            len * 0.36,
            s * 0.03,
            0,
            0,
            -35 * DEG,
          );
          return kit.group(hand, flare, rim, gem, halo, caps, thumb);
        }),
      );
    },
  },
];
