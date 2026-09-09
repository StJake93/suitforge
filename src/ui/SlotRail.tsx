// UX §4 — the slot rail.
import { SLOTS, slotList } from '@/character/slots';
import { registry } from '@/library';
import { hiddenSlots, useStore } from '@/state/store';
import { I, SlotGlyph } from './icons';

export function SlotRail() {
  const loadout = useStore((s) => s.character.loadout);
  const activeSlot = useStore((s) => s.ui.activeSlot);
  const locks = useStore((s) => s.ui.locks);
  const setActiveSlot = useStore((s) => s.setActiveSlot);
  const toggleLock = useStore((s) => s.toggleLock);
  const randomiseSlot = useStore((s) => s.randomiseSlot);
  const equip = useStore((s) => s.equip);
  const hidden = hiddenSlots(loadout);

  return (
    <nav className="rail panel" aria-label="Equipment slots" data-testid="slot-rail">
      <div className="rail-list" role="list">
        {slotList().map((meta) => {
          const id = loadout[meta.id];
          const item = id ? registry.byId(id) : undefined;
          const active = activeSlot === meta.id;
          const locked = locks.has(meta.id);
          const hiddenBy = hidden.get(meta.id);
          return (
            <div key={meta.id} role="listitem" className={`slot-row${active ? ' active' : ''}${locked ? ' locked' : ''}`} data-testid={`slot-${meta.id}`}>
              <button
                className="slot-main"
                aria-pressed={active}
                aria-label={`${meta.label}: ${item ? item.name : 'none'}${hiddenBy ? ` (hidden by ${SLOTS[hiddenBy].label})` : ''}`}
                title={meta.hint}
                onClick={() => setActiveSlot(active ? null : meta.id)}
              >
                <span className="slot-glyph">
                  <SlotGlyph slot={meta.id} />
                </span>
                <span className="slot-label">{meta.label}</span>
                <span className={`slot-item${item ? '' : ' none'}${hiddenBy ? ' hidden-by' : ''}`} title={hiddenBy ? `Hidden by ${SLOTS[hiddenBy].label}` : undefined}>
                  {item ? item.name : 'None'}
                </span>
              </button>
              <div className="slot-actions">
                <button className={`icon-btn sm${locked ? ' locked' : ''}`} aria-label={locked ? `Unlock ${meta.label}` : `Lock ${meta.label}`} aria-pressed={locked} title={locked ? 'Unlock (L)' : 'Lock (L)'} onClick={() => toggleLock(meta.id)}>
                  {locked ? <I.lock /> : <I.unlock />}
                </button>
                <button className="icon-btn sm" aria-label={`Randomise ${meta.label}`} title="Randomise (Shift+R)" disabled={locked} onClick={() => randomiseSlot(meta.id)}>
                  <I.dice />
                </button>
                <button className="icon-btn sm" aria-label={`Clear ${meta.label}`} title="Clear (Backspace)" disabled={!meta.allowEmpty || id === null} onClick={() => equip(meta.id, null)}>
                  <I.x />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
