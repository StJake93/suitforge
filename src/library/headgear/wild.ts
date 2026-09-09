// Wild headgear: mohawk crest, topknot spike, bull horns.
import { DEG } from '../kit';
import type { ItemDefinition } from '../types';

export const wild: ItemDefinition[] = [
  {
    id: 'headgear.mohawk-crest',
    slot: 'headgear',
    name: 'Mohawk Crest',
    tags: ['brutal', 'retro'],
    build: ({ ref, kit }) => {
      const r = ref.headRadius;
      // six fins fanned along the sagittal line on a scalp strip; alternate colours for stripes
      const strip = kit.at(
        kit.mesh(kit.arc(r * 1.05, r * 1.05, r * 0.3, 20 * DEG, 140 * DEG, 12), 'dark'),
        0,
        0,
        0,
        0,
        0,
        90 * DEG,
      );
      const heights = [0.6, 0.9, 1.1, 1.1, 0.9, 0.6];
      const fins = heights.map((h, i) => {
        const psi = (-50 + (100 * i) / 5) * DEG;
        const d = r * (1.0 + h / 2);
        const role = i % 2 === 0 ? 'primary' : 'secondary';
        return kit.at(
          kit.mesh(kit.box(r * 0.14, r * h, r * 0.32), role),
          0,
          d * Math.cos(psi),
          d * Math.sin(psi),
          psi,
        );
      });
      const studL = kit.at(kit.mesh(kit.sphere(r * 0.08, 6), 'accent'), r * 0.22, r * 0.9, r * 0.6);
      const studR = kit.at(kit.mesh(kit.sphere(r * 0.08, 6), 'accent'), -r * 0.22, r * 0.9, r * 0.6);
      return { parts: [{ socket: 'head', object: kit.group(strip, ...fins, studL, studR) }] };
    },
  },
  {
    id: 'headgear.topknot-spike',
    slot: 'headgear',
    name: 'Topknot Spike',
    tags: ['brutal', 'melee', 'light'],
    build: ({ ref, kit }) => {
      const r = ref.headRadius;
      // front headband, wrapped bun on the crown, tall spike and two crossed pins through the bun
      const band = kit.at(
        kit.mesh(kit.arc(r * 1.07, r * 1.07, r * 0.16, -70 * DEG, 140 * DEG, 14), 'primary'),
        0,
        r * 0.4,
        0,
      );
      const wrap = kit.at(
        kit.mesh(kit.cyl(r * 0.3, r * 0.36, r * 0.35, 8), 'primary'),
        0,
        r * 0.95,
        -r * 0.15,
      );
      const bun = kit.at(kit.mesh(kit.sphere(r * 0.42, 10), 'dark'), 0, r * 1.2, -r * 0.15);
      const spike = kit.at(
        kit.mesh(kit.cone(r * 0.12, r * 1.4, 6), 'metal'),
        0,
        r * 2.2,
        -r * 0.15,
        -15 * DEG,
      );
      const pin1 = kit.at(
        kit.mesh(kit.cyl(r * 0.035, r * 0.035, r * 1.4, 5), 'metal'),
        0,
        r * 1.25,
        -r * 0.15,
        0,
        30 * DEG,
        90 * DEG,
      );
      const pin2 = kit.at(
        kit.mesh(kit.cyl(r * 0.035, r * 0.035, r * 1.4, 5), 'metal'),
        0,
        r * 1.25,
        -r * 0.15,
        0,
        -30 * DEG,
        90 * DEG,
      );
      const tip1 = kit.at(
        kit.mesh(kit.sphere(r * 0.07, 6), 'accent'),
        r * 0.7 * Math.cos(30 * DEG),
        r * 1.25,
        -r * 0.15 - r * 0.7 * Math.sin(30 * DEG),
      );
      const tip2 = kit.at(
        kit.mesh(kit.sphere(r * 0.07, 6), 'accent'),
        r * 0.7 * Math.cos(30 * DEG),
        r * 1.25,
        -r * 0.15 + r * 0.7 * Math.sin(30 * DEG),
      );
      return {
        parts: [{ socket: 'head', object: kit.group(band, wrap, bun, spike, pin1, pin2, tip1, tip2) }],
      };
    },
  },
  {
    id: 'headgear.bull-horns',
    slot: 'headgear',
    name: 'Bull Horns',
    tags: ['nature', 'brutal', 'heavy'],
    build: ({ ref, kit }) => {
      const r = ref.headRadius;
      // riveted strap over the crown; two-segment horns curving out sideways from bosses above the ears
      const strap = kit.at(
        kit.mesh(kit.arc(r * 1.06, r * 1.06, r * 0.4, 20 * DEG, 140 * DEG, 12), 'primary'),
        0,
        0,
        0,
        0,
        0,
        90 * DEG,
      );
      const bossL = kit.at(
        kit.mesh(kit.cyl(r * 0.42, r * 0.35, r * 0.3, 8), 'primary'),
        r * 0.95,
        r * 0.6,
        0,
        0,
        0,
        -55 * DEG,
      );
      const bossR = kit.at(
        kit.mesh(kit.cyl(r * 0.42, r * 0.35, r * 0.3, 8), 'primary'),
        -r * 0.95,
        r * 0.6,
        0,
        0,
        0,
        55 * DEG,
      );
      const seg1L = kit.at(
        kit.mesh(kit.cyl(r * 0.18, r * 0.3, r * 0.9, 7), 'secondary'),
        r * 1.21,
        r * 0.97,
        0,
        0,
        0,
        -35 * DEG,
      );
      const seg1R = kit.at(
        kit.mesh(kit.cyl(r * 0.18, r * 0.3, r * 0.9, 7), 'secondary'),
        -r * 1.21,
        r * 0.97,
        0,
        0,
        0,
        35 * DEG,
      );
      const seg2L = kit.at(
        kit.mesh(kit.cone(r * 0.18, r * 0.7, 7), 'secondary'),
        r * 1.81,
        r * 1.4,
        0,
        0,
        0,
        -80 * DEG,
      );
      const seg2R = kit.at(
        kit.mesh(kit.cone(r * 0.18, r * 0.7, 7), 'secondary'),
        -r * 1.81,
        r * 1.4,
        0,
        0,
        0,
        80 * DEG,
      );
      const rivetSpots: Array<[number, number]> = [
        [0, 1.1],
        [0.5, 0.98],
        [-0.5, 0.98],
      ];
      const rivets = rivetSpots.map(([x, y]) =>
        kit.at(kit.mesh(kit.sphere(r * 0.06, 6), 'metal'), r * x, r * y, 0),
      );
      return {
        parts: [
          { socket: 'head', object: kit.group(strap, bossL, bossR, seg1L, seg1R, seg2L, seg2R, ...rivets) },
        ],
      };
    },
  },
];
