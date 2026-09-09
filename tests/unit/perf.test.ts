// T-PERF-04 / T-PERF-05 — build timing and scene complexity for the worst-case loadout.
import { describe, expect, it } from 'vitest';
import { Mesh } from 'three';
import { SLOT_IDS } from '@/character/types';
import { bakePart } from '@/engine/bake';
import { buildBody } from '@/engine/body';
import { registry } from '@/library';
import { buildContext, triangleCount } from '@/library/validate';

describe('performance budgets', () => {
  it('every item builds in ≤ 30 ms warm (T-PERF-05)', () => {
    const ctx = buildContext();
    const slow: string[] = [];
    for (const item of registry.all) {
      item.build(ctx); // warm geometry cache
      const t0 = performance.now();
      item.build(ctx);
      const ms = performance.now() - t0;
      if (ms > 30) slow.push(`${item.id}: ${ms.toFixed(1)} ms`);
    }
    expect(slow).toEqual([]);
  });

  it('worst-case loadout stays under 150 draw calls and 200k triangles (T-PERF-04)', () => {
    const ctx = buildContext();
    let calls = 0;
    let tris = 0;
    const count = (o: import('three').Object3D) => {
      o.traverse((c) => {
        const m = c as Mesh;
        if (m.isMesh) {
          calls++;
          tris += triangleCount(m.geometry);
        }
      });
    };
    for (const part of buildBody('female').parts) count(bakePart(part.object, true));
    for (const slot of SLOT_IDS) {
      const items = registry.bySlot(slot);
      // heaviest item per slot
      let worst = { calls: 0, tris: 0 };
      for (const item of items) {
        let c = 0,
          t = 0;
        for (const part of item.build(ctx).parts) {
          const baked = bakePart(part.object);
          baked.traverse((o) => {
            const m = o as Mesh;
            if (m.isMesh) {
              c++;
              t += triangleCount(m.geometry);
            }
          });
        }
        if (t > worst.tris) worst = { calls: c, tris: t };
      }
      calls += worst.calls;
      tris += worst.tris;
    }
    calls += 3; // platform, ring, contact shadow
    console.info(`worst-case scene: ${calls} draw calls, ${tris} triangles`);
    expect(calls).toBeLessThanOrEqual(150);
    expect(tris).toBeLessThanOrEqual(200_000);
  });
});
