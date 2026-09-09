import { DEG, type Kit } from '../kit';
import type { ItemBuild, ItemDefinition } from '../types';

const pair = ([right, left]: ReturnType<Kit['mirror']>): ItemBuild => ({
  parts: [
    { socket: 'forearmR', object: right },
    { socket: 'forearmL', object: left },
  ],
});

export const mystic: ItemDefinition[] = [
  {
    id: 'bracers.rune-band',
    slot: 'bracers',
    name: 'Rune Band',
    tags: ['mystic', 'elegant', 'energy'],
    build: ({ ref, kit }) => {
      const r = ref.forearmR,
        len = ref.forearmLen;
      return pair(
        kit.mirror(() => {
          const band = kit.at(
            kit.mesh(kit.cyl(r * 1.4, r * 1.4, len * 0.42, 8), 'primary'),
            0,
            len * 0.55,
            0,
          );
          const rimA = kit.at(
            kit.mesh(kit.cyl(r * 1.52, r * 1.52, r * 0.25, 8), 'secondary'),
            0,
            len * 0.34,
            0,
          );
          const rimB = kit.at(
            kit.mesh(kit.cyl(r * 1.52, r * 1.52, r * 0.25, 8), 'secondary'),
            0,
            len * 0.76,
            0,
          );
          const runeX = kit.at(
            kit.mesh(kit.box(r * 0.14, len * 0.22, r * 0.5), 'glow'),
            r * 1.4,
            len * 0.55,
            0,
          );
          const runeNX = kit.at(
            kit.mesh(kit.box(r * 0.14, len * 0.22, r * 0.5), 'glow'),
            -r * 1.4,
            len * 0.55,
            0,
          );
          const runeZ = kit.at(
            kit.mesh(kit.box(r * 0.5, len * 0.22, r * 0.14), 'glow'),
            0,
            len * 0.55,
            r * 1.4,
          );
          const runeNZ = kit.at(
            kit.mesh(kit.box(r * 0.5, len * 0.22, r * 0.14), 'glow'),
            0,
            len * 0.55,
            -r * 1.4,
          );
          const cuff = kit.at(
            kit.mesh(kit.cyl(r * 1.15, r * 1.2, len * 0.15, 8), 'secondary'),
            0,
            len * 0.9,
            0,
          );
          const gem = kit.at(kit.mesh(kit.sphere(r * 0.3, 8), 'accent'), 0, len * 0.9, r * 1.15);
          return kit.group(band, rimA, rimB, runeX, runeNX, runeZ, runeNZ, cuff, gem);
        }),
      );
    },
  },
  {
    id: 'bracers.frost-shards',
    slot: 'bracers',
    name: 'Frost Shards',
    tags: ['mystic', 'nature', 'light'],
    build: ({ ref, kit }) => {
      const r = ref.forearmR,
        len = ref.forearmLen;
      return pair(
        kit.mirror(() => {
          const sleeve = kit.at(
            kit.mesh(kit.cyl(r * 1.12, r * 1.18, len * 0.7, 10), 'secondary'),
            0,
            len * 0.5,
            0,
          );
          // open shell over the outside quadrant (theta 0 = +Z, π/2 = +X)
          const shell = kit.at(
            kit.mesh(kit.arc(r * 1.3, r * 1.38, len * 0.55, 30 * DEG, 120 * DEG, 8), 'primary'),
            0,
            len * 0.5,
            0,
          );
          const shard = (h: number, y: number, tilt: number, role: 'glass' | 'glow') =>
            kit.at(
              kit.mesh(kit.cone(r * 0.32, h, 5), role),
              r * 1.3 + h * 0.5,
              len * y,
              0,
              tilt,
              0,
              -90 * DEG,
            );
          const shards = [
            shard(r * 1.6, 0.32, 20 * DEG, 'glass'),
            shard(r * 1.9, 0.5, 0, 'glow'),
            shard(r * 1.7, 0.66, -20 * DEG, 'glass'),
            shard(r * 1.2, 0.42, -35 * DEG, 'glass'),
          ];
          const wristRing = kit.at(
            kit.mesh(kit.ring(r * 1.2, r * 0.12, 12), 'metal'),
            0,
            len * 0.9,
            0,
            90 * DEG,
          );
          return kit.group(sleeve, shell, ...shards, wristRing);
        }),
      );
    },
  },
  {
    id: 'bracers.sigil-cuff',
    slot: 'bracers',
    name: 'Sigil Cuff',
    tags: ['mystic', 'elegant'],
    build: ({ ref, kit }) => {
      const r = ref.forearmR,
        len = ref.forearmLen;
      return pair(
        kit.mirror(() => {
          const cuff = kit.at(
            kit.mesh(kit.cyl(r * 1.15, r * 1.22, len * 0.32, 10), 'primary'),
            0,
            len * 0.76,
            0,
          );
          const elbow = kit.at(
            kit.mesh(kit.cyl(r * 1.28, r * 1.2, len * 0.18, 10), 'secondary'),
            0,
            len * 0.2,
            0,
          );
          const strap = kit.at(
            kit.mesh(kit.cyl(r * 1.12, r * 1.12, len * 0.06, 10), 'dark'),
            0,
            len * 0.45,
            0,
          );
          // flat hexagonal sigil plate standing off the front of the forearm
          const sigil = kit.at(
            kit.mesh(kit.prism(6, r * 1.45, r * 0.22), 'primary'),
            0,
            len * 0.5,
            r * 1.25,
            90 * DEG,
          );
          const sigilRim = kit.at(
            kit.mesh(kit.prism(6, r * 1.6, r * 0.1), 'metal'),
            0,
            len * 0.5,
            r * 1.18,
            90 * DEG,
          );
          const core = kit.at(
            kit.mesh(kit.prism(6, r * 0.5, r * 0.14), 'glow'),
            0,
            len * 0.5,
            r * 1.4,
            90 * DEG,
          );
          const stud = kit.at(kit.mesh(kit.sphere(r * 0.22, 8), 'accent'), 0, len * 0.76, -r * 1.2);
          return kit.group(cuff, elbow, strap, sigil, sigilRim, core, stud);
        }),
      );
    },
  },
];
