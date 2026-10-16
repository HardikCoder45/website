# AMS Interiors — website

Marketing site for AMS Interiors (Delhi NCR) built with Next.js 16, React 19, Tailwind, GSAP, Lenis and React Three Fiber.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
npm run lint
```

## Brand system

Quiet-luxury, editorial direction: warm ink `#141310`, bone `#EEE9E1`, stone `#D8CFC2` and a muted brass `#A88A5C` (tokens in `styles/tokens.css`). Display type is Cormorant Garamond at light weights; UI labels are small tracked uppercase Inter (`.label`). Section headers follow the `( 0n ) Name` pattern. The nav uses `mix-blend-mode: difference` so it reads on both ink and bone sections.

Home page order: sculptural 3D hero → studio manifesto → selected work → services index → material atelier (3D) → live 3D tours → process → 3D showroom → client voices → estimate → FAQ → contact → footer.

## What's on the site

| Route | What it is |
|---|---|
| `/` | Home (see brand system above): real-time 3D hero vignette — travertine arch, fluted column, brass sphere and moving window light |
| `/kitchen` | Real-time 3D kitchen tour (the Blender model in `public/models/kitchen.glb`) |
| `/wardrobe` | Real-time 3D wardrobe tour (procedural, doors open/close) |
| `/interior` | Real-time 3D living-room tour (procedural room + furniture models) |

The old standalone HTML walkthroughs are still in `public/*.html` but are no longer linked.

## 3D system

- `lib/three/finishes.ts` — finish catalogue (cabinet, countertop, backsplash, hardware…) with swatches and price deltas.
- `lib/three/applyFinishes.ts` / `useFinishMaterials.ts` — restyle GLB materials by name, or create named materials for procedural scenes.
- `components/three/KitchenModel.tsx` — the kitchen GLB, with restored authored colours, finish swapping and day/evening glow.
- `components/three/Prop.tsx` — loads a furniture GLB, scales it to a real-world height and sits it on the floor.
- `components/tour/TourExperience.tsx` — the tour engine: guided stops + hotspots, orbit camera, autoplay, day/evening, configurator, live estimate, WhatsApp quote, save image, fullscreen, adaptive quality.
- `lib/data/tours.ts` — tour definitions (stops, finishes, toggles, area and rates).
- `components/hero/AtelierScene.tsx` — the hero vignette: extruded travertine arch, lathe-built fluted column, off-screen window wall that casts moving window-pane shadows, scroll/pointer camera.
- `components/brand/AtelierCanvas.tsx` — the material atelier specimen (Lightformer studio lighting, shadow-only floor).
- `lib/three/usePbr.ts` — loads the texture sets in `public/textures`; `lib/three/quality.ts` picks the effects level (`?fx=lite|0`, phones get lite) and detects half-float support.
- `components/sections/Showroom*.tsx` — one shared canvas drawing five draggable models via drei `View`.

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
- `public/og.jpg` — social preview image (from the evening render).

To re-optimise a model: `npx @gltf-transform/cli optimize in.glb out.glb --compress meshopt --texture-compress webp --palette false --join false --flatten false` (keep material names so the configurator can find them).
