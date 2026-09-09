# SuitForge — Requirements Specification v1.0

Status: **LOCKED** for v1 (2026-09-09). Changes require a PR that edits this file and is approved by Jake.
Every requirement has an ID. Issues, PRs and tests reference IDs (e.g. `R-SLOT-03`). A requirement is done only when its acceptance criteria are verified by an automated test or a recorded manual check in the PR.

Companion documents (same precedence as this file, they elaborate rather than override):

- `docs/UX.md` — screen layout, interaction rules, keyboard map, motion.
- `docs/ASSET_CONTRACT.md` — how to author an item for the library.
- `docs/ARCHITECTURE.md` — code structure, state model, rendering pipeline.
- `docs/WORKFLOW.md` — branches, PRs, CI gates, definition of done.

---

## 1. Product summary

SuitForge is a browser-based 3D character creator for armoured power-suit / superhero characters. The user picks a base humanoid (male or female), adjusts skin tone, height and musculature, then swaps gear in and out of eleven equipment slots from a built-in library, chooses a power set, names the hero (or lets the generator do it), and can randomise, save, share and export the result.

The primary quality bar is the **gear-swapping UI**: it must feel instant, obvious and satisfying. Rendering fidelity is secondary to responsiveness.

## 2. Targets (hard budgets)

These are CI-enforced where marked ⚙ and manually verified otherwise. Missing a hard budget blocks merge.

| ID          | Target                                                                                                          | Budget                                                                                                                                             | Verified by                                          |
| ----------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| T-PERF-01   | Frame rate on reference device (M1 MacBook Air, Chrome, 1440×900, DPR 2)                                        | ≥ 60 fps steady while idle-animating with all 11 slots equipped and auto-rotate on                                                                 | Manual (Chrome FPS meter) per release                |
| T-PERF-02   | Time from navigation to interactive scene (cold cache, broadband)                                               | ≤ 2.0 s                                                                                                                                            | Lighthouse in CI ⚙ (TTI ≤ 2000 ms on desktop preset) |
| T-PERF-03   | Initial JS payload (gzip)                                                                                       | ≤ 700 kB                                                                                                                                           | Build size check in CI ⚙                             |
| T-PERF-04   | Scene complexity with all slots equipped (meshes merged per role per part at mount)                             | ≤ 150 draw calls, ≤ 200 k triangles                                                                                                                | `npm run stats` + test ⚙                             |
| T-PERF-05   | Equip latency: click on item card → new item visible in 3D view                                                 | ≤ 1 frame (16 ms) after item is built; first build of an item ≤ 30 ms                                                                              | Perf test ⚙ (library build timing)                   |
| T-PERF-06   | Body slider drag                                                                                                | No geometry rebuild during drag; transforms only. 60 fps while dragging                                                                            | Code review + manual                                 |
| T-PERF-07   | Memory                                                                                                          | ≤ 300 MB JS heap after 5 minutes of randomising                                                                                                    | Manual                                               |
| T-QUAL-01   | TypeScript strict mode, zero `any` outside `*.d.ts`                                                             | 0 errors                                                                                                                                           | `tsc -b` ⚙                                           |
| T-QUAL-02   | Lint                                                                                                            | 0 warnings                                                                                                                                         | `oxlint` ⚙                                           |
| T-QUAL-03   | Unit tests                                                                                                      | All pass, ≥ 80 % line coverage on `src/state`, `src/character`, `src/generators`, `src/library/validate`                                           | `vitest` ⚙                                           |
| T-QUAL-04   | End-to-end smoke                                                                                                | Playwright suite passes on Chromium                                                                                                                | ⚙                                                    |
| T-A11Y-01   | Every interactive control keyboard-reachable with a visible focus ring; all icon-only buttons have `aria-label` | Axe: 0 serious/critical                                                                                                                            | Playwright + axe ⚙                                   |
| T-A11Y-02   | Text contrast                                                                                                   | ≥ 4.5:1 for body text, ≥ 3:1 for large text and UI borders                                                                                         | Axe ⚙                                                |
| T-COMPAT-01 | Browsers                                                                                                        | Latest Chrome, Edge, Firefox, Safari (macOS + iPadOS). WebGL2 required; show a friendly fallback message otherwise                                 | Manual per release                                   |
| T-COMPAT-02 | Viewports                                                                                                       | Desktop ≥ 1280 px full layout; tablet 768–1279 px adapted layout (see UX §7); < 768 px shows a "best on a larger screen" banner but must not crash | Playwright at 1440, 1024, 390 ⚙                      |

