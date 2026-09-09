// R-SAVE-01 — named saves with thumbnails.
import { useState } from 'react';
import { renderPng } from '@/engine/exportPng';
import { registry } from '@/library';
import { addSave, deleteSave, listSaves, renameSave, type SaveEntry } from '@/state/persist';
import { sanitise } from '@/state/serialize';
import { useStore } from '@/state/store';
import { I } from './icons';

async function thumbFromView(): Promise<string | null> {
  const raw = renderPng({ transparent: true, scale: 0.25 });
  if (!raw) return null;
  const img = new Image();
  await new Promise<void>((res) => {
    img.onload = () => res();
    img.onerror = () => res();
    img.src = raw;
  });
  const c = document.createElement('canvas');
  const s = 96;
  c.width = s;
  c.height = s;
  const ctx = c.getContext('2d');
  if (!ctx || !img.width) return null;
  const side = Math.min(img.width, img.height);
  ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, s, s);
  return c.toDataURL('image/png');
}

export function SavesDialog() {
  const open = useStore((s) => s.ui.savesOpen);
  if (!open) return null;
  return <SavesDialogInner />;
}

function SavesDialogInner() {
  const setUi = useStore((s) => s.setUi);
  const character = useStore((s) => s.character);
  const load = useStore((s) => s.load);
  const toast = useStore((s) => s.toast);
  const [saves, setSaves] = useState<SaveEntry[]>(() => listSaves());
  const [name, setName] = useState(() => character.name);
  const [confirm, setConfirm] = useState<string | null>(null);
  const [renaming, setRenaming] = useState<{ id: string; name: string } | null>(null);
  const close = () => setUi({ savesOpen: false });

  const onSave = async () => {
    const thumb = await thumbFromView();
    addSave(name.trim() || character.name, character, thumb);
    setSaves(listSaves());
    toast('Saved');
  };
  const onLoad = (e: SaveEntry) => {
    const { character: c, dropped } = sanitise(e.character, registry);
    load(c);
    if (dropped.length) toast('Some items were missing and were removed');
    else toast(`Loaded “${e.name}”`);
    close();
  };

  return (
    <div className="backdrop" onClick={close}>
      <div
        className="dialog"
        role="dialog"
        aria-label="Saved heroes"
        onClick={(e) => e.stopPropagation()}
        data-testid="saves-dialog"
      >
        <div className="panel-head">
          <div className="panel-title">Saved heroes</div>
          <button className="icon-btn" aria-label="Close" onClick={close}>
            <I.x />
          </button>
        </div>
        <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <label className="field" style={{ flex: 1 }}>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Save name"
                aria-label="Save name"
                onKeyDown={(e) => e.key === 'Enter' && onSave()}
              />
            </label>
            <button className="btn primary" onClick={onSave} data-testid="save-current">
              <I.save /> Save current
            </button>
          </div>
          {saves.length === 0 && <p className="hint">No saves yet.</p>}
          {saves.map((e) => (
            <div key={e.id} className="save-row">
              {e.thumb ? <img src={e.thumb} alt="" /> : <div className="noimg" />}
              <div className="meta">
                {renaming?.id === e.id ? (
                  <label className="field">
                    <input
                      autoFocus
                      value={renaming.name}
                      aria-label="New name"
                      onChange={(ev) => setRenaming({ id: e.id, name: ev.target.value })}
                      onBlur={() => {
                        renameSave(e.id, renaming.name.trim() || e.name);
                        setRenaming(null);
                        setSaves(listSaves());
                      }}
                      onKeyDown={(ev) => ev.key === 'Enter' && (ev.target as HTMLInputElement).blur()}
                    />
                  </label>
                ) : (
                  <strong>{e.name}</strong>
                )}
                <span>{new Date(e.savedAt).toLocaleString()}</span>
              </div>
              <div className="actions">
                {confirm === e.id ? (
                  <>
                    <button
                      className="btn danger"
                      onClick={() => {
                        deleteSave(e.id);
                        setConfirm(null);
                        setSaves(listSaves());
                      }}
                    >
                      Delete
                    </button>
                    <button className="btn" onClick={() => setConfirm(null)}>
                      Keep
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="icon-btn"
                      aria-label={`Load ${e.name}`}
                      title="Load"
                      onClick={() => onLoad(e)}
                    >
                      <I.load />
                    </button>
                    <button
                      className="icon-btn"
                      aria-label={`Rename ${e.name}`}
                      title="Rename"
                      onClick={() => setRenaming({ id: e.id, name: e.name })}
                    >
                      <I.edit />
                    </button>
                    <button
                      className="icon-btn"
                      aria-label={`Delete ${e.name}`}
                      title="Delete"
                      onClick={() => setConfirm(e.id)}
                    >
                      <I.trash />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
