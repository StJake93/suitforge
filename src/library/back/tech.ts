// Tech backs: a single vertical turbine and a strapped utility pack.
import { DEG } from '../kit';
import type { ItemDefinition } from '../types';

export const tech: ItemDefinition[] = [
  {
    id: 'back.turbine-pack',
    slot: 'back',
    name: 'Turbine Pack',
    tags: ['tech', 'flight', 'heavy'],
    build: ({ ref, kit }) => {
      const sh = ref.shoulderHalf,
        cl = ref.chestLen;
      const z = cl * 0.62;
      // one big vertical drum: intake ring and fan hub on top, metal nozzle and flame below, side fins
      const drum = kit.at(kit.mesh(kit.cyl(sh * 0.62, sh * 0.66, cl * 0.85, 16), 'primary'), 0, 0, z);
      const intake = kit.at(kit.mesh(kit.ring(sh * 0.62, sh * 0.07, 16), 'metal'), 0, cl * 0.43, z, 90 * DEG);
      const hub = kit.at(kit.mesh(kit.cone(sh * 0.25, cl * 0.15, 8), 'dark'), 0, cl * 0.46, z);
      const nozzle = kit.at(kit.mesh(kit.cyl(sh * 0.5, sh * 0.62, cl * 0.22, 12), 'metal'), 0, -cl * 0.53, z);
      const flame = kit.at(kit.mesh(kit.cone(sh * 0.4, cl * 0.3, 10), 'glow'), 0, -cl * 0.78, z, 180 * DEG);
      const plate = kit.at(
        kit.mesh(kit.rbox(sh * 1.2, cl * 0.6, cl * 0.1, cl * 0.02), 'secondary'),
        0,
        cl * 0.05,
        cl * 0.06,
      );
      const fin = (x: number) =>
        kit.at(
          kit.mesh(kit.plate(cl * 0.3, cl * 0.5, cl * 0.03, cl * 0.06), 'secondary'),
          x,
          cl * 0.05,
          z * 0.85,
          0,
          90 * DEG,
        );
      const strap = kit.at(kit.mesh(kit.box(sh * 1.4, cl * 0.1, cl * 0.05), 'dark'), 0, cl * 0.3, cl * 0.02);
      return {
        parts: [
          {
            socket: 'back',
            object: kit.group(drum, intake, hub, nozzle, flame, plate, fin(sh * 0.9), fin(-sh * 0.9), strap),
          },
        ],
      };
    },
  },
  {
    id: 'back.utility-pack',
    slot: 'back',
    name: 'Utility Pack',
    tags: ['utility', 'tech'],
    build: ({ ref, kit }) => {
      const sh = ref.shoulderHalf,
        cl = ref.chestLen;
      const z = cl * 0.25;
      // boxy pack with a rolled bundle on top, side pouches, a front pocket, straps and an antenna
      const pack = kit.at(
        kit.mesh(kit.rbox(sh * 1.1, cl * 0.8, cl * 0.4, cl * 0.06), 'primary'),
        0,
        -cl * 0.05,
        z,
      );
      const flap = kit.at(
        kit.mesh(kit.rbox(sh * 1.14, cl * 0.18, cl * 0.44, cl * 0.04), 'secondary'),
        0,
        cl * 0.38,
        z,
      );
      const roll = kit.at(
        kit.mesh(kit.cyl(cl * 0.12, cl * 0.12, sh * 1.4, 10), 'secondary'),
        0,
        cl * 0.56,
        z,
        0,
        0,
        90 * DEG,
      );
      const pouch = (x: number) =>
        kit.at(kit.mesh(kit.rbox(cl * 0.14, cl * 0.3, cl * 0.28, cl * 0.03), 'primary'), x, -cl * 0.15, z);
      const pocket = kit.at(
        kit.mesh(kit.rbox(sh * 0.6, cl * 0.3, cl * 0.1, cl * 0.03), 'secondary'),
        0,
        -cl * 0.2,
        z + cl * 0.24,
      );
      const buckle = kit.at(
        kit.mesh(kit.rbox(cl * 0.08, cl * 0.06, cl * 0.03, cl * 0.008), 'accent'),
        0,
        -cl * 0.06,
        z + cl * 0.3,
      );
      const strap = (x: number) =>
        kit.at(kit.mesh(kit.box(cl * 0.08, cl * 0.9, cl * 0.03), 'dark'), x, 0, cl * 0.03);
      const antenna = kit.at(
        kit.mesh(kit.cyl(0.005, 0.008, cl * 0.6, 6), 'metal'),
        sh * 0.48,
        cl * 0.6,
        z - cl * 0.1,
      );
      const tip = kit.at(kit.mesh(kit.sphere(0.014, 6), 'glow'), sh * 0.48, cl * 0.9, z - cl * 0.1);
      return {
        parts: [
          {
            socket: 'back',
            object: kit.group(
              pack,
              flap,
              roll,
              pouch(sh * 0.66),
              pouch(-sh * 0.66),
              pocket,
              buckle,
              strap(sh * 0.4),
              strap(-sh * 0.4),
              antenna,
              tip,
            ),
          },
        ],
      };
    },
  },
];
