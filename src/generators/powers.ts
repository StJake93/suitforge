// R-GEN-02 — power categories, each with ≥ 6 powers and a signature colour.
export interface PowerCategory {
  id: string;
  label: string;
  colour: string;
  blurb: string;
  powers: string[];
}

export const POWER_CATEGORIES: PowerCategory[] = [
  {
    id: 'energy',
    label: 'Energy',
    colour: '#4fd8ff',
    blurb: 'Raw power, channelled and thrown.',
    powers: [
      'Plasma Lance',
      'Overcharge',
      'Arc Field',
      'Photon Burst',
      'Kinetic Shield',
      'Solar Flare',
      'Ion Wake',
    ],
  },
  {
    id: 'tech',
    label: 'Tech',
    colour: '#ffb84a',
    blurb: 'Gadgets, drones and a suit that thinks.',
    powers: [
      'Drone Swarm',
      'Nanite Repair',
      'Targeting Overlay',
      'EMP Pulse',
      'Grapple Line',
      'Holo-Decoy',
      'Rail Shot',
    ],
  },
  {
    id: 'elemental',
    label: 'Elemental',
    colour: '#ff6a3d',
    blurb: 'Fire, ice, storm and stone answer.',
    powers: [
      'Firestorm',
      'Frost Grip',
      'Thunder Call',
      'Stone Skin',
      'Tidal Wave',
      'Ash Cloud',
      'Glacier Wall',
    ],
  },
  {
    id: 'cosmic',
    label: 'Cosmic',
    colour: '#b07cff',
    blurb: 'Gravity bends. Stars listen.',
    powers: [
      'Gravity Well',
      'Event Horizon',
      'Starfall',
      'Void Step',
      'Nebula Veil',
      'Orbital Strike',
      'Singularity',
    ],
  },
  {
    id: 'mystic',
    label: 'Mystic',
    colour: '#5cf0a8',
    blurb: 'Old words, older bargains.',
    powers: [
      'Ward Sigil',
      'Spirit Bind',
      'Hex Bolt',
      'Astral Walk',
      'Rune Blade',
      'Soul Lantern',
      'Curse Mirror',
    ],
  },
  {
    id: 'might',
    label: 'Might',
    colour: '#ff4f6d',
    blurb: 'Strength that redraws the map.',
    powers: [
      'Titan Grip',
      'Seismic Slam',
      'Iron Skin',
      'Shockwave Leap',
      'Unbreakable',
      'Rampart Charge',
      'Crater Punch',
    ],
  },
  {
    id: 'speed',
    label: 'Speed',
    colour: '#ffe94a',
    blurb: 'The world is a slow place.',
    powers: [
      'Blur Step',
      'Time Skip',
      'Afterimage',
      'Sonic Dash',
      'Reflex Overdrive',
      'Vortex Spin',
      'Lightning Sprint',
    ],
  },
  {
    id: 'stealth',
    label: 'Stealth',
    colour: '#7f8cff',
    blurb: 'Nobody saw. Nobody will.',
    powers: [
      'Shadow Cloak',
      'Silent Step',
      'Smoke Veil',
      'Mirror Skin',
      'Phase Shift',
      'Night Sight',
      'Ghost Lock',
    ],
  },
  {
    id: 'psionic',
    label: 'Psionic',
    colour: '#ff7ff0',
    blurb: 'The mind is the weapon.',
    powers: [
      'Mind Spike',
      'Telekinetic Wall',
      'Fear Aura',
      'Thought Read',
      'Psy Blade',
      'Dominate',
      'Astral Scream',
    ],
  },
  {
    id: 'nature',
    label: 'Nature',
    colour: '#7ddc5a',
    blurb: 'Root, thorn, fang and bloom.',
    powers: [
      'Thorn Lash',
      'Bloom Heal',
      'Beast Call',
      'Bark Armour',
      'Spore Cloud',
      'Vine Snare',
      'Wild Surge',
    ],
  },
];

export const MAX_POWERS = 3;

export const powerCategoryById = (id: string | null): PowerCategory | undefined =>
  id ? POWER_CATEGORIES.find((c) => c.id === id) : undefined;
