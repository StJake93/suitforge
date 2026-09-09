// Mystic and organic torsos: a belted arcane tabard, bark-and-leaf armour and a segmented cosmic carapace.
import { DEG } from '../kit';
import type { ItemDefinition, ItemPart } from '../types';
import { sleeves, undersuitCore } from './vanguard';

const part = (parts: ItemPart[], socket: ItemPart['socket']) =>
  parts.find((p) => p.socket === socket)!.object;

export const mystic: ItemDefinition[] = [
  {
    id: 'torso.arcane-tabard',
    slot: 'torso',
    name: 'Arcane Tabard',
    tags: ['mystic', 'elegant'],
    build: (ctx) => {
      const { ref, kit } = ctx;
      const cw = ref.chestHalfW,
        cd = ref.chestDepth,
        cl = ref.chestLen;
      // robe sleeves with bell cuffs, a long front tabard hanging past the hips, sash, flared shoulder pads and a chest gem
      const parts: ItemPart[] = [...undersuitCore(ctx), ...sleeves(ctx, 'primary')];
      const cuff = () =>
        kit.at(
          kit.mesh(kit.cyl(ref.forearmR * 1.1, ref.forearmR * 1.9, ref.forearmLen * 0.35, 12), 'primary'),
          0,
          ref.forearmLen * 0.8,
          0,
        );
      part(parts, 'forearmR').add(cuff());
      part(parts, 'forearmL').add(cuff());
      const tabard = kit.at(
        kit.mesh(kit.plate(cw * 0.9, cl * 0.9, cd * 0.08, cw * 0.1), 'primary'),
        0,
        -cl * 0.2,
        cd * 0.6,
      );
      const sash = kit.at(
        kit.mesh(kit.rbox(ref.waistHalfW * 2 * 1.2, cl * 0.1, ref.waistDepth * 1.25, cd * 0.03), 'accent'),
        0,
        -cl * 0.42,
        0,
      );
      const gem = kit.at(kit.mesh(kit.sphere(cw * 0.14, 10), 'glow'), 0, cl * 0.32, cd * 0.58);
      const bezel = kit.at(kit.mesh(kit.ring(cw * 0.17, cw * 0.03, 12), 'metal'), 0, cl * 0.32, cd * 0.6);
      part(parts, 'chest').add(tabard, sash, gem, bezel);
      const skirt = kit.at(
        kit.mesh(kit.plate(ref.pelvisHalfW * 1.0, ref.hu * 0.9, cd * 0.08, ref.pelvisHalfW * 0.1), 'primary'),
        0,
        -ref.hu * 0.12,
        ref.pelvisDepth * 0.62,
      );
      part(parts, 'pelvis').add(skirt);
      const pad = () =>
        kit.at(
          kit.mesh(kit.cyl(ref.upperArmR * 1.4, ref.upperArmR * 2.1, ref.upperArmR * 0.7, 8), 'primary'),
          0,
          ref.upperArmR * 0.1,
          0,
        );
      part(parts, 'upperArmR').add(pad());
      part(parts, 'upperArmL').add(pad());
      const collar = kit.at(
        kit.mesh(kit.cyl(ref.neckRadius * 1.4, ref.neckRadius * 1.7, ref.neckLen * 0.6, 8), 'primary'),
        0,
        ref.neckLen * 0.2,
        0,
      );
      parts.push({ socket: 'neck', object: kit.group(collar) });
      return { parts };
    },
  },
  {
    id: 'torso.bark-armour',
    slot: 'torso',
    name: 'Bark Armour',
    tags: ['nature', 'armour'],
    build: (ctx) => {
      const { ref, kit } = ctx;
      const cw = ref.chestHalfW,
        cd = ref.chestDepth,
        cl = ref.chestLen;
      // three angled bark slabs on the chest, flat leaf blades over the shoulders, a knotted root belt
      const parts: ItemPart[] = [...undersuitCore(ctx), ...sleeves(ctx)];
      const slab = (x: number, ry: number, rz: number) =>
        kit.at(
          kit.mesh(kit.rbox(cw * 0.55, cl * 0.72, cd * 0.22, cd * 0.03), 'primary'),
          x,
          cl * 0.14,
          cd * 0.48,
          0,
          ry,
          rz,
        );
      const backSlab = kit.at(
        kit.mesh(kit.rbox(cw * 1.2, cl * 0.7, cd * 0.2, cd * 0.03), 'primary'),
        0,
        cl * 0.12,
        -cd * 0.5,
      );
      part(parts, 'chest').add(
        slab(-cw * 0.58, -18 * DEG, 4 * DEG),
        slab(0, 0, -3 * DEG),
        slab(cw * 0.58, 18 * DEG, -5 * DEG),
        backSlab,
      );
      const leaf = () =>
        kit.scaled(
          kit.at(
            kit.mesh(kit.cone(ref.upperArmR * 1.5, ref.upperArmR * 3.4, 4), 'secondary'),
            0,
            ref.upperArmR * 1.5,
            0,
          ),
          1,
          1,
          0.45,
        );
      part(parts, 'upperArmR').add(leaf());
      part(parts, 'upperArmL').add(leaf());
      const roots = kit.at(
        kit.mesh(kit.cyl(ref.pelvisHalfW * 1.25, ref.pelvisHalfW * 1.28, ref.hu * 0.14, 7), 'primary'),
        0,
        ref.hu * 0.24,
        0,
      );
      const seed = kit.at(
        kit.mesh(kit.sphere(ref.hu * 0.06, 8), 'glow'),
        0,
        ref.hu * 0.24,
        ref.pelvisHalfW * 1.22,
      );
      part(parts, 'pelvis').add(roots, seed);
      const collar = kit.at(
        kit.mesh(kit.cyl(ref.neckRadius * 1.4, ref.neckRadius * 1.9, ref.neckLen * 0.5, 7), 'primary'),
        0,
        ref.neckLen * 0.2,
        0,
      );
      parts.push({ socket: 'neck', object: kit.group(collar) });
      return { parts };
    },
  },
  {
    id: 'torso.cosmic-carapace',
    slot: 'torso',
    name: 'Cosmic Carapace',
    tags: ['cosmic', 'armour', 'energy'],
    build: (ctx) => {
      const { ref, kit } = ctx;
      const cw = ref.chestHalfW,
        cd = ref.chestDepth,
        cl = ref.chestLen;
      // stacked horizontal carapace bands with glowing seams, orb shoulders and a core light
      const parts: ItemPart[] = [...undersuitCore(ctx), ...sleeves(ctx)];
      const band = (y: number, w: number, d: number) =>
        kit.at(kit.mesh(kit.rbox(w, cl * 0.14, d, cd * 0.06), 'primary'), 0, y, 0);
      const seam = (y: number, w: number, d: number) =>
        kit.at(kit.mesh(kit.rbox(w, cl * 0.03, d, cd * 0.01), 'glow'), 0, y, 0);
      const ww = ref.waistHalfW * 2,
        wd = ref.waistDepth;
      part(parts, 'chest').add(
        band(cl * 0.32, cw * 2 * 1.12, cd * 1.2),
        band(cl * 0.14, cw * 2 * 1.1, cd * 1.18),
        band(-cl * 0.08, ww * 1.22, wd * 1.28),
        band(-cl * 0.28, ww * 1.16, wd * 1.24),
        seam(cl * 0.23, cw * 2 * 1.06, cd * 1.14),
        seam(-cl * 0.18, ww * 1.14, wd * 1.2),
        kit.at(kit.mesh(kit.sphere(cw * 0.16, 8), 'glow'), 0, cl * 0.14, cd * 0.62),
      );
      const orb = () =>
        kit.at(kit.mesh(kit.sphere(ref.upperArmR * 1.9, 8), 'primary'), 0, ref.upperArmR * 0.3, 0);
      part(parts, 'upperArmR').add(orb());
      part(parts, 'upperArmL').add(orb());
      const hipBand = kit.at(
        kit.mesh(
          kit.rbox(ref.pelvisHalfW * 2 * 1.16, ref.hu * 0.18, ref.pelvisDepth * 1.2, ref.hu * 0.04),
          'primary',
        ),
        0,
        ref.hu * 0.2,
        0,
      );
      part(parts, 'pelvis').add(hipBand);
      return { parts };
    },
  },
];
