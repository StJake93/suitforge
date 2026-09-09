import { DEG } from '../kit';
import type { ItemDefinition } from '../types';

export const vanguard: ItemDefinition[] = [
  {
    id: 'headgear.comms-antenna',
    slot: 'headgear',
    name: 'Comms Antenna',
    tags: ['tech', 'utility'],
    build: ({ ref, kit }) => {
      const r = ref.headRadius;
      const base = kit.at(
        kit.mesh(kit.cyl(r * 0.22, r * 0.28, r * 0.25, 8), 'dark'),
        -r * 0.85,
        r * 0.6,
        -r * 0.3,
        0,
        0,
        35 * DEG,
      );
      const mast = kit.at(
        kit.mesh(kit.cyl(r * 0.05, r * 0.07, r * 1.4, 6), 'metal'),
        -r * 1.15,
        r * 1.2,
        -r * 0.45,
        0,
        0,
        35 * DEG,
      );
      const tip = kit.at(kit.mesh(kit.sphere(r * 0.12, 8), 'glow'), -r * 1.55, r * 1.8, -r * 0.55);
      return { parts: [{ socket: 'head', object: kit.group(base, mast, tip) }] };
    },
  },
];
