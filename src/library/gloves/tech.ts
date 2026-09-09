import { DEG, type Kit } from '../kit';
import type { ItemBuild, ItemDefinition } from '../types';

// Right hand is authored: origin at the wrist, +Y toward the fingertips, +Z is the palm side.
const pair = ([right, left]: ReturnType<Kit['mirror']>): ItemBuild => ({
  parts: [
    { socket: 'handR', object: right },
    { socket: 'handL', object: left },
  ],
});

export const tech: ItemDefinition[] = [
  {
    id: 'gloves.power-fist',
    slot: 'gloves',
    name: 'Power Fist',
    tags: ['tech', 'heavy', 'melee'],
    build: ({ ref, kit }) => {
      const s = ref.handSize,
        len = ref.handLen;
      return pair(
        kit.mirror(() => {
          const fist = kit.at(
            kit.mesh(kit.rbox(s * 0.95, len * 1.05, s * 0.62, s * 0.08), 'primary'),
            0,
            len * 0.55,
            s * 0.04,
          );
          const knuckles = kit.at(
            kit.mesh(kit.rbox(s * 1.0, len * 0.26, s * 0.3, s * 0.04), 'metal'),
            0,
            len * 1.02,
            s * 0.12,
          );
          const thumb = kit.at(
            kit.mesh(kit.rbox(s * 0.3, len * 0.4, s * 0.3, s * 0.04), 'secondary'),
            -s * 0.56,
            len * 0.42,
            s * 0.14,
          );
          const cuff = kit.at(
            kit.mesh(kit.cyl(s * 0.5, s * 0.46, len * 0.24, 8), 'secondary'),
            0,
            len * 0.06,
            0,
          );
          const strip = kit.at(
            kit.mesh(kit.box(s * 0.6, len * 0.08, s * 0.06), 'glow'),
            0,
            len * 0.76,
            -s * 0.34,
          );
          const pistonA = kit.at(
            kit.mesh(kit.cyl(s * 0.06, s * 0.06, len * 0.5, 6), 'metal'),
            s * 0.34,
            len * 0.32,
            -s * 0.34,
          );
          const pistonB = kit.at(
            kit.mesh(kit.cyl(s * 0.06, s * 0.06, len * 0.5, 6), 'metal'),
            -s * 0.34,
            len * 0.32,
            -s * 0.34,
          );
          return kit.group(fist, knuckles, thumb, cuff, strip, pistonA, pistonB);
        }),
      );
    },
  },
  {
    id: 'gloves.stealth-grips',
    slot: 'gloves',
    name: 'Stealth Grips',
    tags: ['stealth', 'light', 'tech'],
    build: ({ ref, kit }) => {
      const s = ref.handSize,
        len = ref.handLen;
      return pair(
        kit.mirror(() => {
          const hand = kit.at(
            kit.mesh(kit.rbox(s * 0.5, len * 0.95, s * 0.22, s * 0.05), 'dark'),
            0,
            len * 0.5,
            0,
          );
          const back = kit.at(
            kit.mesh(kit.rbox(s * 0.42, len * 0.5, s * 0.08, s * 0.02), 'secondary'),
            0,
            len * 0.55,
            -s * 0.14,
          );
          const knuckles = kit.at(
            kit.mesh(kit.rbox(s * 0.46, len * 0.16, s * 0.08, s * 0.02), 'primary'),
            0,
            len * 0.92,
            -s * 0.12,
          );
          const cuff = kit.at(
            kit.mesh(kit.cyl(s * 0.3, s * 0.28, len * 0.18, 10), 'primary'),
            0,
            len * 0.06,
            0,
          );
          const dot = kit.at(
            kit.mesh(kit.box(s * 0.2, len * 0.05, s * 0.03), 'glow'),
            0,
            len * 0.06,
            -s * 0.3,
          );
          const thumb = kit.at(
            kit.mesh(kit.capsule(s * 0.07, len * 0.2), 'dark'),
            -s * 0.3,
            len * 0.38,
            s * 0.04,
            0,
            0,
            -35 * DEG,
          );
          return kit.group(hand, back, knuckles, cuff, dot, thumb);
        }),
      );
    },
  },
  {
    id: 'gloves.nova-hands',
    slot: 'gloves',
    name: 'Nova Hands',
    tags: ['cosmic', 'energy', 'light'],
    build: ({ ref, kit }) => {
      const s = ref.handSize,
        len = ref.handLen;
      return pair(
        kit.mirror(() => {
          const core = kit.at(kit.mesh(kit.capsule(s * 0.22, len * 0.6), 'secondary'), 0, len * 0.5, 0);
          const back = kit.at(
            kit.mesh(kit.rbox(s * 0.4, len * 0.45, s * 0.1, s * 0.03), 'primary'),
            0,
            len * 0.5,
            -s * 0.22,
          );
          const cuff = kit.at(
            kit.mesh(kit.cyl(s * 0.36, s * 0.3, len * 0.22, 10), 'primary'),
            0,
            len * 0.08,
            0,
          );
          const wristRing = kit.at(
            kit.mesh(kit.ring(s * 0.33, s * 0.05, 16), 'glow'),
            0,
            len * 0.16,
            0,
            90 * DEG,
          );
          const orbA = kit.at(kit.mesh(kit.sphere(s * 0.09, 8), 'glow'), s * 0.42, len * 0.7, 0);
          const orbB = kit.at(kit.mesh(kit.sphere(s * 0.08, 8), 'glow'), -s * 0.3, len * 0.85, s * 0.25);
          const orbC = kit.at(kit.mesh(kit.sphere(s * 0.07, 8), 'glow'), s * 0.1, len * 1.05, -s * 0.3);
          const orbit = kit.at(
            kit.mesh(kit.ring(s * 0.5, s * 0.03, 20), 'accent'),
            0,
            len * 0.75,
            0,
            90 * DEG,
            0,
            25 * DEG,
          );
          const palm = kit.at(
            kit.mesh(kit.cyl(s * 0.18, s * 0.18, s * 0.04, 10), 'glow'),
            0,
            len * 0.5,
            s * 0.2,
            90 * DEG,
          );
          return kit.group(core, back, cuff, wristRing, orbA, orbB, orbC, orbit, palm);
        }),
      );
    },
  },
];
