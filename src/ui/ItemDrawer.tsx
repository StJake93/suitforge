// UX §5 — item drawer for the active slot.
import { useMemo } from 'react';
import { SLOTS } from '@/character/slots';
import type { Palette } from '@/character/types';
import { registry } from '@/library';
import { TAGS, type Tag } from '@/library/types';
import { useStore } from '@/state/store';
import { I } from './icons';
import { ItemCard } from './ItemCard';

const ROLE_LABELS: Array<[keyof Palette, string]> = [
  ['primary', 'Primary'],
  ['secondary', 'Secondary'],
  ['accent', 'Accent'],
];

export function ItemDrawer() {
  const activeSlot = useStore((s) => s.ui.activeSlot);
  const search = useStore((s) => s.ui.search);
  const tags = useStore((s) => s.ui.tags);
  const setUi = useStore((s) => s.setUi);
  const setActiveSlot = useStore((s) => s.setActiveSlot);
  const character = useStore((s) => s.character);
  const preview = useStore((s) => s.preview);
  const equip = useStore((s) => s.equip);
  const setPreview = useStore((s) => s.setPreview);
  const clearPreview = useStore((s) => s.clearPreview);
  const setOverride = useStore((s) => s.setOverride);
  // keep the last slot rendered while the drawer slides out
  const slot = activeSlot;
  const meta = slot ? SLOTS[slot] : null;

  const all = useMemo(() => (slot ? registry.bySlot(slot) : []), [slot]);
  const availableTags = useMemo(() => TAGS.filter((t) => all.some((i) => i.tags.includes(t))), [all]);
  const items = useMemo(() => {
    const q = search.trim().toLowerCase();
    return all.filter(
      (i) =>
        (!q || i.name.toLowerCase().includes(q) || i.tags.some((t) => t.includes(q))) &&
        tags.every((t) => i.tags.includes(t)),
    );
  }, [all, search, tags]);

  const toggleTag = (t: Tag) =>
    setUi({ tags: tags.includes(t) ? tags.filter((x) => x !== t) : [...tags, t] });
  const override = slot ? character.overrides[slot] : undefined;

  return (
    <aside
      className={`drawer panel${slot ? ' open' : ''}`}
      aria-label="Item library"
      aria-hidden={!slot}
      data-testid="drawer"
      onPointerLeave={clearPreview}
    >
      {meta && slot && (
        <>
          <div className="panel-head">
            <div className="panel-title">
              {meta.label} <span className="count">{items.length}</span>
            </div>
            <button className="icon-btn" aria-label="Close drawer" onClick={() => setActiveSlot(null)}>
              <I.x />
            </button>
          </div>
          <div className="drawer-tools">
            <label className="field">
              <I.search width={16} height={16} />
              <input
                data-drawer-search
                type="search"
                placeholder={`Search ${meta.label.toLowerCase()}…`}
                value={search}
                onChange={(e) => setUi({ search: e.target.value })}
                aria-label="Search items"
              />
            </label>
            {availableTags.length > 1 && (
              <div className="chips" role="group" aria-label="Filter by tag">
                {availableTags.map((t) => (
                  <button
                    key={t}
                    className="chip"
                    aria-pressed={tags.includes(t)}
                    onClick={() => toggleTag(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="drawer-grid" data-testid="drawer-grid">
            {meta.allowEmpty && !search && tags.length === 0 && (
              <ItemCard
                item={null}
                equipped={character.loadout[slot] === null}
                previewing={
                  preview?.slot === slot && preview.itemId === null && character.loadout[slot] !== null
                }
                palette={character.palette}
                skinTone={character.body.skinTone}
                onPreview={(id) => setPreview(slot, id)}
                onPreviewEnd={clearPreview}
                onEquip={(id) => equip(slot, id)}
              />
            )}
            {items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                equipped={character.loadout[slot] === item.id}
                previewing={
                  preview?.slot === slot && preview.itemId === item.id && character.loadout[slot] !== item.id
                }
                palette={character.palette}
                override={override}
                skinTone={character.body.skinTone}
                onPreview={(id) => setPreview(slot, id)}
                onPreviewEnd={clearPreview}
                onEquip={(id) => equip(slot, id)}
              />
            ))}
            {items.length === 0 && <div className="drawer-empty">No items match.</div>}
          </div>
          <div className="drawer-foot">
            <label className="body-row">
              <span className="label">Colour override for {meta.label}</span>
              <input
                type="checkbox"
                checked={!!override}
                onChange={(e) => setOverride(slot, e.target.checked ? { ...character.palette } : null)}
              />
            </label>
            {override && (
              <div className="palette-roles">
                {ROLE_LABELS.map(([role, label]) => (
                  <label key={role} className="role-swatch">
                    <span className="dot" style={{ background: override[role] ?? character.palette[role] }} />
                    <span>{label}</span>
                    <input
                      type="color"
                      value={override[role] ?? character.palette[role]}
                      aria-label={`${label} override`}
                      onInput={(e) =>
                        setOverride(slot, { [role]: (e.target as HTMLInputElement).value }, false)
                      }
                      onChange={(e) => setOverride(slot, { [role]: e.target.value }, true)}
                    />
                  </label>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </aside>
  );
}
