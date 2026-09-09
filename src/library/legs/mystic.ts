import type { ItemDefinition, ItemPart } from '../types';
import { legUndersuit } from './vanguard';

const HALF = Math.PI / 2;

function attach(parts: ItemPart[], socket: ItemPart['socket'], child: ItemPart['object']): void {
  parts.find((p) => p.socket === socket)!.object.add(child);
}

export const mystic: ItemDefinition[] = [
  {
    // Robe skirt: a wide tapered cone hanging from the pelvis to just above the knees, with a sash, a
    // contrasting hem band, a front tabard strip and a glowing belt gem, over plain leggings.
    id: 'legs.oracle-skirt',
    slot: 'legs',
    name: 'Oracle Skirt',
    tags: ['mystic', 'elegant'],
    build: (ctx) => {
      const { ref, kit } = ctx;
      const parts = legUndersuit(ctx, 'primary');
      const pw = ref.pelvisHalfW,
        pd = ref.pelvisDepth,
        hu = ref.hu;
      const zs = 0.8; // squash the round skirt toward the pelvis' oval section
      attach(
        parts,
        'pelvis',
        kit.group(
          kit.scaled(
            kit.at(kit.mesh(kit.cyl(pw * 1.08, pw * 1.6, hu * 1.45, 16), 'primary'), 0, -hu * 0.74, 0),
            1,
            1,
            zs,
          ),
          kit.scaled(
            kit.at(kit.mesh(kit.cyl(pw * 1.54, pw * 1.64, hu * 0.3, 16), 'secondary'), 0, -hu * 1.35, 0),
            1,
            1,
            zs,
          ),
          kit.scaled(
            kit.at(
              kit.mesh(kit.arc(pw * 1.12, pw * 1.66, hu * 1.4, -0.24, 0.48, 6), 'accent'),
              0,
              -hu * 0.74,
              0,
            ),
            1,
            1,
            zs,
          ),
          kit.scaled(
            kit.at(kit.mesh(kit.cyl(pw * 1.1, pw * 1.14, hu * 0.3, 14), 'secondary'), 0, hu * 0.1, 0),
            1,
            1,
            (pd * 1.2) / pw,
          ),
          kit.at(kit.mesh(kit.sphere(hu * 0.07, 8), 'glow'), 0, hu * 0.08, pd * 1.25),
        ),
      );
      return { parts };
    },
  },
  {
    // Cosmic carapace: faceted octagonal shell segments stacked down each leg, separated by glowing
    // seams, with a faceted knee and an eight-sided belt.
    id: 'legs.starborn-carapace',
    slot: 'legs',
    name: 'Starborn Carapace',
    tags: ['cosmic', 'armour', 'energy'],
    build: (ctx) => {
      const { ref, kit } = ctx;
      const parts = legUndersuit(ctx);
      const pw = ref.pelvisHalfW,
        pd = ref.pelvisDepth,
        hu = ref.hu;
      const tR = ref.thighR,
        tL = ref.thighLen,
        sR = ref.shinR,
        sL = ref.shinLen;
      attach(
        parts,
        'pelvis',
        kit.scaled(
          kit.at(kit.mesh(kit.cyl(pw * 1.12, pw * 1.12, hu * 0.16, 8), 'primary'), 0, hu * 0.06, 0),
          1,
          1,
          (pd * 1.15) / pw,
        ),
      );
      const [thighR, thighL] = kit.mirror(() =>
        kit.group(
          kit.at(kit.mesh(kit.cyl(tR * 1.38, tR * 1.28, tL * 0.3, 8), 'primary'), 0, tL * 0.2, 0),
          kit.at(kit.mesh(kit.cyl(tR * 1.28, tR * 1.18, tL * 0.28, 8), 'primary'), 0, tL * 0.58, 0),
          kit.at(kit.mesh(kit.ring(tR * 1.16, tR * 0.1, 16), 'glow'), 0, tL * 0.4, 0, HALF, 0, 0),
        ),
      );
      const [shinR, shinL] = kit.mirror(() =>
        kit.group(
          kit.at(kit.mesh(kit.sphere(sR * 1.3, 8), 'primary'), 0, sL * 0.04, sR * 0.4),
          kit.at(kit.mesh(kit.cyl(sR * 1.3, sR * 1.2, sL * 0.42, 8), 'primary'), 0, sL * 0.42, 0),
          kit.at(kit.mesh(kit.ring(sR * 1.1, sR * 0.1, 16), 'glow'), 0, sL * 0.72, 0, HALF, 0, 0),
        ),
      );
      attach(parts, 'thighR', thighR);
      attach(parts, 'thighL', thighL);
      attach(parts, 'shinR', shinR);
      attach(parts, 'shinL', shinL);
      return { parts };
    },
  },
];
