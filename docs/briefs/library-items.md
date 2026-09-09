# Brief: authoring library items

You are adding procedural gear to SuitForge's library. Read, in order:

1. `docs/ASSET_CONTRACT.md` (the rules: sockets, axes, material roles, budgets, tags).
2. `src/library/kit.ts` (the geometry helpers you must compose from).
3. `src/character/metrics.ts` — `REF` is the reference body; use `ctx.ref.*` for every body-relative size.
4. The existing `src/library/<slot>/vanguard.ts` files as worked examples.

## Deliverable

- For each slot you own: enough new items that the slot has **≥ 8 items total**, spread across **3 theme files** per slot (e.g. `tech.ts`, `mystic.ts`, `brutal.ts` — pick themes that suit the slot). Export a `const <theme>: ItemDefinition[]` from each and list them in the slot's `index.ts`.
- Every item: unique kebab id `<slot>.<name>`, Title Case name ≤ 24 chars, 1–4 tags from the vocabulary, a `build` that composes 3–14 `kit` primitives with a **clearly different silhouette** from every other item in that slot at thumbnail size. Vary height, width, symmetry, and which material roles dominate. Aim for roughly: 40–70 % of the surface `primary`, 10–30 % `secondary`, ≤ 10 % `accent`/`glow`, plus `metal`/`dark` details.
- Helmets: at least two `full-face` helmets that `hides: ['glasses']`; at least two `open-face`. Weapons: a mix of `hands: 1` and `hands: 2`, melee and ranged; two-handed weapons need a foregrip near `y = 0.30`.
- Paired slots (bracers, gloves, legs, boots): use `kit.mirror` and return both L and R parts. Legs and torso items that look like suits should reuse `legUndersuit` / `undersuitCore` / `sleeves` from the vanguard files so the skin is covered.

## Rules

- Only touch files under `src/library/<your slots>/`. Do not modify `kit.ts`, `validate.ts`, `materials.ts`, other slots, docs or tests. If the kit lacks a shape, compose it from primitives.
- Never create materials or import three materials; use `kit.mesh(geometry, role)` only.
- `build` must be pure and must run in Node (tests build every item): no DOM, no async, no randomness.
- Run `npx vitest run tests/unit/library.test.ts` — every item must pass the contract test, including the socket fit envelope (`SOCKET_BOUNDS` in `src/library/validate.ts`). Then run `npx tsc -b` and `npm run lint` and fix anything they report.
- Do not open a browser, do not start dev servers, do not commit. Report back with each item id and a one-line description of its look.

## Sizing cheat sheet (REF body, metres)

head radius ≈ 0.12 · neck radius ≈ 0.055, neck length ≈ 0.08 · chest half-width ≈ 0.19, chest depth ≈ 0.16, chest length (shoulder→waist) ≈ 0.37 · shoulder half-width ≈ 0.27 · pelvis half-width ≈ 0.17 · upper arm r ≈ 0.056, length 0.34 · forearm r ≈ 0.047, length 0.28 · hand size ≈ 0.165, hand length ≈ 0.17 · thigh r ≈ 0.077, length 0.44 · shin r ≈ 0.055, length 0.44 · foot: length 0.26, height 0.085, width 0.10. Always read these from `ctx.ref` rather than hardcoding.
Limb sockets point +Y _down_ the limb (origin at the proximal joint); head/neck/chest/pelvis/foot sockets are upright (+Y up, +Z forward). `back` has +Z pointing backward.
