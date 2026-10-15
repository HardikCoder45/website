# AMS Interiors — website

Marketing site for AMS Interiors (Delhi NCR) built with Next.js 16, React 19, Tailwind, GSAP, Lenis and React Three Fiber.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
npm run lint
```

## What's on the site

| Route | What it is |
|---|---|
| `/` | Home: minimal hero with a live 3D kitchen that expands on scroll, services, process, 3D tours, 3D showroom, gallery, estimator, reviews, FAQ, contact |
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
- `components/hero/HeroScene.tsx` — the hero's scroll-driven camera rig.
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
- `public/renders/` — stills rendered from the 3D scenes, used in the gallery ("3D Renders") and on the tour cards. They are labelled as 3D renders, not project photos.
- `public/og.jpg` — social preview image.

To re-optimise a model: `npx @gltf-transform/cli optimize in.glb out.glb --compress meshopt --texture-compress webp --palette false --join false --flatten false` (keep material names so the configurator can find them).
