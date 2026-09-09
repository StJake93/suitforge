import { DEG } from '../kit';
import type { ItemDefinition } from '../types';

export const brutal: ItemDefinition[] = [
  {
    id: 'weapon.great-cleaver',
    slot: 'weapon',
    name: 'Great Cleaver',
    tags: ['melee', 'heavy', 'brutal'],
    hands: 2,
    build: ({ kit }) => {
      const handle = kit.at(kit.mesh(kit.cyl(0.02, 0.022, 0.65, 8), 'dark'), 0, 0.075, 0);
      const pommel = kit.at(kit.mesh(kit.sphere(0.035, 8), 'metal'), 0, -0.27, 0);
      const guard = kit.at(kit.mesh(kit.rbox(0.2, 0.04, 0.06, 0.01), 'metal'), 0, 0.42, 0);
      const ricasso = kit.at(kit.mesh(kit.cyl(0.03, 0.03, 0.08, 8), 'dark'), 0, 0.48, 0);
      const blade = kit.at(kit.mesh(kit.box(0.014, 0.8, 0.16), 'primary'), 0, 0.84, 0.02);
      const edge = kit.at(kit.mesh(kit.box(0.006, 0.8, 0.18), 'metal'), 0, 0.84, 0.02);
      const fuller = kit.at(kit.mesh(kit.box(0.018, 0.5, 0.03), 'secondary'), 0, 0.8, 0.02);
      const tip = kit.at(
        kit.scaled(kit.mesh(kit.cone(0.09, 0.14, 4), 'primary'), 0.15, 1, 1),
        0,
        1.31,
        0.02,
        0,
        45 * DEG,
        0,
      );
      const foregripRing = kit.at(kit.mesh(kit.ring(0.028, 0.006, 10), 'metal'), 0, 0.3, 0, 90 * DEG);
      return {
        parts: [
          {
            socket: 'weapon',
            object: kit.group(handle, pommel, guard, ricasso, blade, edge, fuller, tip, foregripRing),
          },
        ],
      };
    },
  },
  {
    id: 'weapon.spiked-mace',
    slot: 'weapon',
    name: 'Spiked Mace',
    tags: ['melee', 'brutal', 'retro'],
    hands: 1,
    build: ({ kit }) => {
      const haft = kit.at(kit.mesh(kit.cyl(0.016, 0.02, 0.5, 8), 'dark'), 0, 0.15, 0);
      const pommel = kit.at(kit.mesh(kit.cyl(0.025, 0.02, 0.04, 8), 'metal'), 0, -0.12, 0);
      const collar = kit.at(kit.mesh(kit.cyl(0.03, 0.025, 0.06, 8), 'secondary'), 0, 0.4, 0);
      const head = kit.at(kit.mesh(kit.sphere(0.09, 8), 'primary'), 0, 0.5, 0);
      const band = kit.at(kit.mesh(kit.ring(0.09, 0.012, 16), 'accent'), 0, 0.5, 0, 90 * DEG);
      const spike = (x: number, y: number, z: number, rx: number, rz: number) =>
        kit.at(kit.mesh(kit.cone(0.025, 0.09, 6), 'metal'), x, y, z, rx, 0, rz);
      const spikes = [
        spike(0, 0.635, 0, 0, 0),
        spike(0.135, 0.5, 0, 0, -90 * DEG),
        spike(-0.135, 0.5, 0, 0, 90 * DEG),
        spike(0, 0.5, 0.135, 90 * DEG, 0),
        spike(0, 0.5, -0.135, -90 * DEG, 0),
      ];
      return {
        parts: [{ socket: 'weapon', object: kit.group(haft, pommel, collar, head, band, ...spikes) }],
      };
    },
  },
  {
    id: 'weapon.war-hammer',
    slot: 'weapon',
    name: 'War Hammer',
    tags: ['melee', 'heavy', 'retro'],
    hands: 1,
    build: ({ kit }) => {
      const haft = kit.at(kit.mesh(kit.cyl(0.018, 0.022, 0.55, 8), 'dark'), 0, 0.15, 0);
      const pommel = kit.at(kit.mesh(kit.cyl(0.028, 0.024, 0.05, 8), 'metal'), 0, -0.14, 0);
      const wrap = kit.at(kit.mesh(kit.ring(0.024, 0.006, 10), 'accent'), 0, 0.05, 0, 90 * DEG);
      const collar = kit.at(kit.mesh(kit.cyl(0.03, 0.03, 0.05, 8), 'secondary'), 0, 0.42, 0);
      // head runs along Z: flat face forward (+Z), spike backward (-Z)
      const head = kit.at(kit.mesh(kit.rbox(0.1, 0.14, 0.22, 0.015), 'primary'), 0, 0.52, 0);
      const face = kit.at(kit.mesh(kit.cyl(0.06, 0.055, 0.05, 8), 'metal'), 0, 0.52, 0.135, 90 * DEG);
      const spike = kit.at(kit.mesh(kit.cone(0.035, 0.14, 6), 'metal'), 0, 0.52, -0.18, -90 * DEG);
      const cap = kit.at(kit.mesh(kit.cone(0.03, 0.06, 6), 'secondary'), 0, 0.62, 0);
      return {
        parts: [{ socket: 'weapon', object: kit.group(haft, pommel, wrap, collar, head, face, spike, cap) }],
      };
    },
  },
];
