// Tactical eyewear: round goggles, targeting eyepatch, wraparound HUD visor.
import { DEG } from '../kit';
import type { ItemDefinition } from '../types';

export const tactical: ItemDefinition[] = [
  {
    id: 'glasses.round-goggles',
    slot: 'glasses',
    name: 'Round Goggles',
    tags: ['retro', 'utility', 'tech'],
    build: ({ ref, kit }) => {
      const r = ref.headRadius;
      const eyeY = r * 0.1;
      // two deep cups with rimmed lenses, joined by a bridge block and a wide strap
      const cupL = kit.at(
        kit.mesh(kit.cyl(r * 0.3, r * 0.36, r * 0.28, 12), 'primary'),
        r * 0.42,
        eyeY,
        r * 0.95,
        90 * DEG,
      );
      const cupR = kit.at(
        kit.mesh(kit.cyl(r * 0.3, r * 0.36, r * 0.28, 12), 'primary'),
        -r * 0.42,
        eyeY,
        r * 0.95,
        90 * DEG,
      );
      const lensL = kit.at(
        kit.mesh(kit.cyl(r * 0.28, r * 0.28, r * 0.04, 12), 'glass'),
        r * 0.42,
        eyeY,
        r * 1.1,
        90 * DEG,
      );
      const lensR = kit.at(
        kit.mesh(kit.cyl(r * 0.28, r * 0.28, r * 0.04, 12), 'glass'),
        -r * 0.42,
        eyeY,
        r * 1.1,
        90 * DEG,
      );
      const rimL = kit.at(kit.mesh(kit.ring(r * 0.3, r * 0.04, 12), 'metal'), r * 0.42, eyeY, r * 1.1);
      const rimR = kit.at(kit.mesh(kit.ring(r * 0.3, r * 0.04, 12), 'metal'), -r * 0.42, eyeY, r * 1.1);
      const bridge = kit.at(kit.mesh(kit.box(r * 0.14, r * 0.14, r * 0.14), 'dark'), 0, eyeY, r * 0.95);
      const strap = kit.at(
        kit.mesh(kit.arc(r * 1.06, r * 1.06, r * 0.18, 40 * DEG, 280 * DEG, 16), 'dark'),
        0,
        eyeY,
        0,
      );
      return {
        parts: [{ socket: 'head', object: kit.group(cupL, cupR, lensL, lensR, rimL, rimR, bridge, strap) }],
      };
    },
  },
  {
    id: 'glasses.eye-patch',
    slot: 'glasses',
    name: 'Targeting Eyepatch',
    tags: ['stealth', 'tech', 'utility'],
    build: ({ ref, kit }) => {
      const r = ref.headRadius;
      const eyeY = r * 0.08;
      // asymmetric: patch with a glowing lens over the right eye, diagonal strap, electronics pod at the temple
      const patch = kit.at(
        kit.mesh(kit.rbox(r * 0.5, r * 0.42, r * 0.14, r * 0.06), 'primary'),
        -r * 0.42,
        eyeY,
        r * 0.96,
      );
      const lens = kit.at(
        kit.mesh(kit.cyl(r * 0.14, r * 0.14, r * 0.06, 10), 'glow'),
        -r * 0.42,
        eyeY,
        r * 1.04,
        90 * DEG,
      );
      const strap = kit.at(
        kit.mesh(kit.arc(r * 1.06, r * 1.06, r * 0.08, 20 * DEG, 320 * DEG, 20), 'dark'),
        0,
        r * 0.25,
        0,
        0,
        0,
        12 * DEG,
      );
      const link = kit.at(
        kit.mesh(kit.box(r * 0.06, r * 0.4, r * 0.06), 'dark'),
        -r * 0.55,
        r * 0.35,
        r * 0.92,
      );
      const pod = kit.at(
        kit.mesh(kit.rbox(r * 0.28, r * 0.3, r * 0.3, r * 0.05), 'secondary'),
        -r * 0.78,
        eyeY,
        r * 0.75,
      );
      const led = kit.at(kit.mesh(kit.sphere(r * 0.05, 6), 'accent'), -r * 0.78, r * 0.28, r * 0.9);
      const buckle = kit.at(kit.mesh(kit.box(r * 0.12, r * 0.14, r * 0.04), 'metal'), r * 1.05, r * 0.45, 0);
      return { parts: [{ socket: 'head', object: kit.group(patch, lens, strap, link, pod, led, buckle) }] };
    },
  },
  {
    id: 'glasses.hud-wrap',
    slot: 'glasses',
    name: 'HUD Wrap',
    tags: ['tech', 'visor', 'energy'],
    build: ({ ref, kit }) => {
      const r = ref.headRadius;
      const eyeY = r * 0.1;
      // continuous curved glass wrapping the front of the head, framed by thin rims, with temple pods
      const visor = kit.at(
        kit.mesh(kit.arc(r * 1.08, r * 1.08, r * 0.34, -75 * DEG, 150 * DEG, 18), 'glass'),
        0,
        eyeY,
        0,
      );
      const rimTop = kit.at(
        kit.mesh(kit.arc(r * 1.12, r * 1.12, r * 0.06, -80 * DEG, 160 * DEG, 18), 'primary'),
        0,
        eyeY + r * 0.2,
        0,
      );
      const rimBot = kit.at(
        kit.mesh(kit.arc(r * 1.12, r * 1.12, r * 0.06, -80 * DEG, 160 * DEG, 18), 'primary'),
        0,
        eyeY - r * 0.2,
        0,
      );
      const templeL = kit.at(
        kit.mesh(kit.box(r * 0.08, r * 0.2, r * 0.9), 'primary'),
        r * 1.02,
        eyeY,
        -r * 0.16,
      );
      const templeR = kit.at(
        kit.mesh(kit.box(r * 0.08, r * 0.2, r * 0.9), 'primary'),
        -r * 1.02,
        eyeY,
        -r * 0.16,
      );
      const pipL = kit.at(
        kit.mesh(kit.box(r * 0.3, r * 0.06, r * 0.03), 'glow'),
        r * 0.46,
        eyeY + r * 0.1,
        r * 1.0,
        0,
        25 * DEG,
      );
      const pipR = kit.at(
        kit.mesh(kit.box(r * 0.18, r * 0.06, r * 0.03), 'accent'),
        -r * 0.46,
        eyeY - r * 0.06,
        r * 1.0,
        0,
        -25 * DEG,
      );
      const podL = kit.at(
        kit.mesh(kit.cyl(r * 0.22, r * 0.22, r * 0.12, 10), 'secondary'),
        r * 1.1,
        eyeY,
        -r * 0.4,
        0,
        0,
        90 * DEG,
      );
      const podR = kit.at(
        kit.mesh(kit.cyl(r * 0.22, r * 0.22, r * 0.12, 10), 'secondary'),
        -r * 1.1,
        eyeY,
        -r * 0.4,
        0,
        0,
        90 * DEG,
      );
      return {
        parts: [
          {
            socket: 'head',
            object: kit.group(visor, rimTop, rimBot, templeL, templeR, pipL, pipR, podL, podR),
          },
        ],
      };
    },
  },
];
