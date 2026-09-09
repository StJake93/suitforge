# SuitForge — UX Specification v1.0

Read with `docs/SPEC.md` §8. IDs here are `UX-*`. The single-screen layout below is the design; deviations need a PR against this file.

## 1. Design principles

1. **The model is the hero.** UI is glass panels over the viewport; nothing sits in the centre column at desktop widths.
2. **Everything previews before it commits.** Hover = try it on, click = keep it. No modal confirms except delete-save.
3. **One gesture per intent.** Select slot → camera goes there and the drawer opens. No second click needed.
4. **State is always visible.** Equipped item names live in the rail; the active slot is unmistakable; locks are obvious.
5. **Fast beats fancy.** Any interaction that cannot resolve in one frame is designed to show its result progressively (shimmer thumbnails), never with a blocking spinner.

## 2. Visual language

- Theme: dark. Background `#0b0e14`; panel surface `rgba(18,22,31,0.72)` with `backdrop-filter: blur(14px)`; border `rgba(255,255,255,0.08)`.
- Text: primary `#e8ecf3`, secondary `#8b93a5`. Font: `Inter, ui-sans-serif, system-ui` (system fallback, no webfont fetch). Sizes: 12 / 13 / 15 / 20 / 28.
- Accent (UI): `#5ee1ff` (cyan). Danger `#ff5e7a`. Success `#7dff9b`. Locked `#ffc857`.
- Radius: 10 px panels, 8 px cards, 999 px pills. Spacing scale 4/8/12/16/24.
- Icons: inline SVG, 20 px, stroke 1.75 px, from `src/ui/icons.tsx`. One glyph per slot (see §4).
- All tokens live in `src/styles/tokens.css`; components never hardcode colours.

## 3. Layout (≥ 1280 px)

```
┌───────────────────────────────────────────────────────────────────────┐
│ TOPBAR  [SUITFORGE]  [Name ▢ 🎲 🔒] [⚡ Power set ▾]   … [↶][↷] [🎲 Randomise] [💾][🔗][📷] │
├────────────┬───────────────────────────────────────────┬──────────────┤
│ SLOT RAIL  │                                           │ ITEM DRAWER  │
│ ▸ Helmet   │                                           │ Helmet  (12) │
│   Headgear │                                           │ [search…]    │
│   Glasses  │             3D VIEWPORT                   │ [tags chips] │
│   Neck     │         (turntable + camera)              │ ┌──┐┌──┐┌──┐ │
│   Torso    │                                           │ │  ││  ││  │ │
│   Back     │                                           │ └──┘└──┘└──┘ │
│   Bracers  │                                           │ ┌──┐┌──┐┌──┐ │
│   Gloves   │                                           │ …            │
│   Weapon   │                                           │              │
│   Legs     │                                           │ Override ▢   │
│   Boots    │                                           │              │
├────────────┴───────────────┬───────────────────────────┴──────────────┤
│ BODY PANEL (bottom-left)   │ TURNTABLE (bottom-centre) │ PALETTE (bottom-right) │
└───────────────────────────────────────────────────────────────────────┘
```

- Slot rail: 232 px wide, fixed left, full height under the top bar.
- Item drawer: 360 px wide, fixed right, slides in from the right when a slot is active; closes with Esc, the ✕, or clicking the active slot again.
- Body panel and palette panel: 300 px each, bottom corners; collapsible to a 40 px header.
- Turntable strip: bottom centre pill: [⟲ auto-rotate] [⤢ frame all] [⏸ idle] [◐ aura].
- Nothing overlaps the centre 40 % of the viewport width at ≥ 1280 px.

## 4. Slot rail (UX-RAIL)

| ID         | Rule                                                                                                                                                                                                                                                                                         |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| UX-RAIL-01 | Rows in order: Helmet, Headgear, Glasses, Neck, Torso, Back, Bracers, Gloves, Weapon, Legs, Boots. Each row: glyph, slot label (13 px), equipped item name (12 px secondary, "None" italic when empty), then on hover/focus/active: lock, dice, clear buttons (icon-only with `aria-label`). |
| UX-RAIL-02 | Active row: accent left border 3 px, surface lightened, glyph tinted accent. Locked row: lock icon persistent, amber. Hidden-by-another-item row: name shown struck-through with tooltip "Hidden by Helmet".                                                                                 |
| UX-RAIL-03 | Click row → set active slot, fly camera, open drawer. Click active row → deselect, camera returns to full frame, drawer closes.                                                                                                                                                              |
| UX-RAIL-04 | Dice on a row rerolls only that slot (respects lock: disabled when locked). Clear disabled for torso and legs.                                                                                                                                                                               |
| UX-RAIL-05 | Glyphs: helmet=helm outline, headgear=circlet/antenna, glasses=visor, neck=collar arc, torso=chestplate, back=wings, bracers=forearm band, gloves=fist, weapon=blade, legs=greaves, boots=boot.                                                                                              |

