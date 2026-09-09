# Art direction options — assessment v2 (2026-09-09)

Status: **proposal, not locked**. Jake picks a direction; the chosen option then becomes a SPEC change PR.

v2 adds Option D after reviewing Human Atlas, Boomba Rally, PlayCanvas, Higgsfield and ElevenLabs, and re-checking what 2026 image-to-3D generators actually deliver. The v1 options (A hand-modelled realistic, B presentation polish, C 16-bit) are kept below for reference.

## What the references actually tell us

- **Human Atlas** (React + three.js + Vite) renders a CC-BY anatomy dataset (BodyParts3D, 2.3 M triangles simplified, 2,234 selectable structures). The fidelity comes from a pre-existing high-quality dataset, not from modelling; the engineering trick is one merged mesh with per-structure visibility and selection driven by GPU textures. For us the lesson is the presentation: a neutral display mannequin with parts that toggle and explode cleanly. We do not need their visibility trick at 11 slots × a few sub-parts each.
- **Boomba Rally** is a robot-vacuum kart game by Overflow Studio. Its "16 hours" is a statement about scope and tooling (PlayCanvas editor, AI-generated assets, AI audio), not about asset fidelity: the racers are simple hard-surface objects with good lighting and post. That is exactly the asset class that AI 3D generation is best at, and armour is the same class.
- **PlayCanvas** is a full engine + browser editor with first-class glTF/PBR, WebGPU and Gaussian splats. Nothing in it raises our fidelity ceiling over three.js: PBR, glTF, KTX2, HDRI lighting and post are equivalent. Its editor helps when you are building levels; our scene is one mannequin on a platform. Switching would cost a rewrite for no visual gain. Keep react-three-fiber.
- **Higgsfield** bundles image generation (Nano Banana Pro, GPT Image), Tripo-based image-to-3D (`image_to_3d`, `multi_image_to_3d`, PBR maps, humanoid auto-rigging, 100–300 k target polycount, symmetry enforcement) and a scene tool (3D Jutsu, GLB export). Its value to us is one account and one API for concept images plus 3D generation. Meshy and Tripo direct APIs do the same 3D step cheaper (Tripo ≈ $0.15–0.35 per generation, Meshy ≈ $0.75–1.20) with more control.
- **ElevenLabs** is voice and sound. Useful for polish (a name-reveal announcer, UI sounds), irrelevant to fidelity.

## Option D — AI-generated realistic parts on a display mannequin

The realism you are describing is achievable at "well-lit, game-ready hard-surface asset" quality, and a display mannequin sidesteps the hardest realism problem (skin, hair, faces). Iron Man-*like* is reachable; a true likeness is a trademark problem, not a technical one.

**Body.** A realistic base mesh from Blender Studio's CC0 Human Base Meshes (male and female), rendered as a matte display mannequin with a skin-tone tint and no facial realism. Height and musculature become two shape keys authored in Blender (agent-scriptable: proportional bone scaling and a "heavy" sculpt pass) and exported as glTF morph targets. Socket transforms are computed in Blender per morph extreme and interpolated at runtime, replacing the hand-written metrics maths with data. Gear stays rigid and fits via socket scale exactly as now; rigid PBR parts tolerate the ±15 % non-uniform scale our bodies need.

**Items.** Per item: a concept image in a locked hard-surface style (front + ¾ views on neutral background, symmetry enforced) → image-to-3D with PBR → headless Blender clean-up script (centre pivot on the socket origin, symmetrise, decimate to ≤ 15 k triangles, bake textures to 1 K KTX2, export GLB with socket naming) → the existing `validate.ts` extended for GLB (envelope, triangle budget, material roles). Three candidates per item, a human picks one. Palette recolouring on AI textures needs a mask: cluster the albedo into primary/secondary/accent regions (k-means, agent script) and recolour through the mask. This works well on flat-regioned hard-surface textures and is the main technical risk.

**Presentation.** The Destiny-style layout from Option B, a bundled 1 K studio HDRI (Poly Haven, CC0), SSAO, bloom, ACES, contact shadow, and an exploded-view toggle that slides each part out along its socket normal. Exploded view is trivial with rigid parts.

