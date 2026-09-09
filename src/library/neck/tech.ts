// Tech neck pieces: a slim glowing choker, a hanging respirator and a tall flared collar.
import { DEG } from '../kit';
import type { ItemDefinition } from '../types';

export const tech: ItemDefinition[] = [
  {
    id: 'neck.halo-choker',
    slot: 'neck',
    name: 'Halo Choker',
    tags: ['tech', 'energy', 'light'],
    build: ({ ref, kit }) => {
      const r = ref.neckRadius,
        nl = ref.neckLen;
      const y = nl * 0.5;
      const band = kit.at(kit.mesh(kit.cyl(r * 1.18, r * 1.18, nl * 0.32, 14), 'primary'), 0, y, 0);
      const halo = kit.at(kit.mesh(kit.ring(r * 1.42, r * 0.11, 20), 'glow'), 0, y, 0, 90 * DEG);
      const emitter = kit.at(
        kit.mesh(kit.rbox(r * 0.6, nl * 0.36, r * 0.4, r * 0.08), 'accent'),
        0,
        y,
        -r * 1.35,
      );
      const gem = kit.at(kit.mesh(kit.sphere(r * 0.22, 8), 'glow'), 0, y, r * 1.45);
      return { parts: [{ socket: 'neck', object: kit.group(band, halo, emitter, gem) }] };
    },
  },
  {
    id: 'neck.breather',
    slot: 'neck',
    name: 'Breather Mask',
    tags: ['tech', 'utility'],
    build: ({ ref, kit }) => {
      const r = ref.neckRadius,
        nl = ref.neckLen;
      const cw = ref.chestHalfW,
        cd = ref.chestDepth,
        cl = ref.chestLen;
      const strap = kit.at(kit.mesh(kit.cyl(r * 1.2, r * 1.26, nl * 0.3, 12), 'dark'), 0, nl * 0.45, 0);
      // respirator resting on the upper chest, hoses running up toward the neck strap
      const body = kit.at(
        kit.mesh(kit.rbox(cw * 0.7, cl * 0.22, cd * 0.36, cd * 0.06), 'primary'),
        0,
        cl * 0.3,
        cd * 0.56,
      );
      const filter = (x: number) =>
        kit.group(
          kit.at(
            kit.mesh(kit.cyl(cd * 0.16, cd * 0.16, cd * 0.12, 10), 'metal'),
            x,
            cl * 0.28,
            cd * 0.66,
            90 * DEG,
          ),
          kit.at(
            kit.mesh(kit.cyl(cd * 0.11, cd * 0.11, cd * 0.03, 10), 'dark'),
            x,
            cl * 0.28,
            cd * 0.74,
            90 * DEG,
          ),
        );
      const valve = kit.at(
        kit.mesh(kit.rbox(cw * 0.2, cl * 0.08, cd * 0.1, cd * 0.02), 'accent'),
        0,
        cl * 0.26,
        cd * 0.76,
      );
      const hose = (x: number, tilt: number) =>
        kit.at(
          kit.mesh(kit.cyl(cd * 0.05, cd * 0.05, cl * 0.26, 8), 'dark'),
          x,
          cl * 0.4,
          cd * 0.4,
          -15 * DEG,
          0,
          tilt,
        );
      const chest = kit.group(
        body,
        filter(cw * 0.42),
        filter(-cw * 0.42),
        valve,
        hose(cw * 0.55, -25 * DEG),
        hose(-cw * 0.55, 25 * DEG),
      );
      return {
        parts: [
          { socket: 'neck', object: kit.group(strap) },
          { socket: 'chest', object: chest },
        ],
      };
    },
  },
  {
    id: 'neck.flare-collar',
    slot: 'neck',
    name: 'Flare Collar',
    tags: ['tech', 'elegant'],
    build: ({ ref, kit }) => {
      const r = ref.neckRadius,
        nl = ref.neckLen;
      const base = kit.at(kit.mesh(kit.cyl(r * 1.5, r * 1.9, nl * 0.5, 14), 'secondary'), 0, nl * 0.25, 0);
      // tall flare around the back of the neck, open at the front; an inner lining faces inward
      const flare = kit.at(
        kit.mesh(kit.arc(r * 2.6, r * 1.7, nl * 1.7, 60 * DEG, 240 * DEG, 16), 'primary'),
        0,
        nl * 0.85,
        0,
      );
      const lining = kit.scaled(
        kit.at(
          kit.mesh(kit.arc(r * 2.5, r * 1.62, nl * 1.66, 60 * DEG, 240 * DEG, 16), 'secondary'),
          0,
          nl * 0.85,
          0,
        ),
        -1,
        1,
        1,
      );
      const light = (x: number, ry: number) =>
        kit.at(
          kit.mesh(kit.rbox(r * 0.3, nl * 0.6, r * 0.14, r * 0.04), 'glow'),
          x,
          nl * 1.0,
          r * 1.15,
          0,
          ry,
        );
      const spine = kit.at(
        kit.mesh(kit.rbox(r * 0.5, nl * 1.4, r * 0.25, r * 0.06), 'accent'),
        0,
        nl * 0.85,
        -r * 2.2,
      );
      return {
        parts: [
          {
            socket: 'neck',
            object: kit.group(
              base,
              flare,
              lining,
              light(r * 1.95, -60 * DEG),
              light(-r * 1.95, 60 * DEG),
              spine,
            ),
          },
        ],
      };
    },
  },
];
