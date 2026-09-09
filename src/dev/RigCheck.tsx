// R-LIB-05 — cycles body extremes with every slot equipped. Route: #/rigcheck[?items=id,id,…]
import { useEffect, useState } from 'react';
import { Viewport } from '@/engine/Viewport';
import { registry } from '@/library';
import { SLOT_IDS, type Body } from '@/character/types';
import { useStore } from '@/state/store';

const EXTREMES: Array<{ label: string; body: Partial<Body> }> = [
  { label: 'male · short · slender', body: { sex: 'male', height: 0, musculature: 0 } },
  { label: 'male · tall · heavy', body: { sex: 'male', height: 1, musculature: 1 } },
  { label: 'female · short · slender', body: { sex: 'female', height: 0, musculature: 0 } },
  { label: 'female · tall · heavy', body: { sex: 'female', height: 1, musculature: 1 } },
  { label: 'male · mid', body: { sex: 'male', height: 0.5, musculature: 0.5 } },
  { label: 'female · mid', body: { sex: 'female', height: 0.5, musculature: 0.5 } },
];

export function RigCheck() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const s = useStore.getState();
    const params = new URLSearchParams(location.hash.split('?')[1] ?? '');
    const wanted = (params.get('items') ?? '').split(',').filter(Boolean);
    const loadout = { ...s.character.loadout };
    for (const slot of SLOT_IDS) {
      const items = registry.bySlot(slot);
      const pick =
        wanted.find((w) => w.startsWith(`${slot}.`)) ?? items[offset % Math.max(1, items.length)]?.id ?? null;
      loadout[slot] = pick;
    }
    s.load({ ...s.character, loadout }, { history: false });
    s.setUi({ autoRotate: true, idleAnim: false, activeSlot: null });
  }, [offset]);
  useEffect(() => {
    const e = EXTREMES[i]!;
    useStore.getState().updateBody(e.body, true);
  }, [i]);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((x) => (x + 1) % EXTREMES.length), 1800);
    return () => clearInterval(t);
  }, [paused]);
  return (
    <div className="app">
      <div className="app-bg" />
      <Viewport />
      <div className="overlay">
        <div
          className="panel"
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            padding: 12,
            display: 'flex',
            gap: 8,
            alignItems: 'center',
          }}
        >
          <strong>RigCheck</strong>
          <span className="hint">{EXTREMES[i]!.label}</span>
          <button className="btn" onClick={() => setPaused(!paused)}>
            {paused ? 'Play' : 'Pause'}
          </button>
          <button className="btn" onClick={() => setI((i + 1) % EXTREMES.length)}>
            Next body
          </button>
          <button className="btn" onClick={() => setOffset(offset + 1)}>
            Next item set
          </button>
          <a className="btn" href="#/">
            Back
          </a>
        </div>
      </div>
    </div>
  );
}