## 3. Character model

| ID        | Requirement                                                                                                                                                                                                                 |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R-CHAR-01 | A character consists of: `name`, `body`, `palette`, `loadout`, per-slot colour `overrides`, `powerSet`. Exact schema in `src/character/types.ts`, versioned (`version: 1`).                                                 |
| R-CHAR-02 | `body.sex` ∈ {`male`, `female`}. Switching sex preserves every other field; the same gear must fit both bodies (via sockets, see ASSET_CONTRACT §3).                                                                        |
| R-CHAR-03 | `body.skinTone` is a hex colour. The UI offers a curated palette of ≥ 10 tones covering the Fitzpatrick range plus non-human tones (grey, blue, green, gold) and a free colour picker.                                      |
| R-CHAR-04 | `body.height` ∈ [0, 1] maps linearly to 1.55 m – 2.10 m. UI shows the value in cm. Default 0.5.                                                                                                                             |
| R-CHAR-05 | `body.musculature` ∈ [0, 1]: 0 = slender, 0.5 = athletic, 1 = heavyweight. Affects shoulder width, chest depth, limb radii, neck radius. Never affects height. Default 0.5.                                                 |
| R-CHAR-06 | `palette` has `primary`, `secondary`, `accent` hex colours. Every library item maps its surfaces to material roles (ASSET_CONTRACT §4). Changing the palette recolours every item in ≤ 1 frame without rebuilding geometry. |
| R-CHAR-07 | `overrides[slot]` may override any subset of palette roles for that slot only.                                                                                                                                              |
| R-CHAR-08 | Default character on first load is deterministic (seeded) so screenshots and e2e tests are stable.                                                                                                                          |

## 4. Slots and loadout

| ID        | Requirement                                                                                                                                                                                                                                                 |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R-SLOT-01 | Exactly eleven slots in this fixed top-to-bottom order: `helmet`, `headgear`, `glasses`, `neck`, `torso`, `back`, `bracers`, `gloves`, `weapon`, `legs`, `boots`.                                                                                           |
| R-SLOT-02 | Every slot except `torso` and `legs` may be empty (`null`). `torso` and `legs` always hold an item (a plain "undersuit" item is the minimum).                                                                                                               |
| R-SLOT-03 | Equipping an item into a slot replaces the previous item in that slot. Items never occupy more than one slot.                                                                                                                                               |
| R-SLOT-04 | `weapon` items declare `hands: 1 \| 2`. A two-handed weapon changes the character's arm pose to a two-hand grip; a one-handed weapon uses the one-hand ready pose; no weapon uses the neutral hero pose. Pose transitions are animated (≤ 350 ms ease-out). |
| R-SLOT-05 | `helmet` and `headgear` and `glasses` may all be worn together. Items may declare `hides: SlotId[]` (e.g. a full-face helmet hides `glasses`); hidden slots stay in the loadout but are not rendered and the UI shows a "hidden by Helmet" note.            |
| R-SLOT-06 | Each slot can be **locked**. Locked slots are ignored by every randomiser. Locks are UI state, not part of the saved character.                                                                                                                             |
| R-SLOT-07 | Paired slots (`bracers`, `gloves`, `legs`, `boots`) always equip both sides symmetrically.                                                                                                                                                                  |

## 5. Library

