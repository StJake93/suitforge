// Arm posing for the three poses (R-SLOT-04). Positions are solved in world space for the un-rotated
// character (facing +Z, +X = character's left). Blending happens on solved joints, then segment lengths
// are re-enforced, which keeps blends robust between angle-driven and IK-driven poses.
import { Quaternion, Vector3 } from 'three';

export type PoseId = 'hero' | 'oneHand' | 'twoHand';

export interface ArmSolution {
  elbow: Vector3;
  wrist: Vector3;
}

export interface PoseSolution {
  L: ArmSolution;
  R: ArmSolution;
  /** world orientation of the weapon socket (+Y long axis, +Z away from palm) */
  weapon: Quaternion;
  /** world position of the grip point (fist centre of the right hand) */
  grip: Vector3;
}

/** Skeleton inputs the pose solver needs. */
export interface ArmRig {
  hu: number;
  shoulderL: Vector3;
  shoulderR: Vector3;
  upperArmLen: number;
  forearmLen: number;
  handLen: number;
  chestY: number;
  chestDepth: number;
  hipY: number;
}

const UP = new Vector3(0, 1, 0);
const tmpA = new Vector3();
const tmpB = new Vector3();
const tmpC = new Vector3();

/** Direction for an upper arm from abduction (out to the side) and flexion (forward) angles, in radians. */
function limbDir(abduct: number, flex: number, side: 1 | -1): Vector3 {
  // start pointing down, rotate outward about Z (sign by side), then forward about X
  const d = new Vector3(0, -1, 0);
  d.applyAxisAngle(new Vector3(0, 0, 1), abduct * side);
  d.applyAxisAngle(new Vector3(1, 0, 0), -flex);
  return d.normalize();
}

/** Two-bone IK. Elbow bends toward `pole`. */
export function twoBoneIK(S: Vector3, T: Vector3, L1: number, L2: number, pole: Vector3): ArmSolution {
  const dir = tmpA.copy(T).sub(S);
  let d = dir.length();
  dir.normalize();
  const maxReach = (L1 + L2) * 0.999;
  const minReach = Math.abs(L1 - L2) * 1.001 + 1e-4;
  if (d > maxReach) d = maxReach;
  if (d < minReach) d = minReach;
  const cosA = (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d);
  const a = Math.acos(Math.max(-1, Math.min(1, cosA)));
  // pole direction orthogonal to dir
  const p = tmpB.copy(pole).sub(S);
  p.addScaledVector(dir, -p.dot(dir));
  if (p.lengthSq() < 1e-8) p.set(0, -1, 0).addScaledVector(dir, -dir.y);
  p.normalize();
  const elbow = new Vector3().copy(S).addScaledVector(dir, L1 * Math.cos(a)).addScaledVector(p, L1 * Math.sin(a));
  const wrist = new Vector3().copy(S).addScaledVector(dir, d);
  return { elbow, wrist };
}

function fromAngles(S: Vector3, side: 1 | -1, rig: ArmRig, abduct: number, flex: number, elbowBend: number): ArmSolution {
  const upper = limbDir(abduct, flex, side);
  const elbow = new Vector3().copy(S).addScaledVector(upper, rig.upperArmLen);
  // forearm: rotate the upper direction forward (about the local X axis) by elbowBend, slightly inward
  const fore = upper.clone();
  const axis = tmpC.set(1, 0, 0);
  fore.applyAxisAngle(axis, -elbowBend);
  fore.applyAxisAngle(UP, -0.25 * side);
  fore.normalize();
  const wrist = new Vector3().copy(elbow).addScaledVector(fore, rig.forearmLen);
  return { elbow, wrist };
}

export function orient(yAxis: Vector3, zHint: Vector3): Quaternion {
  const y = yAxis.clone().normalize();
  const z = zHint.clone().addScaledVector(y, -zHint.dot(y)).normalize();
  const x = new Vector3().crossVectors(y, z).normalize();
  const m = [x.x, x.y, x.z, y.x, y.y, y.z, z.x, z.y, z.z];
  // build quaternion from rotation matrix columns x,y,z
  const q = new Quaternion();
  const m00 = m[0]!, m10 = m[1]!, m20 = m[2]!, m01 = m[3]!, m11 = m[4]!, m21 = m[5]!, m02 = m[6]!, m12 = m[7]!, m22 = m[8]!;
  const tr = m00 + m11 + m22;
  if (tr > 0) {
    const s = 0.5 / Math.sqrt(tr + 1);
    q.set((m21 - m12) * s, (m02 - m20) * s, (m10 - m01) * s, 0.25 / s);
  } else if (m00 > m11 && m00 > m22) {
    const s = 2 * Math.sqrt(1 + m00 - m11 - m22);
    q.set(0.25 * s, (m01 + m10) / s, (m02 + m20) / s, (m21 - m12) / s);
  } else if (m11 > m22) {
    const s = 2 * Math.sqrt(1 + m11 - m00 - m22);
    q.set((m01 + m10) / s, 0.25 * s, (m12 + m21) / s, (m02 - m20) / s);
  } else {
    const s = 2 * Math.sqrt(1 + m22 - m00 - m11);
    q.set((m02 + m20) / s, (m12 + m21) / s, 0.25 * s, (m10 - m01) / s);
  }
  return q.normalize();
}

