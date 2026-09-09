// Inline SVG glyphs (UX §2, UX-RAIL-05). 20px, stroke 1.75.
import type { SVGProps } from 'react';
import type { SlotId } from '@/character/types';

type P = SVGProps<SVGSVGElement>;
const base = (p: P) => ({ viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.75, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true, ...p });

export const I = {
  helmet: (p: P) => <svg {...base(p)}><path d="M5 13a7 7 0 0 1 14 0v5H5z" /><path d="M5 14h14M9 18v2M15 18v2" /></svg>,
  headgear: (p: P) => <svg {...base(p)}><path d="M4 15c2-4 14-4 16 0" /><path d="M12 3v8M9 6l3-3 3 3" /><circle cx="12" cy="13" r="1" /></svg>,
  glasses: (p: P) => <svg {...base(p)}><circle cx="7" cy="13" r="3.5" /><circle cx="17" cy="13" r="3.5" /><path d="M10.5 13h3M2 12l1.5-1M22 12l-1.5-1" /></svg>,
  neck: (p: P) => <svg {...base(p)}><path d="M4 8c2 6 14 6 16 0" /><path d="M6 12c1 4 11 4 12 0" /></svg>,
  torso: (p: P) => <svg {...base(p)}><path d="M7 4l5 2 5-2 3 5-3 2v9H7v-9L4 9z" /><path d="M12 6v14" /></svg>,
  back: (p: P) => <svg {...base(p)}><path d="M12 4v16" /><path d="M12 8C8 6 5 6 3 9c2 1 4 3 5 6 2-1 3-2 4-4" /><path d="M12 8c4-2 7-2 9 1-2 1-4 3-5 6-2-1-3-2-4-4" /></svg>,
  bracers: (p: P) => <svg {...base(p)}><path d="M7 5h10l-1 14H8z" /><path d="M8 9h8M8 13h8" /></svg>,
  gloves: (p: P) => <svg {...base(p)}><path d="M7 11V6a1.5 1.5 0 0 1 3 0v4M10 10V5a1.5 1.5 0 0 1 3 0v5M13 10V6a1.5 1.5 0 0 1 3 0v6" /><path d="M7 11l-2 2c0 4 3 7 7 7h1c3 0 4-2 4-5v-3" /></svg>,
  weapon: (p: P) => <svg {...base(p)}><path d="M4 20l10-10" /><path d="M14 10l6-6-2-2-6 6" /><path d="M9 15l-2 2M7 13l-1-1 3-3" /></svg>,
  legs: (p: P) => <svg {...base(p)}><path d="M7 4h10l-1 8-1 8h-3l-1-8-1 8H8L7 12z" /></svg>,
  boots: (p: P) => <svg {...base(p)}><path d="M7 4h7v9l6 3v3H7z" /><path d="M7 14h7" /></svg>,
  lock: (p: P) => <svg {...base(p)}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>,
  unlock: (p: P) => <svg {...base(p)}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 7.5-2" /></svg>,
  dice: (p: P) => <svg {...base(p)}><rect x="4" y="4" width="16" height="16" rx="3" /><circle cx="9" cy="9" r="1" fill="currentColor" /><circle cx="15" cy="15" r="1" fill="currentColor" /><circle cx="15" cy="9" r="1" fill="currentColor" /><circle cx="9" cy="15" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /></svg>,
  x: (p: P) => <svg {...base(p)}><path d="M6 6l12 12M18 6L6 18" /></svg>,
  check: (p: P) => <svg {...base(p)}><path d="M5 12l5 5 9-10" /></svg>,
  undo: (p: P) => <svg {...base(p)}><path d="M9 14l-4-4 4-4" /><path d="M5 10h9a5 5 0 0 1 0 10h-3" /></svg>,
  redo: (p: P) => <svg {...base(p)}><path d="M15 14l4-4-4-4" /><path d="M19 10h-9a5 5 0 0 0 0 10h3" /></svg>,
  save: (p: P) => <svg {...base(p)}><path d="M5 4h11l3 3v13H5z" /><path d="M8 4v5h7V4M8 20v-6h8v6" /></svg>,
  share: (p: P) => <svg {...base(p)}><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></svg>,
  camera: (p: P) => <svg {...base(p)}><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></svg>,
  rotate: (p: P) => <svg {...base(p)}><path d="M20 12a8 8 0 1 1-2.3-5.7" /><path d="M20 4v5h-5" /></svg>,
  frame: (p: P) => <svg {...base(p)}><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" /></svg>,
  pulse: (p: P) => <svg {...base(p)}><path d="M3 12h4l2-6 4 12 2-6h6" /></svg>,
  aura: (p: P) => <svg {...base(p)}><circle cx="12" cy="12" r="3" /><circle cx="12" cy="12" r="7" strokeDasharray="3 3" /><circle cx="12" cy="12" r="10" strokeDasharray="2 4" /></svg>,
  help: (p: P) => <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.7" /><circle cx="12" cy="17" r=".6" fill="currentColor" /></svg>,
  bolt: (p: P) => <svg {...base(p)}><path d="M13 2L4 14h7l-1 8 9-12h-7z" /></svg>,
  search: (p: P) => <svg {...base(p)}><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.5-4.5" /></svg>,
  trash: (p: P) => <svg {...base(p)}><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" /></svg>,
  edit: (p: P) => <svg {...base(p)}><path d="M4 20h4l10-10-4-4L4 16z" /><path d="M12 8l4 4" /></svg>,
  load: (p: P) => <svg {...base(p)}><path d="M12 4v11M7 10l5 5 5-5" /><path d="M4 20h16" /></svg>,
  chevron: (p: P) => <svg {...base(p)}><path d="M6 9l6 6 6-6" /></svg>,
  shield: (p: P) => <svg {...base(p)}><path d="M12 3L5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6z" /><path d="M9 12h6M12 9v6" /></svg>,
  reset: (p: P) => <svg {...base(p)}><path d="M4 12a8 8 0 1 0 2.3-5.7" /><path d="M4 4v5h5" /></svg>,
  user: (p: P) => <svg {...base(p)}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>,
  eye: (p: P) => <svg {...base(p)}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>,
};

export const SlotGlyph = ({ slot, ...p }: { slot: SlotId } & P) => {
  const C = I[slot];
  return <C {...p} />;
};
