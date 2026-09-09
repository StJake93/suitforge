// Heavy neck armour: a spiked gorget and a layered mail mantle.
import type { Object3D } from 'three';
import { DEG } from '../kit';
import type { ItemDefinition } from '../types';

export const brutal: ItemDefinition[] = [
  {
    id: 'neck.spiked-gorget',
    slot: 'neck',
    name: 'Spiked Gorget',
    tags: ['brutal', 'armour', 'heavy'],
    build: ({ ref, kit }) => {
      const r = ref.neckRadius,
        nl = ref.neckLen;
      const collar = kit.at(kit.mesh(kit.cyl(r * 1.7, r * 2.3, nl * 0.8, 10), 'primary'), 0, nl * 0.35, 0);
      const skirt = kit.at(kit.mesh(kit.cyl(r * 2.3, r * 2.9, nl * 0.35, 10), 'secondary'), 0, -nl * 0.2, 0);
      // eight spikes pointing outward and slightly up; the tilt is applied inside a group that is spun about Y
      const spikes: Object3D[] = [];
      for (let i = 0; i < 8; i++) {
        const spike = kit.at(
          kit.mesh(kit.cone(r * 0.28, nl * 0.9, 6), 'metal'),
          0,
          nl * 0.55,
          r * 2.2,
          65 * DEG,
        );
        spikes.push(kit.at(kit.group(spike), 0, 0, 0, 0, i * 45 * DEG));
      }
      return { parts: [{ socket: 'neck', object: kit.group(collar, skirt, ...spikes) }] };
    },
  },
  {
    id: 'neck.mail-collar',
    slot: 'neck',
    name: 'Mail Collar',
    tags: ['armour', 'heavy'],
    build: ({ ref, kit }) => {
      const r = ref.neckRadius,
        nl = ref.neckLen;
      const cw = ref.chestHalfW,
        cd = ref.chestDepth,
        cl = ref.chestLen;
      const neckTop = ref.neckBaseY - ref.chestY;
      // upper layers hug the neck; lower layers drape over the shoulders and scale with the chest
      const top = kit.at(kit.mesh(kit.cyl(r * 1.3, r * 1.6, nl * 0.45, 16), 'secondary'), 0, nl * 0.55, 0);
      const mid = kit.at(kit.mesh(kit.cyl(r * 1.7, r * 2.4, nl * 0.5, 16), 'primary'), 0, nl * 0.1, 0);
      const mantleA = kit.at(
        kit.mesh(kit.cyl(cw * 0.72, cw * 0.98, cl * 0.12, 16), 'primary'),
        0,
        neckTop - nl * 0.4,
        0,
      );
      const mantleB = kit.at(
        kit.mesh(kit.cyl(cw * 0.98, cw * 1.15, cl * 0.12, 16), 'secondary'),
        0,
        neckTop - nl * 0.95,
        0,
      );
      const clasp = kit.at(
        kit.mesh(kit.rbox(cw * 0.16, cl * 0.06, cd * 0.08, cd * 0.015), 'accent'),
        0,
        cl * 0.45,
        cw * 0.85,
      );
      return {
        parts: [
          { socket: 'neck', object: kit.group(top, mid) },
          { socket: 'chest', object: kit.group(mantleA, mantleB, clasp) },
        ],
      };
    },
  },
];
