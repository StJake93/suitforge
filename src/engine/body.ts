// The base humanoid, authored like an item against REF (ARCHITECTURE §3). Socket scales adapt it.
import { REF } from '@/character/metrics';
import { kit } from '@/library/kit';
import type { Sex } from '@/character/types';
import type { ItemBuild } from '@/library/types';

const cache = new Map<Sex, ItemBuild>();

export function buildBody(sex: Sex): ItemBuild {
  const hit = cache.get(sex);
  if (hit) return hit;
  const r = REF;
  const f = sex === 'female';
  const skin = 'skin' as const;

  // head with simple eyes
  const head = kit.scaled(kit.mesh(kit.sphere(r.headRadius, 20), skin), 0.96, 1.1, 1);
  const jaw = kit.at(
    kit.scaled(kit.mesh(kit.sphere(r.headRadius * 0.82, 14), skin), 1, 0.9, 0.95),
    0,
    -r.headRadius * 0.42,
    r.headRadius * 0.08,
  );
  const eyeL = kit.at(
    kit.mesh(kit.sphere(r.headRadius * 0.09, 8), 'dark'),
    r.headRadius * 0.34,
    r.headRadius * 0.1,
    r.headRadius * 0.9,
  );
  const eyeR = kit.at(
    kit.mesh(kit.sphere(r.headRadius * 0.09, 8), 'dark'),
    -r.headRadius * 0.34,
    r.headRadius * 0.1,
    r.headRadius * 0.9,
  );
  const headGroup = kit.group(head, jaw, eyeL, eyeR);

  const neck = kit.at(
    kit.mesh(kit.cyl(r.neckRadius * 0.95, r.neckRadius, r.neckLen * 1.6, 12), skin),
    0,
    r.neckLen * 0.55,
    0,
  );

  const cw = r.chestHalfW * 2,
    cd = r.chestDepth,
    cl = r.chestLen;
  const chest = kit.at(
    kit.scaled(kit.mesh(kit.sphere(1, 18), skin), cw * 0.5, cl * 0.36, cd * 0.5),
    0,
    cl * 0.18,
    0,
  );
  const upper = kit.at(kit.mesh(kit.rbox(cw * 0.96, cl * 0.5, cd * 0.96, cd * 0.3), skin), 0, cl * 0.22, 0);
  const abdomen = kit.at(
    kit.scaled(
      kit.mesh(kit.sphere(1, 16), skin),
      r.waistHalfW * (f ? 0.88 : 1),
      cl * 0.36,
      r.waistDepth * 0.5,
    ),
    0,
    -cl * 0.22,
    0,
  );
  const chestParts = [chest, upper, abdomen];
  if (f) {
    const b = r.hu * 0.2;
    chestParts.push(kit.at(kit.mesh(kit.sphere(b, 12), skin), cw * 0.22, cl * 0.18, cd * 0.38));
    chestParts.push(kit.at(kit.mesh(kit.sphere(b, 12), skin), -cw * 0.22, cl * 0.18, cd * 0.38));
  }
  const chestGroup = kit.group(...chestParts);

  const pelvis = kit.at(
    kit.scaled(
      kit.mesh(kit.sphere(1, 16), skin),
      r.pelvisHalfW * (f ? 1.0 : 0.98),
      r.hu * 0.36,
      r.pelvisDepth * 0.5,
    ),
    0,
    -r.hu * 0.02,
    0,
  );
  const pelvisBox = kit.at(
    kit.mesh(kit.rbox(r.pelvisHalfW * 1.9, r.hu * 0.5, r.pelvisDepth * 0.96, r.pelvisDepth * 0.3), skin),
    0,
    r.hu * 0.08,
    0,
  );
  const pelvisGroup = kit.group(pelvis, pelvisBox);

  const limb = (rad: number, len: number, jointR: number, endR: number) =>
    kit.group(
      kit.at(kit.mesh(kit.sphere(jointR, 14), skin), 0, 0, 0),
      kit.at(kit.mesh(kit.cyl(rad, rad * 0.86, len, 14), skin), 0, len * 0.5, 0),
      kit.at(kit.mesh(kit.sphere(endR, 12), skin), 0, len, 0),
    );
  const upperArm = () => limb(r.upperArmR, r.upperArmLen, r.upperArmR * 1.18, r.forearmR * 0.98);
  const forearm = () => limb(r.forearmR, r.forearmLen, r.forearmR * 0.9, r.forearmR * 0.72);
  const hand = () =>
    kit.at(
      kit.mesh(kit.rbox(r.handSize * 0.5, r.handLen * 0.95, r.handSize * 0.3, r.handSize * 0.08), skin),
      0,
      r.handLen * 0.48,
      0,
    );
  const thigh = () => limb(r.thighR, r.thighLen, r.thighR * 1.05, r.shinR * 1.1);
  const shin = () => limb(r.shinR, r.shinLen, r.shinR * 0.98, r.shinR * 0.75);
  const foot = () =>
    kit.at(
      kit.mesh(kit.rbox(r.footW, r.footH * 0.9, r.footLen, r.footH * 0.2), skin),
      0,
      -r.footH * 0.5,
      r.footLen * 0.28,
    );

  const build: ItemBuild = {
    parts: [
      { socket: 'head', object: headGroup },
      { socket: 'neck', object: neck },
      { socket: 'chest', object: chestGroup },
      { socket: 'pelvis', object: pelvisGroup },
      { socket: 'upperArmL', object: upperArm() },
      { socket: 'upperArmR', object: upperArm() },
      { socket: 'forearmL', object: forearm() },
      { socket: 'forearmR', object: forearm() },
      { socket: 'handL', object: hand() },
      { socket: 'handR', object: hand() },
      { socket: 'thighL', object: thigh() },
      { socket: 'thighR', object: thigh() },
      { socket: 'shinL', object: shin() },
      { socket: 'shinR', object: shin() },
      { socket: 'footL', object: foot() },
      { socket: 'footR', object: foot() },
    ],
  };
  cache.set(sex, build);
  return build;
}
