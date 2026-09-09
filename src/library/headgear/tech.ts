// Tech headgear: twin antennae, pod headband, radar dish.
import { DEG } from '../kit';
import type { ItemDefinition } from '../types';

export const tech: ItemDefinition[] = [
  {
    id: 'headgear.twin-antennae',
    slot: 'headgear',
    name: 'Twin Antennae',
    tags: ['tech', 'utility'],
    build: ({ ref, kit }) => {
      const r = ref.headRadius;
      // thin band around the crown carrying two splayed masts
      const band = kit.at(kit.mesh(kit.cyl(r * 1.08, r * 1.08, r * 0.12, 14), 'primary'), 0, r * 0.55, 0);
      const unit = kit.at(
        kit.mesh(kit.rbox(r * 0.5, r * 0.3, r * 0.3, r * 0.05), 'primary'),
        0,
        r * 0.7,
        -r * 0.95,
      );
      const baseL = kit.at(
        kit.mesh(kit.cyl(r * 0.16, r * 0.2, r * 0.2, 8), 'dark'),
        r * 0.55,
        r * 0.95,
        r * 0.1,
        0,
        0,
        -20 * DEG,
      );
      const baseR = kit.at(
        kit.mesh(kit.cyl(r * 0.16, r * 0.2, r * 0.2, 8), 'dark'),
        -r * 0.55,
        r * 0.95,
        r * 0.1,
        0,
        0,
        20 * DEG,
      );
      const mastL = kit.at(
        kit.mesh(kit.cyl(r * 0.04, r * 0.05, r * 1.6, 6), 'metal'),
        r * 0.85,
        r * 1.7,
        r * 0.1,
        0,
        0,
        -20 * DEG,
      );
      const mastR = kit.at(
        kit.mesh(kit.cyl(r * 0.04, r * 0.05, r * 1.6, 6), 'metal'),
        -r * 0.85,
        r * 1.7,
        r * 0.1,
        0,
        0,
        20 * DEG,
      );
      const tipL = kit.at(kit.mesh(kit.sphere(r * 0.1, 8), 'glow'), r * 1.12, r * 2.45, r * 0.1);
      const tipR = kit.at(kit.mesh(kit.sphere(r * 0.1, 8), 'glow'), -r * 1.12, r * 2.45, r * 0.1);
      return {
        parts: [{ socket: 'head', object: kit.group(band, unit, baseL, baseR, mastL, mastR, tipL, tipR) }],
      };
    },
  },
  {
    id: 'headgear.pod-band',
    slot: 'headgear',
    name: 'Pod Band',
    tags: ['tech', 'stealth', 'utility'],
    build: ({ ref, kit }) => {
      const r = ref.headRadius;
      // wide headband with a pod over each ear and a strap over the top
      const band = kit.at(kit.mesh(kit.cyl(r * 1.1, r * 1.1, r * 0.22, 14), 'primary'), 0, r * 0.35, 0);
      const topStrap = kit.at(
        kit.mesh(kit.arc(r * 1.15, r * 1.15, r * 0.12, 30 * DEG, 120 * DEG, 12), 'secondary'),
        0,
        0,
        0,
        0,
        0,
        90 * DEG,
      );
      const podL = kit.at(
        kit.mesh(kit.rbox(r * 0.4, r * 0.55, r * 0.75, r * 0.08), 'primary'),
        r * 1.2,
        r * 0.2,
        0,
      );
      const podR = kit.at(
        kit.mesh(kit.rbox(r * 0.4, r * 0.55, r * 0.75, r * 0.08), 'primary'),
        -r * 1.2,
        r * 0.2,
        0,
      );
      const lightL = kit.at(
        kit.mesh(kit.cyl(r * 0.14, r * 0.14, r * 0.1, 8), 'glow'),
        r * 1.42,
        r * 0.2,
        r * 0.15,
        0,
        0,
        90 * DEG,
      );
      const lightR = kit.at(
        kit.mesh(kit.cyl(r * 0.14, r * 0.14, r * 0.1, 8), 'glow'),
        -r * 1.42,
        r * 0.2,
        r * 0.15,
        0,
        0,
        90 * DEG,
      );
      const cable = kit.at(
        kit.mesh(kit.arc(r * 1.25, r * 1.25, r * 0.08, 120 * DEG, 120 * DEG, 12), 'dark'),
        0,
        r * 0.1,
        0,
      );
      const plate = kit.at(
        kit.mesh(kit.plate(r * 0.6, r * 0.3, r * 0.08), 'secondary'),
        0,
        r * 0.35,
        r * 1.1,
      );
      return {
        parts: [
          { socket: 'head', object: kit.group(band, topStrap, podL, podR, lightL, lightR, cable, plate) },
        ],
      };
    },
  },
  {
    id: 'headgear.radar-dish',
    slot: 'headgear',
    name: 'Radar Dish',
    tags: ['tech', 'utility', 'retro'],
    build: ({ ref, kit }) => {
      const r = ref.headRadius;
      // over-the-top strap, a dish on an arm off the left side, counterweight box on the right
      const strap = kit.at(
        kit.mesh(kit.arc(r * 1.1, r * 1.1, r * 0.14, 20 * DEG, 140 * DEG, 12), 'primary'),
        0,
        0,
        0,
        0,
        0,
        90 * DEG,
      );
      const mount = kit.at(
        kit.mesh(kit.box(r * 0.3, r * 0.3, r * 0.3), 'dark'),
        r * 0.75,
        r * 0.85,
        -r * 0.3,
      );
      const arm = kit.at(
        kit.mesh(kit.cyl(r * 0.06, r * 0.06, r * 0.9, 6), 'metal'),
        r * 0.95,
        r * 1.3,
        -r * 0.35,
        0,
        0,
        -25 * DEG,
      );
      const dish = kit.at(
        kit.mesh(
          kit.lathe(
            [
              [r * 0.02, 0],
              [r * 0.45, r * 0.1],
              [r * 0.72, r * 0.32],
            ],
            14,
          ),
          'primary',
        ),
        r * 1.2,
        r * 1.8,
        -r * 0.4,
        0,
        0,
        -35 * DEG,
      );
      const feed = kit.at(
        kit.mesh(kit.cyl(r * 0.03, r * 0.03, r * 0.5, 5), 'metal'),
        r * 1.34,
        r * 2.0,
        -r * 0.4,
        0,
        0,
        -35 * DEG,
      );
      const feedTip = kit.at(kit.mesh(kit.sphere(r * 0.07, 6), 'glow'), r * 1.49, r * 2.21, -r * 0.4);
      const weight = kit.at(
        kit.mesh(kit.rbox(r * 0.5, r * 0.35, r * 0.4, r * 0.06), 'secondary'),
        -r * 0.9,
        r * 0.75,
        -r * 0.2,
      );
      const stripe = kit.at(
        kit.mesh(kit.box(r * 0.52, r * 0.06, r * 0.1), 'accent'),
        -r * 0.9,
        r * 0.9,
        -r * 0.2,
      );
      return {
        parts: [
          { socket: 'head', object: kit.group(strap, mount, arm, dish, feed, feedTip, weight, stripe) },
        ],
      };
    },
  },
];