**Known quality limits** (what it will look like up close): soft edges on some hard-surface pieces, mushy sub-centimetre detail (rivets, vents), occasional baked-lighting artefacts in albedo, and stylistic drift between items unless the concept prompts are strict. At full-body and thumbnail distance it reads as a real game asset. It is not Destiny 2 hero-render quality (100 k-triangle sculpts, 4 K hand-authored materials).

| Work | Who | Hours |
|---|---|---|
| Engine: GLTF/KTX2/meshopt loading, morph-target body + data-driven sockets, mask-based palette, HDRI + post, exploded view, GLB thumbnails | agent | 60–90 |
| Blender pipeline: template scene, clean-up/export script, morph authoring, GLB validation | agent | 20–30 |
| Base mannequin (male/female, two shape keys, mannequin material) | agent + review | 15–25 |
| 106 items: concept (10 min) + generation (10 min) + pick, fit, clean-up (30–45 min) | agent, human approves picks | 90–130 |
| Destiny-style UI rework (from Option B) | agent | 40–60 |
| Generation credits (≈ 3 candidates × 106 items + retries) | — | ≈ $300–600 |
| **Total** | | **≈ 230–330 h** |

That is roughly a third of Option A (hand modelling with morph-skinned gear) and about twice Option C1 (16-bit). The saving over A comes from two decisions: gear stays rigid (no skinning, no morph transfer), and generation replaces modelling and texturing.

## Recommendation (v2)

1. **Run a two-week proof of concept for Option D before committing the library**: mannequin with morphs, five items through the full pipeline (helmet, chest plate, gauntlet, boots, rifle), Destiny-style framing, HDRI and post, exploded view. Budget ≈ 50 h and ≈ $60 credits. Judge it against a reference image you pick now, at three distances: thumbnail, full body, and the drawer-zoom close-up.
2. **Decision gate.** If the PoC clears the bar, replace SPEC §2/§5 art clauses and the asset contract with the GLB pipeline and run the library through it. If it does not, fall back to **C1 (16-bit via 3D-to-pixel rendering)**, which reuses the entire current library and engine and is the cheapest true pivot.
3. Either way, keep react-three-fiber. Use Meshy or Tripo directly for generation unless you already pay for Higgsfield, in which case its bundled image + 3D API is fine. Use ElevenLabs only for a polish pass.

## v1 options (for reference)

### Option A — Hand-modelled realistic (Destiny 2 fidelity)
Sculpted high-poly assets baked to game meshes with 2–4 K PBR sets, skinned body with morph targets, gear skinned and morph-transferred, KTX2/Draco streaming. 500–900 h, most of it artist time; a Blender pipeline only pays off here.

### Option B — Keep the current 3D, Destiny-style presentation + polish
Flanking gear tiles, hover detail, negative space, studio lighting, post, material upgrade without re-authoring. 80–160 h. Reaches perhaps 60 % of the reference *feel* but cannot escape the chunky procedural look; folded into Option D's UI work.

### Option C — Stylised modern-retro 16-bit
C1 renders the existing 3D as pixel art (low-res target, palette quantise, outlines, cel light, snapped facings): 80–140 h, keeps everything. C2 hand-drawn sprites: 400–800 h, sliders become discrete bodies, generators cannot keep facings consistent. C2 not recommended.

## Note on the breathing "aliasing"

The shimmer in the recording is z-fighting, not texture aliasing: consecutive frames show hatched patterns on coplanar faces (boot toe caps against soles, gauntlet plates, sleeve against bracer cuff) that change as the idle bob moves the model a few millimetres. Contributing factors: near plane 0.05 m against far plane 60 m, faces at identical offsets between stacked parts, thin dark straps without depth bias. Fixes are cheap (near plane 0.15, logarithmic depth or polygon offset, a 3 mm clearance rule) and belong to whichever pass you choose. Option D removes most of it anyway because generated parts are single meshes.
