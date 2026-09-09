# SuitForge — Development Workflow v1.0

## 1. Repository

- GitHub: `StJake93/suitforge`, public. Default branch `main`, protected: PR required, CI green required, linear history.
- Deploy: every merge to `main` builds and publishes to GitHub Pages (`https://stjake93.github.io/suitforge/`).

## 2. Task queue

- GitHub Issues are the queue. Labels: `milestone:M1`…`M5`, `area:engine|ui|library|state|infra`, `type:feature|bug|chore`, `blocked`, `needs-review`.
- Every issue body states the requirement IDs it satisfies and its acceptance test.
- One issue → one branch → one PR. Branch names: `feat/<issue#>-<slug>`, `fix/…`, `lib/<slot>-<theme>`, `chore/…`.
- Agents claim an issue by assigning themselves and commenting "claimed" before starting. Do not work on unclaimed issues in parallel.

## 3. Milestones

| M             | Scope                                                                                                                   | Exit criteria                                  |
| ------------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| M1 Core       | Scaffold, spec, metrics, body, sockets, store, viewport, camera, slot rail, drawer with hover preview, 2 items per slot | SPEC §11 steps 1–2 pass with placeholder items |
| M2 Library    | ≥ 8 items per slot, thumbnails, RigCheck, tags/search                                                                   | R-LIB-01..06                                   |
| M3 Generators | Names, power sets, aura, randomiser with locks, palettes                                                                | R-GEN-01..04                                   |
| M4 Persist    | Saves, autosave, share URL, PNG export, toasts                                                                          | R-SAVE-01..05                                  |
| M5 Polish     | Keyboard map, tablet layout, reduced motion, a11y pass, perf pass, Lighthouse in CI                                     | All T-* budgets, SPEC §11 full walk-through    |

## 4. Definition of done (every PR)

1. `npm run check` (typecheck + lint + unit tests) passes locally and in CI.
2. `npm run e2e` passes for UI changes.
3. PR description lists requirement IDs touched and how each was verified.
4. UI changes include a screenshot or short recording at 1440 px; library changes include the thumbnail sheet and RigCheck screenshots.
5. No new dependencies without a one-line justification in the PR.
6. No changes to `docs/SPEC.md` in a feature PR; spec changes are their own PR.

## 5. Commit style

`<area>: <imperative summary>` — e.g. `ui: add hover preview to item cards (R-UI-03)`. Reference issues with `#12`.

## 6. Commands

```
npm run dev        # Vite dev server
npm run check      # tsc + oxlint + vitest run
npm run test       # vitest run
npm run test:watch
npm run e2e        # Playwright (installs Chromium on first run: npx playwright install chromium)
npm run build      # production build to dist/
npm run stats      # print draw-call/triangle stats for the worst-case loadout
npm run thumbs     # open the thumbnail sheet dev page
npm run format
```
