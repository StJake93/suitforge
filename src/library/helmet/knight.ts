// Medieval / martial helmets: bucket great-helm, samurai kabuto, horned brute helm.
import { DEG } from '../kit';
import type { ItemDefinition } from '../types';

export const knight: ItemDefinition[] = [
  {
    id: 'helmet.great-helm',
    slot: 'helmet',
    name: 'Great Helm',
    tags: ['armour', 'heavy', 'full-face'],
    hides: ['glasses'],
    build: ({ ref, kit }) => {
      const r = ref.headRadius;
      // flat-topped bucket that swallows the whole head
      const bucket = kit.at(kit.mesh(kit.cyl(r * 1.2, r * 1.15, r * 2.2, 12), 'primary'), 0, 0, 0);
      const lid = kit.at(kit.mesh(kit.cyl(r * 1.22, r * 1.22, r * 0.12, 12), 'metal'), 0, r * 1.12, 0);
      const topBand = kit.at(
        kit.mesh(kit.cyl(r * 1.25, r * 1.25, r * 0.16, 12), 'secondary'),
        0,
        r * 0.92,
        0,
      );
      const rim = kit.at(kit.mesh(kit.cyl(r * 1.22, r * 1.27, r * 0.18, 12), 'secondary'), 0, -r * 1.02, 0);
      // eye slit and reinforcing cross on the face
      const slit = kit.at(kit.mesh(kit.box(r * 1.6, r * 0.14, r * 0.3), 'dark'), 0, r * 0.28, r * 1.12);
      const crossV = kit.at(kit.mesh(kit.box(r * 0.22, r * 1.15, r * 0.1), 'metal'), 0, -r * 0.45, r * 1.22);
      const crossH = kit.at(kit.mesh(kit.box(r * 1.3, r * 0.2, r * 0.1), 'metal'), 0, r * 0.05, r * 1.22);
      // breath vents either side of the vertical bar
      const ventL = kit.at(
        kit.mesh(kit.box(r * 0.45, r * 0.1, r * 0.08), 'accent'),
        r * 0.5,
        -r * 0.55,
        r * 1.2,
      );
      const ventR = kit.at(
        kit.mesh(kit.box(r * 0.45, r * 0.1, r * 0.08), 'accent'),
        -r * 0.5,
        -r * 0.55,
        r * 1.2,
      );
      return {
        parts: [
          {
            socket: 'head',
            object: kit.group(bucket, lid, topBand, rim, slit, crossV, crossH, ventL, ventR),
          },
        ],
      };
    },
  },
  {
    id: 'helmet.kabuto',
    slot: 'helmet',
    name: 'Kabuto',
    tags: ['armour', 'elegant', 'open-face'],
    build: ({ ref, kit }) => {
      const r = ref.headRadius;
      const bowl = kit.at(kit.mesh(kit.hemi(r * 1.18, 16), 'primary'), 0, r * 0.05, 0);
      const tehen = kit.at(kit.mesh(kit.ring(r * 0.2, r * 0.06, 12), 'metal'), 0, r * 1.2, 0, 90 * DEG);
      // three-lame neck guard flaring out behind
      const lame1 = kit.at(
        kit.mesh(kit.arc(r * 1.2, r * 1.45, r * 0.35, 90 * DEG, 180 * DEG, 14), 'secondary'),
        0,
        -r * 0.3,
        0,
      );
      const lame2 = kit.at(
        kit.mesh(kit.arc(r * 1.42, r * 1.65, r * 0.35, 95 * DEG, 170 * DEG, 14), 'secondary'),
        0,
        -r * 0.62,
        0,
      );
      const lame3 = kit.at(
        kit.mesh(kit.arc(r * 1.62, r * 1.85, r * 0.35, 100 * DEG, 160 * DEG, 14), 'primary'),
        0,
        -r * 0.94,
        0,
      );
      // short peak over the brow
      const peak = kit.at(
        kit.mesh(kit.box(r * 1.6, r * 0.08, r * 0.5), 'metal'),
        0,
        r * 0.15,
        r * 1.1,
        -12 * DEG,
      );
      // forked kuwagata crest with a central disc
      const hornL = kit.at(
        kit.mesh(kit.box(r * 0.12, r * 1.4, r * 0.06), 'accent'),
        r * 0.45,
        r * 1.3,
        r * 0.95,
        0,
        0,
        -25 * DEG,
      );
      const hornR = kit.at(
        kit.mesh(kit.box(r * 0.12, r * 1.4, r * 0.06), 'accent'),
        -r * 0.45,
        r * 1.3,
        r * 0.95,
        0,
        0,
        25 * DEG,
      );
      const disc = kit.at(
        kit.mesh(kit.cyl(r * 0.22, r * 0.22, r * 0.06, 12), 'glow'),
        0,
        r * 0.9,
        r * 1.1,
        90 * DEG,
      );
      // turned-back ear flaps
      const flapL = kit.at(
        kit.mesh(kit.plate(r * 0.5, r * 0.5, r * 0.06), 'secondary'),
        r * 1.2,
        r * 0.1,
        r * 0.6,
        0,
        40 * DEG,
      );
      const flapR = kit.at(
        kit.mesh(kit.plate(r * 0.5, r * 0.5, r * 0.06), 'secondary'),
        -r * 1.2,
        r * 0.1,
        r * 0.6,
        0,
        -40 * DEG,
      );
      return {
        parts: [
          {
            socket: 'head',
            object: kit.group(bowl, tehen, lame1, lame2, lame3, peak, hornL, hornR, disc, flapL, flapR),
          },
        ],
      };
    },
  },
  {
    id: 'helmet.brute-horns',
    slot: 'helmet',
    name: 'Brute Horn Helm',
    tags: ['brutal', 'heavy', 'open-face'],
    build: ({ ref, kit }) => {
      const r = ref.headRadius;
      // chunky low-poly skull cap with a riveted brow band
      const cap = kit.at(kit.mesh(kit.hemi(r * 1.2, 10), 'primary'), 0, 0, 0);
      const band = kit.at(kit.mesh(kit.cyl(r * 1.28, r * 1.28, r * 0.2, 10), 'dark'), 0, 0, 0);
      const cheekL = kit.at(
        kit.mesh(kit.box(r * 0.3, r * 1.2, r * 1.0), 'primary'),
        r * 1.1,
        -r * 0.5,
        r * 0.2,
      );
      const cheekR = kit.at(
        kit.mesh(kit.box(r * 0.3, r * 1.2, r * 1.0), 'primary'),
        -r * 1.1,
        -r * 0.5,
        r * 0.2,
      );
      const nasal = kit.at(kit.mesh(kit.box(r * 0.18, r * 1.0, r * 0.12), 'metal'), 0, -r * 0.15, r * 1.2);
      // big straight horns splayed out to the sides
      const hornL = kit.at(
        kit.mesh(kit.cone(r * 0.32, r * 1.7, 8), 'secondary'),
        r * 1.1,
        r * 0.9,
        -r * 0.1,
        0,
        0,
        -55 * DEG,
      );
      const hornR = kit.at(
        kit.mesh(kit.cone(r * 0.32, r * 1.7, 8), 'secondary'),
        -r * 1.1,
        r * 0.9,
        -r * 0.1,
        0,
        0,
        55 * DEG,
      );
      const bossL = kit.at(
        kit.mesh(kit.cyl(r * 0.4, r * 0.34, r * 0.3, 8), 'dark'),
        r * 0.85,
        r * 0.72,
        -r * 0.1,
        0,
        0,
        -55 * DEG,
      );
      const bossR = kit.at(
        kit.mesh(kit.cyl(r * 0.4, r * 0.34, r * 0.3, 8), 'dark'),
        -r * 0.85,
        r * 0.72,
        -r * 0.1,
        0,
        0,
        55 * DEG,
      );
      const rivets = [-0.7, 0, 0.7].map((x) =>
        kit.at(kit.mesh(kit.sphere(r * 0.08, 6), 'accent'), r * x, 0, r * Math.sqrt(1.28 * 1.28 - x * x)),
      );
      return {
        parts: [
          {
            socket: 'head',
            object: kit.group(cap, band, cheekL, cheekR, nasal, hornL, hornR, bossL, bossR, ...rivets),
          },
        ],
      };
    },
  },
];
