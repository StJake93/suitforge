import { beforeEach, describe, expect, it } from 'vitest';
import { DEFAULT_CHARACTER } from '@/character/defaults';
import { emptyHistory, HISTORY_LIMIT, push, redo, undo } from '@/state/history';
import {
  fromShareString,
  sanitise,
  shareStringFromHash,
  shareUrlFor,
  toShareString,
} from '@/state/serialize';
import { applyPreview, hiddenSlots, useStore } from '@/state/store';
import { registry } from '@/library';
import {
  AUTOSAVE_KEY,
  addSave,
  deleteSave,
  listSaves,
  readAutosave,
  renameSave,
  writeAutosave,
} from '@/state/persist';

const reset = () =>
  useStore.setState({
    character: DEFAULT_CHARACTER,
    preview: null,
    history: emptyHistory(),
    dragBase: null,
    ui: { ...useStore.getState().ui, activeSlot: null, locks: new Set() },
  });

describe('history (R-UI-07)', () => {
  it('push/undo/redo round trip and caps at the limit', () => {
    let h = emptyHistory<number>();
    for (let i = 0; i < HISTORY_LIMIT + 20; i++) h = push(h, i);
    expect(h.past.length).toBe(HISTORY_LIMIT);
    const u = undo(h, 999)!;
    expect(u.value).toBe(HISTORY_LIMIT + 19);
    expect(u.history.future).toEqual([999]);
    const r = redo(u.history, u.value)!;
    expect(r.value).toBe(999);
    expect(undo(emptyHistory(), 1)).toBeNull();
    expect(redo(emptyHistory(), 1)).toBeNull();
  });
});

describe('store actions', () => {
  beforeEach(reset);

  it('equip commits one history step; undo/redo restore', () => {
    const s = useStore.getState();
    const alt = registry.bySlot('weapon').find((i) => i.id !== DEFAULT_CHARACTER.loadout.weapon)!;
    s.equip('weapon', alt.id);
    expect(useStore.getState().character.loadout.weapon).toBe(alt.id);
    expect(useStore.getState().history.past.length).toBe(1);
    useStore.getState().undo();
    expect(useStore.getState().character.loadout.weapon).toBe(DEFAULT_CHARACTER.loadout.weapon);
    useStore.getState().redo();
    expect(useStore.getState().character.loadout.weapon).toBe(alt.id);
  });

  it('refuses to empty torso/legs and refuses wrong-slot items', () => {
    const s = useStore.getState();
    s.equip('torso', null);
    expect(useStore.getState().character.loadout.torso).toBe(DEFAULT_CHARACTER.loadout.torso);
    s.equip('helmet', DEFAULT_CHARACTER.loadout.torso);
    expect(useStore.getState().character.loadout.helmet).toBe(DEFAULT_CHARACTER.loadout.helmet);
    expect(useStore.getState().history.past.length).toBe(0);
  });

  it('slider drags coalesce into one history step', () => {
    const s = useStore.getState();
    s.updateBody({ height: 0.1 }, false);
    s.updateBody({ height: 0.2 }, false);
    s.updateBody({ height: 0.3 }, false);
    expect(useStore.getState().history.past.length).toBe(0);
    useStore.getState().updateBody({}, true);
    expect(useStore.getState().history.past.length).toBe(1);
    expect(useStore.getState().character.body.height).toBe(0.3);
    useStore.getState().undo();
    expect(useStore.getState().character.body.height).toBe(DEFAULT_CHARACTER.body.height);
    // a commit with nothing dragged is a no-op
    useStore.getState().updateBody({}, true);
    expect(useStore.getState().history.past.length).toBe(0);
  });

  it('preview overlays the loadout without committing', () => {
    const s = useStore.getState();
    const alt = registry.bySlot('helmet')[0]!.id;
    s.setPreview('helmet', null);
    expect(
      applyPreview(useStore.getState().character.loadout, useStore.getState().preview).helmet,
    ).toBeNull();
    expect(useStore.getState().character.loadout.helmet).toBe(DEFAULT_CHARACTER.loadout.helmet);
    useStore.getState().clearPreview();
    expect(useStore.getState().preview).toBeNull();
    useStore.getState().setPreview('helmet', alt);
    useStore.getState().equip('helmet', alt);
    expect(useStore.getState().preview).toBeNull();
  });

  it('cycleItem wraps through None where allowed', () => {
    const s = useStore.getState();
    const n = registry.bySlot('helmet').length;
    for (let i = 0; i < n + 1; i++) useStore.getState().cycleItem('helmet', 1);
    expect(useStore.getState().character.loadout.helmet).toBe(DEFAULT_CHARACTER.loadout.helmet);
    expect(useStore.getState().history.past.length).toBe(n + 1);
    void s;
  });

  it('randomiseAll respects locks and is one undo step', () => {
    useStore.getState().toggleLock('torso');
    useStore.getState().toggleLock('name');
    useStore.getState().randomiseAll();
    const c = useStore.getState().character;
    expect(c.loadout.torso).toBe(DEFAULT_CHARACTER.loadout.torso);
    expect(c.name).toBe(DEFAULT_CHARACTER.name);
    expect(useStore.getState().history.past.length).toBe(1);
    useStore.getState().undo();
    expect(useStore.getState().character).toEqual(DEFAULT_CHARACTER);
  });

  it('hiddenSlots reflects hides', () => {
    const full = registry.all.find((i) => i.hides?.includes('glasses'));
    if (!full) return;
    const loadout = { ...DEFAULT_CHARACTER.loadout, [full.slot]: full.id };
    expect(hiddenSlots(loadout).get('glasses')).toBe(full.slot);
  });
});

