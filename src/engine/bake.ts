// Merge every mesh of a part into one mesh per material role, baking transforms (T-PERF-04).
import { BufferGeometry, Material, Mesh, Object3D } from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { roleStub } from '@/library/kit';
import type { MaterialRole } from '@/library/types';

function flipWinding(g: BufferGeometry): void {
  const pos = g.getAttribute('position');
  const arr = pos.array as Float32Array;
  const n = pos.count;
  for (let i = 0; i + 2 < n; i += 3) {
    // swap vertices 1 and 2 of every triangle, for every attribute
    for (const name of Object.keys(g.attributes)) {
      const attr = g.getAttribute(name);
      const a = attr.array as Float32Array;
      const size = attr.itemSize;
      for (let k = 0; k < size; k++) {
        const i1 = (i + 1) * size + k, i2 = (i + 2) * size + k;
        const t = a[i1]!;
        a[i1] = a[i2]!;
        a[i2] = t;
      }
    }
  }
  void arr;
}

/** Returns a new Object3D containing ≤ 1 mesh per role, in the root's local frame. */
export function bakePart(root: Object3D, smooth = false): Object3D {
  root.updateMatrixWorld(true);
  const byRole = new Map<MaterialRole, BufferGeometry[]>();
  root.traverse((o) => {
    const m = o as Mesh;
    if (!m.isMesh) return;
    const role = (m.material as Material).userData.role as MaterialRole | undefined;
    if (!role) return;
    let g = m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone();
    g = g.clone();
    // drop attributes that differ between geometries so merge succeeds
    for (const name of Object.keys(g.attributes)) if (name !== 'position' && name !== 'normal' && name !== 'uv') g.deleteAttribute(name);
    if (!g.getAttribute('uv')) g.setAttribute('uv', g.getAttribute('position').clone());
    g.applyMatrix4(m.matrixWorld);
    if (m.matrixWorld.determinant() < 0) flipWinding(g);
    if (smooth) g.computeVertexNormals();
    const list = byRole.get(role) ?? [];
    list.push(g);
    byRole.set(role, list);
  });
  const out = new Object3D();
  for (const [role, list] of byRole) {
    const merged = list.length === 1 ? list[0]! : mergeGeometries(list, false);
    if (!merged) continue;
    for (const g of list) if (g !== merged) g.dispose();
    const mesh = new Mesh(merged, roleStub(role));
    mesh.name = `baked:${role}`;
    mesh.castShadow = true;
    out.add(mesh);
  }
  return out;
}

export function disposeObject(o: Object3D): void {
  o.traverse((c) => {
    const m = c as Mesh;
    if (m.isMesh) m.geometry.dispose();
  });
}
