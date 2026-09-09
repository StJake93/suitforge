// R-GEN-01 — deterministic name generator with ≥ 5 patterns, seeded by category and sex.
import type { Sex } from '@/character/types';
import { mulberry32, type Rng } from './rng';

const ADJ = {
  common: ['Iron', 'Silent', 'Crimson', 'Golden', 'Shadow', 'Steel', 'Night', 'Storm', 'Solar', 'Lunar', 'Grim', 'Bright', 'Wild', 'Swift', 'Silver', 'Obsidian', 'Radiant', 'Hollow', 'Azure', 'Scarlet', 'Onyx', 'Ivory', 'Cobalt', 'Ember', 'Frost', 'Thunder', 'Void', 'Neon', 'Chrome', 'Titan'],
  energy: ['Volt', 'Plasma', 'Arc', 'Photon', 'Ion', 'Pulse', 'Flare', 'Surge', 'Fusion', 'Blaze'],
  tech: ['Chrome', 'Circuit', 'Nano', 'Binary', 'Servo', 'Quantum', 'Cyber', 'Vector', 'Delta', 'Omega'],
  elemental: ['Ember', 'Frost', 'Tempest', 'Granite', 'Tidal', 'Cinder', 'Glacier', 'Gale', 'Magma', 'Rime'],
  cosmic: ['Nova', 'Stellar', 'Astral', 'Nebula', 'Orbital', 'Eclipse', 'Comet', 'Zenith', 'Quasar', 'Meteor'],
  mystic: ['Arcane', 'Rune', 'Hex', 'Spirit', 'Occult', 'Sigil', 'Veiled', 'Ancient', 'Sacred', 'Warden'],
  might: ['Titan', 'Iron', 'Colossal', 'Brute', 'Rampart', 'Granite', 'Anvil', 'Juggernaut', 'Bastion', 'Mammoth'],
  speed: ['Swift', 'Blur', 'Sonic', 'Flash', 'Dash', 'Rapid', 'Streak', 'Zephyr', 'Bolt', 'Velocity'],
  stealth: ['Shadow', 'Silent', 'Phantom', 'Ghost', 'Umbral', 'Midnight', 'Smoke', 'Wraith', 'Cloak', 'Spectre'],
  psionic: ['Mind', 'Psi', 'Astral', 'Thought', 'Echo', 'Dream', 'Cerebral', 'Lucid', 'Inner', 'Prism'],
  nature: ['Thorn', 'Bloom', 'Fang', 'Root', 'Wild', 'Feral', 'Verdant', 'Briar', 'Moss', 'Talon'],
} as const;

const NOUN = {
  common: ['Sentinel', 'Guardian', 'Warden', 'Knight', 'Ranger', 'Hunter', 'Striker', 'Paladin', 'Vanguard', 'Shield', 'Blade', 'Hawk', 'Wolf', 'Falcon', 'Lion', 'Raven', 'Viper', 'Phoenix', 'Titan', 'Comet', 'Spectre', 'Lance', 'Herald', 'Reaper', 'Marshal', 'Nomad', 'Sabre', 'Bastion', 'Vortex', 'Cipher'],
  energy: ['Spark', 'Surge', 'Bolt', 'Beam', 'Flare', 'Arc', 'Charge', 'Ray', 'Circuit', 'Pulse'],
  tech: ['Unit', 'Engine', 'Protocol', 'Frame', 'Mech', 'Drone', 'Core', 'Array', 'Module', 'Matrix'],
  elemental: ['Storm', 'Flame', 'Tide', 'Quake', 'Frost', 'Gale', 'Blaze', 'Avalanche', 'Ash', 'Torrent'],
  cosmic: ['Star', 'Nova', 'Horizon', 'Orbit', 'Pulsar', 'Eclipse', 'Comet', 'Void', 'Aurora', 'Meridian'],
  mystic: ['Oracle', 'Warlock', 'Seer', 'Sage', 'Mystic', 'Witch', 'Conjurer', 'Adept', 'Hexen', 'Augur'],
  might: ['Fist', 'Hammer', 'Anvil', 'Wall', 'Crusher', 'Behemoth', 'Goliath', 'Colossus', 'Ram', 'Bulwark'],
  speed: ['Streak', 'Flash', 'Dash', 'Blur', 'Bolt', 'Rush', 'Zephyr', 'Sprint', 'Velocity', 'Arrow'],
  stealth: ['Shade', 'Wraith', 'Phantom', 'Ghost', 'Shadow', 'Whisper', 'Smoke', 'Veil', 'Mask', 'Silhouette'],
  psionic: ['Mind', 'Echo', 'Psyche', 'Thought', 'Dreamer', 'Oracle', 'Prism', 'Trance', 'Aura', 'Cortex'],
  nature: ['Thorn', 'Fang', 'Talon', 'Root', 'Bloom', 'Bramble', 'Grove', 'Beast', 'Vine', 'Claw'],
} as const;

