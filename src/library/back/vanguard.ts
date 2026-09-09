import { DEG } from '../kit';
import type { ItemDefinition } from '../types';

export const vanguard: ItemDefinition[] = [
  {
    id: 'back.jetpack',
    slot: 'back',
    name: 'Jetpack',
    tags: ['tech', 'flight'],
    build: ({ ref, kit }) => {
      const w = ref.shoulderHalf, cl = ref.chestLen;
      const body = kit.at(kit.mesh(kit.rbox(w * 1.1, cl * 0.7, cl * 0.28, cl * 0.05), 'secondary'), 0, cl * 0.05, cl * 0.16);
      const tankL = kit.at(kit.mesh(kit.cyl(w * 0.24, w * 0.24, cl * 0.8, 12), 'primary'), w * 0.36, 0, cl * 0.36);
      const tankR = kit.at(kit.mesh(kit.cyl(w * 0.24, w * 0.24, cl * 0.8, 12), 'primary'), -w * 0.36, 0, cl * 0.36);
      const nozL = kit.at(kit.mesh(kit.cone(w * 0.28, cl * 0.22, 12), 'metal'), w * 0.36, -cl * 0.52, cl * 0.36, 180 * DEG);
      const nozR = kit.at(kit.mesh(kit.cone(w * 0.28, cl * 0.22, 12), 'metal'), -w * 0.36, -cl * 0.52, cl * 0.36, 180 * DEG);
      const flameL = kit.at(kit.mesh(kit.cone(w * 0.16, cl * 0.16, 8), 'glow'), w * 0.36, -cl * 0.68, cl * 0.36, 180 * DEG);
      const flameR = kit.at(kit.mesh(kit.cone(w * 0.16, cl * 0.16, 8), 'glow'), -w * 0.36, -cl * 0.68, cl * 0.36, 180 * DEG);
      const strap = kit.at(kit.mesh(kit.box(w * 1.3, cl * 0.1, cl * 0.05), 'dark'), 0, cl * 0.3, cl * 0.03);
      return { parts: [{ socket: 'back', object: kit.group(body, tankL, tankR, nozL, nozR, flameL, flameR, strap) }] };
    },
  },
];
