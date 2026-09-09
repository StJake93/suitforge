import { DEG } from '../kit';
import type { ItemDefinition } from '../types';

// Weapon socket: grip at origin, +Y along the barrel, +Z away from the palm (top of the weapon).
export const tech: ItemDefinition[] = [
  {
    id: 'weapon.rail-cannon',
    slot: 'weapon',
    name: 'Rail Cannon',
    tags: ['tech', 'ranged', 'energy', 'heavy'],
    hands: 2,
    build: ({ kit }) => {
      const receiver = kit.at(kit.mesh(kit.rbox(0.07, 0.7, 0.13, 0.015), 'primary'), 0, 0.3, 0.07);
      const railA = kit.at(kit.mesh(kit.box(0.012, 0.6, 0.03), 'metal'), 0.03, 0.85, 0.09);
      const railB = kit.at(kit.mesh(kit.box(0.012, 0.6, 0.03), 'metal'), -0.03, 0.85, 0.09);
      const core = kit.at(kit.mesh(kit.cyl(0.02, 0.02, 0.56, 8), 'glow'), 0, 0.85, 0.09);
      const muzzle = kit.at(kit.mesh(kit.rbox(0.08, 0.08, 0.1, 0.01), 'dark'), 0, 1.16, 0.09);
      const stock = kit.at(kit.mesh(kit.rbox(0.055, 0.22, 0.1, 0.012), 'secondary'), 0, -0.18, 0.07);
      const grip = kit.at(kit.mesh(kit.rbox(0.035, 0.09, 0.05, 0.01), 'dark'), 0, 0.0, -0.02, 15 * DEG);
      const foregrip = kit.at(kit.mesh(kit.rbox(0.035, 0.08, 0.05, 0.01), 'dark'), 0, 0.3, -0.01);
      const capacitor = kit.at(kit.mesh(kit.cyl(0.045, 0.045, 0.2, 8), 'secondary'), 0, 0.45, 0.16);
      const scope = kit.at(kit.mesh(kit.cyl(0.022, 0.022, 0.18, 8), 'dark'), 0, 0.2, 0.17);
      const fin = kit.at(kit.mesh(kit.plate(0.02, 0.24, 0.05), 'accent'), 0, 0.75, 0.15);
      return {
        parts: [
          {
            socket: 'weapon',
            object: kit.group(
              receiver,
              railA,
              railB,
              core,
              muzzle,
              stock,
              grip,
              foregrip,
              capacitor,
              scope,
              fin,
            ),
          },
        ],
      };
    },
  },
  {
    id: 'weapon.ion-pistol',
    slot: 'weapon',
    name: 'Ion Pistol',
    tags: ['tech', 'ranged', 'energy', 'light'],
    hands: 1,
    build: ({ kit }) => {
      const body = kit.at(kit.mesh(kit.rbox(0.05, 0.22, 0.09, 0.012), 'primary'), 0, 0.13, 0.06);
      const barrel = kit.at(kit.mesh(kit.cyl(0.018, 0.02, 0.14, 10), 'metal'), 0, 0.3, 0.07);
      const emitter = kit.at(kit.mesh(kit.ring(0.03, 0.008, 12), 'glow'), 0, 0.37, 0.07, 90 * DEG);
      const grip = kit.at(kit.mesh(kit.rbox(0.035, 0.11, 0.05, 0.01), 'dark'), 0, 0.0, -0.01, 15 * DEG);
      const cell = kit.at(kit.mesh(kit.rbox(0.02, 0.1, 0.05, 0.006), 'glow'), 0.034, 0.14, 0.06);
      const guard = kit.at(kit.mesh(kit.box(0.015, 0.06, 0.01), 'dark'), 0, 0.1, -0.005);
      const fin = kit.at(kit.mesh(kit.plate(0.015, 0.12, 0.03), 'secondary'), 0, 0.2, 0.12);
      return {
        parts: [{ socket: 'weapon', object: kit.group(body, barrel, emitter, grip, cell, guard, fin) }],
      };
    },
  },
  {
    id: 'weapon.rotary-cannon',
    slot: 'weapon',
    name: 'Rotary Cannon',
    tags: ['heavy', 'ranged', 'tech', 'brutal'],
    hands: 2,
    build: ({ kit }) => {
      const barrels = [0, 1, 2, 3, 4, 5].map((i) => {
        const a = (i / 6) * Math.PI * 2;
        return kit.at(
          kit.mesh(kit.cyl(0.012, 0.012, 0.6, 6), 'metal'),
          Math.cos(a) * 0.035,
          0.75,
          0.1 + Math.sin(a) * 0.035,
        );
      });
      const shroud = kit.at(kit.mesh(kit.cyl(0.055, 0.055, 0.03, 8), 'dark'), 0, 1.0, 0.1);
      const rotor = kit.at(kit.mesh(kit.cyl(0.065, 0.075, 0.2, 10), 'primary'), 0, 0.35, 0.1);
      const body = kit.at(kit.mesh(kit.rbox(0.1, 0.35, 0.16, 0.02), 'primary'), 0, 0.12, 0.06);
      const drum = kit.at(
        kit.mesh(kit.cyl(0.07, 0.07, 0.1, 12), 'secondary'),
        0.1,
        0.1,
        0.03,
        0,
        0,
        90 * DEG,
      );
      const grip = kit.at(kit.mesh(kit.rbox(0.035, 0.1, 0.05, 0.01), 'dark'), 0, 0.0, -0.04, 15 * DEG);
      const foregrip = kit.at(kit.mesh(kit.rbox(0.04, 0.09, 0.05, 0.01), 'dark'), 0, 0.3, 0.0);
      const pack = kit.at(kit.mesh(kit.rbox(0.09, 0.14, 0.12, 0.015), 'secondary'), 0, -0.14, 0.06);
      const feed = kit.at(kit.mesh(kit.box(0.02, 0.2, 0.02), 'glow'), -0.05, 0.2, 0.13);
      return {
        parts: [
          {
            socket: 'weapon',
            object: kit.group(...barrels, shroud, rotor, body, drum, grip, foregrip, pack, feed),
          },
        ],
      };
    },
  },
];