const PREFIX = ['Volt', 'Arc', 'Nova', 'Sky', 'Iron', 'Night', 'Star', 'Storm', 'Sun', 'Moon', 'Neo', 'Ultra', 'Mega', 'Hyper', 'Astro', 'Cryo', 'Pyro', 'Aero', 'Geo', 'Chrono', 'Umbra', 'Lux', 'Ferro', 'Tele', 'Omni'];
const SUFFIX = ['strike', 'blade', 'wing', 'fire', 'storm', 'shade', 'hawk', 'fist', 'star', 'wave', 'knight', 'shot', 'burst', 'runner', 'dancer', 'bringer', 'breaker', 'walker', 'shard', 'flare'];
const TITLE_M = ['Captain', 'Doctor', 'Lord', 'Mister', 'Agent', 'Commander', 'Sir', 'Baron', 'Marshal', 'Professor'];
const TITLE_F = ['Captain', 'Doctor', 'Lady', 'Miss', 'Agent', 'Commander', 'Dame', 'Baroness', 'Marshal', 'Professor'];
const CODENAME = ['Alpha', 'Zero', 'Prime', 'Vector', 'Omega', 'Nine', 'Seven', 'Echo', 'Sigma', 'Halo', 'X', 'Ultra'];

type CatKey = keyof typeof ADJ;

function pools(category: string | null) {
  const key = (category && category in ADJ ? category : 'common') as CatKey;
  const adj = key === 'common' ? ADJ.common : [...ADJ[key], ...ADJ.common];
  const noun = key === 'common' ? NOUN.common : [...NOUN[key], ...NOUN.common];
  return { adj, noun, themed: key !== 'common' ? { adj: ADJ[key], noun: NOUN[key] } : null };
}

export interface NameInput {
  sex: Sex;
  category: string | null;
}

export const NAME_PATTERNS = 7;

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function generateName(input: NameInput, rng: Rng): string {
  const { adj, noun, themed } = pools(input.category);
  const themedAdj = themed?.adj ?? adj;
  const themedNoun = themed?.noun ?? noun;
  const pattern = rng.int(NAME_PATTERNS);
  switch (pattern) {
    case 0:
      return `The ${rng.pick(adj)} ${rng.pick(noun)}`;
    case 1:
      return `${rng.pick(themedAdj)} ${rng.pick(noun)}`;
    case 2:
      return `${rng.pick(adj)}${rng.pick(SUFFIX)}`;
    case 3:
      return `${rng.pick(PREFIX)}${rng.pick(SUFFIX)}`;
    case 4:
      return `${rng.pick(input.sex === 'female' ? TITLE_F : TITLE_M)} ${rng.pick(themedNoun)}`;
    case 5:
      return `${rng.pick(themedNoun)} ${rng.pick(CODENAME)}`;
    default:
      return cap(`${rng.pick(themedAdj)}-${rng.pick(NOUN.common)}`);
  }
}

export const generateNameSeeded = (input: NameInput, seed: number): string => generateName(input, mulberry32(seed));

/** Approximate size of the output space, for the R-GEN-01 test. */
export function nameSpaceSize(): number {
  const a = ADJ.common.length + 10, n = NOUN.common.length + 10;
  return a * n + a * n + a * SUFFIX.length + PREFIX.length * SUFFIX.length + TITLE_M.length * n + n * CODENAME.length + a * NOUN.common.length;
}
