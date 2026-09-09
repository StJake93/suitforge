// R-UI-04 — name, power set, undo/redo, randomise, save, share, export.
import { useEffect, useRef, useState } from 'react';
import { exportPng } from '@/engine/exportPng';
import { powerCategoryById } from '@/generators/powers';
import { shareUrlFor } from '@/state/serialize';
import { canRedo, canUndo, useStore } from '@/state/store';
import { I } from './icons';
import { PowerPopover } from './PowerPopover';

export function TopBar() {
  const name = useStore((s) => s.character.name);
  const powerSet = useStore((s) => s.character.powerSet);
  const character = useStore((s) => s.character);
  const locks = useStore((s) => s.ui.locks);
  const undoOk = useStore(canUndo);
  const redoOk = useStore(canRedo);
  const { setName, rollName, toggleLock, undo, redo, randomiseAll, setUi, toast } = useStore.getState();
  const [draft, setDraft] = useState(name);
  const [prevName, setPrevName] = useState(name);
  if (name !== prevName) {
    setPrevName(name);
    setDraft(name);
  }
  const [powerOpen, setPowerOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!exportOpen) return;
    const onDown = (e: PointerEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) setExportOpen(false);
    };
    window.addEventListener('pointerdown', onDown);
    return () => window.removeEventListener('pointerdown', onDown);
  }, [exportOpen]);
  const cat = powerCategoryById(powerSet.category);
  const nameLocked = locks.has('name');

  const share = async () => {
    const url = shareUrlFor(character);
    try {
      await navigator.clipboard.writeText(url);
      toast('Link copied');
    } catch {
      history.replaceState(null, '', url);
      toast('Link is in the address bar');
    }
  };
  const doExport = async (transparent: boolean) => {
    setExportOpen(false);
    const ok = await exportPng(character.name, { transparent });
    toast(ok ? 'PNG exported' : 'Export failed');
  };

  return (
    <header className="topbar panel" data-testid="topbar">
      <div className="brand">
        <I.shield /> SUITFORGE
      </div>
      <label className="field name-field">
        <input
          value={draft}
          aria-label="Hero name"
          data-testid="name-input"
          maxLength={40}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => draft.trim() && setName(draft.trim())}
          onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
        />
        <button className="icon-btn sm" aria-label="Random name" title="Random name (N)" disabled={nameLocked} onClick={rollName} data-testid="roll-name">
          <I.dice />
        </button>
        <button className={`icon-btn sm${nameLocked ? ' locked' : ''}`} aria-label={nameLocked ? 'Unlock name' : 'Lock name'} aria-pressed={nameLocked} onClick={() => toggleLock('name')}>
          {nameLocked ? <I.lock /> : <I.unlock />}
        </button>
      </label>
      <div style={{ position: 'relative' }}>
        <button className="chip" style={{ height: 34, ['--cat' as never]: cat?.colour }} aria-haspopup="dialog" aria-expanded={powerOpen} onPointerDown={(e) => e.stopPropagation()} onClick={() => setPowerOpen(!powerOpen)} data-testid="power-chip">
          <I.bolt width={16} height={16} style={{ color: cat?.colour ?? 'currentColor' }} />
          {cat ? `${cat.label}${powerSet.powers.length ? ` · ${powerSet.powers.join(', ')}` : ''}` : 'Choose power set'}
        </button>
      </div>
      {powerOpen && <PowerPopover onClose={() => setPowerOpen(false)} />}
      <div className="spacer" />
      <div className="group">
        <button className="icon-btn" aria-label="Undo" title="Undo (⌘Z)" disabled={!undoOk} onClick={undo} data-testid="undo">
          <I.undo />
        </button>
        <button className="icon-btn" aria-label="Redo" title="Redo (⇧⌘Z)" disabled={!redoOk} onClick={redo} data-testid="redo">
          <I.redo />
        </button>
      </div>
      <div className="divider" />
      <button className="btn primary" onClick={randomiseAll} title="Randomise everything unlocked (R)" data-testid="randomise">
        <I.dice /> Randomise
      </button>
      <div className="divider hide-tablet" />
      <div className="group hide-tablet">
        <button className="icon-btn" aria-label="Saved heroes" title="Save / load" onClick={() => setUi({ savesOpen: true })} data-testid="open-saves">
          <I.save />
        </button>
        <button className="icon-btn" aria-label="Copy share link" title="Copy share link" onClick={share} data-testid="share">
          <I.share />
        </button>
        <div ref={exportRef} style={{ position: 'relative' }}>
          <button className="icon-btn" aria-label="Export PNG" title="Export PNG" aria-haspopup="menu" aria-expanded={exportOpen} onClick={() => setExportOpen(!exportOpen)}>
            <I.camera />
          </button>
          {exportOpen && (
            <div className="popover" role="menu" style={{ top: 40, right: 0, width: 220, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <button className="btn" role="menuitem" onClick={() => doExport(false)}>
                <I.camera /> PNG with background
              </button>
              <button className="btn" role="menuitem" onClick={() => doExport(true)}>
                <I.camera /> Transparent PNG
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
