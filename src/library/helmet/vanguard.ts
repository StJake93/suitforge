import { DEG } from '../kit';
import type { ItemDefinition } from '../types';

export const vanguard: ItemDefinition[] = [
  {
    id: 'helmet.vanguard-helm',
    slot: 'helmet',
    name: 'Vanguard Helm',
    tags: ['armour', 'tech', 'visor'],
    hides: ['glasses'],
    build: ({ ref, kit }) => {
      const r = ref.headRadius;
      const dome = kit.at(kit.mesh(kit.hemi(r * 1.16, 16), 'primary'), 0, 0.03 * r, 0);
      const sides = kit.at(
        kit.mesh(kit.arc(r * 1.16, r * 1.08, r * 1.0, 60 * DEG, 240 * DEG, 16), 'primary'),
        0,
        -0.45 * r,
        0,
      );
      const visor = kit.at(
        kit.mesh(kit.rbox(r * 1.55, r * 0.55, r * 0.22, r * 0.08), 'glass'),
        0,
        0.1 * r,
        r * 1.02,
      );
      const brow = kit.at(
        kit.mesh(kit.rbox(r * 1.7, r * 0.2, r * 0.3, r * 0.05), 'secondary'),
        0,
        0.45 * r,
        r * 0.95,
      );
      const chin = kit.at(
        kit.mesh(kit.rbox(r * 1.5, r * 0.42, r * 0.5, r * 0.08), 'secondary'),
        0,
        -0.68 * r,
        r * 0.72,
      );
      const crest = kit.at(kit.mesh(kit.box(r * 0.14, r * 0.3, r * 1.4), 'accent'), 0, r * 1.05, -r * 0.15);
      const earL = kit.at(
        kit.mesh(kit.cyl(r * 0.32, r * 0.32, r * 0.16, 10), 'glow'),
        r * 1.12,
        -0.1 * r,
        0,
        0,
        0,
        90 * DEG,
      );
      const earR = kit.at(
        kit.mesh(kit.cyl(r * 0.32, r * 0.32, r * 0.16, 10), 'glow'),
        -r * 1.12,
        -0.1 * r,
        0,
        0,
        0,
        90 * DEG,
      );
      return {
        parts: [{ socket: 'head', object: kit.group(dome, sides, visor, brow, chin, crest, earL, earR) }],
      };
    },
  },
];
