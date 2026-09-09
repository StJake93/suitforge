import type { ItemDefinition } from '../types';

export const vanguard: ItemDefinition[] = [
  {
    id: 'boots.vanguard-boots',
    slot: 'boots',
    name: 'Vanguard Boots',
    tags: ['armour', 'tech'],
    build: ({ ref, kit }) => {
      const L = ref.footLen,
        H = ref.footH,
        W = ref.footW;
      const [right, left] = kit.mirror(() => {
        const sole = kit.at(
          kit.mesh(kit.rbox(W * 1.15, H * 0.35, L * 1.08, H * 0.1), 'dark'),
          0,
          -H * 0.82,
          L * 0.28,
        );
        const foot = kit.at(
          kit.mesh(kit.rbox(W * 1.1, H * 0.75, L * 1.0, H * 0.18), 'primary'),
          0,
          -H * 0.4,
          L * 0.28,
        );
        const toe = kit.at(
          kit.mesh(kit.rbox(W * 1.0, H * 0.5, L * 0.3, H * 0.15), 'secondary'),
          0,
          -H * 0.5,
          L * 0.72,
        );
        const ankle = kit.at(kit.mesh(kit.cyl(W * 0.62, W * 0.68, H * 1.1, 10), 'primary'), 0, H * 0.35, 0);
        const cuff = kit.at(kit.mesh(kit.cyl(W * 0.7, W * 0.62, H * 0.35, 10), 'accent'), 0, H * 1.0, 0);
        return kit.group(sole, foot, toe, ankle, cuff);
      });
      return {
        parts: [
          { socket: 'footR', object: right },
          { socket: 'footL', object: left },
        ],
      };
    },
  },
];
