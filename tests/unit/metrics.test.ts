import { describe, expect, it } from 'vitest';
import { Vector3 } from 'three';
import { computeMetrics, REF, REF_BODY } from '@/character/metrics';
import { SOCKET_IDS } from '@/character/slots';
import { heightToMetres, type Body } from '@/character/types';

const body = (p: Partial<Body>): Body => ({ ...REF_BODY, ...p });

describe('computeMetrics (R-CHAR-04, R-CHAR-05, ASSET_CONTRACT §3)', () => {
  it('reference body yields unit socket scale on every axis', () => {
    for (const id of SOCKET_IDS) {
      const s = REF.sockets[id].scale;
      expect(s.x).toBeCloseTo(1, 6);
      expect(s.y).toBeCloseTo(1, 6);
      expect(s.z).toBeCloseTo(1, 6);
    }
  });

  it('height maps to 1.55–2.10 m and scales the whole skeleton', () => {
    const short = computeMetrics(body({ height: 0 }));
    const tall = computeMetrics(body({ height: 1 }));
    expect(short.heightM).toBeCloseTo(1.55);
    expect(tall.heightM).toBeCloseTo(2.1);
    expect(heightToMetres(0.5)).toBeCloseTo(1.825);
    expect(tall.headCenterY).toBeGreaterThan(short.headCenterY);
    expect(tall.thighLen / short.thighLen).toBeCloseTo(2.1 / 1.55, 5);
  });

  it('musculature widens shoulders and limbs but never changes height', () => {
    const slim = computeMetrics(body({ musculature: 0 }));
    const heavy = computeMetrics(body({ musculature: 1 }));
    expect(heavy.heightM).toBeCloseTo(slim.heightM);
    expect(heavy.headCenterY).toBeCloseTo(slim.headCenterY);
    expect(heavy.shoulderHalf).toBeGreaterThan(slim.shoulderHalf);
    expect(heavy.upperArmR).toBeGreaterThan(slim.upperArmR);
    expect(heavy.thighR).toBeGreaterThan(slim.thighR);
    expect(heavy.chestDepth).toBeGreaterThan(slim.chestDepth);
  });

  it('female body has narrower shoulders, wider hips and a bust; same gear sockets', () => {
    const f = computeMetrics(body({ sex: 'female' }));
    expect(f.shoulderHalf).toBeLessThan(REF.shoulderHalf);
    expect(f.pelvisHalfW).toBeGreaterThan(REF.pelvisHalfW);
    expect(f.bust).toBeGreaterThan(0);
    expect(Object.keys(f.sockets).sort()).toEqual([...SOCKET_IDS].sort());
  });

  it('limb sockets point +Y down the limb', () => {
    const m = REF;
    const down = new Vector3(0, 1, 0).applyQuaternion(m.sockets.thighL.quaternion);
    const expected = m.joints.kneeL.clone().sub(m.joints.hipL).normalize();
    expect(down.distanceTo(expected)).toBeLessThan(1e-6);
    const arm = new Vector3(0, 1, 0).applyQuaternion(m.sockets.forearmR.quaternion);
    const expectedArm = m.joints.wristR.clone().sub(m.joints.elbowR).normalize();
    expect(arm.distanceTo(expectedArm)).toBeLessThan(1e-6);
  });

  it('limb socket +Z faces forward for the legs', () => {
    const z = new Vector3(0, 0, 1).applyQuaternion(REF.sockets.shinR.quaternion);
    expect(z.z).toBeGreaterThan(0.95);
  });

  it('back socket faces backward', () => {
    const z = new Vector3(0, 0, 1).applyQuaternion(REF.sockets.back.quaternion);
    expect(z.z).toBeLessThan(-0.99);
  });

  it('feet rest on the ground', () => {
    for (const h of [0, 0.5, 1]) {
      const m = computeMetrics(body({ height: h }));
      expect(m.joints.ankleL.y - m.footH).toBeCloseTo(0, 6);
    }
  });
});

describe('pose solver (R-SLOT-04)', () => {
  const lenOk = (m: ReturnType<typeof computeMetrics>) => {
    for (const side of ['L', 'R'] as const) {
      const s = m.joints[`shoulder${side}`],
        e = m.joints[`elbow${side}`],
        w = m.joints[`wrist${side}`];
      expect(s.distanceTo(e)).toBeCloseTo(m.upperArmLen, 4);
      expect(e.distanceTo(w)).toBeCloseTo(m.forearmLen, 4);
    }
  };

  it('keeps segment lengths in every pose and mid-blend', () => {
    lenOk(computeMetrics(REF_BODY, { from: 'hero', to: 'hero', t: 0 }));
    lenOk(computeMetrics(REF_BODY, { from: 'hero', to: 'oneHand', t: 1 }));
    lenOk(computeMetrics(REF_BODY, { from: 'oneHand', to: 'twoHand', t: 1 }));
    lenOk(computeMetrics(REF_BODY, { from: 'hero', to: 'twoHand', t: 0.5 }));
    lenOk(
      computeMetrics(body({ sex: 'female', height: 0, musculature: 0 }), {
        from: 'hero',
        to: 'twoHand',
        t: 0.3,
      }),
    );
  });

  it('two-hand pose brings both hands in front of the chest', () => {
    const m = computeMetrics(REF_BODY, { from: 'twoHand', to: 'twoHand', t: 0 });
    expect(m.joints.wristL.z).toBeGreaterThan(m.chestDepth);
    expect(m.joints.wristR.z).toBeGreaterThan(m.chestDepth);
    expect(m.joints.grip.z).toBeGreaterThan(0.2);
  });

  it('weapon socket +Y points up-ish for one-hand and forward for two-hand', () => {
    const one = computeMetrics(REF_BODY, { from: 'oneHand', to: 'oneHand', t: 0 });
    const two = computeMetrics(REF_BODY, { from: 'twoHand', to: 'twoHand', t: 0 });
    expect(new Vector3(0, 1, 0).applyQuaternion(one.sockets.weapon.quaternion).y).toBeGreaterThan(0.9);
    expect(new Vector3(0, 1, 0).applyQuaternion(two.sockets.weapon.quaternion).z).toBeGreaterThan(0.8);
  });
});
