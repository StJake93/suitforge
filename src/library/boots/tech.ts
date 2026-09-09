import type { ItemDefinition } from '../types';

const HALF = Math.PI / 2;

export const tech: ItemDefinition[] = [
  {
    // Rocket boots: armoured boot with a tall ankle, twin metal thruster pods behind the heel with
    // glowing nozzles, and a spine plate tying the pods to the shaft.
    id: 'boots.rocket-boots',
    slot: 'boots',
    name: 'Rocket Boots',
    tags: ['tech', 'flight', 'energy'],
    build: ({ ref, kit }) => {
      const L = ref.footLen,
        H = ref.footH,
        W = ref.footW;
      const pod = (x: number) =>
        kit.at(kit.mesh(kit.cyl(W * 0.26, W * 0.3, H * 1.3, 10), 'metal'), x, H * 0.15, -L * 0.4);
      const nozzle = (x: number) =>
        kit.at(kit.mesh(kit.cone(W * 0.24, H * 0.6, 10), 'glow'), x, -H * 0.75, -L * 0.4, Math.PI, 0, 0);
      const [right, left] = kit.mirror(() =>
        kit.group(
          kit.at(kit.mesh(kit.rbox(W * 1.2, H * 0.3, L * 1.05, H * 0.08), 'dark'), 0, -H * 0.85, L * 0.28),
          kit.at(kit.mesh(kit.rbox(W * 1.15, H * 0.8, L * 0.95, H * 0.18), 'primary'), 0, -H * 0.38, L * 0.3),
          kit.at(
            kit.mesh(kit.rbox(W * 1.0, H * 0.5, L * 0.28, H * 0.12), 'secondary'),
            0,
            -H * 0.5,
            L * 0.74,
          ),
          kit.at(kit.mesh(kit.cyl(W * 0.62, W * 0.7, H * 1.5, 10), 'primary'), 0, H * 0.55, 0),
          kit.at(kit.mesh(kit.cyl(W * 0.74, W * 0.66, H * 0.36, 10), 'secondary'), 0, H * 1.35, 0),
          kit.at(kit.mesh(kit.rbox(W * 1.0, H * 1.2, L * 0.16, H * 0.1), 'secondary'), 0, H * 0.3, -L * 0.26),
          pod(W * 0.36),
          pod(-W * 0.36),
          nozzle(W * 0.36),
          nozzle(-W * 0.36),
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
  {
    // Hover discs: a slim slipper standing on a thick wide disc with a glowing rim ring, clamped at the
    // ankle by a metal collar. Very wide and flat at the ground.
    id: 'boots.hover-discs',
    slot: 'boots',
    name: 'Hover Discs',
    tags: ['tech', 'flight', 'energy'],
    build: ({ ref, kit }) => {
      const L = ref.footLen,
        H = ref.footH,
        W = ref.footW;
      const [right, left] = kit.mirror(() =>
        kit.group(
          kit.at(kit.mesh(kit.cyl(W * 1.4, W * 1.32, H * 0.4, 18), 'primary'), 0, -H * 1.15, L * 0.25),
          kit.at(kit.mesh(kit.ring(W * 1.42, W * 0.08, 18), 'glow'), 0, -H * 1.15, L * 0.25, HALF, 0, 0),
          kit.at(kit.mesh(kit.cyl(W * 1.0, W * 1.05, H * 0.12, 18), 'secondary'), 0, -H * 0.9, L * 0.25),
          kit.at(kit.mesh(kit.rbox(W * 1.0, H * 0.7, L * 0.9, H * 0.2), 'secondary'), 0, -H * 0.45, L * 0.3),
          kit.at(kit.mesh(kit.cyl(W * 0.6, W * 0.64, H * 1.3, 10), 'primary'), 0, H * 0.45, 0),
          kit.at(kit.mesh(kit.ring(W * 0.66, W * 0.08, 12), 'metal'), 0, H * 1.05, 0, HALF, 0, 0),
          kit.at(kit.mesh(kit.box(W * 0.2, H * 0.08, L * 0.6), 'accent'), 0, -H * 0.08, L * 0.3),
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
  {
    // Runner boots: low sneaker silhouette with a chunky two-tone sole, a padded low collar, a lace
    // panel and a slanted side stripe.
    id: 'boots.runner-boots',
    slot: 'boots',
    name: 'Runner Boots',
    tags: ['light', 'retro', 'utility'],
    build: ({ ref, kit }) => {
      const L = ref.footLen,
        H = ref.footH,
        W = ref.footW;
      const [right, left] = kit.mirror(() =>
        kit.group(
          kit.at(kit.mesh(kit.rbox(W * 1.18, H * 0.36, L * 1.1, H * 0.1), 'dark'), 0, -H * 0.82, L * 0.28),
          kit.at(
            kit.mesh(kit.rbox(W * 1.12, H * 0.26, L * 1.06, H * 0.08), 'secondary'),
            0,
            -H * 0.52,
            L * 0.28,
          ),
          kit.at(kit.mesh(kit.rbox(W * 1.02, H * 0.62, L * 0.92, H * 0.2), 'primary'), 0, -H * 0.1, L * 0.3),
          kit.at(
            kit.mesh(kit.rbox(W * 0.94, H * 0.5, L * 0.26, H * 0.12), 'secondary'),
            0,
            -H * 0.2,
            L * 0.72,
          ),
          kit.at(kit.mesh(kit.cyl(W * 0.52, W * 0.56, H * 0.7, 10), 'primary'), 0, H * 0.4, -L * 0.02),
          kit.at(kit.mesh(kit.ring(W * 0.54, W * 0.12, 12), 'secondary'), 0, H * 0.72, -L * 0.02, HALF, 0, 0),
          kit.at(
            kit.mesh(kit.box(W * 0.06, H * 0.16, L * 0.5), 'accent'),
            W * 0.53,
            -H * 0.15,
            L * 0.3,
            0.35,
            0,
            0,
          ),
          kit.at(kit.mesh(kit.box(W * 0.4, H * 0.1, L * 0.4), 'dark'), 0, H * 0.22, L * 0.35),
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
