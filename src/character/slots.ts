import type { SlotId } from './types';

export type SocketId =
  | 'head'
  | 'neck'
  | 'chest'
  | 'back'
  | 'pelvis'
  | 'upperArmL'
  | 'upperArmR'
  | 'forearmL'
  | 'forearmR'
  | 'handL'
  | 'handR'
  | 'weapon'
  | 'thighL'
  | 'thighR'
  | 'shinL'
  | 'shinR'
  | 'footL'
  | 'footR';

export const SOCKET_IDS: readonly SocketId[] = [
  'head',
  'neck',
  'chest',
  'back',
  'pelvis',
  'upperArmL',
  'upperArmR',
  'forearmL',
  'forearmR',
  'handL',
  'handR',
  'weapon',
  'thighL',
  'thighR',
  'shinL',
  'shinR',
  'footL',
  'footR',
];

export interface SlotMeta {
  id: SlotId;
  label: string;
  /** may hold null (R-SLOT-02) */
  allowEmpty: boolean;
  /** symmetric left/right (R-SLOT-07) */
  paired: boolean;
  /** sockets an item in this slot may attach to (ASSET_CONTRACT §3.1) */
  sockets: readonly SocketId[];
  /** camera focus: target height as a fraction of body height, distance in metres at 1.8 m (UX §8) */
  focus: { y: number; dist: number; polar: number };
  hint: string;
}

export const SLOTS: Record<SlotId, SlotMeta> = {
  helmet: {
    id: 'helmet',
    label: 'Helmet',
    allowEmpty: true,
    paired: false,
    sockets: ['head'],
    focus: { y: 0.93, dist: 1.25, polar: 75 },
    hint: 'Full helms, half helms and masks',
  },
  headgear: {
    id: 'headgear',
    label: 'Headgear',
    allowEmpty: true,
    paired: false,
    sockets: ['head'],
    focus: { y: 0.93, dist: 1.25, polar: 75 },
    hint: 'Circlets, antennae, crests',
  },
  glasses: {
    id: 'glasses',
    label: 'Glasses',
    allowEmpty: true,
    paired: false,
    sockets: ['head'],
    focus: { y: 0.93, dist: 1.25, polar: 75 },
    hint: 'Visors, goggles, lenses',
  },
  neck: {
    id: 'neck',
    label: 'Neck',
    allowEmpty: true,
    paired: false,
    sockets: ['neck', 'chest'],
    focus: { y: 0.86, dist: 1.35, polar: 75 },
    hint: 'Collars, scarves, gorgets',
  },
  torso: {
    id: 'torso',
    label: 'Torso',
    allowEmpty: false,
    paired: false,
    sockets: ['chest', 'pelvis', 'neck', 'upperArmL', 'upperArmR', 'forearmL', 'forearmR'],
    focus: { y: 0.7, dist: 2.0, polar: 75 },
    hint: 'Chest plates and suits',
  },
  back: {
    id: 'back',
    label: 'Back',
    allowEmpty: true,
    paired: false,
    sockets: ['back'],
    focus: { y: 0.7, dist: 2.0, polar: 75 },
    hint: 'Wings, jetpacks, capes',
  },
  bracers: {
    id: 'bracers',
    label: 'Bracers',
    allowEmpty: true,
    paired: true,
    sockets: ['forearmL', 'forearmR'],
    focus: { y: 0.55, dist: 1.9, polar: 75 },
    hint: 'Forearm guards and gauntlet cuffs',
  },
  gloves: {
    id: 'gloves',
    label: 'Gloves',
    allowEmpty: true,
    paired: true,
    sockets: ['handL', 'handR'],
    focus: { y: 0.55, dist: 1.9, polar: 75 },
    hint: 'Gauntlets and grips',
  },
  weapon: {
    id: 'weapon',
    label: 'Weapon',
    allowEmpty: true,
    paired: false,
    sockets: ['weapon', 'handL'],
    focus: { y: 0.55, dist: 1.9, polar: 75 },
    hint: 'One- and two-handed',
  },
  legs: {
    id: 'legs',
    label: 'Legs',
    allowEmpty: false,
    paired: true,
    sockets: ['pelvis', 'thighL', 'thighR', 'shinL', 'shinR'],
    focus: { y: 0.35, dist: 2.1, polar: 75 },
    hint: 'Greaves, plating, undersuits',
  },
  boots: {
    id: 'boots',
    label: 'Boots',
    allowEmpty: true,
    paired: true,
    sockets: ['footL', 'footR', 'shinL', 'shinR'],
    focus: { y: 0.08, dist: 1.5, polar: 80 },
    hint: 'Boots and thrusters',
  },
};

export const FULL_BODY_FOCUS = { y: 0.5, dist: 4.3, polar: 80 };

export const slotList = (): SlotMeta[] => Object.values(SLOTS);
