import { DEG } from '../kit';
import type { ItemDefinition } from '../types';

export const mystic: ItemDefinition[] = [
  {
    id: 'weapon.oracle-staff',
    slot: 'weapon',
    name: 'Oracle Staff',
    tags: ['mystic', 'energy', 'elegant'],
    hands: 2,
    build: ({ kit }) => {
      const shaft = kit.at(kit.mesh(kit.cyl(0.016, 0.02, 1.35, 8), 'dark'), 0, 0.375, 0);
      const gripWrap = kit.at(kit.mesh(kit.cyl(0.024, 0.024, 0.12, 8), 'secondary'), 0, 0.0, 0);
      const foregrip = kit.at(kit.mesh(kit.cyl(0.024, 0.024, 0.12, 8), 'secondary'), 0, 0.3, 0);
      const ferrule = kit.at(kit.mesh(kit.cone(0.022, 0.06, 6), 'metal'), 0, -0.3, 0, 180 * DEG);
      const cradle = kit.at(kit.mesh(kit.cyl(0.032, 0.02, 0.1, 6), 'primary'), 0, 1.07, 0);
      const prongs = [0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2;
        return kit.at(
          kit.mesh(kit.box(0.012, 0.16, 0.012), 'primary'),
          Math.cos(a) * 0.06,
          1.18,
          Math.sin(a) * 0.06,
          Math.cos(a) * 12 * DEG,
          0,
          -Math.sin(a) * 12 * DEG,
        );
      });
      const orb = kit.at(kit.mesh(kit.sphere(0.06, 12), 'glow'), 0, 1.22, 0);
      const halo = kit.at(kit.mesh(kit.ring(0.1, 0.008, 20), 'accent'), 0, 1.22, 0);
      const crown = kit.at(kit.mesh(kit.cone(0.035, 0.08, 6), 'metal'), 0, 1.33, 0);
      return {
        parts: [
          {
            socket: 'weapon',
            object: kit.group(shaft, gripWrap, foregrip, ferrule, cradle, ...prongs, orb, halo, crown),
          },
        ],
      };
    },
  },
  {
    id: 'weapon.rune-wand',
    slot: 'weapon',
    name: 'Rune Wand',
    tags: ['mystic', 'energy', 'light'],
    hands: 1,
    build: ({ kit }) => {
      const handle = kit.at(kit.mesh(kit.cyl(0.016, 0.02, 0.18, 8), 'dark'), 0, 0.02, 0);
      const pommel = kit.at(kit.mesh(kit.prism(6, 0.025, 0.04), 'metal'), 0, -0.08, 0);
      const guard = kit.at(kit.mesh(kit.ring(0.035, 0.008, 12), 'metal'), 0, 0.12, 0, 90 * DEG);
      const rod = kit.at(kit.mesh(kit.cyl(0.01, 0.014, 0.3, 6), 'primary'), 0, 0.27, 0);
      const crystal = kit.at(kit.mesh(kit.prism(4, 0.025, 0.12), 'glass'), 0, 0.46, 0);
      const tip = kit.at(kit.mesh(kit.cone(0.025, 0.06, 4), 'accent'), 0, 0.55, 0);
      const runes = [0.24, 0.32, 0.4].map((y, i) =>
        kit.at(
          kit.mesh(kit.box(0.024, 0.03, 0.006), 'glow'),
          Math.sin(i * 120 * DEG) * 0.045,
          y,
          Math.cos(i * 120 * DEG) * 0.045,
          0,
          i * 120 * DEG,
          0,
        ),
      );
      return {
        parts: [{ socket: 'weapon', object: kit.group(handle, pommel, guard, rod, crystal, tip, ...runes) }],
      };
    },
  },
  {
    id: 'weapon.ward-shield',
    slot: 'weapon',
    name: 'Ward Shield',
    tags: ['mystic', 'armour', 'heavy'],
    hands: 1,
    build: ({ kit }) => {
      // octagonal plate facing +Z (away from the palm); the arm sits behind it along -Y
      const plate = kit.at(kit.mesh(kit.cyl(0.3, 0.3, 0.025, 8), 'primary'), 0, 0.05, 0.06, 90 * DEG);
      const rim = kit.at(kit.mesh(kit.ring(0.3, 0.02, 8), 'metal'), 0, 0.05, 0.06);
      const inner = kit.at(kit.mesh(kit.cyl(0.2, 0.2, 0.015, 8), 'secondary'), 0, 0.05, 0.08, 90 * DEG);
      const boss = kit.at(kit.mesh(kit.hemi(0.07, 10), 'accent'), 0, 0.05, 0.088, 90 * DEG);
      const barV = kit.at(kit.mesh(kit.box(0.02, 0.36, 0.01), 'glow'), 0, 0.05, 0.09);
      const barH = kit.at(kit.mesh(kit.box(0.36, 0.02, 0.01), 'glow'), 0, 0.05, 0.09);
      const grip = kit.at(kit.mesh(kit.cyl(0.02, 0.02, 0.12, 8), 'dark'), 0, 0.0, 0.0);
      const strap = kit.at(kit.mesh(kit.box(0.06, 0.02, 0.05), 'dark'), 0, -0.15, 0.03);
      return {
        parts: [{ socket: 'weapon', object: kit.group(plate, rim, inner, boss, barV, barH, grip, strap) }],
      };
    },
  },
];
