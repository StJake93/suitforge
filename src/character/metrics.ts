// computeMetrics: body → joint positions, radii and socket transforms (ARCHITECTURE §3, ASSET_CONTRACT §3).
// Pure, allocation-light, cheap enough to call every frame during pose blends.
import { Quaternion, Vector3 } from 'three';
import type { SocketId } from './slots';
import { blendPose, orient, solvePose, type PoseId, type PoseSolution } from './pose';
import { heightToMetres, type Body } from './types';

export interface SocketTransform {
  position: Vector3;
  quaternion: Quaternion;
  scale: Vector3;
}

export interface BodyMetrics {
  heightM: number;
  /** head unit: height / 7.5 */
  hu: number;
  sex: Body['sex'];
  musculature: number;
  // head & neck
  headRadius: number;
  headCenterY: number;
  neckBaseY: number;
  neckLen: number;
  neckRadius: number;
  // torso
  shoulderY: number;
  shoulderHalf: number;
  chestY: number;
  chestHalfW: number;
  chestDepth: number;
  chestLen: number;
  waistY: number;
  waistHalfW: number;
  waistDepth: number;
  pelvisY: number;
  pelvisHalfW: number;
  pelvisDepth: number;
  hipY: number;
  hipHalf: number;
  bust: number;
  // limbs
  upperArmLen: number;
  forearmLen: number;
  handLen: number;
  upperArmR: number;
  forearmR: number;
  handSize: number;
  thighLen: number;
  shinLen: number;
  thighR: number;
  shinR: number;
  footLen: number;
  footH: number;
  footW: number;
  joints: {
    shoulderL: Vector3;
    shoulderR: Vector3;
    elbowL: Vector3;
    elbowR: Vector3;
    wristL: Vector3;
    wristR: Vector3;
    hipL: Vector3;
    hipR: Vector3;
    kneeL: Vector3;
    kneeR: Vector3;
    ankleL: Vector3;
    ankleR: Vector3;
    grip: Vector3;
  };
  sockets: Record<SocketId, SocketTransform>;
}

export interface PoseBlend {
  from: PoseId;
  to: PoseId;
  t: number;
}

const HERO: PoseBlend = { from: 'hero', to: 'hero', t: 0 };
const UPV = new Vector3(0, 1, 0);

const FWD = new Vector3(0, 0, 1);
const DOWN = new Vector3(0, -1, 0);
/** Limb socket orientation: +Y along the limb, +Z as close to world-forward as possible (ASSET_CONTRACT §3). */
function dirQuat(from: Vector3, to: Vector3): Quaternion {
  const d = new Vector3().subVectors(to, from).normalize();
  return orient(d, Math.abs(d.dot(FWD)) > 0.9 ? DOWN : FWD);
}

/** Static (pose-independent) proportions. */
function proportions(body: Body) {
  const H = heightToMetres(body.height);
  const hu = H / 7.5;
  const m = body.musculature;
  const f = body.sex === 'female';
  const headRadius = 0.5 * hu * (f ? 0.96 : 1);
  const shoulderHalf = hu * (f ? 0.82 + 0.22 * m : 0.95 + 0.3 * m);
  const chestHalfW = hu * (f ? 0.6 + 0.14 * m : 0.68 + 0.2 * m);
  const chestDepth = hu * (f ? 0.5 + 0.14 * m : 0.56 + 0.22 * m);
  const waistHalfW = hu * (f ? 0.46 + 0.1 * m : 0.56 + 0.16 * m);
  const waistDepth = hu * (f ? 0.42 + 0.1 * m : 0.48 + 0.16 * m);
  const pelvisHalfW = hu * (f ? 0.72 + 0.08 * m : 0.64 + 0.12 * m);
  const pelvisDepth = hu * (f ? 0.5 + 0.08 * m : 0.5 + 0.1 * m);
  const hipHalf = hu * (f ? 0.42 : 0.4);
  return {
    H,
    hu,
    headRadius,
    neckRadius: hu * (f ? 0.15 + 0.06 * m : 0.18 + 0.09 * m),
    shoulderHalf,
    chestHalfW,
    chestDepth,
    waistHalfW,
    waistDepth,
    pelvisHalfW,
    pelvisDepth,
    hipHalf,
    bust: f ? hu * 0.2 : 0,
    upperArmR: hu * (f ? 0.14 + 0.1 * m : 0.16 + 0.14 * m),
    forearmR: hu * (f ? 0.12 + 0.08 * m : 0.14 + 0.11 * m),
    handSize: hu * (f ? 0.62 : 0.68),
    thighR: hu * (f ? 0.24 + 0.1 * m : 0.25 + 0.13 * m),
    shinR: hu * (f ? 0.17 + 0.07 * m : 0.18 + 0.09 * m),
  };
}

