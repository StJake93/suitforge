// UX §6 keyboard map (R-UI-08).
import { useEffect } from 'react';
import { SLOTS } from '@/character/slots';
import { SLOT_IDS } from '@/character/types';
import { useStore } from '@/state/store';

const isTyping = (t: EventTarget | null) => {
  const el = t as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
};

export function useHotkeys() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const s = useStore.getState();
      const meta = e.metaKey || e.ctrlKey;
      if (e.key === 'Escape') {
        if (isTyping(e.target)) (e.target as HTMLElement).blur();
        else if (s.ui.keyboardHelp) s.setUi({ keyboardHelp: false });
        else if (s.ui.savesOpen) s.setUi({ savesOpen: false });
        else if (s.ui.activeSlot) s.setActiveSlot(null);
        return;
      }
      if (isTyping(e.target)) return;
      if (meta && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) s.redo();
        else s.undo();
        return;
      }
      if (meta && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        s.redo();
        return;
      }
      if (meta) return;
      const active = s.ui.activeSlot;
      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowDown': {
          e.preventDefault();
          const idx = active ? SLOT_IDS.indexOf(active) : -1;
          const next = e.key === 'ArrowDown' ? (idx + 1) % SLOT_IDS.length : (idx - 1 + SLOT_IDS.length) % SLOT_IDS.length;
          s.setActiveSlot(SLOT_IDS[next]!);
          return;
        }
        case 'ArrowLeft':
        case 'ArrowRight':
          if (!active) return;
          e.preventDefault();
          s.cycleItem(active, e.key === 'ArrowRight' ? 1 : -1);
          return;
        case 'r':
          e.preventDefault();
          s.randomiseAll();
          return;
        case 'R':
          e.preventDefault();
          if (active) s.randomiseSlot(active);
          return;
        case 'l':
        case 'L':
          if (active) s.toggleLock(active);
          return;
        case 'Backspace':
        case 'Delete':
          if (active && SLOTS[active].allowEmpty) {
            e.preventDefault();
            s.equip(active, null);
          }
          return;
        case 'f':
        case 'F':
          s.frameAll();
          return;
        case ' ':
          e.preventDefault();
          s.setUi({ autoRotate: !s.ui.autoRotate });
          return;
        case 'n':
        case 'N':
          if (!s.ui.locks.has('name')) s.rollName();
          return;
        case '/': {
          e.preventDefault();
          if (!active) s.setActiveSlot('helmet');
          requestAnimationFrame(() => document.querySelector<HTMLInputElement>('[data-drawer-search]')?.focus());
          return;
        }
        case '?':
          s.setUi({ keyboardHelp: !s.ui.keyboardHelp });
          return;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}
