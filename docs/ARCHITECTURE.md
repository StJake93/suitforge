# SuitForge — Architecture v1.0

Stack: Vite · React 19 · TypeScript (strict) · three · @react-three/fiber · @react-three/drei · camera-controls · zustand · vitest · Playwright · oxlint · Prettier. Deployed as static files to GitHub Pages.

## 1. Folder map

```
src/
  main.tsx               bootstrap, WebGL2 guard
  App.tsx                layout shell: <Viewport/> + panels
  styles/tokens.css      design tokens (UX §2) — the only place colours/sizes are defined
  styles/global.css      reset, layout grid, panel primitives
  character/
    types.ts             Character, Body, Palette, SlotId, SLOT_IDS, PowerSet (R-CHAR-01)
    slots.ts             per-slot metadata: label, allowEmpty, paired, sockets, focus frame
    metrics.ts           computeMetrics(body, pose) → BodyMetrics {joints, radii, sockets}; REF
    pose.ts              hero / oneHand / twoHand joint angles, blend()
    defaults.ts          seeded default character (R-CHAR-08)
  library/
    types.ts             ItemDefinition, BuildContext, ItemBuild, MaterialRole, SocketId, Tag
    kit.ts               geometry helpers (ASSET_CONTRACT §5)
    materials.ts         MaterialSet: role → material, update(palette, override, skin)
    validate.ts          contract checks used by tests (R-LIB-03)
    index.ts             registry: byId, bySlot, all
    <slot>/…             item definitions
  engine/
    Viewport.tsx         <Canvas> config, lighting, environment, platform, character, camera
    CharacterRig.tsx     builds body meshes + socket groups from metrics; updates transforms per frame
    ItemMount.tsx        mounts one equipped item's parts into sockets; owns its MaterialSet
    Body.tsx             stylised body parts (unit geometries scaled by metrics)
    CameraRig.tsx        camera-controls wrapper; focusSlot(), frameAll(); reads store
    Turntable.tsx        platform, drag-to-rotate, auto-rotate, aura ring
    thumbnails.ts        offscreen renderer + cache (R-LIB-06)
    exportPng.ts         2× render to PNG (R-SAVE-04)
  state/
    store.ts             zustand store: character, ui, history; actions
    history.ts           undo/redo ring (≥ 100)
    serialize.ts         toShareString / fromShareString, validate, migrate
    persist.ts           localStorage autosave + save slots
  generators/
    rng.ts               seeded PRNG (mulberry32)
    names.ts             name generator (R-GEN-01)
    powers.ts            power categories + powers (R-GEN-02)
    palettes.ts          curated palettes + triad generator (R-GEN-04)
    randomise.ts         randomiseAll(character, locks, rng), randomiseSlot
  ui/
    TopBar.tsx SlotRail.tsx ItemDrawer.tsx ItemCard.tsx BodyPanel.tsx PalettePanel.tsx
    PowerPopover.tsx SavesDialog.tsx TurntableBar.tsx Toast.tsx KeyboardHelp.tsx icons.tsx
    hooks/useHotkeys.ts
tests/
  unit/                  vitest (jsdom)
  e2e/                   Playwright
```

## 2. State model

Single zustand store (`src/state/store.ts`).

```ts
interface Store {
  character: Character;                 // committed, undoable, persisted
  preview: { slot: SlotId; itemId: string | null } | null;   // transient hover preview
  ui: { activeSlot: SlotId | null; locks: Set<SlotId | 'body' | 'palette' | 'name' | 'power'>;
        autoRotate: boolean; idleAnim: boolean; aura: boolean; search: string; tags: Tag[] };
  history: { past: Character[]; future: Character[] };
  // actions
  equip(slot, itemId | null)            // commits, history step
  setPreview(slot, itemId | null) / clearPreview()
  updateBody(patch, { commit: boolean })  // commit=false during drags, no history
  setPalette / setOverride / setName / setPowerSet
  randomiseAll() / randomiseSlot(slot)
  undo() / redo()
  load(character) / reset()
}
```

- `effectiveLoadout = applyPreview(character.loadout, preview)` is a selector; the engine renders the effective loadout, so preview and commit go through one path.
- Persistence subscribes to `character` and writes autosave (debounced 250 ms).
- History pushes on every committing action; non-committing body updates mutate `character` in place without a history entry, and `updateBody(…, {commit:true})` on release pushes the pre-drag snapshot.

## 3. Rendering pipeline

1. `computeMetrics(body, pose)` is pure and cheap (< 0.1 ms). It produces joint positions and socket transforms for the live body.
2. `CharacterRig` keeps a `Group` per socket. Every frame (or on change) it copies socket transforms from metrics into the groups. Body part meshes are unit geometries positioned/scaled from metrics — **no geometry is rebuilt when sliders move (T-PERF-06).**
3. `ItemMount` builds an item once (`buildCache: Map<itemId, ItemBuild>`), clones parts into the matching socket groups, and owns a `MaterialSet`. On palette/override change it calls `materialSet.update()` which mutates colours in place.
4. Pose changes blend joint angles over 300 ms in `pose.ts`; metrics are recomputed per frame during the blend only.
5. Camera: `camera-controls` via drei `<CameraControls>`; `focusSlot` uses `setLookAt(...,true)` with azimuth preserved (UX §8).
6. Thumbnails: a single offscreen `WebGLRenderer` (128×128, alpha) with its own scene and reference sockets; renders item parts on a neutral mannequin silhouette; `toDataURL` cached per `${itemId}|${paletteHash}`; requests processed in `requestIdleCallback` batches of 4.

## 4. Performance rules

- One `<Canvas>`, `frameloop="always"` (idle anim); set `frameloop="demand"` when idle anim and auto-rotate are both off.
- Geometries are cached in `kit.ts` by argument signature; materials are per-item MaterialSets (≤ 8 materials each); no per-frame allocations in `useFrame` (reuse vectors).
- Never `JSON.stringify` in render paths; selectors are shallow.
- No network fetches at runtime. All assets are code.
- Bundle: three tree-shaken via ESM; drei imported by named path where the bundle check fails.

## 5. Testing strategy

- Unit: metrics monotonicity and socket sanity; pose blend; store actions + history; serialise round-trip + bad input; name generator uniqueness/determinism; randomiser validity and lock respect; library validation (every item builds in Node, budgets, sockets, ids).
- E2E (Chromium): app loads; rail lists 11 slots; selecting slot opens drawer with ≥ 8 cards; hover previews (store state via `window.__suitforge` test hook); equip + undo; share link round trip; keyboard navigation; axe scan; viewport 1440/1024/390 screenshots.
- Perf: `tests/unit/perf.test.ts` asserts each item builds ≤ 30 ms in Node and totals ≤ T-PERF-04 triangle budget for the worst-case loadout.

## 6. Dev pages

Hash routes handled in `App.tsx`: `#/rigcheck` (cycles body extremes with all slots equipped, R-LIB-05) and `#/thumbs` (thumbnail sheet for every item, R-LIB-04). Both excluded from the main UI chrome.