| ID       | Requirement                                                                                                                                                                                                                                |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| R-LIB-01 | Launch library: ≥ 8 items per slot (`torso` and `legs` ≥ 8 plus the undersuit). Each item has a unique `id` (`<slot>.<kebab-name>`), display `name`, ≥ 1 `tags` from the controlled vocabulary in ASSET_CONTRACT §6, and a build function. |
| R-LIB-02 | Items are procedural (built from code against the socket reference frames). GLB-backed items follow the same interface and may be added later without UI changes.                                                                          |
| R-LIB-03 | `npm test` fails if any item violates the contract (`src/library/validate.ts`): missing fields, duplicate ids, unknown sockets or tags, build error, part with > 6 000 triangles, item with > 28 meshes, non-role material.                |
| R-LIB-04 | Every item must be visually distinct from every other item in its slot at thumbnail size (128 px). Reviewed manually; the PR includes the thumbnail sheet (`npm run thumbs`).                                                              |
| R-LIB-05 | Every item must fit both sexes at height 0, 0.5, 1 and musculature 0, 0.5, 1 without visible clipping through the body beyond 1 cm. Verified by the `RigCheck` dev page (`/#/rigcheck`) which cycles the extremes.                         |
| R-LIB-06 | Thumbnails are rendered at runtime with an offscreen renderer using the current palette, cached per (item, palette) and produced lazily for the open drawer only. First thumbnail batch for a drawer ≤ 150 ms.                             |

## 6. Generators

| ID       | Requirement                                                                                                                                                                                                                                                                                       |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R-GEN-01 | **Name generator**: deterministic given a seed; takes `sex` and `powerSet.category` as inputs; ≥ 5 distinct patterns; ≥ 60 000 possible outputs overall; the UI roll never repeats any of the previous 20 rolled names (tested). Names are editable and lockable.                                 |
| R-GEN-02 | **Power sets**: ≥ 10 categories (e.g. Energy, Tech, Elemental, Cosmic, Mystic, Might, Speed, Stealth, Psionic, Nature), each with ≥ 6 named powers and a signature colour. User picks one category then up to 3 powers. Category colour drives the platform aura and rim light when "Aura" is on. |
| R-GEN-03 | **Randomiser**: "Randomise all" rerolls every unlocked slot, body, palette, power set and name. Per-slot dice reroll only that slot. Randomising never yields an invalid character (R-SLOT-02, `hides` respected). Randomise is undoable in one step.                                             |
| R-GEN-04 | Randomiser colour choices come from curated harmonious palettes (≥ 12 presets) plus a 20 % chance of a generated triad.                                                                                                                                                                           |

## 7. Viewport and camera

| ID       | Requirement                                                                                                                                                                                                                                                                                                                          |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| R-CAM-01 | The character stands on a circular platform. Drag on the platform or the model rotates the character (turntable), not the camera. Auto-rotate toggle (default on, 6 °/s), pauses while the user interacts, while an item is being previewed and while a slot is active (inspection), resumes after 2 s idle. Drag has light inertia. |
| R-CAM-02 | Orbit camera: drag on empty space orbits, wheel/pinch zooms, right-drag/two-finger pans. Polar angle clamped to [15°, 100°], distance clamped to [0.6 m, 6 m]. Damping on.                                                                                                                                                           |
| R-CAM-03 | Selecting a slot flies the camera to that slot's focus frame (height and distance per slot, azimuth preserved) with a smooth transition of 450–600 ms. Selecting the same slot again, or "Frame all" (F), returns to the full-body frame.                                                                                            |
| R-CAM-04 | Idle animation: subtle breathing and weight shift (amplitude ≤ 1 cm) that never interferes with the fit check. Can be paused.                                                                                                                                                                                                        |
| R-CAM-05 | Lighting: three-point key/fill/rim plus a procedural environment map for metals. No network fetches for lighting or textures.                                                                                                                                                                                                        |
| R-CAM-06 | Rendering: physically based, flat-shaded stylised look, sRGB output, ACES tone mapping, soft contact shadow under the character. DPR capped at 2.                                                                                                                                                                                    |

## 8. UI (summary — full detail in UX.md)

