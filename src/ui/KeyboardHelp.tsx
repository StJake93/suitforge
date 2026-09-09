import { useStore } from '@/state/store';
import { I } from './icons';

const KEYS: Array<[string, string]> = [
  ['↑ / ↓', 'Previous / next slot'],
  ['← / →', 'Previous / next item in slot'],
  ['Enter', 'Equip focused item'],
  ['R', 'Randomise everything unlocked'],
  ['Shift + R', 'Randomise active slot'],
  ['L', 'Lock / unlock active slot'],
  ['Backspace', 'Clear active slot'],
  ['⌘/Ctrl + Z', 'Undo'],
  ['⇧ + ⌘/Ctrl + Z', 'Redo'],
  ['F', 'Frame full body'],
  ['Space', 'Toggle auto-rotate'],
  ['N', 'New name'],
  ['/', 'Search items'],
  ['Esc', 'Close drawer'],
  ['?', 'This help'],
];

export function KeyboardHelp() {
  const open = useStore((s) => s.ui.keyboardHelp);
  const setUi = useStore((s) => s.setUi);
  if (!open) return null;
  return (
    <div className="backdrop" onClick={() => setUi({ keyboardHelp: false })}>
      <div className="dialog" role="dialog" aria-label="Keyboard shortcuts" onClick={(e) => e.stopPropagation()}>
        <div className="panel-head">
          <div className="panel-title">Keyboard shortcuts</div>
          <button className="icon-btn" aria-label="Close" onClick={() => setUi({ keyboardHelp: false })}>
            <I.x />
          </button>
        </div>
        <div className="panel-body">
          <div className="keys">
            {KEYS.map(([k, d]) => (
              <>
                <kbd key={`${k}-k`}>{k}</kbd>
                <span key={`${k}-d`}>{d}</span>
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
