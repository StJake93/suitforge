# Art direction options — assessment (2026-09-09)

Status: **proposal, not locked**. Jake picks a direction; the chosen option then becomes a SPEC change PR.

Context: the mechanics work but the current presentation (grey-blue glass panels, small rail, flat procedural look) is hurting the fun factor. Three directions were assessed. Effort figures are order-of-magnitude, in focused hours; "agent" means the current agentic team can do it unattended against the spec, "human" means it needs an artist or purchased assets.

## Option A — Realistic (Destiny 2 fidelity)

What "realistic" actually requires: sculpted high-poly assets baked to game meshes (20–60 k tris each) with 2–4 K PBR texture sets (albedo, normal, roughness, metal, emissive), a proper skinned body with morph targets for height and musculature, skin subsurface shading, hair, cloth, HDRI lighting and post-processing (TAA, bloom, SSAO). On the web that also means Draco/meshopt compression, KTX2 textures, LODs and per-slot streaming so a 106-item library does not weigh hundreds of megabytes.

The structural cost is bigger than the art cost. Realistic gear cannot use our socket-scale trick; it must be **skinned to the body rig and carry the same morph targets** as the body so height and musculature deform it. That is a re-architecture of body variation and of the asset contract, and every item must be modelled on the base body and morph-transferred.

| Work                                                                                      | Who                                                                                     | Hours                                      |
| ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------ |
| Base body (male/female), rig, height/muscle morphs, skin shader                           | human + agent                                                                           | 60–100                                     |
| Engine: GLTF/KTX2 pipeline, skinning + morphs on items, LOD/streaming, post FX            | agent                                                                                   | 60–100                                     |
| Blender pipeline: template .blend with body + sockets, headless export/validate script    | agent                                                                                   | 20–30                                      |
| 106 items modelled, textured, fitted, morph-transferred                                   | human (2–6 h each); AI-mesh (Meshy/Tripo) + cleanup roughly halves it with quality risk | 300–600                                    |
| Purchased modular kits instead of modelling: fitting/re-topology per item, licence review | human                                                                                   | 100–200 (+ licence cost, consistency risk) |
| **Total**                                                                                 |                                                                                         | **≈ 500–900**                              |

Blender hookup: yes, this route needs it. Headless `blender --background --python` with a template scene is the lightweight version; agents can drive export/validation but not the sculpting and texturing that produce realism. Procedural code (ours or Blender geometry nodes) cannot deliver Destiny-grade surfaces.

Verdict: highest ceiling, roughly ten times the cost of the other options, and the bulk of the cost is not agent-addressable.

## Option B — Keep 3D, Destiny-inspired presentation + material polish

The Destiny screens are mostly **presentation**: character centred with lots of negative space, gear tiles in two columns flanking the body (weapons left, armour right), a hero number, item tiles with rarity borders and rendered icons, hover-driven detail panels, monochrome iconography, subtle geometric decor, no boxed panels. None of that depends on asset fidelity, and our engine already renders per-item thumbnails.

| Work                                                                                                                                                                                     | Who   | Hours        |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | ------------ |
| UI rework: flanking slot tiles, hover detail panel, identity/body/colour as tabs, typography and iconography pass, motion                                                                | agent | 40–80        |
| Visual polish on the existing 3D: studio three-point lighting + HDRI-style environment, bloom/SSAO/vignette post, fix z-fighting and breathing shimmer, camera framing, body proportions | agent | 20–40        |
| Material upgrade without re-authoring: bevel shading, procedural trim/wear detail via triplanar shader, decals, better metal/glass                                                       | agent | 20–40        |
| **Total**                                                                                                                                                                                |       | **≈ 80–160** |

Verdict: reaches perhaps 60 % of the reference feel at 10–15 % of Option A's cost, keeps every mechanic and the whole library, and attacks the stated problem (the UI) directly.

## Option C — Stylised modern-retro 16-bit

Two very different routes.

**C1. Render the existing 3D as pixel art.** Keep the engine, the library, sliders, turntable and zoom; add a pixel post-pipeline: render at ¼ resolution to a target, quantise to a 32–64 colour palette, 1-px outlines from depth/normal edges, cel-banded lighting with fixed light angles, optional dithering, nearest-neighbour upscale, rotation snapped to 8 or 16 facings, UI redone with a pixel font and chunky panels. Our chunky flat-shaded procedural items suit this well (this is how Dead Cells and similar titles get consistent sprites).

| Work                                                                               | Who   | Hours        |
| ---------------------------------------------------------------------------------- | ----- | ------------ |
| Pixel render pipeline (low-res target, palette quantise, outline, cel light, snap) | agent | 30–50        |
| Pixel-style UI (fonts, panels, tiles, motion)                                      | agent | 30–50        |
| Item silhouette pass so everything reads at 64–96 px                               | agent | 20–40        |
| **Total**                                                                          |       | **≈ 80–140** |

Risk: it can read as "3D with a filter" unless silhouettes, palettes and facings are designed for it; the silhouette pass and snapping mitigate most of that.

**C2. Hand-drawn sprites.** Sliders do not exist in pixel art, so height and musculature become a handful of discrete bodies. Even with 2 bodies × 4 facings × 106 items that is 848 sprites at 30–60 min each: 400–800 hours, and AI generators cannot keep facings consistent (the Fridge Raiders lesson). Not recommended.

## Recommendation

1. **Do Option B first**, UI rework and 3D polish, as a two-week agent sprint. It targets the actual complaint, preserves all mechanics and the library, and is cheap enough to throw away if you later change direction.
2. **Then decide** with the polished build in hand. If the look still is not fun, **C1 is the cheapest true art-direction pivot** and keeps everything you have built.
3. **Treat Option A as a separate product decision**, not a refinement: it needs artists or purchased assets and a body-variation re-architecture. A Blender pipeline only pays off on that route (or later, for a few hand-modelled hero pieces mixed into the procedural library).

## Note on the breathing "aliasing"

The shimmer in the recording is not texture aliasing. Consecutive frames show hatched patterns on coplanar faces (boot toe caps against soles, gauntlet plates, undersuit sleeve against bracer cuff) that change as the idle bob moves the model a few millimetres: classic **z-fighting**. Contributing factors: the camera near plane at 0.05 m with a far plane of 60 m (poor depth precision), authored items with faces at exactly the same offset as neighbouring parts, and thin dark straps rendered without depth bias. Fixes are cheap (near plane 0.15, logarithmic depth buffer or polygon offset on secondary layers, an authoring rule of ≥ 3 mm clearance between stacked plates) and belong to the polish pass in Option B.
