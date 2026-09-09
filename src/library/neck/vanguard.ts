import { DEG } from '../kit';
import type { ItemDefinition } from '../types';

export const vanguard: ItemDefinition[] = [
  {
    id: 'neck.gorget',
    slot: 'neck',
    name: 'Gorget',
    tags: ['armour', 'heavy'],
    build: ({ ref, kit }) => {
      const r = ref.neckRadius;
      const ring = kit.at(
        kit.mesh(kit.cyl(r * 1.6, r * 2.1, ref.neckLen * 0.9, 12), 'primary'),
        0,
        ref.neckLen * 0.35,
        0,
      );
      const trim = kit.at(
        kit.mesh(kit.ring(r * 1.65, r * 0.16, 16), 'accent'),
        0,
        ref.neckLen * 0.82,
        0,
        90 * DEG,
      );
      return { parts: [{ socket: 'neck', object: kit.group(ring, trim) }] };
    },
  },
];
