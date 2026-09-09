// Arcane / otherworldly helmets: shadow cowl, insectoid carapace, haloed astral crown.
import { DEG } from '../kit';
import type { ItemDefinition } from '../types';

export const arcane: ItemDefinition[] = [
  {
    id: 'helmet.shadow-cowl',
    slot: 'helmet',
    name: 'Shadow Cowl',
    tags: ['mystic', 'stealth', 'open-face'],
    build: ({ ref, kit }) => {
      const r = ref.headRadius;
      // pointed hood: cone peak over two flaring open-front bands
      const peak = kit.at(kit.mesh(kit.cone(r * 1.2, r * 0.8, 10), 'primary'), 0, r * 1.1, 0);
      const hood = kit.at(
        kit.mesh(kit.arc(r * 1.2, r * 1.35, r * 1.0, 40 * DEG, 280 * DEG, 12), 'primary'),
        0,
        r * 0.2,
        0,
      );
      const mantle = kit.at(
        kit.mesh(kit.arc(r * 1.35, r * 1.8, r * 1.1, 30 * DEG, 300 * DEG, 12), 'primary'),
        0,
        -r * 0.85,
        0,
      );
      // face wrap over the mouth and drape edges framing the eyes
      const wrap = kit.at(
        kit.mesh(kit.rbox(r * 1.3, r * 0.6, r * 0.5, r * 0.1), 'secondary'),
        0,
        -r * 0.7,
        r * 0.85,
      );
      const drapeL = kit.at(
        kit.mesh(kit.box(r * 0.18, r * 1.6, r * 0.14), 'secondary'),
        r * 0.95,
        -r * 0.2,
        r * 0.95,
        0,
        0,
        -8 * DEG,
      );
      const drapeR = kit.at(
        kit.mesh(kit.box(r * 0.18, r * 1.6, r * 0.14), 'secondary'),
        -r * 0.95,
        -r * 0.2,
        r * 0.95,
        0,
        0,
        8 * DEG,
      );
      const rune = kit.at(kit.mesh(kit.prism(6, r * 0.16, r * 0.06), 'glow'), 0, r * 0.7, r * 1.15, 90 * DEG);
      return {
        parts: [{ socket: 'head', object: kit.group(peak, hood, mantle, wrap, drapeL, drapeR, rune) }],
      };
    },
  },
  {
    id: 'helmet.chitin-carapace',
    slot: 'helmet',
    name: 'Chitin Carapace',
    tags: ['nature', 'armour', 'full-face'],
    hides: ['glasses'],
    build: ({ ref, kit }) => {
      const r = ref.headRadius;
      // faceted beetle shell, longer front to back, with a dorsal ridge
      const shell = kit.at(kit.scaled(kit.mesh(kit.sphere(r * 1.25, 10), 'primary'), 1, 0.95, 1.15), 0, 0, 0);
      const ridge = kit.at(kit.mesh(kit.box(r * 0.12, r * 0.2, r * 2.6), 'secondary'), 0, r * 1.12, 0);
      // segmented plates down the back of the neck
      const seg1 = kit.at(
        kit.mesh(kit.arc(r * 1.3, r * 1.42, r * 0.35, 110 * DEG, 140 * DEG, 10), 'secondary'),
        0,
        -r * 0.75,
        0,
      );
      const seg2 = kit.at(
        kit.mesh(kit.arc(r * 1.42, r * 1.55, r * 0.35, 120 * DEG, 120 * DEG, 10), 'secondary'),
        0,
        -r * 1.08,
        0,
      );
      // compound eyes and forward mandibles (rz tilt is applied before rx, so rz yaws the tips inward)
      const eyeL = kit.at(kit.mesh(kit.sphere(r * 0.4, 8), 'glass'), r * 0.6, r * 0.15, r * 1.15);
      const eyeR = kit.at(kit.mesh(kit.sphere(r * 0.4, 8), 'glass'), -r * 0.6, r * 0.15, r * 1.15);
      const mandL = kit.at(
        kit.mesh(kit.cone(r * 0.18, r * 0.9, 6), 'dark'),
        r * 0.55,
        -r * 0.9,
        r * 1.3,
        90 * DEG,
        0,
        25 * DEG,
      );
      const mandR = kit.at(
        kit.mesh(kit.cone(r * 0.18, r * 0.9, 6), 'dark'),
        -r * 0.55,
        -r * 0.9,
        r * 1.3,
        90 * DEG,
        0,
        -25 * DEG,
      );
      // antennae sweeping up and forward
      const antL = kit.at(
        kit.mesh(kit.cyl(r * 0.04, r * 0.05, r * 1.6, 5), 'dark'),
        r * 0.5,
        r * 1.4,
        r * 0.8,
        50 * DEG,
        0,
        -15 * DEG,
      );
      const antR = kit.at(
        kit.mesh(kit.cyl(r * 0.04, r * 0.05, r * 1.6, 5), 'dark'),
        -r * 0.5,
        r * 1.4,
        r * 0.8,
        50 * DEG,
        0,
        15 * DEG,
      );
      const tipL = kit.at(kit.mesh(kit.sphere(r * 0.08, 6), 'accent'), r * 0.71, r * 1.9, r * 1.39);
      const tipR = kit.at(kit.mesh(kit.sphere(r * 0.08, 6), 'accent'), -r * 0.71, r * 1.9, r * 1.39);
      return {
        parts: [
          {
            socket: 'head',
            object: kit.group(shell, ridge, seg1, seg2, eyeL, eyeR, mandL, mandR, antL, antR, tipL, tipR),
          },
        ],
      };
    },
  },
  {
    id: 'helmet.astral-crown',
    slot: 'helmet',
    name: 'Astral Crown',
    tags: ['cosmic', 'elegant', 'open-face', 'energy'],
    build: ({ ref, kit }) => {
      const r = ref.headRadius;
      const cap = kit.at(kit.mesh(kit.hemi(r * 1.14, 14), 'primary'), 0, 0, 0);
      const brow = kit.at(kit.mesh(kit.cyl(r * 1.2, r * 1.2, r * 0.22, 14), 'secondary'), 0, r * 0.05, 0);
      const cheekL = kit.at(
        kit.mesh(kit.box(r * 0.22, r * 0.9, r * 0.7), 'primary'),
        r * 1.08,
        -r * 0.4,
        r * 0.15,
      );
      const cheekR = kit.at(
        kit.mesh(kit.box(r * 0.22, r * 0.9, r * 0.7), 'primary'),
        -r * 1.08,
        -r * 0.4,
        r * 0.15,
      );
      const nape = kit.at(
        kit.mesh(kit.arc(r * 1.15, r * 1.3, r * 0.6, 120 * DEG, 120 * DEG, 12), 'secondary'),
        0,
        -r * 0.7,
        0,
      );
      const gem = kit.at(kit.mesh(kit.sphere(r * 0.14, 8), 'accent'), 0, r * 0.25, r * 1.15);
      // floating tilted halo above a ring of five outward-leaning spikes
      const halo = kit.at(kit.mesh(kit.ring(r * 1.5, r * 0.07, 24), 'glow'), 0, r * 1.35, 0, 100 * DEG);
      const spikes = [0, 72, 144, 216, 288].map((phi) => {
        const spike = kit.at(
          kit.mesh(kit.cone(r * 0.12, r * 0.7, 5), 'metal'),
          0,
          r * 1.15,
          r * 0.9,
          30 * DEG,
        );
        return kit.at(kit.group(spike), 0, 0, 0, 0, phi * DEG);
      });
      return {
        parts: [{ socket: 'head', object: kit.group(cap, brow, cheekL, cheekR, nape, gem, halo, ...spikes) }],
      };
    },
  },
];
