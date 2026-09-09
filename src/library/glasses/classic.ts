// Classic eyewear: aviators, cat-eye frames, brass monocle.
import { DEG } from '../kit';
import type { ItemDefinition } from '../types';

export const classic: ItemDefinition[] = [
  {
    id: 'glasses.aviators',
    slot: 'glasses',
    name: 'Aviators',
    tags: ['retro', 'light'],
    build: ({ ref, kit }) => {
      const r = ref.headRadius;
      const eyeY = r * 0.08;
      const z = r * 0.98;
      // tall teardrop-ish lenses in thin wire rims with a double bridge
      const lensL = kit.at(
        kit.scaled(kit.mesh(kit.cyl(r * 0.34, r * 0.3, r * 0.04, 12), 'glass'), 1, 1, 1.2),
        r * 0.42,
        eyeY,
        z,
        90 * DEG,
      );
      const lensR = kit.at(
        kit.scaled(kit.mesh(kit.cyl(r * 0.34, r * 0.3, r * 0.04, 12), 'glass'), 1, 1, 1.2),
        -r * 0.42,
        eyeY,
        z,
        90 * DEG,
      );
      const rimL = kit.at(
        kit.scaled(kit.mesh(kit.ring(r * 0.34, r * 0.025, 16), 'metal'), 1, 1.2, 1),
        r * 0.42,
        eyeY,
        z,
      );
      const rimR = kit.at(
        kit.scaled(kit.mesh(kit.ring(r * 0.34, r * 0.025, 16), 'metal'), 1, 1.2, 1),
        -r * 0.42,
        eyeY,
        z,
      );
      const bridge1 = kit.at(kit.mesh(kit.box(r * 0.24, r * 0.04, r * 0.04), 'metal'), 0, r * 0.2, z);
      const bridge2 = kit.at(kit.mesh(kit.box(r * 0.24, r * 0.04, r * 0.04), 'metal'), 0, r * 0.34, z);
      const armL = kit.at(
        kit.mesh(kit.cyl(r * 0.025, r * 0.025, r * 1.1, 5), 'metal'),
        r * 0.86,
        r * 0.22,
        r * 0.45,
        90 * DEG,
      );
      const armR = kit.at(
        kit.mesh(kit.cyl(r * 0.025, r * 0.025, r * 1.1, 5), 'metal'),
        -r * 0.86,
        r * 0.22,
        r * 0.45,
        90 * DEG,
      );
      return {
        parts: [
          { socket: 'head', object: kit.group(lensL, lensR, rimL, rimR, bridge1, bridge2, armL, armR) },
        ],
      };
    },
  },
  {
    id: 'glasses.cat-eye',
    slot: 'glasses',
    name: 'Cat-Eye Frames',
    tags: ['elegant', 'retro'],
    build: ({ ref, kit }) => {
      const r = ref.headRadius;
      const eyeY = r * 0.1;
      // chunky frames tilted up at the outer corners with pointed wing tips
      const frameL = kit.at(
        kit.mesh(kit.rbox(r * 0.5, r * 0.36, r * 0.14, r * 0.06), 'primary'),
        r * 0.42,
        eyeY,
        r * 0.96,
        0,
        0,
        12 * DEG,
      );
      const frameR = kit.at(
        kit.mesh(kit.rbox(r * 0.5, r * 0.36, r * 0.14, r * 0.06), 'primary'),
        -r * 0.42,
        eyeY,
        r * 0.96,
        0,
        0,
        -12 * DEG,
      );
      const lensL = kit.at(
        kit.mesh(kit.rbox(r * 0.42, r * 0.28, r * 0.06, r * 0.02), 'glass'),
        r * 0.42,
        eyeY,
        r * 1.02,
        0,
        0,
        12 * DEG,
      );
      const lensR = kit.at(
        kit.mesh(kit.rbox(r * 0.42, r * 0.28, r * 0.06, r * 0.02), 'glass'),
        -r * 0.42,
        eyeY,
        r * 1.02,
        0,
        0,
        -12 * DEG,
      );
      const wingL = kit.at(
        kit.mesh(kit.cone(r * 0.08, r * 0.3, 4), 'accent'),
        r * 0.72,
        r * 0.36,
        r * 0.96,
        0,
        0,
        -45 * DEG,
      );
      const wingR = kit.at(
        kit.mesh(kit.cone(r * 0.08, r * 0.3, 4), 'accent'),
        -r * 0.72,
        r * 0.36,
        r * 0.96,
        0,
        0,
        45 * DEG,
      );
      const bridge = kit.at(kit.mesh(kit.box(r * 0.2, r * 0.06, r * 0.08), 'primary'), 0, r * 0.16, r * 0.98);
      const armL = kit.at(
        kit.mesh(kit.box(r * 0.06, r * 0.08, r * 1.1), 'primary'),
        r * 0.86,
        r * 0.25,
        r * 0.42,
      );
      const armR = kit.at(
        kit.mesh(kit.box(r * 0.06, r * 0.08, r * 1.1), 'primary'),
        -r * 0.86,
        r * 0.25,
        r * 0.42,
      );
      return {
        parts: [
          {
            socket: 'head',
            object: kit.group(frameL, frameR, lensL, lensR, wingL, wingR, bridge, armL, armR),
          },
        ],
      };
    },
  },
  {
    id: 'glasses.brass-monocle',
    slot: 'glasses',
    name: 'Brass Monocle',
    tags: ['retro', 'elegant', 'utility'],
    build: ({ ref, kit }) => {
      const r = ref.headRadius;
      const eyeY = r * 0.1;
      // single rimmed lens over the left eye in a leather cup, held by a strap round the head
      const cup = kit.at(
        kit.mesh(kit.cyl(r * 0.3, r * 0.22, r * 0.15, 16), 'primary'),
        r * 0.42,
        eyeY,
        r * 0.9,
        90 * DEG,
      );
      const rim = kit.at(kit.mesh(kit.ring(r * 0.3, r * 0.05, 16), 'metal'), r * 0.42, eyeY, r * 0.98);
      const lens = kit.at(
        kit.mesh(kit.cyl(r * 0.28, r * 0.28, r * 0.03, 16), 'glass'),
        r * 0.42,
        eyeY,
        r * 0.98,
        90 * DEG,
      );
      const knob = kit.at(
        kit.mesh(kit.cyl(r * 0.06, r * 0.06, r * 0.12, 6), 'metal'),
        r * 0.42,
        eyeY + r * 0.36,
        r * 0.98,
      );
      const strap = kit.at(
        kit.mesh(kit.arc(r * 1.05, r * 1.05, r * 0.08, 25 * DEG, 320 * DEG, 20), 'dark'),
        0,
        r * 0.15,
        0,
      );
      const hinge = kit.at(kit.mesh(kit.sphere(r * 0.06, 6), 'accent'), r * 0.7, eyeY, r * 0.88);
      return { parts: [{ socket: 'head', object: kit.group(cup, rim, lens, knob, strap, hinge) }] };
    },
  },
];
