import { DEG } from '../kit';
import type { BuildContext, ItemDefinition, ItemPart } from '../types';

/** Undersuit sleeves for upper arms and forearms, shared by suit-style torsos. */
export function sleeves({ ref, kit }: BuildContext, role: 'secondary' | 'primary' = 'secondary'): ItemPart[] {
  const ua = () =>
    kit.group(
      kit.at(kit.mesh(kit.sphere(ref.upperArmR * 1.24, 14), role), 0, 0, 0),
      kit.at(
        kit.mesh(kit.cyl(ref.upperArmR * 1.06, ref.upperArmR * 1.02, ref.upperArmLen, 12), role),
        0,
        ref.upperArmLen * 0.5,
        0,
      ),
      kit.at(kit.mesh(kit.sphere(ref.forearmR * 1.04, 12), role), 0, ref.upperArmLen, 0),
    );
  const fa = () =>
    kit.group(
      kit.at(
        kit.mesh(kit.cyl(ref.forearmR * 1.08, ref.forearmR * 1.0, ref.forearmLen, 12), role),
        0,
        ref.forearmLen * 0.5,
        0,
      ),
      kit.at(kit.mesh(kit.sphere(ref.forearmR * 0.8, 10), role), 0, ref.forearmLen, 0),
    );
  return [
    { socket: 'upperArmR', object: ua() },
    { socket: 'upperArmL', object: ua() },
    { socket: 'forearmR', object: fa() },
    { socket: 'forearmL', object: fa() },
  ];
}

/** Body-hugging undersuit for the chest and pelvis. */
export function undersuitCore({ ref, kit }: BuildContext): ItemPart[] {
  const cw = ref.chestHalfW * 2,
    cd = ref.chestDepth,
    cl = ref.chestLen;
  const chest = kit.at(
    kit.mesh(kit.rbox(cw * 1.04, cl * 0.58, cd * 1.06, cd * 0.22), 'secondary'),
    0,
    cl * 0.2,
    0,
  );
  const abdomen = kit.at(
    kit.mesh(
      kit.rbox(ref.waistHalfW * 2 * 1.05, cl * 0.5, ref.waistDepth * 1.08, ref.waistDepth * 0.2),
      'secondary',
    ),
    0,
    -cl * 0.28,
    0,
  );
  const pelvis = kit.at(
    kit.mesh(
      kit.rbox(ref.pelvisHalfW * 2 * 1.04, ref.hu * 0.62, ref.pelvisDepth * 1.06, ref.pelvisDepth * 0.2),
      'secondary',
    ),
    0,
    0,
    0,
  );
  return [
    { socket: 'chest', object: kit.group(chest, abdomen) },
    { socket: 'pelvis', object: pelvis },
  ];
}

export const vanguard: ItemDefinition[] = [
  {
    id: 'torso.undersuit',
    slot: 'torso',
    name: 'Undersuit',
    tags: ['light', 'stealth'],
    build: (ctx) => ({ parts: [...undersuitCore(ctx), ...sleeves(ctx)] }),
  },
  {
    id: 'torso.vanguard-plate',
    slot: 'torso',
    name: 'Vanguard Plate',
    tags: ['armour', 'tech', 'heavy'],
    build: (ctx) => {
      const { ref, kit } = ctx;
      const cw = ref.chestHalfW * 2,
        cd = ref.chestDepth,
        cl = ref.chestLen;
      const core = undersuitCore(ctx);
      const chestPlate = kit.at(
        kit.mesh(kit.plate(cw * 1.14, cl * 0.6, cd * 0.34, cw * 0.14), 'primary'),
        0,
        cl * 0.16,
        cd * 0.42,
      );
      const backPlate = kit.at(
        kit.mesh(kit.plate(cw * 1.12, cl * 0.66, cd * 0.3, cw * 0.14), 'primary'),
        0,
        cl * 0.12,
        -cd * 0.42,
      );
      const ab1 = kit.at(
        kit.mesh(kit.plate(cw * 0.78, cl * 0.13, cd * 0.24, cw * 0.06), 'secondary'),
        0,
        -cl * 0.24,
        ref.waistDepth * 0.5,
      );
      const ab2 = kit.at(
        kit.mesh(kit.plate(cw * 0.72, cl * 0.13, cd * 0.24, cw * 0.06), 'secondary'),
        0,
        -cl * 0.4,
        ref.waistDepth * 0.48,
      );
      const emblem = kit.at(
        kit.mesh(kit.prism(6, cw * 0.11, cd * 0.12), 'glow'),
        0,
        cl * 0.2,
        cd * 0.62,
        90 * DEG,
      );
      const chestGroup = core[0]!.object;
      chestGroup.add(chestPlate, backPlate, ab1, ab2, emblem);
      const belt = kit.at(
        kit.mesh(
          kit.rbox(ref.pelvisHalfW * 2 * 1.12, ref.hu * 0.16, ref.pelvisDepth * 1.14, ref.hu * 0.03),
          'primary',
        ),
        0,
        ref.hu * 0.22,
        0,
      );
      const buckle = kit.at(
        kit.mesh(kit.rbox(ref.hu * 0.2, ref.hu * 0.14, ref.hu * 0.06, ref.hu * 0.02), 'accent'),
        0,
        ref.hu * 0.22,
        ref.pelvisDepth * 0.58,
      );
      core[1]!.object.add(belt, buckle);
      const pauldron = () => {
        const r = ref.upperArmR * 2.1;
        const dome = kit.at(kit.mesh(kit.hemi(r, 14), 'primary'), 0, ref.upperArmR * 0.4, 0, 180 * DEG);
        const trim = kit.at(
          kit.mesh(kit.ring(r * 0.98, r * 0.09, 18), 'accent'),
          0,
          ref.upperArmR * 0.42,
          0,
          90 * DEG,
        );
        return kit.group(dome, trim);
      };
      const parts: ItemPart[] = [...core, ...sleeves(ctx)];
      parts.find((p) => p.socket === 'upperArmR')!.object.add(pauldron());
      parts.find((p) => p.socket === 'upperArmL')!.object.add(pauldron());
      return { parts };
    },
  },
];
