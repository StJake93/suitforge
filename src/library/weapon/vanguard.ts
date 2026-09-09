import { DEG } from '../kit';
import type { ItemDefinition } from '../types';

export const vanguard: ItemDefinition[] = [
  {
    id: 'weapon.pulse-rifle',
    slot: 'weapon',
    name: 'Pulse Rifle',
    tags: ['tech', 'ranged', 'energy'],
    hands: 2,
    build: ({ kit }) => {
      // grip at origin, barrel along +Y, stock along -Y, foregrip near y = 0.30 (ASSET_CONTRACT §3.2)
      const receiver = kit.at(kit.mesh(kit.rbox(0.06, 0.5, 0.11, 0.015), 'primary'), 0, 0.2, 0.06);
      const barrel = kit.at(kit.mesh(kit.cyl(0.018, 0.022, 0.42, 10), 'metal'), 0, 0.62, 0.08);
      const muzzle = kit.at(kit.mesh(kit.cyl(0.03, 0.03, 0.06, 10), 'dark'), 0, 0.84, 0.08);
      const stock = kit.at(kit.mesh(kit.rbox(0.05, 0.2, 0.09, 0.012), 'secondary'), 0, -0.14, 0.07);
      const grip = kit.at(kit.mesh(kit.rbox(0.035, 0.09, 0.05, 0.01), 'dark'), 0, 0.0, -0.02, 15 * DEG);
      const foregrip = kit.at(kit.mesh(kit.rbox(0.035, 0.07, 0.05, 0.01), 'dark'), 0, 0.3, -0.005);
      const cell = kit.at(kit.mesh(kit.rbox(0.045, 0.16, 0.05, 0.01), 'glow'), 0, 0.28, 0.13);
      const sight = kit.at(kit.mesh(kit.box(0.02, 0.14, 0.03), 'dark'), 0, 0.42, 0.14);
      return {
        parts: [
          {
            socket: 'weapon',
            object: kit.group(receiver, barrel, muzzle, stock, grip, foregrip, cell, sight),
          },
        ],
      };
    },
  },
  {
    id: 'weapon.arc-sabre',
    slot: 'weapon',
    name: 'Arc Sabre',
    tags: ['energy', 'melee', 'elegant'],
    hands: 1,
    build: ({ kit }) => {
      const hilt = kit.at(kit.mesh(kit.cyl(0.018, 0.02, 0.2, 10), 'dark'), 0, 0.0, 0);
      const pommel = kit.at(kit.mesh(kit.sphere(0.024, 8), 'metal'), 0, -0.11, 0);
      const guard = kit.at(kit.mesh(kit.rbox(0.12, 0.02, 0.05, 0.008), 'metal'), 0, 0.11, 0);
      const blade = kit.at(kit.mesh(kit.box(0.012, 0.78, 0.045), 'glow'), 0, 0.52, 0);
      const edge = kit.at(kit.mesh(kit.box(0.005, 0.78, 0.055), 'accent'), 0, 0.52, 0);
      return { parts: [{ socket: 'weapon', object: kit.group(hilt, pommel, guard, blade, edge) }] };
    },
  },
];
