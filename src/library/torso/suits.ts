// Suit-style torsos: full skin coverage via undersuitCore + sleeves, with a hero or operator read.
import { DEG } from '../kit';
import type { ItemDefinition, ItemPart } from '../types';
import { sleeves, undersuitCore } from './vanguard';

const part = (parts: ItemPart[], socket: ItemPart['socket']) =>
  parts.find((p) => p.socket === socket)!.object;

export const suits: ItemDefinition[] = [
  {
    id: 'torso.sleek-emblem',
    slot: 'torso',
    name: 'Sleek Emblem Suit',
    tags: ['tech', 'light', 'energy'],
    build: (ctx) => {
      const { ref, kit } = ctx;
      const cw = ref.chestHalfW,
        cd = ref.chestDepth,
        cl = ref.chestLen;
      const parts: ItemPart[] = [...undersuitCore(ctx), ...sleeves(ctx, 'primary')];
      // slim pectoral panels either side of a glowing diamond emblem
      const pec = (x: number) =>
        kit.at(
          kit.mesh(kit.rbox(cw * 0.8, cl * 0.3, cd * 0.14, cd * 0.04), 'primary'),
          x,
          cl * 0.24,
          cd * 0.5,
          0,
          0,
          x > 0 ? -6 * DEG : 6 * DEG,
        );
      const emblem = kit.at(
        kit.mesh(kit.prism(4, cw * 0.22, cd * 0.1), 'glow'),
        0,
        cl * 0.14,
        cd * 0.56,
        90 * DEG,
      );
      part(parts, 'chest').add(pec(cw * 0.5), pec(-cw * 0.5), emblem);
      const cap = () =>
        kit.at(kit.mesh(kit.sphere(ref.upperArmR * 1.4, 12), 'primary'), 0, ref.upperArmR * 0.1, 0);
      part(parts, 'upperArmR').add(cap());
      part(parts, 'upperArmL').add(cap());
      const collar = kit.at(
        kit.mesh(kit.cyl(ref.neckRadius * 1.25, ref.neckRadius * 1.4, ref.neckLen * 0.3, 12), 'primary'),
        0,
        ref.neckLen * 0.12,
        0,
      );
      const belt = kit.at(
        kit.mesh(
          kit.rbox(ref.pelvisHalfW * 2 * 1.08, ref.hu * 0.1, ref.pelvisDepth * 1.1, ref.hu * 0.02),
          'primary',
        ),
        0,
        ref.hu * 0.22,
        0,
      );
      part(parts, 'pelvis').add(belt);
      parts.push({ socket: 'neck', object: kit.group(collar) });
      return { parts };
    },
  },
  {
    id: 'torso.retro-hero',
    slot: 'torso',
    name: 'Retro Hero Suit',
    tags: ['retro', 'light', 'elegant'],
    build: (ctx) => {
      const { ref, kit } = ctx;
      const cw = ref.chestHalfW,
        cd = ref.chestDepth,
        cl = ref.chestLen;
      const parts: ItemPart[] = [...undersuitCore(ctx), ...sleeves(ctx, 'primary')];
      // primary bodysuit over the core, contrasting leotard trunks, a big chest shield with a downward
      // triangle, and a V neckline
      const body = kit.at(
        kit.mesh(kit.rbox(cw * 2 * 1.06, cl * 0.6, cd * 1.1, cd * 0.22), 'primary'),
        0,
        cl * 0.2,
        0,
      );
      const waist = kit.at(
        kit.mesh(
          kit.rbox(ref.waistHalfW * 2 * 1.08, cl * 0.5, ref.waistDepth * 1.12, ref.waistDepth * 0.2),
          'primary',
        ),
        0,
        -cl * 0.28,
        0,
      );
      const trunks = kit.at(
        kit.mesh(
          kit.rbox(ref.pelvisHalfW * 2 * 1.1, ref.hu * 0.7, ref.pelvisDepth * 1.12, ref.pelvisDepth * 0.2),
          'secondary',
        ),
        0,
        ref.hu * 0.02,
        0,
      );
      const belt = kit.at(
        kit.mesh(
          kit.rbox(ref.pelvisHalfW * 2 * 1.14, ref.hu * 0.14, ref.pelvisDepth * 1.16, ref.hu * 0.03),
          'secondary',
        ),
        0,
        ref.hu * 0.3,
        0,
      );
      const buckle = kit.at(
        kit.mesh(kit.rbox(ref.hu * 0.16, ref.hu * 0.11, ref.hu * 0.05, ref.hu * 0.015), 'glow'),
        0,
        ref.hu * 0.3,
        ref.pelvisDepth * 0.6,
      );
      part(parts, 'pelvis').add(trunks, belt, buckle);
      const shield = kit.at(
        kit.mesh(kit.prism(5, cw * 0.42, cd * 0.06), 'accent'),
        0,
        cl * 0.18,
        cd * 0.6,
        90 * DEG,
      );
      const symbol = kit.at(
        kit.mesh(kit.prism(3, cw * 0.24, cd * 0.05), 'glow'),
        0,
        cl * 0.16,
        cd * 0.66,
        90 * DEG,
      );
      const vee = (x: number) =>
        kit.at(
          kit.mesh(kit.rbox(cw * 0.16, cl * 0.42, cd * 0.08, cd * 0.02), 'secondary'),
          x,
          cl * 0.38,
          cd * 0.56,
          0,
          0,
          x > 0 ? -35 * DEG : 35 * DEG,
        );
      part(parts, 'chest').add(body, waist, shield, symbol, vee(cw * 0.42), vee(-cw * 0.42));
      return { parts };
    },
  },
  {
    id: 'torso.stealth-harness',
    slot: 'torso',
    name: 'Stealth Harness',
    tags: ['stealth', 'utility', 'light'],
    build: (ctx) => {
      const { ref, kit } = ctx;
      const cw = ref.chestHalfW,
        cd = ref.chestDepth,
        cl = ref.chestLen;
      const parts: ItemPart[] = [...undersuitCore(ctx), ...sleeves(ctx)];
      // crossed straps over the chest, a low rig plate with pouches, flat shoulder pads
      const strap = (rz: number) =>
        kit.at(
          kit.mesh(kit.rbox(cw * 0.2, cl * 0.85, cd * 0.08, cd * 0.02), 'dark'),
          0,
          cl * 0.1,
          cd * 0.52,
          0,
          0,
          rz,
        );
      const rig = kit.at(
        kit.mesh(kit.rbox(cw * 0.9, cl * 0.24, cd * 0.16, cd * 0.03), 'primary'),
        0,
        cl * 0.06,
        cd * 0.55,
      );
      const pouch = (x: number) =>
        kit.at(
          kit.mesh(kit.rbox(cw * 0.24, cl * 0.14, cd * 0.14, cd * 0.03), 'primary'),
          x,
          -cl * 0.12,
          cd * 0.6,
        );
      part(parts, 'chest').add(
        strap(30 * DEG),
        strap(-30 * DEG),
        rig,
        pouch(cw * 0.3),
        pouch(-cw * 0.3),
        pouch(0),
      );
      const pad = () =>
        kit.at(
          kit.mesh(
            kit.rbox(ref.upperArmR * 2.4, ref.upperArmR * 0.9, ref.upperArmR * 2.2, ref.upperArmR * 0.2),
            'primary',
          ),
          0,
          ref.upperArmR * 0.15,
          0,
        );
      part(parts, 'upperArmR').add(pad());
      part(parts, 'upperArmL').add(pad());
      const belt = kit.at(
        kit.mesh(
          kit.rbox(ref.pelvisHalfW * 2 * 1.1, ref.hu * 0.12, ref.pelvisDepth * 1.12, ref.hu * 0.02),
          'dark',
        ),
        0,
        ref.hu * 0.22,
        0,
      );
      const hip = kit.at(
        kit.mesh(kit.rbox(ref.hu * 0.16, ref.hu * 0.2, ref.hu * 0.14, ref.hu * 0.02), 'primary'),
        -ref.pelvisHalfW * 0.95,
        ref.hu * 0.12,
        ref.pelvisDepth * 0.2,
      );
      part(parts, 'pelvis').add(belt, hip);
      return { parts };
    },
  },
];
