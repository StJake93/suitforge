// Wings and halos. Back socket: +Z points backward, +X is the character's right; one side is authored and mirrored.
import type { Object3D } from 'three';
import { DEG } from '../kit';
import type { ItemDefinition, MaterialRole } from '../types';

export const wings: ItemDefinition[] = [
  {
    id: 'back.feather-wings',
    slot: 'back',
    name: 'Feather Wings',
    tags: ['nature', 'flight', 'elegant'],
    build: ({ ref, kit }) => {
      const cl = ref.chestLen;
      const rootY = cl * 0.3,
        z = cl * 0.2;
      // two bone segments (up-and-out, then out-and-down) with a fan of flat feather plates hanging below
      const wing = () => {
        const arm = kit.at(
          kit.mesh(kit.rbox(0.5, cl * 0.14, cl * 0.1, cl * 0.03), 'secondary'),
          0.19,
          rootY + 0.16,
          z,
          0,
          0,
          40 * DEG,
        );
        const hand = kit.at(
          kit.mesh(kit.rbox(0.6, cl * 0.11, cl * 0.08, cl * 0.02), 'secondary'),
          0.65,
          rootY + 0.32 - 0.127,
          z,
          0,
          0,
          -25 * DEG,
        );
        const feathers: Object3D[] = [];
        const spec: Array<[number, number, number, number, MaterialRole]> = [
          [0.14, rootY + 0.08, 0.36, 6, 'primary'],
          [0.3, rootY + 0.22, 0.48, 9, 'primary'],
          [0.46, rootY + 0.28, 0.6, 12, 'primary'],
          [0.62, rootY + 0.2, 0.66, 15, 'secondary'],
          [0.78, rootY + 0.13, 0.56, 18, 'secondary'],
          [0.92, rootY + 0.06, 0.4, 22, 'secondary'],
        ];
        for (const [x, top, h, tilt, role] of spec) {
          feathers.push(
            kit.at(
              kit.mesh(kit.plate(0.1, h, 0.02, 0.03), role),
              x,
              top - h * 0.5,
              z + 0.02,
              0,
              0,
              tilt * DEG,
            ),
          );
        }
        // sweep back about Y inside an outer group so kit.mirror's scale.x flip does not reverse the sweep
        return kit.group(kit.at(kit.group(arm, hand, ...feathers), 0, 0, 0, 0, -20 * DEG));
      };
      const [right, left] = kit.mirror(wing);
      const mount = kit.at(
        kit.mesh(kit.rbox(ref.shoulderHalf * 0.7, cl * 0.35, cl * 0.14, cl * 0.03), 'dark'),
        0,
        rootY,
        cl * 0.08,
      );
      return { parts: [{ socket: 'back', object: kit.group(mount, right, left) }] };
    },
  },
  {
    id: 'back.bat-wings',
    slot: 'back',
    name: 'Bat Wings',
    tags: ['brutal', 'flight', 'mystic'],
    build: ({ ref, kit }) => {
      const cl = ref.chestLen;
      const rootY = cl * 0.25,
        z = cl * 0.15;
      // finger bones radiating from the root at angles a (degrees above +X); membranes are isoceles triangles
      // (prism(3) laid flat) scaled to the wedge between two fingers and rotated so the apex sits at the root.
      const finger = (a: number, len: number) => {
        const c = Math.cos(a * DEG),
          s = Math.sin(a * DEG);
        return kit.at(
          kit.mesh(kit.cyl(0.014, 0.022, len, 6), 'dark'),
          len * 0.5 * c,
          rootY + len * 0.5 * s,
          z,
          0,
          0,
          (a - 90) * DEG,
        );
      };
      const membrane = (a1: number, a2: number, len: number) => {
        const mid = (a1 + a2) * 0.5,
          half = (a1 - a2) * 0.5;
        const r = (len * Math.cos(half * DEG)) / 1.5;
        const sx = Math.tan(half * DEG) / Math.tan(30 * DEG);
        const tri = kit.scaled(
          kit.at(kit.mesh(kit.prism(3, r, 0.02), 'primary'), 0, 0, 0, 90 * DEG),
          sx,
          1,
          1,
        );
        const phi = (mid - 90) * DEG;
        return kit.at(kit.group(tri), -r * Math.sin(phi), rootY + r * Math.cos(phi), z, 0, 0, phi);
      };
      const wing = () => {
        const claw = kit.at(
          kit.mesh(kit.cone(0.02, 0.07, 6), 'metal'),
          0.7 * Math.cos(45 * DEG),
          rootY + 0.7 * Math.sin(45 * DEG) + 0.03,
          z,
          0,
          0,
          -45 * DEG,
        );
        const g = kit.group(
          finger(45, 0.7),
          finger(10, 0.76),
          finger(-32, 0.62),
          membrane(45, 10, 0.66),
          membrane(10, -32, 0.6),
          claw,
        );
        return kit.group(kit.at(g, 0, 0, 0, 0, -25 * DEG));
      };
      const [right, left] = kit.mirror(wing);
      const mount = kit.at(
        kit.mesh(kit.rbox(ref.shoulderHalf * 0.6, cl * 0.3, cl * 0.16, cl * 0.03), 'secondary'),
        0,
        rootY,
        cl * 0.08,
      );
      return { parts: [{ socket: 'back', object: kit.group(mount, right, left) }] };
    },
  },
  {
    id: 'back.energy-halo',
    slot: 'back',
    name: 'Energy Halo',
    tags: ['energy', 'cosmic', 'elegant'],
    build: ({ ref, kit }) => {
      const cl = ref.chestLen,
        sh = ref.shoulderHalf;
      const y = cl * 0.45,
        z = cl * 0.3;
      // a big vertical ring framing the head and shoulders, with a glowing inner ring and floating shards
      const outer = kit.at(kit.mesh(kit.ring(0.36, 0.028, 24), 'primary'), 0, y, z);
      const inner = kit.at(kit.mesh(kit.ring(0.29, 0.012, 24), 'glow'), 0, y, z);
      const shards: Object3D[] = [];
      for (const a of [30, 150, 210, 330]) {
        const c = Math.cos(a * DEG),
          s = Math.sin(a * DEG);
        shards.push(
          kit.at(
            kit.mesh(kit.rbox(0.03, 0.13, 0.02, 0.006), 'secondary'),
            0.43 * c,
            y + 0.43 * s,
            z,
            0,
            0,
            (a - 90) * DEG,
          ),
        );
      }
      const emitter = kit.at(
        kit.mesh(kit.rbox(sh * 0.5, cl * 0.3, cl * 0.12, cl * 0.02), 'primary'),
        0,
        cl * 0.25,
        cl * 0.08,
      );
      const stalk = kit.at(
        kit.mesh(kit.rbox(0.04, cl * 0.1, cl * 0.3, 0.008), 'dark'),
        0,
        cl * 0.32,
        cl * 0.18,
      );
      return { parts: [{ socket: 'back', object: kit.group(outer, inner, ...shards, emitter, stalk) }] };
    },
  },
];
