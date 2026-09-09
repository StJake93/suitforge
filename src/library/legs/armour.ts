import type { ItemDefinition, ItemPart } from '../types';
import { legUndersuit } from './vanguard';

const HALF = Math.PI / 2;

function attach(parts: ItemPart[], socket: ItemPart['socket'], child: ItemPart['object']): void {
  parts.find((p) => p.socket === socket)!.object.add(child);
}

export const armour: ItemDefinition[] = [
  {
    // Heavy, wide, segmented plate greaves: two overlapping thigh lames, a huge domed knee with a
    // ridge on top, a bell-shaped shin flare. Reads much wider than the undersuit at thumbnail size.
    id: 'legs.bastion-greaves',
    slot: 'legs',
    name: 'Bastion Greaves',
    tags: ['armour', 'heavy'],
    build: (ctx) => {
      const { ref, kit } = ctx;
      const parts = legUndersuit(ctx, 'primary');
      const tR = ref.thighR,
        tL = ref.thighLen,
        sR = ref.shinR,
        sL = ref.shinLen;
      const [thighR, thighL] = kit.mirror(() =>
        kit.group(
          // upper cuisse wrapping the front and sides
          kit.at(
            kit.mesh(kit.arc(tR * 1.42, tR * 1.34, tL * 0.34, -1.8, 3.6, 12), 'primary'),
            0,
            tL * 0.22,
            0,
          ),
          // lower lame, overlapping the cuisse
          kit.at(
            kit.mesh(kit.arc(tR * 1.34, tR * 1.24, tL * 0.32, -1.6, 3.2, 12), 'secondary'),
            0,
            tL * 0.52,
            0,
          ),
        ),
      );
      const [shinR, shinL] = kit.mirror(() =>
        kit.group(
          // oversized knee dome
          kit.at(kit.mesh(kit.sphere(sR * 1.62, 12), 'primary'), 0, sL * 0.05, sR * 0.55),
          // knee ridge
          kit.at(kit.mesh(kit.prism(3, sR * 0.45, sL * 0.26), 'metal'), 0, sL * 0.05, sR * 1.55, HALF, 0, 0),
          // front shin plate
          kit.at(
            kit.mesh(kit.arc(sR * 1.34, sR * 1.4, sL * 0.5, -1.4, 2.8, 12), 'secondary'),
            0,
            sL * 0.5,
            0,
          ),
          // bell flare above the ankle
          kit.at(kit.mesh(kit.cyl(sR * 1.3, sR * 1.7, sL * 0.16, 12), 'primary'), 0, sL * 0.86, 0),
        ),
      );
      attach(parts, 'thighR', thighR);
      attach(parts, 'thighL', thighL);
      attach(parts, 'shinR', shinR);
      attach(parts, 'shinL', shinL);
      return { parts };
    },
  },
  {
    // Brute loincloth: bare legs (skin shows), a heavy belt with a buckle and skull stud, a long tapered
    // front flap and a shorter back flap, and only leather straps around the thighs and shins.
    id: 'legs.war-loincloth',
    slot: 'legs',
    name: 'War Loincloth',
    tags: ['brutal', 'light', 'melee'],
    build: ({ ref, kit }) => {
      const pw = ref.pelvisHalfW,
        pd = ref.pelvisDepth,
        hu = ref.hu;
      const tR = ref.thighR,
        tL = ref.thighLen,
        sR = ref.shinR,
        sL = ref.shinLen;
      const belt = kit.scaled(
        kit.at(kit.mesh(kit.cyl(pw * 1.12, pw * 1.16, hu * 0.22, 14), 'dark'), 0, hu * 0.02, 0),
        1,
        1,
        (pd * 1.15) / pw,
      );
      const buckle = kit.at(
        kit.mesh(kit.rbox(pw * 0.42, hu * 0.18, pd * 0.16, hu * 0.02), 'metal'),
        0,
        hu * 0.02,
        pd * 0.62,
      );
      const stud = kit.at(kit.mesh(kit.sphere(hu * 0.06, 8), 'accent'), 0, hu * 0.02, pd * 0.74);
      // tapered flaps: a 4-sided cylinder turned 45° and squashed in z gives a trapezoid slab
      const front = kit.scaled(
        kit.at(
          kit.mesh(kit.cyl(pw * 0.42, pw * 0.72, hu * 1.42, 4), 'primary'),
          0,
          -hu * 0.78,
          pd * 0.5,
          0.06,
          Math.PI / 4,
          0,
        ),
        1,
        1,
        0.12,
      );
      const back = kit.scaled(
        kit.at(
          kit.mesh(kit.cyl(pw * 0.5, pw * 0.66, hu * 1.05, 4), 'secondary'),
          0,
          -hu * 0.6,
          -pd * 0.5,
          -0.06,
          Math.PI / 4,
          0,
        ),
        1,
        1,
        0.12,
      );
      const pelvis = kit.group(belt, buckle, stud, front, back);

      const [thighR, thighL] = kit.mirror(() =>
        kit.group(
          kit.at(kit.mesh(kit.ring(tR * 1.06, tR * 0.14, 16), 'dark'), 0, tL * 0.58, 0, HALF, 0, 0),
          kit.at(
            kit.mesh(kit.rbox(tR * 0.34, tR * 0.34, tR * 0.2, tR * 0.05), 'metal'),
            tR * 1.1,
            tL * 0.58,
            0,
          ),
        ),
      );
      const [shinR, shinL] = kit.mirror(() =>
        kit.group(
          kit.at(kit.mesh(kit.ring(sR * 1.06, sR * 0.16, 16), 'dark'), 0, sL * 0.3, 0, HALF, 0, 0),
          kit.at(kit.mesh(kit.ring(sR * 1.0, sR * 0.16, 16), 'dark'), 0, sL * 0.62, 0, HALF, 0, 0),
          kit.at(
            kit.mesh(kit.rbox(sR * 0.4, sR * 0.36, sR * 0.2, sR * 0.05), 'metal'),
            0,
            sL * 0.62,
            sR * 1.05,
          ),
        ),
      );
      return {
        parts: [
          { socket: 'pelvis', object: pelvis },
          { socket: 'thighR', object: thighR },
          { socket: 'thighL', object: thighL },
          { socket: 'shinR', object: shinR },
          { socket: 'shinL', object: shinL },
        ],
      };
    },
  },
];
