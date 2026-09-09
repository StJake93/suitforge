// Tech helmets: glass space bubble, stealth mask, retro pilot cap.
import { DEG } from '../kit';
import type { ItemDefinition } from '../types';

export const tech: ItemDefinition[] = [
  {
    id: 'helmet.orbit-bubble',
    slot: 'helmet',
    name: 'Orbit Bubble',
    tags: ['tech', 'cosmic', 'full-face'],
    hides: ['glasses'],
    build: ({ ref, kit }) => {
      const r = ref.headRadius;
      // one big glass sphere sitting in a collar ring
      const dome = kit.at(kit.mesh(kit.sphere(r * 1.45, 16), 'glass'), 0, r * 0.1, 0);
      const collar = kit.at(kit.mesh(kit.cyl(r * 1.3, r * 1.4, r * 0.35, 16), 'primary'), 0, -r * 1.25, 0);
      const collarRing = kit.at(
        kit.mesh(kit.ring(r * 1.35, r * 0.1, 16), 'metal'),
        0,
        -r * 1.45,
        0,
        90 * DEG,
      );
      // lower lip hugging the front of the dome
      const lip = kit.at(
        kit.mesh(kit.arc(r * 1.5, r * 1.46, r * 0.32, -60 * DEG, 120 * DEG, 16), 'primary'),
        0,
        -r * 0.95,
        0,
      );
      // life-support pod on the back
      const pod = kit.at(
        kit.mesh(kit.rbox(r * 1.0, r * 0.8, r * 0.5, r * 0.1), 'primary'),
        0,
        -r * 0.3,
        -r * 1.55,
      );
      const podLine = kit.at(
        kit.mesh(kit.box(r * 0.7, r * 0.08, r * 0.06), 'secondary'),
        0,
        -r * 0.3,
        -r * 1.82,
      );
      const beacon = kit.at(kit.mesh(kit.cyl(r * 0.15, r * 0.15, r * 0.1, 8), 'glow'), 0, r * 1.58, 0);
      const lampL = kit.at(
        kit.mesh(kit.cyl(r * 0.18, r * 0.18, r * 0.2, 8), 'accent'),
        r * 1.42,
        -r * 0.9,
        r * 0.3,
        0,
        0,
        90 * DEG,
      );
      const lampR = kit.at(
        kit.mesh(kit.cyl(r * 0.18, r * 0.18, r * 0.2, 8), 'accent'),
        -r * 1.42,
        -r * 0.9,
        r * 0.3,
        0,
        0,
        90 * DEG,
      );
      return {
        parts: [
          {
            socket: 'head',
            object: kit.group(dome, collar, collarRing, lip, pod, podLine, beacon, lampL, lampR),
          },
        ],
      };
    },
  },
  {
    id: 'helmet.wraith-mask',
    slot: 'helmet',
    name: 'Wraith Mask',
    tags: ['stealth', 'tech', 'full-face', 'visor'],
    hides: ['glasses'],
    build: ({ ref, kit }) => {
      const r = ref.headRadius;
      // sleek shell, slightly elongated front to back
      const shell = kit.at(kit.scaled(kit.mesh(kit.sphere(r * 1.12, 14), 'primary'), 1, 1.05, 1.1), 0, 0, 0);
      const facePlate = kit.at(
        kit.mesh(kit.plate(r * 1.5, r * 1.6, r * 0.2, r * 0.3), 'secondary'),
        0,
        -r * 0.25,
        r * 1.0,
      );
      const slitVisor = kit.at(
        kit.mesh(kit.rbox(r * 1.4, r * 0.16, r * 0.12, r * 0.04), 'glow'),
        0,
        r * 0.15,
        r * 1.18,
      );
      const chin = kit.at(
        kit.mesh(kit.rbox(r * 0.9, r * 0.5, r * 0.6, r * 0.08), 'dark'),
        0,
        -r * 1.0,
        r * 0.7,
      );
      // swept-back fins
      const finL = kit.at(
        kit.mesh(kit.box(r * 0.06, r * 0.7, r * 0.8), 'secondary'),
        r * 0.5,
        r * 0.4,
        -r * 0.9,
        -25 * DEG,
      );
      const finR = kit.at(
        kit.mesh(kit.box(r * 0.06, r * 0.7, r * 0.8), 'secondary'),
        -r * 0.5,
        r * 0.4,
        -r * 0.9,
        -25 * DEG,
      );
      const ventL = kit.at(
        kit.mesh(kit.box(r * 0.3, r * 0.12, r * 0.12), 'dark'),
        r * 0.6,
        -r * 0.6,
        r * 1.05,
      );
      const ventR = kit.at(
        kit.mesh(kit.box(r * 0.3, r * 0.12, r * 0.12), 'dark'),
        -r * 0.6,
        -r * 0.6,
        r * 1.05,
      );
      const crownStripe = kit.at(kit.mesh(kit.box(r * 0.08, r * 0.05, r * 1.2), 'accent'), 0, r * 1.15, 0);
      return {
        parts: [
          {
            socket: 'head',
            object: kit.group(shell, facePlate, slitVisor, chin, finL, finR, ventL, ventR, crownStripe),
          },
        ],
      };
    },
  },
  {
    id: 'helmet.aero-cap',
    slot: 'helmet',
    name: 'Aero Pilot Cap',
    tags: ['retro', 'light', 'open-face'],
    build: ({ ref, kit }) => {
      const r = ref.headRadius;
      // snug leather cap with ear flaps and a chin strap
      const crown = kit.at(kit.mesh(kit.hemi(r * 1.1, 14), 'primary'), 0, r * 0.02, 0);
      const sides = kit.at(
        kit.mesh(kit.arc(r * 1.1, r * 1.06, r * 0.7, 50 * DEG, 260 * DEG, 14), 'primary'),
        0,
        -r * 0.35,
        0,
      );
      const flapL = kit.at(
        kit.mesh(kit.rbox(r * 0.28, r * 0.8, r * 0.7, r * 0.06), 'secondary'),
        r * 1.05,
        -r * 0.9,
        r * 0.1,
      );
      const flapR = kit.at(
        kit.mesh(kit.rbox(r * 0.28, r * 0.8, r * 0.7, r * 0.06), 'secondary'),
        -r * 1.05,
        -r * 0.9,
        r * 0.1,
      );
      const chinStrap = kit.at(
        kit.mesh(kit.arc(r * 0.95, r * 0.95, r * 0.1, -60 * DEG, 120 * DEG, 12), 'dark'),
        0,
        -r * 1.5,
        0,
      );
      // goggles pushed up onto the forehead
      const goggleBand = kit.at(kit.mesh(kit.cyl(r * 1.16, r * 1.16, r * 0.2, 14), 'dark'), 0, r * 0.55, 0);
      const cupL = kit.at(
        kit.mesh(kit.cyl(r * 0.34, r * 0.3, r * 0.25, 10), 'metal'),
        r * 0.42,
        r * 0.75,
        r * 0.95,
        60 * DEG,
      );
      const cupR = kit.at(
        kit.mesh(kit.cyl(r * 0.34, r * 0.3, r * 0.25, 10), 'metal'),
        -r * 0.42,
        r * 0.75,
        r * 0.95,
        60 * DEG,
      );
      const lensL = kit.at(
        kit.mesh(kit.cyl(r * 0.28, r * 0.28, r * 0.06, 10), 'glass'),
        r * 0.42,
        r * 0.82,
        r * 1.07,
        60 * DEG,
      );
      const lensR = kit.at(
        kit.mesh(kit.cyl(r * 0.28, r * 0.28, r * 0.06, 10), 'glass'),
        -r * 0.42,
        r * 0.82,
        r * 1.07,
        60 * DEG,
      );
      const emblem = kit.at(kit.mesh(kit.sphere(r * 0.1, 8), 'accent'), 0, r * 0.55, r * 1.18);
      return {
        parts: [
          {
            socket: 'head',
            object: kit.group(
              crown,
              sides,
              flapL,
              flapR,
              chinStrap,
              goggleBand,
              cupL,
              cupR,
              lensL,
              lensR,
              emblem,
            ),
          },
        ],
      };
    },
  },
];
