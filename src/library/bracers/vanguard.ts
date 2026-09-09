import type { ItemDefinition } from '../types';

export const vanguard: ItemDefinition[] = [
  {
    id: 'bracers.vanguard-guards',
    slot: 'bracers',
    name: 'Vanguard Guards',
    tags: ['armour', 'tech'],
    build: ({ ref, kit }) => {
      const r = ref.forearmR,
        len = ref.forearmLen;
      const [right, left] = kit.mirror(() => {
        const cuff = kit.at(kit.mesh(kit.cyl(r * 1.3, r * 1.5, len * 0.55, 10), 'primary'), 0, len * 0.6, 0);
        const plate = kit.at(
          kit.mesh(kit.rbox(r * 1.6, len * 0.45, r * 0.5, r * 0.15), 'secondary'),
          0,
          len * 0.55,
          r * 1.35,
        );
        const light = kit.at(
          kit.mesh(kit.box(r * 0.5, len * 0.28, r * 0.12), 'glow'),
          0,
          len * 0.55,
          r * 1.62,
        );
        return kit.group(cuff, plate, light);
      });
      return {
        parts: [
          { socket: 'forearmR', object: right },
          { socket: 'forearmL', object: left },
        ],
      };
    },
  },
];