describe('serialisation (R-SAVE-03, R-SAVE-05)', () => {
  it('share string round-trips exactly and stays ≤ 400 chars', () => {
    const c = {
      ...DEFAULT_CHARACTER,
      name: "Zé “Storm” O'Neil|x,y",
      overrides: { helmet: { primary: '#ff0000' }, boots: { accent: '#00ff00', secondary: '#123456' } },
      powerSet: { category: 'mystic', powers: ['Hex Bolt', 'Rune Blade'] },
    };
    const s = toShareString(c);
    expect(s.length).toBeLessThanOrEqual(400);
    expect(s).toMatch(/^[A-Za-z0-9_-]+$/);
    const r = fromShareString(s, registry)!;
    expect(r.dropped).toEqual([]);
    expect(r.character).toEqual({ ...c, loadout: c.loadout });
    expect(shareStringFromHash(shareUrlFor(c, 'https://x.test/'))).toBe(s);
  });

  it('worst-case loadout stays within the 800-char budget', () => {
    const loadout = { ...DEFAULT_CHARACTER.loadout };
    for (const slot of Object.keys(loadout) as Array<keyof typeof loadout>) {
      const longest = [...registry.bySlot(slot)].sort((a, b) => b.id.length - a.id.length)[0];
      loadout[slot] = longest?.id ?? null;
    }
    const overrides = Object.fromEntries(
      Object.keys(loadout).map((s) => [s, { primary: '#112233', secondary: '#445566', accent: '#778899' }]),
    );
    const c = {
      ...DEFAULT_CHARACTER,
      name: 'X'.repeat(40),
      loadout,
      overrides,
      powerSet: { category: 'elemental', powers: ['Firestorm', 'Frost Grip', 'Thunder Call'] },
    };
    expect(toShareString(c).length).toBeLessThanOrEqual(800);
  });

  it('unknown items degrade to null/undersuit and are reported', () => {
    const r = sanitise(
      {
        ...DEFAULT_CHARACTER,
        loadout: { ...DEFAULT_CHARACTER.loadout, helmet: 'helmet.does-not-exist', torso: 'torso.nope' },
      },
      registry,
    );
    expect(r.dropped).toEqual(['helmet.does-not-exist', 'torso.nope']);
    expect(r.character.loadout.helmet).toBeNull();
    expect(r.character.loadout.torso).toBe(registry.bySlot('torso')[0]!.id);
  });

  it('garbage input never throws', () => {
    for (const junk of [
      null,
      42,
      'x',
      [],
      {},
      { body: 'no', loadout: 5, palette: null, powerSet: { category: 3, powers: 'a' } },
    ]) {
      const r = sanitise(junk, registry);
      expect(r.character.version).toBe(1);
      expect(r.character.loadout.torso).not.toBeNull();
    }
    expect(fromShareString('!!!not base64!!!', registry)).toBeNull();
    expect(fromShareString('AAAA', registry)).toBeNull();
  });
});

describe('persistence (R-SAVE-01, R-SAVE-02)', () => {
  beforeEach(() => localStorage.clear());
  it('autosave round trip', () => {
    writeAutosave(DEFAULT_CHARACTER);
    expect(localStorage.getItem(AUTOSAVE_KEY)).toBeTruthy();
    expect(readAutosave()).toEqual(DEFAULT_CHARACTER);
  });
  it('save slots add/rename/delete', () => {
    const e = addSave('First', DEFAULT_CHARACTER, null);
    expect(listSaves().map((s) => s.id)).toEqual([e.id]);
    renameSave(e.id, 'Renamed');
    expect(listSaves()[0]!.name).toBe('Renamed');
    deleteSave(e.id);
    expect(listSaves()).toEqual([]);
  });
  it('tolerates corrupt storage', () => {
    localStorage.setItem(AUTOSAVE_KEY, '{not json');
    expect(readAutosave()).toBeNull();
    localStorage.setItem('suitforge.saves.v1', '[1,2,{"id":"x","character":{}}]');
    expect(listSaves().length).toBe(1);
  });
});
