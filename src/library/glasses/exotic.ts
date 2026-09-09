// Exotic eyewear: single cyclops lens, frameless floating holo-lenses.
import { DEG } from '../kit';
import type { ItemDefinition } from '../types';

export const exotic: ItemDefinition[] = [
  {
    id: 'glasses.cyclops-lens',
    slot: 'glasses',
    name: 'Cyclops Lens',
    tags: ['tech', 'energy', 'visor'],
    build: ({ ref, kit }) => {
      const r = ref.headRadius;
      const eyeY = r * 0.1;
      // one heavy bar frame with a single central glowing eye and blocky side housings
      const frame = kit.at(
        kit.mesh(kit.rbox(r * 1.3, r * 0.5, r * 0.24, r * 0.1), 'primary'),
        0,
        eyeY,
        r * 0.95,
      );
      const eye = kit.at(
        kit.mesh(kit.cyl(r * 0.2, r * 0.2, r * 0.14, 14), 'glow'),
        0,
        eyeY,
        r * 1.1,
        90 * DEG,
      );
      const eyeRim = kit.at(kit.mesh(kit.ring(r * 0.22, r * 0.04, 14), 'metal'), 0, eyeY, r * 1.15);
      const blockL = kit.at(
        kit.mesh(kit.box(r * 0.24, r * 0.4, r * 0.5), 'secondary'),
        r * 0.72,
        eyeY,
        r * 0.7,
      );
      const blockR = kit.at(
        kit.mesh(kit.box(r * 0.24, r * 0.4, r * 0.5), 'secondary'),
        -r * 0.72,
        eyeY,
        r * 0.7,
      );
      const strap = kit.at(
        kit.mesh(kit.arc(r * 1.06, r * 1.06, r * 0.2, 50 * DEG, 260 * DEG, 16), 'dark'),
        0,
        eyeY,
        0,
      );
      const ventL = kit.at(
        kit.mesh(kit.box(r * 0.3, r * 0.04, r * 0.03), 'accent'),
        r * 0.4,
        eyeY + r * 0.2,
        r * 1.08,
      );
      const ventR = kit.at(
        kit.mesh(kit.box(r * 0.3, r * 0.04, r * 0.03), 'accent'),
        -r * 0.4,
        eyeY + r * 0.2,
        r * 1.08,
      );
      return {
        parts: [
          { socket: 'head', object: kit.group(frame, eye, eyeRim, blockL, blockR, strap, ventL, ventR) },
        ],
      };
    },
  },
  {
    id: 'glasses.holo-lenses',
    slot: 'glasses',
    name: 'Holo Lenses',
    tags: ['energy', 'cosmic', 'light'],
    build: ({ ref, kit }) => {
      const r = ref.headRadius;
      const eyeY = r * 0.1;
      // frameless hexagonal panes hovering in front of each eye, projected from small temple emitters
      const paneL = kit.at(
        kit.mesh(kit.prism(6, r * 0.24, r * 0.03), 'glass'),
        r * 0.42,
        eyeY,
        r * 1.05,
        90 * DEG,
      );
      const paneR = kit.at(
        kit.mesh(kit.prism(6, r * 0.24, r * 0.03), 'glass'),
        -r * 0.42,
        eyeY,
        r * 1.05,
        90 * DEG,
      );
      const edgeL = kit.at(kit.mesh(kit.ring(r * 0.25, r * 0.025, 6), 'glow'), r * 0.42, eyeY, r * 1.05);
      const edgeR = kit.at(kit.mesh(kit.ring(r * 0.25, r * 0.025, 6), 'glow'), -r * 0.42, eyeY, r * 1.05);
      const emitL = kit.at(
        kit.mesh(kit.rbox(r * 0.16, r * 0.16, r * 0.3, r * 0.04), 'primary'),
        r * 0.98,
        eyeY + r * 0.05,
        r * 0.25,
      );
      const emitR = kit.at(
        kit.mesh(kit.rbox(r * 0.16, r * 0.16, r * 0.3, r * 0.04), 'primary'),
        -r * 0.98,
        eyeY + r * 0.05,
        r * 0.25,
      );
      const lightL = kit.at(kit.mesh(kit.sphere(r * 0.05, 6), 'accent'), r * 1.0, eyeY + r * 0.14, r * 0.4);
      const lightR = kit.at(kit.mesh(kit.sphere(r * 0.05, 6), 'accent'), -r * 1.0, eyeY + r * 0.14, r * 0.4);
      const pip = kit.at(kit.mesh(kit.sphere(r * 0.06, 6), 'glow'), 0, eyeY + r * 0.1, r * 1.08);
      return {
        parts: [
          {
            socket: 'head',
            object: kit.group(paneL, paneR, edgeL, edgeR, emitL, emitR, lightL, lightR, pip),
          },
        ],
      };
    },
  },
];
