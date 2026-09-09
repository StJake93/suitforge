// Soft and ceremonial neck pieces: a wrapped scarf, a fur ruff and a chained cape clasp.
import type { Object3D } from 'three';
import { DEG } from '../kit';
import type { ItemDefinition } from '../types';

export const mystic: ItemDefinition[] = [
  {
    id: 'neck.scarf-wrap',
    slot: 'neck',
    name: 'Scarf Wrap',
    tags: ['mystic', 'light'],
    build: ({ ref, kit }) => {
      const r = ref.neckRadius,
        nl = ref.neckLen;
      const cw = ref.chestHalfW,
        cd = ref.chestDepth,
        cl = ref.chestLen;
      const wrap = kit.at(kit.mesh(kit.cyl(r * 1.55, r * 1.75, nl * 0.75, 12), 'primary'), 0, nl * 0.45, 0);
      const loop = kit.at(kit.mesh(kit.ring(r * 1.5, r * 0.45, 16), 'primary'), 0, nl * 0.15, 0, 90 * DEG);
      // two tails trailing down the back from a knot behind the shoulder
      const tail = (w: number, h: number, role: 'primary' | 'secondary' = 'primary') =>
        kit.group(
          kit.at(kit.mesh(kit.plate(w, h, cd * 0.08, w * 0.12), role), 0, 0, 0),
          kit.at(kit.mesh(kit.box(w, cl * 0.06, cd * 0.1), 'accent'), 0, -h * 0.5, 0),
        );
      const knot = kit.at(kit.mesh(kit.sphere(r * 0.9, 10), 'secondary'), cw * 0.15, cl * 0.4, -cd * 0.5);
      const tailA = kit.at(tail(cw * 0.4, cl * 0.75), cw * 0.25, -cl * 0.1, -cd * 0.62, 0, 0, 8 * DEG);
      const tailB = kit.at(
        tail(cw * 0.32, cl * 0.55, 'secondary'),
        -cw * 0.1,
        -cl * 0.02,
        -cd * 0.66,
        0,
        0,
        -6 * DEG,
      );
      return {
        parts: [
          { socket: 'neck', object: kit.group(wrap, loop) },
          { socket: 'chest', object: kit.group(knot, tailA, tailB) },
        ],
      };
    },
  },
  {
    id: 'neck.fur-ruff',
    slot: 'neck',
    name: 'Fur Ruff',
    tags: ['nature', 'heavy'],
    build: ({ ref, kit }) => {
      const r = ref.neckRadius,
        nl = ref.neckLen;
      const core = kit.at(kit.mesh(kit.cyl(r * 1.3, r * 1.5, nl * 0.6, 12), 'secondary'), 0, nl * 0.2, 0);
      const tufts: Object3D[] = [];
      for (let i = 0; i < 10; i++) {
        const a = i * 36 * DEG;
        const big = i % 2 === 0;
        const rad = r * (big ? 0.95 : 0.78);
        const dist = r * (big ? 1.9 : 2.05);
        const y = nl * (big ? 0.15 : 0.38);
        const role = i % 3 === 0 ? 'secondary' : 'primary';
        tufts.push(kit.at(kit.mesh(kit.sphere(rad, 8), role), Math.sin(a) * dist, y, Math.cos(a) * dist));
      }
      return { parts: [{ socket: 'neck', object: kit.group(core, ...tufts) }] };
    },
  },
  {
    id: 'neck.cape-clasp',
    slot: 'neck',
    name: 'Cape Clasp',
    tags: ['mystic', 'elegant'],
    build: ({ ref, kit }) => {
      const cw = ref.chestHalfW,
        cd = ref.chestDepth,
        cl = ref.chestLen;
      const y = cl * 0.36,
        z = cd * 0.62;
      const disc = (x: number) =>
        kit.group(
          kit.at(kit.mesh(kit.cyl(cw * 0.16, cw * 0.16, cd * 0.06, 10), 'primary'), x, y, z, 90 * DEG),
          kit.at(kit.mesh(kit.ring(cw * 0.16, cw * 0.025, 12), 'metal'), x, y, z),
          kit.at(kit.mesh(kit.sphere(cw * 0.08, 8), 'glow'), x, y, z + cd * 0.05),
        );
      // sagging chain of links between the two discs
      const links: Object3D[] = [];
      const n = 7;
      for (let i = 0; i < n; i++) {
        const t = (i + 1) / (n + 1);
        const x = cw * 0.7 * (1 - 2 * t);
        const u = 2 * t - 1;
        const sag = (1 - u * u) * cl * 0.12;
        links.push(
          kit.at(
            kit.mesh(kit.ring(cw * 0.05, cw * 0.012, 8), 'metal'),
            x,
            y - sag,
            z,
            0,
            i % 2 === 0 ? 0 : 90 * DEG,
          ),
        );
      }
      return { parts: [{ socket: 'chest', object: kit.group(disc(cw * 0.7), disc(-cw * 0.7), ...links) }] };
    },
  },
];
