import type { ItemDefinition } from '../types';

const HALF = Math.PI / 2;

export const mystic: ItemDefinition[] = [
  {
    // Knee-high boots: pointed slipper toe, a tall shaft rising from the ankle, and a shin-socket cuff
    // with a folded flare, trim ring and a glowing gem just below the knee.
    id: 'boots.oracle-boots',
    slot: 'boots',
    name: 'Oracle Boots',
    tags: ['mystic', 'elegant'],
    build: ({ ref, kit }) => {
      const L = ref.footLen,
        H = ref.footH,
        W = ref.footW;
      const sR = ref.shinR,
        sL = ref.shinLen;
      const [footR, footL] = kit.mirror(() =>
        kit.group(
          kit.at(kit.mesh(kit.rbox(W * 1.0, H * 0.24, L * 0.9, H * 0.06), 'dark'), 0, -H * 0.88, L * 0.22),
          kit.at(kit.mesh(kit.rbox(W * 0.98, H * 0.7, L * 0.78, H * 0.2), 'primary'), 0, -H * 0.42, L * 0.2),
          kit.scaled(
            kit.at(kit.mesh(kit.cone(W * 0.46, L * 0.42, 8), 'primary'), 0, -H * 0.5, L * 0.72, HALF, 0, 0),
            1,
            1,
            0.7,
          ),
          kit.at(kit.mesh(kit.cyl(W * 0.58, W * 0.66, H * 2.5, 12), 'primary'), 0, H * 1.15, -L * 0.02),
          kit.at(kit.mesh(kit.rbox(W * 0.24, H * 0.9, L * 0.08, H * 0.03), 'accent'), 0, H * 0.3, L * 0.28),
        ),
      );
      const [shinR, shinL] = kit.mirror(() =>
        kit.group(
          kit.at(kit.mesh(kit.cyl(sR * 1.22, sR * 1.3, sL * 0.5, 12), 'primary'), 0, sL * 0.72, 0),
          kit.at(kit.mesh(kit.cyl(sR * 1.62, sR * 1.32, sL * 0.15, 12), 'secondary'), 0, sL * 0.48, 0),
          kit.at(kit.mesh(kit.ring(sR * 1.5, sR * 0.1, 16), 'accent'), 0, sL * 0.415, 0, HALF, 0, 0),
          kit.at(kit.mesh(kit.sphere(sR * 0.28, 8), 'glow'), 0, sL * 0.55, sR * 1.45),
        ),
      );
      return {
        parts: [
          { socket: 'footR', object: footR },
          { socket: 'footL', object: footL },
          { socket: 'shinR', object: shinR },
          { socket: 'shinL', object: shinL },
        ],
      };
    },
  },
  {
    // Stealth wraps: soft low foot bound in three cloth bands, a wrapped ankle with a diagonal band and
    // a knot tail at the heel. Lowest, narrowest silhouette in the slot.
    id: 'boots.stealth-wraps',
    slot: 'boots',
    name: 'Stealth Wraps',
    tags: ['stealth', 'light', 'mystic'],
    build: ({ ref, kit }) => {
      const L = ref.footLen,
        H = ref.footH,
        W = ref.footW;
      // a torus in the XY plane encircles the foot's long axis (+Z)
      const band = (r: number, y: number, z: number, tilt: number, sy: number) =>
        kit.scaled(kit.at(kit.mesh(kit.ring(r, H * 0.11, 14), 'primary'), 0, y, z, tilt, 0, 0), 1.06, sy, 1);
      const [right, left] = kit.mirror(() =>
        kit.group(
          kit.at(kit.mesh(kit.rbox(W * 1.04, H * 0.2, L * 1.0, H * 0.05), 'dark'), 0, -H * 0.9, L * 0.28),
          kit.at(
            kit.mesh(kit.rbox(W * 1.0, H * 0.62, L * 0.96, H * 0.25), 'secondary'),
            0,
            -H * 0.48,
            L * 0.28,
          ),
          band(W * 0.5, -H * 0.42, L * 0.12, 0.25, 0.78),
          band(W * 0.5, -H * 0.46, L * 0.34, -0.2, 0.74),
          band(W * 0.46, -H * 0.52, L * 0.56, 0.15, 0.66),
          kit.at(kit.mesh(kit.cyl(W * 0.58, W * 0.62, H * 1.1, 10), 'primary'), 0, H * 0.4, -L * 0.02),
          kit.at(
            kit.mesh(kit.ring(W * 0.62, H * 0.1, 14), 'secondary'),
            0,
            H * 0.75,
            -L * 0.02,
            HALF + 0.35,
            0,
            0,
          ),
          kit.at(
            kit.mesh(kit.box(W * 0.22, H * 0.5, L * 0.06), 'secondary'),
            W * 0.3,
            H * 0.35,
            -L * 0.28,
            0.3,
            0,
            0.5,
          ),
        ),
      );
      return {
        parts: [
          { socket: 'footR', object: right },
          { socket: 'footL', object: left },
        ],
      };
    },
  },
];
