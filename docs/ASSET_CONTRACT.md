# SuitForge — Asset Contract v1.0

How to author a library item. Every item in `src/library/<slot>/*.ts` must follow this file; `src/library/validate.ts` enforces the machine-checkable parts and `npm test` runs it.

## 1. Item definition

```ts
export interface ItemDefinition {
  id: string;            // "<slot>.<kebab-name>", unique across the library
  slot: SlotId;
  name: string;          // ≤ 24 chars, Title Case
  tags: Tag[];           // ≥ 1, from the vocabulary in §6
  hands?: 1 | 2;         // weapon only, required for weapon
  hides?: SlotId[];      // slots not rendered while this item is equipped
  build: (ctx: BuildContext) => ItemBuild;
}

export interface BuildContext {
  ref: BodyMetrics;       // the REFERENCE body (male, height 0.5, musculature 0.5); author against this
  mat: (role: MaterialRole) => THREE.Material; // shared, palette-driven materials — always use this
  kit: Kit;               // geometry helpers (§5)
}

export interface ItemBuild {
  parts: Array<{ socket: SocketId; object: THREE.Object3D }>;
}
```

Rules:
- `build` is pure: no side effects, no globals, no async, no texture/network loads. It is called once per item and cached; it must run in Node (vitest) as well as the browser, so use `three` classes only, never DOM.
- Return one part per socket the item attaches to. Paired slots return both sides (§3.3).
- Never create materials: call `ctx.mat(role)`. This is how palette changes recolour instantly.
- Budgets: ≤ 24 meshes per item, ≤ 6 000 triangles per part, ≤ 10 000 per item. Meshes are merged per material role per part at mount time, so draw calls depend on roles used, not mesh count. Use `kit` primitives; low-poly, flat-shaded silhouettes read better than detail.

## 2. Coordinate conventions

- Units: metres. Y up. Character faces **+Z** (toward the default camera). +X is the character's **left**.
- Limb sockets (`upperArm*`, `forearm*`, `thigh*`, `shin*`) point +Y **down the limb**, with +Z kept as close to world-forward as the pose allows; as a consequence their +X points to the character's **right**. Head, neck, chest, pelvis and foot sockets are upright (+Y up, +Z forward, +X character's left).
- Each part is authored in **socket-local space** for the reference body. Origin = socket origin. The runtime parents the part to the live socket, whose transform (position, rotation, per-axis scale) adapts it to the current sex/height/musculature. You do not handle body variation yourself.

## 3. Sockets

Socket origin/axes are defined for the reference body. `scale` describes what the runtime scales along each axis so authors know what stretches.

| Socket | Origin | Axes | Runtime scale |
|---|---|---|---|
| `head` | centre of the skull | +Y up, +Z face | uniform: head radius |
| `neck` | base of the neck (top of shoulders) | +Y up | x,z: neck radius; y: neck length |
| `chest` | centre of the torso at nipple height | +Y up, +Z front | x: shoulder width; y: torso length; z: chest depth |
| `back` | same as `chest` but origin on the back surface, +Z points **backward** | | x: shoulder width; y: torso length; z: uniform |
| `pelvis` | centre of the hips | +Y up | x: hip width; y,z: uniform |
| `upperArmL/R` | shoulder joint | +Y **down the limb** toward the elbow | y: segment length; x,z: limb radius |
| `forearmL/R` | elbow joint | +Y down toward the wrist | y: segment length; x,z: limb radius |
| `handL/R` | wrist joint | +Y toward fingertips, +Z palm-forward | uniform: hand size |
| `weapon` | right palm grip point | +Y along the weapon's long axis (blade/barrel), +Z away from the palm | uniform: hand size |
| `thighL/R` | hip joint | +Y down toward the knee | y: length; x,z: radius |
| `shinL/R` | knee joint | +Y down toward the ankle | y: length; x,z: radius |
| `footL/R` | ankle joint | +Y **up**, +Z toward toes; the sole is at `y = -REF.footH` | uniform: foot size |

