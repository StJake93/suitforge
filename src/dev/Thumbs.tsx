// R-LIB-04 — thumbnail sheet for every item. Route: #/thumbs
import { DEFAULT_CHARACTER } from '@/character/defaults';
import { SLOTS } from '@/character/slots';
import { SLOT_IDS } from '@/character/types';
import { useThumbnail } from '@/engine/thumbnails';
import { registry } from '@/library';
import type { ItemDefinition } from '@/library/types';

function Thumb({ item }: { item: ItemDefinition }) {
  const url = useThumbnail(item.id, DEFAULT_CHARACTER.palette, undefined, DEFAULT_CHARACTER.body.skinTone);
  return (
    <div className="card" style={{ width: 128 }}>
      <div className={`thumb${url ? '' : ' loading'}`}>{url && <img src={url} alt={item.name} />}</div>
      <div className="card-name">{item.name}</div>
      <div className="hint">{item.id}</div>
    </div>
  );
}

export function Thumbs() {
  return (
    <div style={{ padding: 24, overflow: 'auto', height: '100%' }}>
      <h1 style={{ margin: '0 0 16px' }}>
        Thumbnail sheet{' '}
        <a className="btn" href="#/">
          Back
        </a>
      </h1>
      {SLOT_IDS.map((slot) => (
        <section key={slot} style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 15, margin: '0 0 8px' }}>
            {SLOTS[slot].label} <span className="hint">({registry.bySlot(slot).length})</span>
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {registry.bySlot(slot).map((item) => (
              <Thumb key={item.id} item={item} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
