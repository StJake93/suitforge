import { useStore } from '@/state/store';
import { I } from './icons';

export function TurntableBar() {
  const ui = useStore((s) => s.ui);
  const setUi = useStore((s) => s.setUi);
  const frameAll = useStore((s) => s.frameAll);
  return (
    <div className="turnbar panel" role="toolbar" aria-label="Viewport">
      <button className="icon-btn" aria-label="Auto-rotate" aria-pressed={ui.autoRotate} title="Auto-rotate (Space)" onClick={() => setUi({ autoRotate: !ui.autoRotate })}>
        <I.rotate />
      </button>
      <button className="icon-btn" aria-label="Frame full body" title="Frame full body (F)" onClick={frameAll}>
        <I.frame />
      </button>
      <button className="icon-btn" aria-label="Idle animation" aria-pressed={ui.idleAnim} title="Idle animation" onClick={() => setUi({ idleAnim: !ui.idleAnim })}>
        <I.pulse />
      </button>
      <button className="icon-btn" aria-label="Power aura" aria-pressed={ui.aura} title="Power aura" onClick={() => setUi({ aura: !ui.aura })}>
        <I.aura />
      </button>
      <button className="icon-btn" aria-label="Keyboard shortcuts" title="Keyboard shortcuts (?)" onClick={() => setUi({ keyboardHelp: true })}>
        <I.help />
      </button>
    </div>
  );
}