| ID      | Requirement                                                                                                                                                                                                                                                                                                            |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R-UI-01 | Single screen, no page navigation. 3D view fills the viewport; panels overlay it and never obscure the character's centre column at ≥ 1280 px.                                                                                                                                                                         |
| R-UI-02 | **Slot rail** (left): eleven rows in R-SLOT-01 order, each showing icon, slot name, equipped item name, lock toggle, dice, clear. Active slot highlighted. Click selects and opens the drawer.                                                                                                                         |
| R-UI-03 | **Item drawer** (right): grid of item cards for the active slot with thumbnail and name; "None" card where allowed; search box; tag filter chips; equipped card marked. **Hover preview**: hovering a card previews it on the model within 1 frame; leaving reverts; click commits. Keyboard focus behaves like hover. |
| R-UI-04 | **Top bar**: name field with dice and lock; power-set chip opening a popover; Undo/Redo; Randomise all; Save/Load; Share; Export PNG.                                                                                                                                                                                  |
| R-UI-05 | **Body panel**: sex toggle, skin swatches + custom, height slider (cm readout), musculature slider, lock.                                                                                                                                                                                                              |
| R-UI-06 | **Palette panel**: primary/secondary/accent swatches with colour picker, ≥ 12 presets, per-active-slot override toggle, lock.                                                                                                                                                                                          |
| R-UI-07 | **Undo/redo**: every committed change (equip, clear, randomise, body/palette commit, name, power set) is one history step. Slider drags coalesce into one step on release. ≥ 100 steps.                                                                                                                                |
| R-UI-08 | **Keyboard**: full map in UX §6. Includes ↑/↓ slot, ←/→ cycle items, R randomise all, Shift+R randomise slot, L lock, Backspace clear, ⌘/Ctrl+Z / ⇧⌘Z undo/redo, F frame, Space auto-rotate, `/` focus search, Esc close drawer.                                                                                       |
| R-UI-09 | **Motion**: panel open/close ≤ 200 ms, card hover lift ≤ 120 ms, respects `prefers-reduced-motion` (disables camera fly, idle anim and transitions).                                                                                                                                                                   |
| R-UI-10 | All state changes are reflected in the UI within one frame; no spinners inside the creator (thumbnails may show a shimmer placeholder).                                                                                                                                                                                |
| R-UI-11 | Touch: cards equip on tap, preview on long-press (400 ms). Slot rail and drawer scroll independently of the canvas.                                                                                                                                                                                                    |

## 9. Persistence, sharing, export

| ID        | Requirement                                                                                                                                                                                                                                                                                                                                   |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R-SAVE-01 | Save slots in `localStorage` (`suitforge.saves.v1`): unlimited named saves with timestamp and a 96 px PNG thumbnail; load, rename, delete (delete asks to confirm).                                                                                                                                                                           |
| R-SAVE-02 | Autosave the working character to `localStorage` (`suitforge.current.v1`) on every committed change; restored on next visit unless a share URL is present.                                                                                                                                                                                    |
| R-SAVE-03 | **Share URL**: full character encoded in the URL hash (`#c=<base64url>`), ≤ 400 characters for a typical character and ≤ 800 for the worst case (every slot filled with the longest ids and every override set). Opening the URL loads exactly that character. Unknown item ids degrade to `null` (or undersuit) with a toast, never a crash. |
| R-SAVE-04 | **Export PNG**: renders the current view at 2× resolution with transparent background option, filename `<name>.png`.                                                                                                                                                                                                                          |
| R-SAVE-05 | Character JSON schema is validated on load (`src/state/serialize.ts`); forward-compatible via `version`.                                                                                                                                                                                                                                      |

## 10. Non-goals for v1

No accounts or backend, no GLB export, no phone layout, no animation clips beyond idle and pose blends, no physics, no cloth, no facial customisation, no texture painting.

## 11. Acceptance walk-through (release check)

1. Open the deployed URL cold. Scene interactive ≤ 2 s. Default hero visible, auto-rotating.
2. Click each slot in the rail top to bottom: camera flies to each; drawer shows ≥ 8 cards with thumbnails; hovering previews, clicking equips, Undo reverts.
3. Toggle sex, drag height to both ends and musculature to both ends: no clipping > 1 cm on any equipped item, no frame drops.
4. Randomise 20 times: always valid; locked slots never change.
5. Equip a two-handed weapon then a one-handed weapon: pose changes smoothly.
6. Change palette and a per-slot override: recolour is instant.
7. Pick a power set and roll names: names reflect category; aura colour updates.
8. Save, reload the page, load the save. Copy share link, open in a private window: identical character. Export PNG.
9. Tab through the whole UI with keyboard only; every control reachable and operable.