export function computeMetrics(body: Body, pose: PoseBlend = HERO): BodyMetrics {
  const p = proportions(body);
  const { hu } = p;
  // vertical landmarks (in head units from the ground)
  const ankleY = 0.35 * hu;
  const kneeY = 2.15 * hu;
  const hipY = 3.95 * hu;
  const pelvisY = 4.15 * hu;
  const waistY = 4.7 * hu;
  const chestY = 5.5 * hu;
  const shoulderY = 6.2 * hu;
  const neckBaseY = 6.3 * hu;
  const headCenterY = p.H - p.headRadius;
  const neckLen = headCenterY - p.headRadius * 0.75 - neckBaseY;
  const chestLen = shoulderY - waistY;

  const upperArmLen = 1.4 * hu;
  const forearmLen = 1.15 * hu;
  const handLen = 0.7 * hu;
  const thighLen = hipY - kneeY;
  const shinLen = kneeY - ankleY;
  const footLen = 1.05 * hu;
  const footH = ankleY;
  const footW = 0.42 * hu;

  const shoulderL = new Vector3(p.shoulderHalf, shoulderY, 0);
  const shoulderR = new Vector3(-p.shoulderHalf, shoulderY, 0);
  const hipL = new Vector3(p.hipHalf, hipY, 0);
  const hipR = new Vector3(-p.hipHalf, hipY, 0);
  const stance = p.hipHalf * 1.35;
  const ankleL = new Vector3(stance, ankleY, 0.02 * hu);
  const ankleR = new Vector3(-stance, ankleY, 0.02 * hu);
  const kneeL = hipL
    .clone()
    .lerp(ankleL, thighLen / (thighLen + shinLen))
    .add(new Vector3(0, 0, 0.03 * hu));
  const kneeR = hipR
    .clone()
    .lerp(ankleR, thighLen / (thighLen + shinLen))
    .add(new Vector3(0, 0, 0.03 * hu));

  const rig = {
    hu,
    shoulderL,
    shoulderR,
    upperArmLen,
    forearmLen,
    handLen,
    chestY,
    chestDepth: p.chestDepth,
    hipY,
  };
  let sol: PoseSolution = solvePose(rig, pose.from);
  if (pose.to !== pose.from && pose.t > 0) sol = blendPose(sol, solvePose(rig, pose.to), pose.t, rig);

  const scale = (x: number, y: number, z: number) => new Vector3(x, y, z);
  const back = new Quaternion().setFromAxisAngle(UPV, Math.PI);
  const toeOutL = new Quaternion().setFromAxisAngle(UPV, 0.12);
  const toeOutR = new Quaternion().setFromAxisAngle(UPV, -0.12);
  const handQL = dirQuat(sol.L.elbow, sol.L.wrist);
  const handQR = dirQuat(sol.R.elbow, sol.R.wrist);

  // socket scales are ratios against REF; REF itself is computed with ratios of 1 (see below)
  const r = REF_PROPS;
  // cuffs must stay outside the adjoining limb at heavy builds: widen hands/feet with the forearm/shin radius
  const handXZ = Math.max(p.handSize / r.handSize, p.forearmR / r.forearmR);
  const footXZ = Math.max(footLen / r.footLen, p.shinR / r.shinR);
  const sockets: Record<SocketId, SocketTransform> = {
    head: {
      position: new Vector3(0, headCenterY, 0),
      quaternion: new Quaternion(),
      scale: scale(p.headRadius / r.headRadius, p.headRadius / r.headRadius, p.headRadius / r.headRadius),
    },
    neck: {
      position: new Vector3(0, neckBaseY, 0),
      quaternion: new Quaternion(),
      scale: scale(p.neckRadius / r.neckRadius, neckLen / r.neckLen, p.neckRadius / r.neckRadius),
    },
    chest: {
      position: new Vector3(0, chestY, 0),
      quaternion: new Quaternion(),
      scale: scale(p.shoulderHalf / r.shoulderHalf, chestLen / r.chestLen, p.chestDepth / r.chestDepth),
    },
    back: {
      position: new Vector3(0, chestY, -p.chestDepth * 0.5),
      quaternion: back,
      scale: scale(p.shoulderHalf / r.shoulderHalf, chestLen / r.chestLen, hu / r.hu),
    },
    pelvis: {
      position: new Vector3(0, pelvisY, 0),
      quaternion: new Quaternion(),
      scale: scale(p.pelvisHalfW / r.pelvisHalfW, hu / r.hu, p.pelvisDepth / r.pelvisDepth),
    },
    upperArmL: {
      position: shoulderL,
      quaternion: dirQuat(shoulderL, sol.L.elbow),
      scale: scale(p.upperArmR / r.upperArmR, upperArmLen / r.upperArmLen, p.upperArmR / r.upperArmR),
    },
    upperArmR: {
      position: shoulderR,
      quaternion: dirQuat(shoulderR, sol.R.elbow),
      scale: scale(p.upperArmR / r.upperArmR, upperArmLen / r.upperArmLen, p.upperArmR / r.upperArmR),
    },
    forearmL: {
      position: sol.L.elbow,
      quaternion: dirQuat(sol.L.elbow, sol.L.wrist),
      scale: scale(p.forearmR / r.forearmR, forearmLen / r.forearmLen, p.forearmR / r.forearmR),
    },
    forearmR: {
      position: sol.R.elbow,
      quaternion: dirQuat(sol.R.elbow, sol.R.wrist),
      scale: scale(p.forearmR / r.forearmR, forearmLen / r.forearmLen, p.forearmR / r.forearmR),
    },
    handL: {
      position: sol.L.wrist,
      quaternion: handQL,
      scale: scale(handXZ, p.handSize / r.handSize, handXZ),
    },
    handR: {
      position: sol.R.wrist,
      quaternion: handQR,
      scale: scale(handXZ, p.handSize / r.handSize, handXZ),
    },
    weapon: {
      position: sol.grip,
      quaternion: sol.weapon,
      scale: scale(p.handSize / r.handSize, p.handSize / r.handSize, p.handSize / r.handSize),
    },
    thighL: {
      position: hipL,
      quaternion: dirQuat(hipL, kneeL),
      scale: scale(p.thighR / r.thighR, thighLen / r.thighLen, p.thighR / r.thighR),
    },
    thighR: {
      position: hipR,
      quaternion: dirQuat(hipR, kneeR),
      scale: scale(p.thighR / r.thighR, thighLen / r.thighLen, p.thighR / r.thighR),
    },
    shinL: {
      position: kneeL,
      quaternion: dirQuat(kneeL, ankleL),
      scale: scale(p.shinR / r.shinR, shinLen / r.shinLen, p.shinR / r.shinR),
    },
    shinR: {
      position: kneeR,
      quaternion: dirQuat(kneeR, ankleR),
      scale: scale(p.shinR / r.shinR, shinLen / r.shinLen, p.shinR / r.shinR),
    },
    footL: {
      position: ankleL,
      quaternion: toeOutL,
      scale: scale(footXZ, footLen / r.footLen, footXZ),
    },
    footR: {
      position: ankleR,
      quaternion: toeOutR,
      scale: scale(footXZ, footLen / r.footLen, footXZ),
    },
  };

  return {
    heightM: p.H,
    hu,
    sex: body.sex,
    musculature: body.musculature,
    headRadius: p.headRadius,
    headCenterY,
    neckBaseY,
    neckLen,
    neckRadius: p.neckRadius,
    shoulderY,
    shoulderHalf: p.shoulderHalf,
    chestY,
    chestHalfW: p.chestHalfW,
    chestDepth: p.chestDepth,
    chestLen,
    waistY,
    waistHalfW: p.waistHalfW,
    waistDepth: p.waistDepth,
    pelvisY,
    pelvisHalfW: p.pelvisHalfW,
    pelvisDepth: p.pelvisDepth,
    hipY,
    hipHalf: p.hipHalf,
    bust: p.bust,
    upperArmLen,
    forearmLen,
    handLen,
    upperArmR: p.upperArmR,
    forearmR: p.forearmR,
    handSize: p.handSize,
    thighLen,
    shinLen,
    thighR: p.thighR,
    shinR: p.shinR,
    footLen,
    footH,
    footW,
    joints: {
      shoulderL,
      shoulderR,
      elbowL: sol.L.elbow,
      elbowR: sol.R.elbow,
      wristL: sol.L.wrist,
      wristR: sol.R.wrist,
      hipL,
      hipR,
      kneeL,
      kneeR,
      ankleL,
      ankleR,
      grip: sol.grip,
    },
    sockets,
  };
}

/** The reference body every item is authored against (ASSET_CONTRACT §1). */
export const REF_BODY: Body = { sex: 'male', skinTone: '#c68642', height: 0.5, musculature: 0.5 };

// Reference proportions used as the denominator for socket scales. Computed from the same formulas so
// that the reference body yields socket scale = 1 on every axis.
const REF_PROPS = (() => {
  const p = proportions(REF_BODY);
  const hu = p.hu;
  const ankleY = 0.35 * hu;
  const kneeY = 2.15 * hu;
  const hipY = 3.95 * hu;
  const waistY = 4.7 * hu;
  const shoulderY = 6.2 * hu;
  const neckBaseY = 6.3 * hu;
  const headCenterY = p.H - p.headRadius;
  return {
    ...p,
    neckLen: headCenterY - p.headRadius * 0.75 - neckBaseY,
    chestLen: shoulderY - waistY,
    upperArmLen: 1.4 * hu,
    forearmLen: 1.15 * hu,
    thighLen: hipY - kneeY,
    shinLen: kneeY - ankleY,
    footLen: 1.05 * hu,
  };
})();

export const REF: BodyMetrics = computeMetrics(REF_BODY);
