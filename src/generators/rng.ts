/** Seeded PRNG (mulberry32). Deterministic for tests and share links. */
export interface Rng {
  next: () => number;
  int: (maxExclusive: number) => number;
  pick: <T>(arr: readonly T[]) => T;
  chance: (p: number) => boolean;
  range: (min: number, max: number) => number;
}

export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const rng: Rng = {
    next,
    int: (n) => Math.floor(next() * n),
    pick: (arr) => {
      if (arr.length === 0) throw new Error('pick from empty array');
      return arr[Math.floor(next() * arr.length)] as (typeof arr)[number];
    },
    chance: (p) => next() < p,
    range: (min, max) => min + next() * (max - min),
  };
  return rng;
}

export const randomSeed = (): number => (Math.random() * 0xffffffff) >>> 0;
export const seededRng = (seed?: number): Rng => mulberry32(seed ?? randomSeed());
