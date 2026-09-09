# SuitForge

Browser-based 3D armoured power-suit / superhero character creator. Pick a base figure, adjust skin, height and musculature, swap gear across eleven slots from a built-in library, choose a power set, name your hero, randomise, save, share and export.

**Live:** https://stjake93.github.io/suitforge/

## Run it

```bash
npm install
npm run dev
```

`npm run check` runs typecheck, lint and unit tests. `npm run e2e` runs the Playwright suite (first run: `npx playwright install chromium`).

## Docs

- [Requirements spec](docs/SPEC.md) — locked requirement IDs and hard budgets
- [UX spec](docs/UX.md) — layout, interactions, keyboard map, motion
- [Asset contract](docs/ASSET_CONTRACT.md) — how to author a library item
- [Architecture](docs/ARCHITECTURE.md) — folders, state, rendering pipeline
- [Workflow](docs/WORKFLOW.md) — issues, branches, CI, definition of done

Dev pages: `/#/rigcheck` cycles body extremes with every slot equipped; `/#/thumbs` renders the thumbnail sheet.

Stack: Vite · React 19 · TypeScript · three · react-three-fiber · zustand · vitest · Playwright.