Reference dimensions are exported as `REF` from `src/character/metrics.ts` (e.g. `REF.headRadius`, `REF.forearmLength`) so authors can size parts numerically.

### 3.1 Which sockets each slot may use

| Slot | Allowed sockets |
|---|---|
| helmet, headgear, glasses | `head` |
| neck | `neck`, `chest` |
| torso | `chest`, `pelvis`, `neck`, `upperArmL/R` (pauldrons, sleeves), `forearmL/R` (sleeves) |
| back | `back` |
| bracers | `forearmL/R` |
| gloves | `handL/R` |
| weapon | `weapon` (and optionally `handL` for a foregrip cosmetic) |
| legs | `pelvis`, `thighL/R`, `shinL/R` |
| boots | `footL/R`, `shinL/R` (cuffs) |

### 3.2 Weapons

- Grip at origin. Long axis +Y. A rifle has its stock along −Y (≤ 0.25 m) and barrel along +Y.
- `hands: 2` weapons should place a foregrip around `y = 0.30` m; the left hand is posed there.
- Max length 1.4 m. Nothing below `y = −0.35` m (would intersect the leg).

### 3.3 Paired slots

Return both parts. Use `kit.mirror(buildOneSide)`: it builds the right side and produces the left by cloning with `scale.x = -1` (the renderer handles winding). Author the **right** side.

## 4. Material roles

| Role | Meaning | Palette-driven |
|---|---|---|
| `primary` | main armour plating | yes |
| `secondary` | undersuit / secondary plating | yes |
| `accent` | trims, lights, emblems (emissive tint) | yes |
| `metal` | bare polished metal | no (fixed) |
| `dark` | rubber, straps, joints | no |
| `glass` | visors, lenses (transparent) | tint from accent |
| `glow` | emissive elements | accent, emissive |
| `skin` | exposed skin (rarely used by items) | body skin tone |

Every mesh must use one of these via `ctx.mat(role)`. Roughly: 40–70 % of an item's surface `primary`, 10–30 % `secondary`, ≤ 10 % `accent`/`glow`.

## 5. Kit helpers (`src/library/kit.ts`)

`box(w,h,d)`, `rbox(w,h,d,r)` (rounded), `capsule(r,len)`, `cyl(rTop,rBot,h,segments)`, `arc(rTop,rBot,h,thetaStart,thetaLength)` (open partial cylinder, theta 0 = front), `cone(r,h)`, `hemi(r)`, `sphere(r)`, `plate(w,h,thick,bevel)`, `lathe(profile)`, `prism(sides,r,h)`, `mesh(geometry, role)`, `group(...objects)`, `at(object, x,y,z, rx?,ry?,rz?)`, `mirror(fn)`, `ring(r, tube)`. All geometries are flat-shaded and cached by argument signature. Prefer composing 3–8 primitives with clear silhouette changes over many small details.

## 6. Tag vocabulary

Style: `tech`, `armour`, `stealth`, `mystic`, `cosmic`, `nature`, `retro`, `heavy`, `light`, `elegant`, `brutal`.
Function: `ranged`, `melee`, `energy`, `flight`, `utility`, `visor`, `full-face`, `open-face`.
Each item: 1–4 tags. Search uses tags.

## 7. Naming and files

- One file per item group: `src/library/<slot>/<theme>.ts` exporting `ItemDefinition[]`; `src/library/<slot>/index.ts` concatenates. `src/library/index.ts` builds the registry.
- Ids: `torso.vanguard-plate`, `weapon.pulse-rifle`. Never rename an id once merged (share links depend on it); deprecate by adding to `LEGACY_IDS` in `src/library/legacy.ts`.

## 8. Definition of done for an item PR

1. `npm test` passes (contract validation, budgets).
2. `npm run thumbs` output attached: the item is distinct at 128 px.
3. `RigCheck` page screenshot at the six body extremes (§ R-LIB-05): no clipping > 1 cm.
4. Item looks intentional on both sexes with the default palette and with the "Midnight" preset.