const DEG = Math.PI / 180;

export function solvePose(rig: ArmRig, pose: PoseId): PoseSolution {
  const { hu } = rig;
  const heroL = fromAngles(rig.shoulderL, 1, rig, 24 * DEG, 6 * DEG, 22 * DEG);
  const heroR = fromAngles(rig.shoulderR, -1, rig, 24 * DEG, 6 * DEG, 22 * DEG);
  const poleL = rig.shoulderL.clone().add(new Vector3(1.2, -1, -0.8));
  const poleR = rig.shoulderR.clone().add(new Vector3(-1.2, -1, -0.8));

  if (pose === 'hero') {
    const grip = heroR.wrist.clone().add(new Vector3(0, -0.5 * rig.handLen, 0));
    return { L: heroL, R: heroR, weapon: orient(new Vector3(0, 1, 0), new Vector3(0, 0, 1)), grip };
  }

  if (pose === 'oneHand') {
    // sword-at-ready: fist in front of the right hip, blade up and slightly forward
    const grip = new Vector3(rig.shoulderR.x - 0.35 * hu, rig.hipY + 0.55 * hu, 1.25 * hu);
    const first = twoBoneIK(rig.shoulderR, grip, rig.upperArmLen, rig.forearmLen, poleR);
    const foreDir = tmpA.copy(first.wrist).sub(first.elbow).normalize();
    const wristTarget = grip.clone().addScaledVector(foreDir, -0.5 * rig.handLen);
    const R = twoBoneIK(rig.shoulderR, wristTarget, rig.upperArmLen, rig.forearmLen, poleR);
    const weapon = orient(new Vector3(0.05, 1, 0.18), new Vector3(0, 0, 1));
    return { L: heroL, R, weapon, grip };
  }

  // twoHand: rifle across the body, right hand on the grip, left hand on the foregrip
  const aim = new Vector3(0.32, 0.12, 1).normalize();
  const grip = new Vector3(-0.35 * hu, rig.chestY - 1.0 * hu, rig.chestDepth * 0.5 + 0.9 * hu);
  const foregrip = grip.clone().addScaledVector(aim, 0.3 * (rig.handLen / 0.17));
  const solveTo = (S: Vector3, target: Vector3, pole: Vector3) => {
    const first = twoBoneIK(S, target, rig.upperArmLen, rig.forearmLen, pole);
    const foreDir = tmpA.copy(first.wrist).sub(first.elbow).normalize();
    const wristTarget = target.clone().addScaledVector(foreDir, -0.5 * rig.handLen);
    return twoBoneIK(S, wristTarget, rig.upperArmLen, rig.forearmLen, pole);
  };
  const R = solveTo(rig.shoulderR, grip, poleR.clone().add(new Vector3(-0.3, -0.6, 0)));
  const L = solveTo(rig.shoulderL, foregrip, poleL.clone().add(new Vector3(0.3, -0.8, 0)));
  const weapon = orient(aim, new Vector3(0, 1, 0));
  return { L, R, weapon, grip };
}

/** Blend two solutions, re-enforcing segment lengths so limbs never stretch. */
export function blendPose(a: PoseSolution, b: PoseSolution, t: number, rig: ArmRig): PoseSolution {
  if (t <= 0) return a;
  if (t >= 1) return b;
  const arm = (x: ArmSolution, y: ArmSolution, S: Vector3): ArmSolution => {
    const elbow = x.elbow.clone().lerp(y.elbow, t);
    const wrist = x.wrist.clone().lerp(y.wrist, t);
    elbow.sub(S).setLength(rig.upperArmLen).add(S);
    wrist.sub(elbow).setLength(rig.forearmLen).add(elbow);
    return { elbow, wrist };
  };
  return {
    L: arm(a.L, b.L, rig.shoulderL),
    R: arm(a.R, b.R, rig.shoulderR),
    weapon: a.weapon.clone().slerp(b.weapon, t),
    grip: a.grip.clone().lerp(b.grip, t),
  };
}

export const ease = (t: number): number => 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3);
