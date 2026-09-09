# SuitForge — guide for agents

Browser 3D armoured-suit / superhero character creator. Vite + React 19 + TypeScript strict + three/react-three-fiber + zustand.

## Read first, in this order
1. `docs/SPEC.md` — locked requirements with IDs and hard budgets. Never edit in a feature PR.
2. `docs/UX.md` — layout, interaction, keyboard map, motion.
3. `docs/ASSET_CONTRACT.md` — how to author library items (sockets, material roles, budgets).
4. `docs/ARCHITECTURE.md` — folders, state model, rendering pipeline.
5. `docs/WORKFLOW.md` — issues, branches, PR definition of done.

## Hard rules
- The gear-swap UX is the product. Equip/preview must resolve in one frame. Never add a blocking spinner inside the creator.
- No geometry rebuild on body slider drag: sockets carry scale; items are authored in socket-local space against `REF`.
- Items never create materials; use `ctx.mat(role)`.
- No runtime network fetches. No new dependencies without justification.
- All colours/sizes come from `src/styles/tokens.css`.
- Keep `npm run check` green; add or update tests with every change; reference requirement IDs in PRs.

## Commands
```
npm run dev · npm run check · npm run test · npm run e2e · npm run build
```
