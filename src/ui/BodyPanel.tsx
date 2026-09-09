// UX / R-UI-05 — sex, skin tone, height, musculature.
import { useState } from 'react';
import { SKIN_TONES } from '@/character/defaults';
import { heightToMetres } from '@/character/types';
import { useStore } from '@/state/store';
import { I } from './icons';

export function BodyPanel() {
  const body = useStore((s) => s.character.body);
  const updateBody = useStore((s) => s.updateBody);
  const locked = useStore((s) => s.ui.locks.has('body'));
  const toggleLock = useStore((s) => s.toggleLock);
  const [collapsed, setCollapsed] = useState(false);
  const commit = () => updateBody({}, true);
  const cm = Math.round(heightToMetres(body.height) * 100);
  const muscleLabel = body.musculature < 0.33 ? 'Slender' : body.musculature < 0.66 ? 'Athletic' : 'Heavy';

  return (
    <section className={`bottom-left panel${collapsed ? ' collapsed' : ''}`} aria-label="Body" data-testid="body-panel">
      <div className="panel-head">
        <button className="panel-title" aria-expanded={!collapsed} onClick={() => setCollapsed(!collapsed)}>
          <I.user width={16} height={16} /> Body
        </button>
        <button className={`icon-btn sm${locked ? ' locked' : ''}`} aria-label={locked ? 'Unlock body' : 'Lock body'} aria-pressed={locked} onClick={() => toggleLock('body')}>
          {locked ? <I.lock /> : <I.unlock />}
        </button>
        <button className="icon-btn sm" aria-label={collapsed ? 'Expand' : 'Collapse'} onClick={() => setCollapsed(!collapsed)} style={{ transform: collapsed ? 'rotate(180deg)' : undefined }}>
          <I.chevron />
        </button>
      </div>
      <div className="panel-body">
        <div className="body-row">
          <div className="seg" role="group" aria-label="Base figure">
            <button aria-pressed={body.sex === 'male'} onClick={() => updateBody({ sex: 'male' }, true)}>
              Male
            </button>
            <button aria-pressed={body.sex === 'female'} onClick={() => updateBody({ sex: 'female' }, true)}>
              Female
            </button>
          </div>
          <div className="swatches" role="group" aria-label="Skin tone">
            {SKIN_TONES.slice(0, 9).map((t) => (
              <button key={t.hex} className="swatch" style={{ background: t.hex }} aria-label={t.name} aria-pressed={body.skinTone === t.hex} title={t.name} onClick={() => updateBody({ skinTone: t.hex }, true)} />
            ))}
            <span className="swatch custom" title="Custom skin tone">
              <input type="color" value={body.skinTone} aria-label="Custom skin tone" onInput={(e) => updateBody({ skinTone: (e.target as HTMLInputElement).value }, false)} onChange={commit} />
            </span>
          </div>
        </div>
        <div className="swatches" role="group" aria-label="Non-human tones" style={{ marginTop: 8 }}>
          {SKIN_TONES.slice(9).map((t) => (
            <button key={t.hex} className="swatch" style={{ background: t.hex }} aria-label={t.name} aria-pressed={body.skinTone === t.hex} title={t.name} onClick={() => updateBody({ skinTone: t.hex }, true)} />
          ))}
        </div>
        <div className="slider">
          <span className="label">Height</span>
          <span className="value">{cm} cm</span>
          <input type="range" min={0} max={1} step={0.01} value={body.height} aria-label="Height" style={{ '--fill': `${body.height * 100}%` } as never} onChange={(e) => updateBody({ height: Number(e.target.value) }, false)} onPointerUp={commit} onKeyUp={commit} onBlur={commit} />
        </div>
        <div className="slider">
          <span className="label">Musculature</span>
          <span className="value">{muscleLabel}</span>
          <input type="range" min={0} max={1} step={0.01} value={body.musculature} aria-label="Musculature" style={{ '--fill': `${body.musculature * 100}%` } as never} onChange={(e) => updateBody({ musculature: Number(e.target.value) }, false)} onPointerUp={commit} onKeyUp={commit} onBlur={commit} />
        </div>
      </div>
    </section>
  );
}
