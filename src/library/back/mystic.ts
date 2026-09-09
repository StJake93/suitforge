// Cloth, banner, blade and cosmic backs.
import type { Object3D } from 'three';
import { DEG } from '../kit';
import type { ItemDefinition } from '../types';

export const mystic: ItemDefinition[] = [
  {
    id: 'back.hero-cape',
    slot: 'back',
    name: 'Hero Cape',
    tags: ['retro', 'elegant', 'light'],
    build: ({ ref, kit }) => {
      const sh = ref.shoulderHalf,
        cl = ref.chestLen;
      // a long flattened tapered tube hanging from a short shoulder mantle, hem band and emblem on the back
      const len = 1.05;
      const cape = kit.scaled(
        kit.at(kit.mesh(kit.cyl(sh * 0.9, sh * 1.5, len, 14), 'primary'), 0, cl * 0.4 - len * 0.5, cl * 0.28),
        1,
        1,
        0.22,
      );
      const hem = kit.scaled(
        kit.at(
          kit.mesh(kit.cyl(sh * 1.49, sh * 1.52, cl * 0.07, 14), 'secondary'),
          0,
          cl * 0.4 - len + cl * 0.04,
          cl * 0.28,
        ),
        1,
        1,
        0.22,
      );
      const mantle = kit.scaled(
        kit.at(kit.mesh(kit.cyl(sh * 1.0, sh * 1.2, cl * 0.14, 14), 'secondary'), 0, cl * 0.42, cl * 0.16),
        1,
        1,
        0.45,
      );
      const emblem = kit.at(
        kit.mesh(kit.prism(5, sh * 0.3, 0.012), 'accent'),
        0,
        -cl * 0.4,
        cl * 0.28 + sh * 1.15 * 0.22,
        90 * DEG,
      );
      return { parts: [{ socket: 'back', object: kit.group(cape, hem, mantle, emblem) }] };
    },
  },
  {
    id: 'back.sashimono',
    slot: 'back',
    name: 'Sashimono Banner',
    tags: ['retro', 'elegant'],
    build: ({ ref, kit }) => {
      const sh = ref.shoulderHalf,
        cl = ref.chestLen;
      const px = sh * 0.35,
        z = cl * 0.25;
      // tall pole strapped to a back frame, a crossbar at the top and a vertical banner with a crest
      const pole = kit.at(kit.mesh(kit.cyl(0.012, 0.015, 1.6, 6), 'dark'), px, 0.18, z);
      const bar = kit.at(kit.mesh(kit.cyl(0.01, 0.01, 0.34, 6), 'dark'), px + 0.15, 0.95, z, 0, 0, 90 * DEG);
      const banner = kit.at(kit.mesh(kit.plate(0.3, 0.7, 0.012, 0.02), 'primary'), px + 0.17, 0.58, z);
      const crest = kit.at(kit.mesh(kit.prism(6, 0.09, 0.01), 'accent'), px + 0.17, 0.7, z + 0.012, 90 * DEG);
      const tail = kit.at(kit.mesh(kit.plate(0.3, 0.16, 0.012, 0.02), 'secondary'), px + 0.17, 0.14, z);
      const frame = kit.at(
        kit.mesh(kit.rbox(sh * 0.9, cl * 0.5, cl * 0.12, cl * 0.02), 'secondary'),
        0,
        cl * 0.05,
        cl * 0.06,
      );
      const strap = (y: number) =>
        kit.at(kit.mesh(kit.box(sh * 1.5, cl * 0.08, cl * 0.03), 'dark'), 0, y, cl * 0.01);
      const clamp = (y: number) => kit.at(kit.mesh(kit.ring(0.026, 0.008, 8), 'metal'), px, y, z, 90 * DEG);
      return {
        parts: [
          {
            socket: 'back',
            object: kit.group(
              pole,
              bar,
              banner,
              crest,
              tail,
              frame,
              strap(cl * 0.25),
              strap(-cl * 0.15),
              clamp(0),
              clamp(cl * 0.35),
            ),
          },
        ],
      };
    },
  },
  {
    id: 'back.orbit-spheres',
    slot: 'back',
    name: 'Orbit Spheres',
    tags: ['cosmic', 'energy', 'mystic'],
    build: ({ ref, kit }) => {
      const sh = ref.shoulderHalf,
        cl = ref.chestLen;
      const cy = cl * 0.2,
        cz = cl * 0.55;
      // a core sphere on a stalk with two tilted orbit rings carrying satellites and glowing motes
      const core = kit.at(kit.mesh(kit.sphere(cl * 0.22, 12), 'primary'), 0, cy, cz);
      const ringA = kit.at(kit.mesh(kit.ring(0.42, 0.012, 32), 'accent'), 0, cy, cz, 35 * DEG);
      const ringB = kit.at(
        kit.mesh(kit.ring(0.33, 0.012, 32), 'secondary'),
        0,
        cy,
        cz,
        -35 * DEG,
        0,
        40 * DEG,
      );
      // point on a ring of radius r at angle t, tilted rx about X then rz about Z (Euler XYZ: Z applied first)
      const onRing = (r: number, t: number, rx: number, rz: number): [number, number, number] => {
        const x0 = r * Math.cos(t * DEG),
          y0 = r * Math.sin(t * DEG);
        const x1 = x0 * Math.cos(rz * DEG) - y0 * Math.sin(rz * DEG);
        const y1 = x0 * Math.sin(rz * DEG) + y0 * Math.cos(rz * DEG);
        return [x1, cy + y1 * Math.cos(rx * DEG), cz + y1 * Math.sin(rx * DEG)];
      };
      const bodies: Object3D[] = [];
      for (const [t, r, role] of [
        [20, 0.055, 'primary'],
        [140, 0.045, 'secondary'],
        [250, 0.05, 'primary'],
      ] as const) {
        const [x, y, z] = onRing(0.42, t, 35, 0);
        bodies.push(kit.at(kit.mesh(kit.sphere(r, 8), role), x, y, z));
      }
      for (const [t, r] of [
        [80, 0.04],
        [260, 0.035],
      ] as const) {
        const [x, y, z] = onRing(0.33, t, -35, 40);
        bodies.push(kit.at(kit.mesh(kit.sphere(r, 8), 'secondary'), x, y, z));
      }
      for (const t of [200, 330]) {
        const [x, y, z] = onRing(0.33, t, -35, 40);
        bodies.push(kit.at(kit.mesh(kit.sphere(0.02, 6), 'glow'), x, y, z));
      }
      const mount = kit.at(
        kit.mesh(kit.rbox(sh * 0.4, cl * 0.25, cl * 0.12, cl * 0.02), 'dark'),
        0,
        cy,
        cl * 0.06,
      );
      const stalk = kit.at(kit.mesh(kit.cyl(0.015, 0.015, cl * 0.4, 6), 'metal'), 0, cy, cl * 0.3, 90 * DEG);
      return { parts: [{ socket: 'back', object: kit.group(core, ringA, ringB, ...bodies, mount, stalk) }] };
    },
  },
  {
    id: 'back.great-scabbard',
    slot: 'back',
    name: 'Great Scabbard',
    tags: ['melee', 'retro'],
    build: ({ ref, kit }) => {
      const cl = ref.chestLen;
      // a long scabbard slung diagonally across the back on a baldric, hilt rising over the left shoulder
      const sheath = kit.at(kit.mesh(kit.rbox(0.07, 0.95, 0.035, 0.012), 'primary'), 0, 0, 0);
      const baldric = kit.at(kit.mesh(kit.box(0.1, 0.9, 0.015), 'dark'), 0, 0, -0.018);
      const chape = kit.at(kit.mesh(kit.cone(0.04, 0.08, 6), 'metal'), 0, -0.51, 0, 180 * DEG);
      const throat = kit.at(kit.mesh(kit.rbox(0.09, 0.06, 0.05, 0.01), 'metal'), 0, 0.45, 0);
      const guard = kit.at(kit.mesh(kit.rbox(0.16, 0.025, 0.04, 0.006), 'metal'), 0, 0.49, 0);
      const grip = kit.at(kit.mesh(kit.cyl(0.018, 0.02, 0.22, 8), 'dark'), 0, 0.61, 0);
      const pommel = kit.at(kit.mesh(kit.sphere(0.03, 8), 'metal'), 0, 0.73, 0);
      const buckle = kit.at(kit.mesh(kit.rbox(0.05, 0.05, 0.02, 0.008), 'accent'), 0, 0.12, 0.028);
      const rig = kit.at(
        kit.group(sheath, baldric, chape, throat, guard, grip, pommel, buckle),
        0.05,
        -0.15,
        cl * 0.16,
        0,
        0,
        25 * DEG,
      );
      return { parts: [{ socket: 'back', object: kit.group(rig) }] };
    },
  },
];
