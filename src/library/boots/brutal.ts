import type { ItemDefinition } from '../types';

const HALF = Math.PI / 2;

export const brutal: ItemDefinition[] = [
  {
    // Iron sabatons: heel plate and two overlapping toe lames ending in a long flattened metal point,
    // with a flared metal cuff at the ankle. Long and pointed at the front.
    id: 'boots.iron-sabatons',
    slot: 'boots',
    name: 'Iron Sabatons',
    tags: ['armour', 'heavy'],
    build: ({ ref, kit }) => {
      const L = ref.footLen,
        H = ref.footH,
        W = ref.footW;
      const [right, left] = kit.mirror(() =>
        kit.group(
          kit.at(kit.mesh(kit.rbox(W * 1.25, H * 0.34, L * 1.08, H * 0.08), 'dark'), 0, -H * 0.83, L * 0.26),
          kit.at(kit.mesh(kit.rbox(W * 1.2, H * 0.82, L * 0.48, H * 0.1), 'primary'), 0, -H * 0.32, L * 0.02),
          kit.at(
            kit.mesh(kit.rbox(W * 1.16, H * 0.62, L * 0.32, H * 0.08), 'primary'),
            0,
            -H * 0.4,
            L * 0.36,
          ),
          kit.at(
            kit.mesh(kit.rbox(W * 1.08, H * 0.52, L * 0.3, H * 0.08), 'secondary'),
            0,
            -H * 0.48,
            L * 0.58,
          ),
          kit.scaled(
            kit.at(kit.mesh(kit.cone(W * 0.52, L * 0.42, 8), 'metal'), 0, -H * 0.55, L * 0.86, HALF, 0, 0),
            1,
            1,
            0.62,
          ),
          kit.at(kit.mesh(kit.cyl(W * 0.74, W * 0.7, H * 1.3, 10), 'primary'), 0, H * 0.5, -L * 0.02),
          kit.at(kit.mesh(kit.cyl(W * 0.9, W * 0.74, H * 0.42, 10), 'metal'), 0, H * 1.3, -L * 0.02),
          kit.at(kit.mesh(kit.rbox(W * 0.3, H * 0.5, L * 0.06, H * 0.02), 'accent'), 0, H * 0.5, W * 0.72),
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
    // Spiked stompers: oversized block boot on a huge sole, a toe cap with two forward spikes, two
    // spikes on top of the foot, and a strapped tall ankle. Widest, chunkiest silhouette in the slot.
    id: 'boots.spiked-stompers',
    slot: 'boots',
    name: 'Spiked Stompers',
    tags: ['brutal', 'heavy', 'melee'],
    build: ({ ref, kit }) => {
      const L = ref.footLen,
        H = ref.footH,
        W = ref.footW;
      const toeSpike = (x: number) =>
        kit.at(kit.mesh(kit.cone(W * 0.13, L * 0.3, 8), 'metal'), x, -H * 0.28, L * 0.98, HALF, 0, 0);
      const topSpike = (z: number) =>
        kit.at(kit.mesh(kit.cone(W * 0.15, H * 0.9, 8), 'metal'), 0, H * 0.72, z);
      const [right, left] = kit.mirror(() =>
        kit.group(
          kit.at(kit.mesh(kit.rbox(W * 1.42, H * 0.5, L * 1.16, H * 0.1), 'dark'), 0, -H * 0.75, L * 0.28),
          kit.at(kit.mesh(kit.rbox(W * 1.3, H * 0.9, L * 1.0, H * 0.16), 'primary'), 0, -H * 0.15, L * 0.28),
          kit.at(
            kit.mesh(kit.rbox(W * 1.22, H * 0.72, L * 0.32, H * 0.1), 'secondary'),
            0,
            -H * 0.3,
            L * 0.74,
          ),
          toeSpike(W * 0.32),
          toeSpike(-W * 0.32),
          topSpike(L * 0.3),
          topSpike(L * 0.55),
          kit.at(kit.mesh(kit.cyl(W * 0.76, W * 0.8, H * 1.5, 10), 'primary'), 0, H * 0.6, -L * 0.02),
          kit.at(kit.mesh(kit.ring(W * 0.82, W * 0.1, 12), 'dark'), 0, H * 1.05, -L * 0.02, HALF, 0, 0),
          kit.at(kit.mesh(kit.box(W * 0.2, H * 0.22, L * 0.22), 'metal'), 0, H * 1.05, W * 0.82),
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
