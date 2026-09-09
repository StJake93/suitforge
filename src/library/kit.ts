// Geometry helpers for item authors (ASSET_CONTRACT §5). Geometries are cached by signature and shared;
// meshes are tagged with their material role and get real materials when mounted (materials.ts).
import {
  BoxGeometry,
  BufferGeometry,
  CapsuleGeometry,
  ConeGeometry,
  CylinderGeometry,
  ExtrudeGeometry,
  Group,
  LatheGeometry,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Shape,
  SphereGeometry,
  TorusGeometry,
  Vector2,
} from 'three';
import type { MaterialRole } from './types';

const geoCache = new Map<string, BufferGeometry>();
function cached(key: string, make: () => BufferGeometry): BufferGeometry {
  let g = geoCache.get(key);
  if (!g) {
    g = make();
    g.computeVertexNormals();
    geoCache.set(key, g);
  }
  return g;
}

/** Shared role-stub materials: they carry the role in userData and are replaced at mount time. */
const stubs = new Map<MaterialRole, MeshStandardMaterial>();
export function roleStub(role: MaterialRole): MeshStandardMaterial {
  let m = stubs.get(role);
  if (!m) {
    m = new MeshStandardMaterial({ name: `role:${role}` });
    m.userData.role = role;
    stubs.set(role, m);
  }
  return m;
}

export interface Kit {
  box: (w: number, h: number, d: number) => BufferGeometry;
  rbox: (w: number, h: number, d: number, r?: number) => BufferGeometry;
  capsule: (r: number, len: number) => BufferGeometry;
  cyl: (rTop: number, rBot: number, h: number, seg?: number) => BufferGeometry;
  cone: (r: number, h: number, seg?: number) => BufferGeometry;
  /** open cylinder segment; theta 0 = +Z (front), covering `thetaLength` radians clockwise from `thetaStart` */
  arc: (rTop: number, rBot: number, h: number, thetaStart: number, thetaLength: number, seg?: number) => BufferGeometry;
  sphere: (r: number, seg?: number) => BufferGeometry;
  hemi: (r: number, seg?: number) => BufferGeometry;
  prism: (sides: number, r: number, h: number) => BufferGeometry;
  ring: (r: number, tube: number, seg?: number) => BufferGeometry;
  plate: (w: number, h: number, thick: number, bevel?: number) => BufferGeometry;
  lathe: (profile: Array<[number, number]>, seg?: number) => BufferGeometry;
  mesh: (geometry: BufferGeometry, role: MaterialRole) => Mesh;
  group: (...children: Object3D[]) => Group;
  at: (o: Object3D, x: number, y: number, z: number, rx?: number, ry?: number, rz?: number) => Object3D;
  scaled: (o: Object3D, sx: number, sy?: number, sz?: number) => Object3D;
  /** Build the right-hand side; returns [right, left(mirrored)] */
  mirror: (build: () => Object3D) => [Object3D, Object3D];
}

export const kit: Kit = {
  box: (w, h, d) => cached(`box:${w},${h},${d}`, () => new BoxGeometry(w, h, d)),
  rbox: (w, h, d, r = Math.min(w, h, d) * 0.18) =>
    cached(`rbox:${w},${h},${d},${r}`, () => {
      const shape = new Shape();
      const x = -w / 2, y = -h / 2;
      shape.moveTo(x + r, y);
      shape.lineTo(x + w - r, y);
      shape.quadraticCurveTo(x + w, y, x + w, y + r);
      shape.lineTo(x + w, y + h - r);
      shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      shape.lineTo(x + r, y + h);
      shape.quadraticCurveTo(x, y + h, x, y + h - r);
      shape.lineTo(x, y + r);
      shape.quadraticCurveTo(x, y, x + r, y);
      const g = new ExtrudeGeometry(shape, { depth: d - 2 * r, bevelEnabled: true, bevelThickness: r, bevelSize: r, bevelSegments: 2, curveSegments: 3 });
      g.translate(0, 0, -(d - 2 * r) / 2);
      return g;
    }),
  capsule: (r, len) => cached(`cap:${r},${len}`, () => new CapsuleGeometry(r, len, 3, 10)),
  cyl: (rt, rb, h, seg = 12) => cached(`cyl:${rt},${rb},${h},${seg}`, () => new CylinderGeometry(rt, rb, h, seg)),
  arc: (rt, rb, h, ts, tl, seg = 12) => cached(`arc:${rt},${rb},${h},${ts},${tl},${seg}`, () => new CylinderGeometry(rt, rb, h, seg, 1, true, ts, tl)),
  cone: (r, h, seg = 10) => cached(`cone:${r},${h},${seg}`, () => new ConeGeometry(r, h, seg)),
  sphere: (r, seg = 12) => cached(`sph:${r},${seg}`, () => new SphereGeometry(r, seg, Math.max(6, Math.round(seg * 0.7)))),
  hemi: (r, seg = 12) => cached(`hemi:${r},${seg}`, () => new SphereGeometry(r, seg, Math.max(4, Math.round(seg * 0.5)), 0, Math.PI * 2, 0, Math.PI / 2)),
  prism: (sides, r, h) => cached(`prism:${sides},${r},${h}`, () => new CylinderGeometry(r, r, h, sides)),
  ring: (r, tube, seg = 16) => cached(`ring:${r},${tube},${seg}`, () => new TorusGeometry(r, tube, 6, seg)),
  plate: (w, h, thick, bevel = Math.min(w, h) * 0.1) =>
    cached(`plate:${w},${h},${thick},${bevel}`, () => {
      const shape = new Shape();
      const x = -w / 2, y = -h / 2;
      shape.moveTo(x + bevel, y);
      shape.lineTo(x + w - bevel, y);
      shape.lineTo(x + w, y + bevel);
      shape.lineTo(x + w, y + h - bevel);
      shape.lineTo(x + w - bevel, y + h);
      shape.lineTo(x + bevel, y + h);
      shape.lineTo(x, y + h - bevel);
      shape.lineTo(x, y + bevel);
      shape.closePath();
      const g = new ExtrudeGeometry(shape, { depth: thick, bevelEnabled: true, bevelThickness: thick * 0.3, bevelSize: thick * 0.3, bevelSegments: 1 });
      g.translate(0, 0, -thick / 2);
      return g;
    }),
  lathe: (profile, seg = 14) =>
    cached(`lathe:${profile.flat().join(',')},${seg}`, () => new LatheGeometry(profile.map(([x, y]) => new Vector2(x, y)), seg)),
  mesh: (geometry, role) => {
    const m = new Mesh(geometry, roleStub(role));
    m.castShadow = true;
    m.receiveShadow = false;
    return m;
  },
  group: (...children) => {
    const g = new Group();
    for (const c of children) g.add(c);
    return g;
  },
  at: (o, x, y, z, rx = 0, ry = 0, rz = 0) => {
    o.position.set(x, y, z);
    o.rotation.set(rx, ry, rz);
    return o;
  },
  scaled: (o, sx, sy = sx, sz = sy) => {
    o.scale.set(sx, sy, sz);
    return o;
  },
  mirror: (build) => {
    const right = build();
    const left = build();
    left.scale.x *= -1;
    return [right, left];
  },
};

export const DEG = Math.PI / 180;
