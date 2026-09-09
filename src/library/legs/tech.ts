import type { ItemDefinition, ItemPart } from '../types';
import { legUndersuit } from './vanguard';

const HALF = Math.PI / 2;

function attach(parts: ItemPart[], socket: ItemPart['socket'], child: ItemPart['object']): void {
  parts.find((p) => p.socket === socket)!.object.add(child);
}

export const tech: ItemDefinition[] = [
  {
    // Sleek stealth suit: primary-coloured undersuit, a utility belt with hip pouches, an asymmetric
    // drop-leg holster on the right thigh, a knife sheath on the left, and low kneepads with a shin stripe.
    id: 'legs.shadow-suit',
    slot: 'legs',
    name: 'Shadow Suit Legs',
    tags: ['stealth', 'tech', 'light'],
    build: (ctx) => {
      const { ref, kit } = ctx;
      const parts = legUndersuit(ctx, 'primary');
      const pw = ref.pelvisHalfW,
        pd = ref.pelvisDepth,
        hu = ref.hu;
      const tR = ref.thighR,
        tL = ref.thighLen,
        sR = ref.shinR,
        sL = ref.shinLen;
      const pouch = (x: number) =>
        kit.at(
          kit.mesh(kit.rbox(pw * 0.3, hu * 0.2, pd * 0.3, hu * 0.02), 'secondary'),
          x,
          -hu * 0.06,
          pd * 0.36,
        );
      attach(
        parts,
        'pelvis',
        kit.group(
          kit.scaled(
            kit.at(kit.mesh(kit.cyl(pw * 1.1, pw * 1.12, hu * 0.14, 14), 'dark'), 0, hu * 0.06, 0),
            1,
            1,
            (pd * 1.15) / pw,
          ),
          pouch(pw * 0.95),
          pouch(-pw * 0.95),
        ),
      );
      const strap = () =>
        kit.at(kit.mesh(kit.ring(tR * 1.04, tR * 0.12, 16), 'dark'), 0, tL * 0.3, 0, HALF, 0, 0);
      // right thigh: outer side is +X in limb-socket space
      attach(
        parts,
        'thighR',
        kit.group(
          strap(),
          kit.at(
            kit.mesh(kit.rbox(tR * 0.5, tL * 0.34, tR * 0.9, tR * 0.08), 'dark'),
            tR * 1.15,
            tL * 0.42,
            tR * 0.15,
          ),
          kit.at(
            kit.mesh(kit.rbox(tR * 0.24, tL * 0.14, tR * 0.5, tR * 0.04), 'metal'),
            tR * 1.15,
            tL * 0.2,
            -tR * 0.05,
            0.5,
            0,
            0,
          ),
        ),
      );
      // left thigh: outer side is -X
      attach(
        parts,
        'thighL',
        kit.group(
          strap(),
          kit.at(
            kit.mesh(kit.rbox(tR * 0.28, tL * 0.3, tR * 0.36, tR * 0.04), 'secondary'),
            -tR * 1.05,
            tL * 0.45,
            tR * 0.3,
          ),
        ),
      );
      const [shinR, shinL] = kit.mirror(() =>
        kit.group(
          kit.at(
            kit.mesh(kit.rbox(sR * 1.7, sL * 0.24, sR * 0.7, sR * 0.15), 'secondary'),
            0,
            sL * 0.1,
            sR * 0.78,
          ),
          kit.at(kit.mesh(kit.box(sR * 0.18, sL * 0.5, sR * 0.1), 'accent'), 0, sL * 0.55, sR * 1.05),
        ),
      );
      attach(parts, 'shinR', shinR);
      attach(parts, 'shinL', shinL);
      return { parts };
    },
  },
  {
    // Exo-frame: thin metal struts running down the outside of each leg with glowing hip and knee
    // joints, hip actuator pods, and a slim shin plate. Silhouette is the undersuit plus hard outer rails.
    id: 'legs.exo-frame',
    slot: 'legs',
    name: 'Exo-Frame Legs',
    tags: ['tech', 'energy', 'utility'],
    build: (ctx) => {
      const { ref, kit } = ctx;
      const parts = legUndersuit(ctx, 'primary');
      const pw = ref.pelvisHalfW,
        pd = ref.pelvisDepth,
        hu = ref.hu;
      const tR = ref.thighR,
        tL = ref.thighLen,
        sR = ref.shinR,
        sL = ref.shinLen;
      const pod = (x: number) =>
        kit.at(kit.mesh(kit.rbox(pw * 0.36, hu * 0.34, pd * 0.6, hu * 0.03), 'secondary'), x, -hu * 0.02, 0);
      attach(parts, 'pelvis', kit.group(pod(pw * 1.02), pod(-pw * 1.02)));
      const [thighR, thighL] = kit.mirror(() =>
        kit.group(
          kit.at(kit.mesh(kit.box(tR * 0.3, tL * 0.8, tR * 0.45), 'metal'), tR * 1.22, tL * 0.5, 0),
          kit.at(kit.mesh(kit.sphere(tR * 0.38, 10), 'glow'), tR * 1.22, tL * 0.08, 0),
          kit.at(kit.mesh(kit.sphere(tR * 0.34, 10), 'glow'), tR * 1.22, tL * 0.94, 0),
        ),
      );
      const [shinR, shinL] = kit.mirror(() =>
        kit.group(
          kit.at(kit.mesh(kit.box(sR * 0.34, sL * 0.78, sR * 0.5), 'metal'), sR * 1.35, sL * 0.45, 0),
          kit.at(
            kit.mesh(kit.rbox(sR * 1.5, sL * 0.6, sR * 0.5, sR * 0.12), 'secondary'),
            0,
            sL * 0.45,
            sR * 0.95,
          ),
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
