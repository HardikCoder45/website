# AMS Interiors — website

Marketing site for AMS Interiors (Delhi NCR) built with Next.js 16, React 19, Tailwind, GSAP, Lenis and React Three Fiber.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
npm run lint
```

## Brand system

AMS Interiors, in its original brand colours: sand `#F5EFE0`, brass gold `#B8892A` and walnut brown `#2C2416` (tokens in `styles/tokens.css`). Headlines are Cormorant Garamond (`.display`, italic for emphasis), text and labels are Inter (`.label`, `.mono` for tabular figures). Major sections carry a sheet title block (`components/brand/SheetHeader.tsx`).

Logo: `components/brand/Logo.tsx` (an "A" drawn as a gable on a ground line, with a brass window, beside the AMS / INTERIORS wordmark). Icons: `app/icon.svg`, `app/favicon.ico`, `app/apple-icon.png`, `public/icon-192.png`, `public/icon-512.png`; Next.js writes the `<link rel="icon">` / `apple-touch-icon` tags from these and from `metadata.icons` in `app/layout.tsx`.

Copy follows the no-AI-slop rules (concrete facts, no filler words, no em-dash crutches).

## Prices

Every rate on the site comes from `lib/data/pricing.ts` and is the price AMS lists on IndiaMart under its two trading names, Anil Multi Service (Jagat Puri) and Anil Electric Multi Service (Indirapuram). Each entry records the seller, and packages record the listing name. Rates exclude GST. **If a listing changes, change it there**; the 3D tour estimates (`lib/data/tours.ts`) use the same ranges.

## Home page

| Section | File |
|---|---|
| 3D construction hero: a G+1 house assembles in eight stages on scroll | `components/build/BuildHero.tsx`, `HouseScene.tsx`, `lib/data/build.ts` |
| Studio statement + stats | `components/brand/Manifesto.tsx` |
| Services index (Build / Interiors) | `components/brand/ServicesIndex.tsx` |
| Construction packages + specification schedule | `components/sections/BuildPricing.tsx` |
| Interiors rate card | `components/sections/InteriorRates.tsx` |
| Estimator (build a house / interiors) | `components/calculator/QuoteCalculator.tsx` |
| Work, materials (3D), live 3D tours, reviews, FAQ | `components/brand/*`, `components/sections/FaqSection.tsx` |
| Globe finale: Earth turns and dives to the studio | `components/globe/GlobeFinale.tsx`, `EarthScene.tsx` |
| Contact form, footer | `components/sections/ContactSection.tsx`, `components/layout/Footer.tsx` |

## 3D system

- `lib/three/finishes.ts` — finish catalogue (cabinet, countertop, backsplash, hardware…) with swatches and price deltas.
- `lib/three/applyFinishes.ts` / `useFinishMaterials.ts` — restyle GLB materials by name, or create named materials for procedural scenes.
- `components/three/KitchenModel.tsx` — the kitchen GLB, with restored authored colours, finish swapping and day/evening glow.
- `components/three/Prop.tsx` — loads a furniture GLB, scales it to a real-world height and sits it on the floor.
- `components/tour/TourExperience.tsx` — the tour engine: guided stops + hotspots, orbit camera, autoplay, day/evening, configurator, live estimate, WhatsApp quote, save image, fullscreen, adaptive quality.
- `lib/data/tours.ts` — tour definitions (stops, finishes, toggles, area and rates).
- `components/build/HouseScene.tsx` — a G+1 house built from parts tagged by stage (travertine, teak louvres, bronze fins, pergola, gate and garden, neighbouring plots for context). The active stage glows brass; the light falls from afternoon to dusk as the house is finished; then the camera walks through the front glass into the living room and kitchen (the tour scenes, evening mood). Scroll ranges live in `HERO_P` in `lib/data/build.ts`.
- `components/globe/EarthScene.tsx` — custom Earth shader (day, night lights, ocean glint, clouds, rim) + limb-hugging atmosphere; scroll turns India to camera and dives to Delhi; HTML pin and live altitude readout.
- `components/brand/AtelierCanvas.tsx` — the material atelier specimen (Lightformer studio lighting, shadow-only floor).
- `lib/three/usePbr.ts` — loads the texture sets in `public/textures`; `lib/three/quality.ts` picks the effects level (`?fx=lite|0`, phones get lite) and detects half-float support.

### Tour URL parameters

Useful for sharing a specific design or rendering stills:

```
/kitchen?stop=island&mood=evening&cabinets=navy&countertop=calacatta&hardware=chrome
/wardrobe?open=1&shutters=olive
/interior?leather=1&walls=clay&panel=marble
&clean=1   hide all UI (for screenshots)
&fx=lite   bloom + tone mapping only;  &fx=0  no post-processing
```

### Adding a finish

Add a choice to the relevant group in `lib/three/finishes.ts` (kitchen) or `lib/data/tours.ts` (wardrobe/living room). Choices with `original: true` keep the authored look; others set `color`/`roughness`/`metalness`, and `keepMap` keeps the texture.

### Adding a tour

1. Add a scene in `components/tour/scenes/` that takes `SceneProps`.
2. Add a `TourDef` in `lib/data/tours.ts` and register the scene in `components/tour/TourClient.tsx`.
3. Add `app/<slug>/page.tsx` rendering `<TourClient slug="<slug>" />`.

## Assets

- `public/models/` — optimised GLBs (meshopt + WebP textures via `gltf-transform`). See `public/models/CREDITS.md` for sources and licences (CC0 / CC BY 4.0; attribution is shown on the site).
- `public/hdri/` — small Poly Haven HDRIs (CC0) used for lighting, served locally.
- `public/textures/` — tileable PBR sets (albedo / roughness / normal) for travertine, Calacatta, Nero Marquina, oak, plaster, terrazzo, linen and brushed metal. Generated (original, no licence restrictions) by `scripts/gen_textures.py`:
  `python3 scripts/gen_textures.py <out_dir>`
- `public/renders/cy-*.webp` — ray-traced Cycles renders of the kitchen model, captioned on the site as 3D visualisations, not project photos. Re-render with Blender's Python module (`pip install bpy`, Python 3.11):
  `VARIANT=ivory MOOD=evening python scripts/render_kitchen.py public/kitchen.glb <tex_dir> public/hdri/apartment.exr <out_dir> 1440 900 64 island,overview`
  (variants: wenge, ivory, sage, walnut; shots: overview, island, cooking, detail, wide). Note the renderer needs the original `public/kitchen.glb`, not the meshopt-compressed copy.
- `public/earth/` — Earth day / night / bump-roughness-clouds maps from Solar System Scope (CC BY 4.0), see `public/earth/CREDITS.md`.
- `public/renders/build-*.webp` — stills of the 3D house used as service previews.
- `public/og.jpg` — social preview image (from the evening render).

To re-optimise a model: `npx @gltf-transform/cli optimize in.glb out.glb --compress meshopt --texture-compress webp --palette false --join false --flatten false` (keep material names so the configurator can find them).
