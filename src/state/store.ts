// Single zustand store (ARCHITECTURE §2).
import { create } from 'zustand';
import { DEFAULT_CHARACTER } from '@/character/defaults';
import { SLOTS } from '@/character/slots';
import {
  SLOT_IDS,
  type Body,
  type Character,
  type LockId,
  type Loadout,
  type Palette,
  type PowerSet,
  type SlotId,
} from '@/character/types';
import { rollName } from '@/generators/names';
import { randomiseAll, randomiseSlot } from '@/generators/randomise';
import { seededRng } from '@/generators/rng';
import { registry } from '@/library';
import type { Tag } from '@/library/types';
import { emptyHistory, push, redo as redoH, undo as undoH, type History } from './history';

export interface Preview {
  slot: SlotId;
  itemId: string | null;
}

export interface Toast {
  id: number;
  message: string;
}

export interface UiState {
  activeSlot: SlotId | null;
  locks: ReadonlySet<LockId>;
  autoRotate: boolean;
  idleAnim: boolean;
  aura: boolean;
  search: string;
  tags: Tag[];
  keyboardHelp: boolean;
  savesOpen: boolean;
  toasts: Toast[];
  /** set by the camera rig for the "frame all" action */
  cameraNonce: number;
}

export interface Store {
  character: Character;
  preview: Preview | null;
  ui: UiState;
  history: History<Character>;
  dragBase: Character | null;

  equip: (slot: SlotId, itemId: string | null) => void;
  cycleItem: (slot: SlotId, dir: 1 | -1) => void;
  setPreview: (slot: SlotId, itemId: string | null) => void;
  clearPreview: () => void;
  updateBody: (patch: Partial<Body>, commit: boolean) => void;
  setPalette: (patch: Partial<Palette>, commit?: boolean) => void;
  setOverride: (slot: SlotId, patch: Partial<Palette> | null, commit?: boolean) => void;
  setName: (name: string) => void;
  rollName: () => void;
  setPowerSet: (ps: PowerSet) => void;
  randomiseAll: () => void;
  randomiseSlot: (slot: SlotId) => void;
  undo: () => void;
  redo: () => void;
  load: (c: Character, opts?: { history?: boolean }) => void;
  reset: () => void;

  setActiveSlot: (slot: SlotId | null) => void;
  toggleLock: (id: LockId) => void;
  setUi: (patch: Partial<UiState>) => void;
  toast: (message: string) => void;
  dismissToast: (id: number) => void;
  frameAll: () => void;
}

let toastId = 0;

function commit(state: Pick<Store, 'character' | 'history' | 'dragBase'>, next: Character) {
  const base = state.dragBase ?? state.character;
  return { character: next, history: push(state.history, base), dragBase: null };
}

