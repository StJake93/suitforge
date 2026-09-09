// Regal headgear: star circlet, laurel wreath, floating seraph halo.
import { DEG } from '../kit';
import type { ItemDefinition } from '../types';

export const regal: ItemDefinition[] = [
  {
    id: 'headgear.star-circlet',
    slot: 'headgear',
    name: 'Star Circlet',
    tags: ['elegant', 'cosmic', 'light'],
    build: ({ ref, kit }) => {
      const r = ref.headRadius;
      // front-facing band with a metal rim and three leaning tiara points
      const band = kit.at(
        kit.mesh(kit.arc(r * 1.07, r * 1.07, r * 0.14, -100 * DEG, 200 * DEG, 24), 'primary'),
        0,
        r * 0.35,
        0,
      );
      const rim = kit.at(kit.mesh(kit.ring(r * 1.08, r * 0.05, 24), 'metal'), 0, r * 0.27, 0, 90 * DEG);
      const peak = kit.at(kit.mesh(kit.cone(r * 0.22, r * 0.7, 4), 'metal'), 0, r * 0.72, r * 1.0, -20 * DEG);
      const peakL = kit.at(
        kit.mesh(kit.cone(r * 0.14, r * 0.45, 4), 'metal'),
        r * 0.55,
        r * 0.6,
        r * 0.88,
        -20 * DEG,
      );
      const peakR = kit.at(
        kit.mesh(kit.cone(r * 0.14, r * 0.45, 4), 'metal'),
        -r * 0.55,
        r * 0.6,
        r * 0.88,
        -20 * DEG,
      );
      const gem = kit.at(kit.mesh(kit.sphere(r * 0.14, 8), 'glow'), 0, r * 0.5, r * 1.12);
      const gemL = kit.at(kit.mesh(kit.sphere(r * 0.08, 6), 'accent'), r * 0.55, r * 0.42, r * 0.98);
      const gemR = kit.at(kit.mesh(kit.sphere(r * 0.08, 6), 'accent'), -r * 0.55, r * 0.42, r * 0.98);
      return {
        parts: [{ socket: 'head', object: kit.group(band, rim, peak, peakL, peakR, gem, gemL, gemR) }],
      };
    },
  },
  {
    id: 'headgear.laurel-wreath',
    slot: 'headgear',
    name: 'Laurel Wreath',
    tags: ['nature', 'elegant', 'retro'],
    build: ({ ref, kit }) => {
      const r = ref.headRadius;
      // vine ring with a run of flattened leaves sweeping from the back toward the brow
      const vine = kit.at(kit.mesh(kit.ring(r * 1.06, r * 0.06, 20), 'dark'), 0, r * 0.3, 0, 90 * DEG);
      const leaves: ReturnType<typeof kit.at>[] = [];
      for (let i = 0; i < 12; i++) {
        const phi = (30 + (300 * i) / 11) * DEG;
        const leaf = kit.scaled(kit.mesh(kit.sphere(r * 0.16, 6), 'primary'), 1.8, 0.35, 1);
        leaves.push(kit.at(leaf, r * 1.1 * Math.sin(phi), r * 0.38, r * 1.1 * Math.cos(phi), 0, phi, 0));
      }
      const ribbonL = kit.at(
        kit.mesh(kit.box(r * 0.12, r * 0.5, r * 0.05), 'accent'),
        r * 0.15,
        0,
        -r * 1.1,
        0,
        0,
        15 * DEG,
      );
      const ribbonR = kit.at(
        kit.mesh(kit.box(r * 0.12, r * 0.5, r * 0.05), 'accent'),
        -r * 0.15,
        0,
        -r * 1.1,
        0,
        0,
        -15 * DEG,
      );
      const berryL = kit.at(kit.mesh(kit.sphere(r * 0.08, 6), 'secondary'), r * 0.5, r * 0.42, r * 1.0);
      const berryR = kit.at(kit.mesh(kit.sphere(r * 0.08, 6), 'secondary'), -r * 0.5, r * 0.42, r * 1.0);
      return {
        parts: [{ socket: 'head', object: kit.group(vine, ...leaves, ribbonL, ribbonR, berryL, berryR) }],
      };
    },
  },
  {
    id: 'headgear.seraph-halo',
    slot: 'headgear',
    name: 'Seraph Halo',
    tags: ['mystic', 'cosmic', 'flight'],
    build: ({ ref, kit }) => {
      const r = ref.headRadius;
      // glowing ring floating above the crown, filled with a glass disc, plus a tilted outer ring
      const halo = kit.at(kit.mesh(kit.ring(r * 0.85, r * 0.06, 24), 'glow'), 0, r * 1.6, 0, 90 * DEG);
      const disc = kit.at(kit.mesh(kit.cyl(r * 0.78, r * 0.78, r * 0.02, 24), 'glass'), 0, r * 1.6, 0);
      const outer = kit.at(kit.mesh(kit.ring(r * 1.15, r * 0.035, 28), 'metal'), 0, r * 1.55, 0, 98 * DEG);
      const orbs = [0, 120, 240].map((phi) =>
        kit.at(
          kit.mesh(kit.sphere(r * 0.1, 8), 'accent'),
          r * 0.85 * Math.sin(phi * DEG),
          r * 1.6,
          r * 0.85 * Math.cos(phi * DEG),
        ),
      );
      const petals = [45, 135, 225, 315].map((phi) =>
        kit.at(
          kit.mesh(kit.box(r * 0.08, r * 0.3, r * 0.5), 'primary'),
          r * Math.sin(phi * DEG),
          r * 1.6,
          r * Math.cos(phi * DEG),
          0,
          phi * DEG,
        ),
      );
      return { parts: [{ socket: 'head', object: kit.group(halo, disc, outer, ...orbs, ...petals) }] };
    },
  },
];
