import type { ItemDefinition } from '../types';

export const vanguard: ItemDefinition[] = [
  {
    id: 'gloves.vanguard-gauntlets',
    slot: 'gloves',
    name: 'Vanguard Gauntlets',
    tags: ['armour', 'tech'],
    build: ({ ref, kit }) => {
      const s = ref.handSize, len = ref.handLen;
      const [right, left] = kit.mirror(() => {
        const fist = kit.at(kit.mesh(kit.rbox(s * 0.6, len * 1.02, s * 0.38, s * 0.1), 'primary'), 0, len * 0.5, 0);
        const knuckles = kit.at(kit.mesh(kit.rbox(s * 0.62, len * 0.22, s * 0.16, s * 0.04), 'accent'), 0, len * 0.9, s * 0.16);
        const cuff = kit.at(kit.mesh(kit.cyl(s * 0.36, s * 0.32, len * 0.2, 10), 'secondary'), 0, len * 0.08, 0);
        return kit.group(fist, knuckles, cuff);
      });
      return { parts: [{ socket: 'handR', object: right }, { socket: 'handL', object: left }] };
    },
  },
];
