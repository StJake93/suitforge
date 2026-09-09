// R-GEN-02 — power set picker.
import { useEffect, useRef } from 'react';
import { MAX_POWERS, POWER_CATEGORIES, powerCategoryById } from '@/generators/powers';
import { useStore } from '@/state/store';
import { I } from './icons';

export function PowerPopover({ onClose }: { onClose: () => void }) {
  const powerSet = useStore((s) => s.character.powerSet);
  const setPowerSet = useStore((s) => s.setPowerSet);
  const locked = useStore((s) => s.ui.locks.has('power'));
  const toggleLock = useStore((s) => s.toggleLock);
  const ref = useRef<HTMLDivElement>(null);
  const cat = powerCategoryById(powerSet.category);

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    window.addEventListener('pointerdown', onDown);
    return () => window.removeEventListener('pointerdown', onDown);
  }, [onClose]);

  const togglePower = (p: string) => {
    const has = powerSet.powers.includes(p);
    const powers = has ? powerSet.powers.filter((x) => x !== p) : [...powerSet.powers, p].slice(-MAX_POWERS);
    setPowerSet({ ...powerSet, powers });
  };

  return (
    <div ref={ref} className="popover" role="dialog" aria-label="Power set" style={{ top: 'calc(var(--topbar-h) + 4px)', left: 'min(420px, 40vw)' }} data-testid="power-popover">
      <div className="body-row" style={{ marginBottom: 10 }}>
        <span className="label">Power set</span>
        <span style={{ display: 'flex', gap: 2 }}>
          <button className={`icon-btn sm${locked ? ' locked' : ''}`} aria-label={locked ? 'Unlock power set' : 'Lock power set'} aria-pressed={locked} onClick={() => toggleLock('power')}>
            {locked ? <I.lock /> : <I.unlock />}
          </button>
          <button className="icon-btn sm" aria-label="Close" onClick={onClose}>
            <I.x />
          </button>
        </span>
      </div>
      <div className="power-cats" role="group" aria-label="Category">
        {POWER_CATEGORIES.map((c) => (
          <button key={c.id} className="power-cat" aria-pressed={powerSet.category === c.id} style={{ '--cat': c.colour } as never} onClick={() => setPowerSet(powerSet.category === c.id ? { category: null, powers: [] } : { category: c.id, powers: [] })}>
            <span className="dot" style={{ background: c.colour, color: c.colour }} />
            {c.label}
          </button>
        ))}
      </div>
      {cat ? (
        <>
          <p className="hint" style={{ margin: '10px 0 0' }}>
            {cat.blurb} Pick up to {MAX_POWERS}.
          </p>
          <div className="power-list" role="group" aria-label="Powers">
            {cat.powers.map((p) => (
              <button key={p} className="chip" aria-pressed={powerSet.powers.includes(p)} onClick={() => togglePower(p)}>
                {p}
              </button>
            ))}
          </div>
        </>
      ) : (
        <p className="hint" style={{ margin: '10px 0 0' }}>Choose a category to see its powers.</p>
      )}
    </div>
  );
}
