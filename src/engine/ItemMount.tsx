// Mounts one baked item into the socket groups and owns its MaterialSet (ARCHITECTURE §3).
import { useEffect, useMemo } from 'react';
import type { Object3D } from 'three';
import type { Palette } from '@/character/types';
import { MaterialSet } from '@/library/materials';
import type { BakedItem } from './builds';
import { useSockets } from './SocketsContext';

interface Props {
  baked: BakedItem;
  palette: Palette;
  override?: Partial<Palette>;
  skinTone: string;
  /** brief pop-in scale animation (UX §9) */
  popIn?: boolean;
}

export function ItemMount({ baked, palette, override, skinTone, popIn }: Props) {
  const sockets = useSockets();
  const set = useMemo(() => new MaterialSet(), []);

  useEffect(() => {
    const mounted: Array<{ parent: Object3D; obj: Object3D }> = [];
    for (const part of baked.parts) {
      const obj = part.object.clone();
      set.apply(obj);
      const parent = sockets[part.socket];
      parent.add(obj);
      mounted.push({ parent, obj });
      if (popIn) {
        obj.scale.setScalar(0.92);
        obj.userData.popStart = performance.now();
      }
    }
    return () => {
      for (const m of mounted) m.parent.remove(m.obj);
    };
  }, [baked, sockets, set, popIn]);

  useEffect(() => {
    set.update({ palette, override, skinTone });
  }, [set, palette, override, skinTone]);

  useEffect(() => () => set.dispose(), [set]);

  return null;
}