export const useStore = create<Store>((set, get) => ({
  character: DEFAULT_CHARACTER,
  preview: null,
  ui: {
    activeSlot: null,
    locks: new Set<LockId>(),
    autoRotate: true,
    idleAnim: true,
    aura: true,
    search: '',
    tags: [],
    keyboardHelp: false,
    savesOpen: false,
    toasts: [],
    cameraNonce: 0,
  },
  history: emptyHistory<Character>(),
  dragBase: null,

  equip: (slot, itemId) =>
    set((s) => {
      if (itemId === null && !SLOTS[slot].allowEmpty) return {};
      if (itemId !== null) {
        const item = registry.byId(itemId);
        if (!item || item.slot !== slot) return {};
      }
      if (s.character.loadout[slot] === itemId) return { preview: null };
      const next: Character = { ...s.character, loadout: { ...s.character.loadout, [slot]: itemId } };
      return { ...commit(s, next), preview: null };
    }),

  cycleItem: (slot, dir) => {
    const s = get();
    const items = registry.bySlot(slot).map((i) => i.id);
    const options: Array<string | null> = SLOTS[slot].allowEmpty ? [null, ...items] : items;
    const idx = options.indexOf(s.character.loadout[slot]);
    const next = options[(idx + dir + options.length) % options.length] ?? null;
    s.equip(slot, next);
  },

  setPreview: (slot, itemId) =>
    set((s) =>
      s.preview && s.preview.slot === slot && s.preview.itemId === itemId
        ? {}
        : { preview: { slot, itemId } },
    ),
  clearPreview: () => set((s) => (s.preview ? { preview: null } : {})),

  updateBody: (patch, commitNow) =>
    set((s) => {
      if (commitNow && s.dragBase === null && Object.keys(patch).length === 0) return {};
      const next: Character = { ...s.character, body: { ...s.character.body, ...patch } };
      if (commitNow) return commit(s, next);
      return { character: next, dragBase: s.dragBase ?? s.character };
    }),

  setPalette: (patch, commitNow = true) =>
    set((s) => {
      const next: Character = { ...s.character, palette: { ...s.character.palette, ...patch } };
      if (commitNow) return commit(s, next);
      return { character: next, dragBase: s.dragBase ?? s.character };
    }),

  setOverride: (slot, patch, commitNow = true) =>
    set((s) => {
      const overrides = { ...s.character.overrides };
      if (patch === null) delete overrides[slot];
      else overrides[slot] = { ...overrides[slot], ...patch };
      const next: Character = { ...s.character, overrides };
      if (commitNow) return commit(s, next);
      return { character: next, dragBase: s.dragBase ?? s.character };
    }),

  setName: (name) => set((s) => (s.character.name === name ? {} : commit(s, { ...s.character, name }))),

  rollName: () =>
    set((s) => {
      const name = rollName(
        { sex: s.character.body.sex, category: s.character.powerSet.category },
        seededRng(),
      );
      return commit(s, { ...s.character, name });
    }),

  setPowerSet: (powerSet) => set((s) => commit(s, { ...s.character, powerSet })),

  randomiseAll: () =>
    set((s) => {
      const next = randomiseAll(s.character, s.ui.locks, registry, seededRng());
      return { ...commit(s, next), preview: null };
    }),

  randomiseSlot: (slot) =>
    set((s) => {
      if (s.ui.locks.has(slot)) return {};
      const next = randomiseSlot(s.character, slot, registry, seededRng());
      return { ...commit(s, next), preview: null };
    }),

  undo: () =>
    set((s) => {
      const r = undoH(s.history, s.character);
      return r ? { character: r.value, history: r.history, dragBase: null, preview: null } : {};
    }),
  redo: () =>
    set((s) => {
      const r = redoH(s.history, s.character);
      return r ? { character: r.value, history: r.history, dragBase: null, preview: null } : {};
    }),

  load: (c, opts) =>
    set((s) =>
      opts?.history === false
        ? { character: c, history: emptyHistory(), dragBase: null, preview: null }
        : { ...commit(s, c), preview: null },
    ),
  reset: () => set((s) => ({ ...commit(s, DEFAULT_CHARACTER), preview: null })),

  setActiveSlot: (slot) =>
    set((s) => ({
      ui: {
        ...s.ui,
        activeSlot: slot,
        search: slot === s.ui.activeSlot ? s.ui.search : '',
        tags: slot === s.ui.activeSlot ? s.ui.tags : [],
      },
      preview: null,
    })),
  toggleLock: (id) =>
    set((s) => {
      const locks = new Set(s.ui.locks);
      if (locks.has(id)) locks.delete(id);
      else locks.add(id);
      return { ui: { ...s.ui, locks } };
    }),
  setUi: (patch) => set((s) => ({ ui: { ...s.ui, ...patch } })),
  toast: (message) =>
    set((s) => ({ ui: { ...s.ui, toasts: [...s.ui.toasts.slice(-2), { id: ++toastId, message }] } })),
  dismissToast: (id) => set((s) => ({ ui: { ...s.ui, toasts: s.ui.toasts.filter((t) => t.id !== id) } })),
  frameAll: () =>
    set((s) => ({ ui: { ...s.ui, activeSlot: null, cameraNonce: s.ui.cameraNonce + 1 }, preview: null })),
}));

// ---- selectors -----------------------------------------------------------------------------------

export function applyPreview(loadout: Loadout, preview: Preview | null): Loadout {
  if (!preview) return loadout;
  if (loadout[preview.slot] === preview.itemId) return loadout;
  return { ...loadout, [preview.slot]: preview.itemId };
}

/** Slots hidden by an equipped item's `hides` (R-SLOT-05). */
export function hiddenSlots(loadout: Loadout): Map<SlotId, SlotId> {
  const hidden = new Map<SlotId, SlotId>();
  for (const slot of SLOT_IDS) {
    const id = loadout[slot];
    const item = id ? registry.byId(id) : undefined;
    for (const h of item?.hides ?? []) if (!hidden.has(h)) hidden.set(h, slot);
  }
  return hidden;
}

/** Not for use as a useStore selector (returns a new object); combine with useMemo. */
export const effectiveLoadout = (s: Store): Loadout => applyPreview(s.character.loadout, s.preview);
export const canUndo = (s: Store): boolean => s.history.past.length > 0;
export const canRedo = (s: Store): boolean => s.history.future.length > 0;
