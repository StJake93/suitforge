import type { ItemDefinition } from '../types';

export const vanguard: ItemDefinition[] = [
  {
    id: 'glasses.tactical-visor',
    slot: 'glasses',
    name: 'Tactical Visor',
    tags: ['tech', 'visor'],
    build: ({ ref, kit }) => {
      const r = ref.headRadius;
      const lens = kit.at(
        kit.mesh(kit.rbox(r * 1.5, r * 0.36, r * 0.12, r * 0.06), 'glass'),
        0,
        0.12 * r,
        r * 0.98,
      );
      const frame = kit.at(
        kit.mesh(kit.rbox(r * 1.62, r * 0.1, r * 0.16, r * 0.03), 'dark'),
        0,
        0.34 * r,
        r * 0.96,
      );
      const armL = kit.at(kit.mesh(kit.box(r * 0.08, r * 0.1, r * 1.1), 'dark'), r * 0.82, 0.3 * r, r * 0.4);
      const armR = kit.at(kit.mesh(kit.box(r * 0.08, r * 0.1, r * 1.1), 'dark'), -r * 0.82, 0.3 * r, r * 0.4);
      return { parts: [{ socket: 'head', object: kit.group(lens, frame, armL, armR) }] };
    },
  },
];
