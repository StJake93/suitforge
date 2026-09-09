// R-UI-06 — suit palette with presets.
import { useState } from 'react';
import type { Palette } from '@/character/types';
import { PALETTE_PRESETS } from '@/generators/palettes';
import { useStore } from '@/state/store';
import { I } from './icons';

const ROLES: Array<[keyof Palette, string]> = [
  ['primary', 'Primary'],
  ['secondary', 'Secondary'],
  ['accent', 'Accent'],
];

export function PalettePanel() {
  const palette = useStore((s) => s.character.palette);
  const setPalette = useStore((s) => s.setPalette);
  const locked = useStore((s) => s.ui.locks.has('palette'));
  const toggleLock = useStore((s) => s.toggleLock);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <section className={`bottom-right panel${collapsed ? ' collapsed' : ''}`} aria-label="Colours" data-testid="palette-panel">
      <div className="panel-head">
        <button className="panel-title" aria-expanded={!collapsed} onClick={() => setCollapsed(!collapsed)}>
          <I.shield width={16} height={16} /> Colours
        </button>
        <button className={`icon-btn sm${locked ? ' locked' : ''}`} aria-label={locked ? 'Unlock colours' : 'Lock colours'} aria-pressed={locked} onClick={() => toggleLock('palette')}>
          {locked ? <I.lock /> : <I.unlock />}
        </button>
        <button className="icon-btn sm" aria-label={collapsed ? 'Expand' : 'Collapse'} onClick={() => setCollapsed(!collapsed)} style={{ transform: collapsed ? 'rotate(180deg)' : undefined }}>
          <I.chevron />
        </button>
      </div>
      <div className="panel-body">
        <div className="palette-roles">
          {ROLES.map(([role, label]) => (
            <label key={role} className="role-swatch">
              <span className="dot" style={{ background: palette[role] }} />
              <span>{label}</span>
              <input type="color" value={palette[role]} aria-label={`${label} colour`} onInput={(e) => setPalette({ [role]: (e.target as HTMLInputElement).value }, false)} onChange={(e) => setPalette({ [role]: e.target.value }, true)} />
            </label>
          ))}
        </div>
        <div className="presets" role="group" aria-label="Palette presets">
          {PALETTE_PRESETS.map((p) => (
            <button key={p.name} className="preset" title={p.name} aria-label={`Preset ${p.name}`} onClick={() => setPalette({ primary: p.primary, secondary: p.secondary, accent: p.accent })}>
              <span style={{ background: p.primary }} />
              <span style={{ background: p.secondary }} />
              <span style={{ background: p.accent }} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