## 5. Item drawer (UX-DRAWER)

| ID           | Rule                                                                                                                                                                                                                                                                           |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| UX-DRAWER-01 | Header: slot name, item count, ✕. Search input filters by name and tags (case-insensitive substring, instant). Tag chips toggle AND-filters.                                                                                                                                   |
| UX-DRAWER-02 | Grid: 3 columns of square cards (thumbnail 1:1, name below, 12 px). First card is "None" (dashed outline) when the slot allows empty.                                                                                                                                          |
| UX-DRAWER-03 | Card states: default; hover (lift 2 px, border accent 40 %); equipped (accent border 100 % + check badge); previewing (dashed accent border); focus-visible (2 px accent ring).                                                                                                |
| UX-DRAWER-04 | Hover preview: pointerenter → preview applied to the model on the next frame; pointerleave → revert; click → commit (history step) and stop previewing. Keyboard: focus behaves as hover; Enter/Space commits. Touch: tap commits; long-press (400 ms) previews until release. |
| UX-DRAWER-05 | Thumbnail placeholder: shimmer block until rendered (R-LIB-06). Thumbnails use the current palette and override for that slot.                                                                                                                                                 |
| UX-DRAWER-06 | Footer: "Colour override for this slot" toggle; when on, shows three role swatches for the slot.                                                                                                                                                                               |
| UX-DRAWER-07 | Drawer scrolls independently; wheel over the drawer never zooms the camera.                                                                                                                                                                                                    |

## 6. Keyboard map (UX-KEYS)

| Key                                        | Action                                                                                        |
| ------------------------------------------ | --------------------------------------------------------------------------------------------- |
| ↑ / ↓                                      | Previous / next slot (wraps)                                                                  |
| ← / →                                      | Previous / next item in active slot (wraps, includes None where allowed); commits immediately |
| Enter / Space on a card                    | Equip                                                                                         |
| R                                          | Randomise all (unlocked)                                                                      |
| Shift + R                                  | Randomise active slot                                                                         |
| L                                          | Toggle lock on active slot                                                                    |
| Backspace / Delete                         | Clear active slot (if allowed)                                                                |
| ⌘/Ctrl + Z, ⇧⌘/Ctrl+Shift + Z (and Ctrl+Y) | Undo / Redo                                                                                   |
| F                                          | Frame full body                                                                               |
| Space (not on a control)                   | Toggle auto-rotate                                                                            |
| /                                          | Focus drawer search                                                                           |
| Esc                                        | Close drawer / blur search                                                                    |
| N                                          | Roll a new name (if not locked)                                                               |
| ?                                          | Show keyboard help overlay                                                                    |

Shortcuts are suppressed while typing in a text field.

## 7. Tablet layout (768–1279 px)

- Slot rail collapses to a 64 px icon rail with tooltips; the active slot label appears in the drawer header.
- Item drawer becomes a bottom sheet (45 % height) with a 4-column grid; swipe down or ✕ closes.
- Body and palette panels become tabs inside the bottom sheet ("Gear", "Body", "Colours", "Power").
- Top bar keeps name, power chip, randomise, undo/redo; save/share/export move into an overflow menu.

## 8. Camera focus frames (UX-CAM)

Per slot: target height as a fraction of body height, and distance in metres (scaled by body height / 1.8).

| Slot                      | target (fraction of height) | distance |
| ------------------------- | --------------------------- | -------- |
| helmet, headgear, glasses | 0.93                        | 1.25     |
| neck                      | 0.86                        | 1.35     |
| torso, back               | 0.70                        | 2.0      |
| bracers, gloves, weapon   | 0.55                        | 1.9      |
| legs                      | 0.35                        | 2.1      |
| boots                     | 0.08                        | 1.5      |
| full body                 | 0.50                        | 4.3      |

Azimuth preserved; polar eased toward 80° for boots, 75° otherwise. `back` additionally rotates the turntable 180° so the back faces the camera, and rotates it back when leaving the slot.

## 9. Motion

- Drawer slide: 200 ms `cubic-bezier(.2,.8,.2,1)`. Cards: 120 ms transform/border.
- Camera fly: camera-controls smooth transition, ~500 ms.
- Pose blend (weapon change): 300 ms ease-out on joint angles.
- Randomise: items pop in with a 150 ms scale from 0.9 → 1 staggered 20 ms per slot (max 220 ms total). Skipped under reduced motion.
- `prefers-reduced-motion`: all of the above become instant; idle anim and auto-rotate default off.

## 10. Feedback and errors

- Toasts (bottom-centre, 3 s): "Saved", "Link copied", "PNG exported", "Some items were missing and were removed" (share link with unknown ids).
- WebGL unavailable: full-screen message with browser suggestions; no console errors.
- Never show raw error text to the user.
