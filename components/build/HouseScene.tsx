'use client';
import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Html, Line } from '@react-three/drei';
import { EffectComposer, N8AO, ToneMapping } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import * as THREE from 'three';
import { initialFxLevel, supportsHalfFloat, type FxLevel } from '@/lib/three/quality';
import { defaultSelection, KITCHEN_FINISHES } from '@/lib/three/finishes';
import { INTERIOR_FINISHES } from '@/lib/data/tours';
import InteriorScene from '@/components/tour/scenes/InteriorScene';
import KitchenScene from '@/components/tour/scenes/KitchenScene';
import { HERO_P, heroPhase, type HeroPhase } from '@/lib/data/build';

/** Shared with the HTML overlay. See HERO_P for the scroll ranges. */
export interface BuildState { p: number }

// ── Model: a G+1 house on a 30×50 ft (9 × 15 m) Delhi plot ──────────────
const W = 9, X0 = -4.5, X1 = 4.5;
const Z0 = -7.5, Z1 = 4.5;          // building footprint (3 m front garden to z = 7.5)
const PLINTH = 0.6, FLOOR = 3.2, SLAB = 0.15, WALL = 0.23;
const L1 = PLINTH + FLOOR;          // first-floor slab top
const L2 = L1 + FLOOR;              // roof slab top
const COLS_X = [-4.35, 0, 4.35];
const COLS_Z = [-7.35, -3.6, 0.15, 4.35];

type MatKey = 'footing' | 'struct' | 'wall' | 'frame' | 'glass' | 'teak' | 'stone' | 'bronze' | 'lawn' | 'hedge' | 'paving' | 'clay' | 'wood' | 'soft' | 'lamp' | 'neighbour';
type Anim = 'grow' | 'drop' | 'pop' | 'none';

interface Part {
    stage: number;
    delay: number; // 0..1 within the stage
    anim: Anim;
    pos: [number, number, number]; // base centre (y = bottom)
    size: [number, number, number];
    mat: MatKey;
    shadow?: boolean;
}

interface Opening { c: number; w: number; sill: number; head: number }

/** Split a straight wall into boxes around its openings. */
function wallParts(axis: 'x' | 'z', fixed: number, from: number, to: number, y0: number, h: number, openings: Opening[], stage: number, delayBase: number): Part[] {
    const parts: Part[] = [];
    const cuts = [...openings].sort((a, b) => a.c - b.c);
    let cursor = from;
    const push = (a: number, b: number, yb: number, hh: number, d: number) => {
        if (b - a < 0.02 || hh < 0.02) return;
        const mid = (a + b) / 2;
        const len = b - a;
        parts.push({
            stage, delay: Math.min(1, delayBase + d), anim: 'grow', mat: 'wall',
            pos: axis === 'x' ? [mid, yb, fixed] : [fixed, yb, mid],
            size: axis === 'x' ? [len, hh, WALL] : [WALL, hh, len],
        });
    };
    cuts.forEach((o, i) => {
        const a = o.c - o.w / 2, b = o.c + o.w / 2;
        push(cursor, a, y0, h, i * 0.05);
        push(a, b, y0, o.sill, i * 0.05 + 0.02);
        push(a, b, y0 + o.head, h - o.head, i * 0.05 + 0.25);
        cursor = b;
    });
    push(cursor, to, y0, h, cuts.length * 0.05);
    return parts;
}

/** Window or door: slim frame, mullions every ~1.1 m, a transom, and glass. */
function frameParts(axis: 'x' | 'z', fixed: number, y0: number, o: Opening, stage: number, delay: number): Part[] {
    const t = 0.06, depth = 0.1;
    const h = o.head - o.sill;
    const yb = y0 + o.sill;
    const at = (c: number, y: number): [number, number, number] => (axis === 'x' ? [c, y, fixed] : [fixed, y, c]);
    const sz = (w: number, hh: number): [number, number, number] => (axis === 'x' ? [w, hh, depth] : [depth, hh, w]);
    const parts: Part[] = [];
    const add = (pos: [number, number, number], size: [number, number, number], d = 0) => parts.push({ stage, delay: Math.min(1, delay + d), anim: 'pop', mat: 'frame', pos, size });
    add(at(o.c - o.w / 2 + t / 2, yb), sz(t, h));
    add(at(o.c + o.w / 2 - t / 2, yb), sz(t, h));
    add(at(o.c, yb), sz(o.w, t));
    add(at(o.c, yb + h - t), sz(o.w, t));
    const bays = Math.max(1, Math.round(o.w / 1.1));
    for (let i = 1; i < bays; i++) add(at(o.c - o.w / 2 + (o.w * i) / bays, yb), sz(t * 0.8, h), 0.04);
    if (h > 2.1) add(at(o.c, yb + h - 0.55), sz(o.w, t * 0.8), 0.06);
    parts.push({ stage, delay: Math.min(1, delay + 0.1), anim: 'pop', mat: 'glass', pos: at(o.c, yb + t), size: axis === 'x' ? [o.w - t, h - 2 * t, 0.02] : [0.02, h - 2 * t, o.w - t], shadow: false });
    return parts;
}

const box = (stage: number, delay: number, anim: Anim, mat: MatKey, pos: [number, number, number], size: [number, number, number], shadow = true): Part => ({ stage, delay, anim, mat, pos, size, shadow });

function buildModel(): Part[] {
    const P: Part[] = [];

    // 0 · Context: neighbouring plots, already standing, in pale clay.
    P.push(box(-1, 0, 'none', 'neighbour', [-9.9, 0, -1.5], [9.0, 6.9, 15]));
    P.push(box(-1, 0, 'none', 'neighbour', [-11.4, 6.9, -5.2], [3.0, 2.4, 3.2]));
    P.push(box(-1, 0, 'none', 'neighbour', [0, 0, -17.4], [9.0, 5.8, 13]));
    P.push(box(-1, 0, 'none', 'paving', [0, 0, 11.2], [44, 0.02, 6.4], false));  // street
    P.push(box(-1, 0, 'none', 'stone', [0, 0, 8.2], [44, 0.12, 1.2]));           // footpath

    // 1 · Foundation: footings, plinth beams, plinth slab
    COLS_X.forEach((x, i) => COLS_Z.forEach((z, j) => {
        P.push(box(1, (i * 4 + j) / 14, 'grow', 'footing', [x, -0.05, z], [1.3, 0.35, 1.3]));
    }));
    COLS_Z.forEach((z, j) => P.push(box(1, 0.55 + j * 0.05, 'grow', 'footing', [0, 0.2, z], [W, 0.4, 0.3])));
    COLS_X.forEach((x, i) => P.push(box(1, 0.6 + i * 0.05, 'grow', 'footing', [x, 0.2, (Z0 + Z1) / 2], [0.3, 0.4, Z1 - Z0])));
    P.push(box(1, 0.85, 'grow', 'struct', [0, 0.45, (Z0 + Z1) / 2], [W, PLINTH - 0.45, Z1 - Z0]));

    // 2 · Frame: columns for both floors
    COLS_X.forEach((x, i) => COLS_Z.forEach((z, j) => {
        P.push(box(2, (i * 4 + j) / 24, 'grow', 'struct', [x, PLINTH, z], [0.3, FLOOR - SLAB, 0.3]));
        P.push(box(2, 0.5 + (i * 4 + j) / 24, 'grow', 'struct', [x, L1, z], [0.3, FLOOR - SLAB, 0.3]));
    }));

    // 3 · Slabs, beams, balcony, sunshade, roof overhang
    [L1, L2].forEach((top, k) => {
        P.push(box(3, k * 0.5, 'drop', 'struct', [0, top - SLAB, (Z0 + Z1) / 2], [W + 0.1, SLAB, Z1 - Z0 + 0.1]));
        P.push(box(3, k * 0.5 + 0.1, 'drop', 'struct', [0, top - 0.45, Z1 - 0.15], [W, 0.3, 0.3]));
        P.push(box(3, k * 0.5 + 0.1, 'drop', 'struct', [0, top - 0.45, Z0 + 0.15], [W, 0.3, 0.3]));
    });
    P.push(box(3, 0.35, 'drop', 'struct', [1.6, L1 - SLAB, Z1 + 0.75], [4.6, SLAB, 1.5]));
    P.push(box(3, 0.4, 'drop', 'struct', [-1.4, PLINTH + 2.95, Z1 + 0.4], [5.0, 0.12, 0.8]));
    P.push(box(3, 0.85, 'drop', 'struct', [1.2, L2 - SLAB + 0.02, Z1 + 0.6], [6.6, 0.18, 1.2]));

    // 4 · Walls with openings, parapet, stair room
    const gFront: Opening[] = [{ c: -1.4, w: 4.4, sill: 0.05, head: 2.75 }, { c: 2.85, w: 1.1, sill: 0.0, head: 2.4 }];
    const fFront: Opening[] = [{ c: -2.4, w: 2.2, sill: 0.9, head: 2.4 }, { c: 1.6, w: 3.2, sill: 0.0, head: 2.5 }];
    const side: Opening[] = [{ c: -1.4, w: 1.6, sill: 0.9, head: 2.3 }, { c: -5.4, w: 1.2, sill: 0.9, head: 2.3 }];
    const back: Opening[] = [{ c: 1.6, w: 1.2, sill: 0.9, head: 2.2 }];
    const h = FLOOR - SLAB;
    P.push(...wallParts('x', Z1 - WALL / 2, X0, X1, PLINTH, h, gFront, 4, 0));
    P.push(...wallParts('x', Z1 - WALL / 2, X0, X1, L1, h, fFront, 4, 0.45));
    P.push(...wallParts('z', X1 - WALL / 2, Z0, Z1, PLINTH, h, side, 4, 0.1));
    P.push(...wallParts('z', X1 - WALL / 2, Z0, Z1, L1, h, side, 4, 0.55));
    P.push(...wallParts('z', X0 + WALL / 2, Z0, Z1, PLINTH, h, [], 4, 0.15));
    P.push(...wallParts('z', X0 + WALL / 2, Z0, Z1, L1, h, [], 4, 0.6));
    P.push(...wallParts('x', Z0 + WALL / 2, X0, X1, PLINTH, h, back, 4, 0.2));
    P.push(...wallParts('x', Z0 + WALL / 2, X0, X1, L1, h, back, 4, 0.65));
    P.push(box(4, 0.85, 'grow', 'wall', [-2.4, L2, Z1 - 0.1], [4.2, 1.0, 0.2]));
    P.push(box(4, 0.85, 'grow', 'wall', [X1 - 0.1, L2, (Z0 + Z1) / 2], [0.2, 1.0, Z1 - Z0]));
    P.push(box(4, 0.85, 'grow', 'wall', [X0 + 0.1, L2, (Z0 + Z1) / 2], [0.2, 1.0, Z1 - Z0]));
    P.push(box(4, 0.85, 'grow', 'wall', [0, L2, Z0 + 0.1], [W, 1.0, 0.2]));
    P.push(box(4, 0.9, 'grow', 'wall', [-3, L2, -5.6], [3, 2.6, 3.4]));
    P.push(box(4, 0.98, 'drop', 'struct', [-3, L2 + 2.6, -5.6], [3.4, 0.15, 3.8]));

    // 5 · Openings: frames, glass, front door, balcony glass with a bronze rail
    P.push(...frameParts('x', Z1 + 0.02, PLINTH, gFront[0], 5, 0));
    fFront.forEach((o, i) => P.push(...frameParts('x', Z1 + 0.02, L1, o, 5, 0.25 + i * 0.12)));
    side.forEach((o, i) => { P.push(...frameParts('z', X1 + 0.02, PLINTH, o, 5, 0.4 + i * 0.08)); P.push(...frameParts('z', X1 + 0.02, L1, o, 5, 0.5 + i * 0.08)); });
    P.push(box(5, 0.15, 'pop', 'teak', [2.85, PLINTH, Z1 + 0.04], [1.05, 2.38, 0.08]));
    P.push(box(5, 0.2, 'pop', 'bronze', [3.2, PLINTH + 1.0, Z1 + 0.11], [0.04, 0.9, 0.04]));
    P.push(box(5, 0.7, 'pop', 'glass', [1.6, L1, Z1 + 1.48], [4.6, 1.05, 0.03], false));
    P.push(box(5, 0.72, 'pop', 'bronze', [1.6, L1 + 1.05, Z1 + 1.48], [4.62, 0.05, 0.07]));
    P.push(box(5, 0.72, 'pop', 'glass', [-0.68, L1, Z1 + 0.75], [0.03, 1.05, 1.5], false));
    P.push(box(5, 0.74, 'pop', 'glass', [3.88, L1, Z1 + 0.75], [0.03, 1.05, 1.5], false));
    P.push(box(5, 0.8, 'pop', 'glass', [2.25, L2, Z1 - 0.1], [4.5, 1.0, 0.03], false));

    // 6 · Finishes: travertine, teak louvres, bronze frame, pergola, garden, gate
    P.push(box(6, 0, 'grow', 'stone', [-4.05, PLINTH, Z1 + 0.04], [0.9, FLOOR - SLAB, 0.08]));
    P.push(box(6, 0.05, 'grow', 'stone', [1.55, PLINTH, Z1 + 0.04], [1.5, FLOOR - SLAB, 0.08]));
    P.push(box(6, 0.08, 'grow', 'stone', [3.95, PLINTH, Z1 + 0.04], [1.1, FLOOR - SLAB, 0.08]));
    P.push(box(6, 0.1, 'grow', 'stone', [0, 0, Z1 + 0.05], [W + 0.1, PLINTH, 0.1]));
    P.push(box(6, 0.12, 'grow', 'stone', [X1 + 0.05, 0, (Z0 + Z1) / 2], [0.1, PLINTH, Z1 - Z0]));
    for (let i = 0; i < 17; i++) P.push(box(6, 0.2 + i / 40, 'grow', 'teak', [-4.2 + i * 0.13, L1 + 0.05, Z1 + 0.16], [0.06, FLOOR - 0.2, 0.12]));
    P.push(box(6, 0.4, 'grow', 'bronze', [-0.12, L1 - SLAB, Z1 + 0.75], [0.2, FLOOR, 1.5]));
    P.push(box(6, 0.42, 'grow', 'bronze', [3.32, L1 - SLAB, Z1 + 0.75], [0.2, FLOOR, 1.5]));
    P.push(box(6, 0.45, 'pop', 'teak', [1.6, L1 - SLAB - 0.03, Z1 + 0.75], [4.6, 0.03, 1.5], false));
    P.push(box(6, 0.48, 'pop', 'teak', [1.2, L2 - SLAB - 0.02, Z1 + 0.6], [6.6, 0.03, 1.2], false));
    [[0.2, -0.8], [4.1, -0.8], [0.2, 3.8], [4.1, 3.8]].forEach(([x, z], i) => P.push(box(6, 0.55 + i * 0.02, 'grow', 'bronze', [x, L2, z], [0.12, 2.5, 0.12])));
    for (let i = 0; i < 12; i++) P.push(box(6, 0.62 + i / 60, 'drop', 'teak', [0.3 + i * 0.34, L2 + 2.5, 1.5], [0.08, 0.16, 5.0]));
    P.push(box(6, 0.5, 'pop', 'lawn', [-2.55, 0.01, 6.0], [3.9, 0.04, 2.8], false));
    P.push(box(6, 0.52, 'pop', 'paving', [1.95, 0.01, 6.0], [5.1, 0.03, 2.8], false));
    for (let i = 0; i < 5; i++) P.push(box(6, 0.55 + i * 0.02, 'pop', 'stone', [2.85, 0.03, 4.95 + i * 0.5], [1.1, 0.04, 0.38], false));
    P.push(box(6, 0.6, 'grow', 'stone', [-2.55, 0, 4.95], [3.6, 0.45, 0.5]));
    P.push(box(6, 0.66, 'grow', 'hedge', [-2.55, 0.45, 4.95], [3.4, 0.38, 0.38]));
    P.push(box(6, 0.6, 'grow', 'clay', [-2.65, 0, 7.4], [3.7, 1.2, 0.2]));
    P.push(box(6, 0.62, 'grow', 'clay', [X1 - 0.1, 0, 6], [0.2, 1.2, 3]));
    P.push(box(6, 0.62, 'grow', 'clay', [X0 + 0.1, 0, 6], [0.2, 1.2, 3]));
    P.push(box(6, 0.64, 'grow', 'stone', [-2.65, 1.2, 7.4], [3.8, 0.06, 0.28]));
    P.push(box(6, 0.66, 'grow', 'clay', [4.0, 0, 7.4], [1.0, 1.2, 0.2]));
    for (let i = 0; i < 26; i++) P.push(box(6, 0.7 + i / 90, 'grow', 'bronze', [-0.7 + i * 0.16, 0.05, 7.4], [0.05, 1.45, 0.06]));
    P.push(box(6, 0.72, 'pop', 'bronze', [1.3, 1.5, 7.4], [4.15, 0.05, 0.08]));
    for (let i = 0; i < 3; i++) P.push(box(6, 0.75 + i * 0.03, 'grow', 'hedge', [-4.0, 0, 5.4 + i * 0.7], [0.5, 0.9 + i * 0.15, 0.5]));

    // 7 · Interiors seen through the glazing, then the lights come on
    P.push(box(7, 0, 'pop', 'wood', [0, PLINTH + 0.005, (Z0 + Z1) / 2], [W - 0.5, 0.02, Z1 - Z0 - 0.5], false));
    P.push(box(7, 0.05, 'pop', 'wood', [0, L1 + 0.005, (Z0 + Z1) / 2], [W - 0.5, 0.02, Z1 - Z0 - 0.5], false));
    P.push(box(7, 0.1, 'grow', 'teak', [-1.4, PLINTH, -1.2], [3.6, 2.7, 0.12]));
    P.push(box(7, 0.2, 'grow', 'soft', [-1.4, PLINTH, 2.6], [2.6, 0.42, 0.95]));
    P.push(box(7, 0.22, 'grow', 'soft', [-1.4, PLINTH + 0.42, 3.0], [2.6, 0.38, 0.2]));
    P.push(box(7, 0.28, 'grow', 'stone', [-1.4, PLINTH, 1.3], [1.2, 0.36, 0.7]));
    P.push(box(7, 0.3, 'grow', 'clay', [2.2, PLINTH, 0.2], [2.0, 0.92, 0.9]));
    P.push(box(7, 0.34, 'grow', 'stone', [2.2, PLINTH + 0.92, 0.2], [2.1, 0.05, 1.0]));
    P.push(box(7, 0.4, 'grow', 'teak', [-2.4, L1, 2.6], [1.9, 0.5, 2.1]));
    P.push(box(7, 0.42, 'grow', 'soft', [-2.4, L1 + 0.5, 2.4], [1.8, 0.12, 1.6]));
    P.push(box(7, 0.46, 'grow', 'teak', [1.6, L1, -0.6], [3.2, 2.4, 0.6]));
    P.push(box(7, 0.5, 'pop', 'lamp', [-1.4, PLINTH + 2.82, 2.2], [4.0, 0.03, 0.04], false));
    [1.6, 2.2, 2.8].forEach((x, i) => P.push(box(7, 0.55 + i * 0.03, 'pop', 'lamp', [x, PLINTH + 2.0, 0.2], [0.14, 0.14, 0.14], false)));
    P.push(box(7, 0.6, 'pop', 'lamp', [1.6, L1 + 2.95, Z1 + 1.1], [4.2, 0.03, 0.04], false));
    P.push(box(7, 0.62, 'pop', 'lamp', [2.2, PLINTH + 2.5, Z1 + 0.12], [0.08, 0.3, 0.05], false));
    P.push(box(7, 0.62, 'pop', 'lamp', [3.5, PLINTH + 2.5, Z1 + 0.12], [0.08, 0.3, 0.05], false));
    [-3.9, -2.55, -1.2].forEach((x, i) => P.push(box(7, 0.66 + i * 0.03, 'pop', 'lamp', [x, 0.48, 5.22], [0.1, 0.05, 0.05], false)));
    P.push(box(7, 0.7, 'pop', 'lamp', [-2.65, 1.06, 7.52], [0.3, 0.06, 0.04], false));

    return P;
}

// ── Materials & colours ──────────────────────────────────────────────────
const C: Record<MatKey | 'accent' | 'concrete' | 'brick' | 'plaster', THREE.Color> = {
    accent: new THREE.Color('#B8892A'),
    plaster: new THREE.Color('#F2ECE1'),
    concrete: new THREE.Color('#C7C0B4'),
    brick: new THREE.Color('#BE8A6C'),
    footing: new THREE.Color('#B4AC9F'),
    struct: new THREE.Color('#C7C0B4'),
    wall: new THREE.Color('#BE8A6C'),
    frame: new THREE.Color('#2A231B'),
    glass: new THREE.Color('#8FA3A6'),
    teak: new THREE.Color('#8C5B36'),
    stone: new THREE.Color('#D2C2A6'),
    bronze: new THREE.Color('#9A7840'),
    lawn: new THREE.Color('#9AA57C'),
    hedge: new THREE.Color('#5D6B48'),
    paving: new THREE.Color('#E1D7C6'),
    clay: new THREE.Color('#EEE6D8'),
    wood: new THREE.Color('#B48D66'),
    soft: new THREE.Color('#D8CCB8'),
    lamp: new THREE.Color('#FFE2B0'),
    neighbour: new THREE.Color('#F1EADD'),
};
const TMP = new THREE.Color();

function baseColor(key: MatKey, p: number, out: THREE.Color) {
    const finish = THREE.MathUtils.clamp(p - 6, 0, 1); // the finishes stage plasters everything
    if (key === 'struct') return out.copy(C.concrete).lerp(C.plaster, finish);
    if (key === 'wall') return out.copy(C.brick).lerp(C.plaster, finish);
    return out.copy(C[key]);
}

const SURFACE: Partial<Record<MatKey, { roughness: number; metalness?: number }>> = {
    glass: { roughness: 0.05, metalness: 0.2 },
    frame: { roughness: 0.45, metalness: 0.4 },
    bronze: { roughness: 0.32, metalness: 0.85 },
    teak: { roughness: 0.6 },
    stone: { roughness: 0.75 },
    lamp: { roughness: 1 },
};
const NO_GLOW = new Set<string>(['glass', 'frame', 'lamp', 'bronze']);

const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const duskOf = (p: number) => THREE.MathUtils.clamp((Math.min(p, HERO_P.built) - 7.1) / 1.1, 0, 1);

function House({ state }: { state: MutableRefObject<BuildState> }) {
    const parts = useMemo(() => buildModel(), []);
    const groups = useRef<(THREE.Group | null)[]>([]);

    // One material per (material key, stage) so each stage can glow on its own.
    const materials = useMemo(() => {
        const m = new Map<string, THREE.MeshStandardMaterial>();
        parts.forEach((p) => {
            const k = `${p.mat}|${p.stage}`;
            if (m.has(k)) return;
            const s = SURFACE[p.mat] ?? { roughness: 0.88 };
            const glass = p.mat === 'glass';
            const lamp = p.mat === 'lamp';
            m.set(k, new THREE.MeshStandardMaterial({
                color: '#ffffff',
                roughness: s.roughness,
                metalness: s.metalness ?? 0,
                transparent: glass,
                opacity: glass ? 0.38 : 1,
                emissive: glass ? new THREE.Color('#ffae5c') : lamp ? new THREE.Color('#ffc988') : new THREE.Color('#000000'),
                emissiveIntensity: 0,
                envMapIntensity: glass ? 1.6 : 1,
            }));
        });
        return m;
    }, [parts]);

    const geo = useMemo(() => new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0), []);
    const warm = useRef<THREE.PointLight>(null);
    const warm2 = useRef<THREE.PointLight>(null);
    const porch = useRef<THREE.PointLight>(null);

    useFrame(() => {
        const P = Math.min(state.current.p, HERO_P.built);
        const dusk = duskOf(P);
        materials.forEach((mat, key) => {
            const [mk, st] = key.split('|');
            const local = P - Number(st);
            baseColor(mk as MatKey, P, TMP);
            // The stage being built glows brass, then settles to its own colour.
            const glow = local >= 0 && local < 1.3 ? 1 - THREE.MathUtils.clamp((local - 0.7) / 0.6, 0, 1) : 0;
            if (!NO_GLOW.has(mk)) TMP.lerp(C.accent, glow * 0.4);
            mat.color.copy(TMP);
            if (mk === 'glass') mat.emissiveIntensity = dusk * 0.95;
            if (mk === 'lamp') mat.emissiveIntensity = 0.3 + dusk * 3.2;
        });
        parts.forEach((part, i) => {
            const g = groups.current[i];
            if (!g || part.anim === 'none') return;
            const [x, y, z] = part.pos;
            const start = part.stage + part.delay * 0.55;
            const t = ease(THREE.MathUtils.clamp((P - start) / 0.45, 0, 1));
            g.visible = t > 0.001;
            if (part.anim === 'grow') { g.scale.set(1, Math.max(t, 0.001), 1); g.position.set(x, y, z); }
            else if (part.anim === 'drop') { g.scale.set(1, 1, 1); g.position.set(x, y + (1 - t) * 3, z); }
            else { const s = 0.6 + 0.4 * t; g.scale.set(s, Math.max(t, 0.001), s); g.position.set(x, y, z); }
        });
        if (warm.current) warm.current.intensity = dusk * 14;
        if (warm2.current) warm2.current.intensity = dusk * 9;
        if (porch.current) porch.current.intensity = dusk * 6;
    });

    return (
        <group>
            {parts.map((p, i) => (
                <group key={i} ref={(el) => { groups.current[i] = el; }} visible={p.anim === 'none'} position={p.pos}>
                    <mesh
                        geometry={geo}
                        material={materials.get(`${p.mat}|${p.stage}`)}
                        scale={p.size}
                        castShadow={p.shadow !== false}
                        receiveShadow
                    />
                </group>
            ))}
            <pointLight ref={warm} position={[-1.4, PLINTH + 2.2, 2.2]} color="#ffb877" intensity={0} distance={10} decay={2} />
            <pointLight ref={warm2} position={[0.5, L1 + 2.2, 1.6]} color="#ffc48f" intensity={0} distance={9} decay={2} />
            <pointLight ref={porch} position={[2.8, PLINTH + 2.4, Z1 + 1.2]} color="#ffcf8f" intensity={0} distance={6} decay={2} />
        </group>
    );
}

/** Faint survey grid on the ground plane, in the page's sand colour. */
function useGridTexture() {
    return useMemo(() => {
        const c = document.createElement('canvas');
        c.width = c.height = 256;
        const g = c.getContext('2d')!;
        g.fillStyle = '#F5EFE0';
        g.fillRect(0, 0, 256, 256);
        g.strokeStyle = 'rgba(44,36,22,0.09)';
        g.lineWidth = 2;
        g.strokeRect(0, 0, 256, 256);
        g.strokeStyle = 'rgba(44,36,22,0.045)';
        g.lineWidth = 1;
        for (let i = 1; i < 4; i++) { g.beginPath(); g.moveTo(i * 64, 0); g.lineTo(i * 64, 256); g.moveTo(0, i * 64); g.lineTo(256, i * 64); g.stroke(); }
        const t = new THREE.CanvasTexture(c);
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.repeat.set(30, 30);
        t.anisotropy = 8;
        t.colorSpace = THREE.SRGBColorSpace;
        return t;
    }, []);
}

/** Plot boundary and dimension lines, visible while the plot is being set out. */
function SiteMarks({ state }: { state: MutableRefObject<BuildState> }) {
    const [show, setShow] = useState(true);
    useFrame(() => {
        const visible = state.current.p < 2.2;
        if (visible !== show) setShow(visible);
    });
    const plot: [number, number, number][] = [[-4.6, 0.03, -7.6], [4.6, 0.03, -7.6], [4.6, 0.03, 7.6], [-4.6, 0.03, 7.6], [-4.6, 0.03, -7.6]];
    if (!show) return null;
    return (
        <group>
            <Line points={plot} color="#B8892A" lineWidth={1.6} dashed dashSize={0.35} gapSize={0.22} />
            <Line points={[[-4.6, 0.03, 9.4], [4.6, 0.03, 9.4]]} color="#2C2416" lineWidth={1} />
            <Line points={[[5.6, 0.03, -7.6], [5.6, 0.03, 7.6]]} color="#2C2416" lineWidth={1} />
            <Html position={[0, 0.05, 9.4]} center zIndexRange={[5, 0]}><span className="mono text-[11px] px-1.5 whitespace-nowrap" style={{ background: '#F5EFE0', color: '#2C2416' }}>30 FT · 9.1 M</span></Html>
            <Html position={[5.6, 0.05, 0]} center zIndexRange={[5, 0]}><span className="mono text-[11px] px-1.5 whitespace-nowrap" style={{ background: '#F5EFE0', color: '#2C2416' }}>50 FT · 15.2 M</span></Html>
        </group>
    );
}

// ── Camera ───────────────────────────────────────────────────────────────
const POS = new THREE.Vector3();
const LOOK = new THREE.Vector3();
const A = new THREE.Vector3();
const B = new THREE.Vector3();
const curve = (pts: number[][]) => new THREE.CatmullRomCurve3(pts.map(([x, y, z]) => new THREE.Vector3(x, y, z)));

// Interior camera paths (positions and look-at points), based on the tour views.
const LIVING = {
    pos: curve([[4.4, 1.55, 5.8], [3.7, 1.9, 3.9], [1.6, 1.5, 2.6], [0.3, 1.4, 1.7]]),
    look: curve([[0, 1.2, -1.6], [-0.6, 1.05, -1.0], [-0.2, 1.2, -2.4], [0, 1.3, -3]]),
};
const KITCHEN = {
    pos: curve([[4.2, 2.3, 3.6], [3.2, 2.05, 2.4], [2.5, 1.55, 2.3], [1.9, 1.5, 2.1]]),
    look: curve([[-0.6, 1.0, -1.6], [-0.6, 1.0, -1.6], [0.2, 0.95, -0.2], [-1.0, 1.15, -2.6]]),
};

/** House: high survey → low three-quarter view → walk up to the living-room glass. */
function housePose(p: number, mobile: boolean, px: number, py: number) {
    const t = THREE.MathUtils.smootherstep(p, -0.6, 8.2);
    const theta = THREE.MathUtils.lerp(0.95, 0.5, t) + px * 0.06;
    const dist = THREE.MathUtils.lerp(38, 24, t) * (mobile ? 1.45 : 1);
    const elev = THREE.MathUtils.lerp(25, 6.2, t) + py * 0.8;
    POS.set(Math.sin(theta) * dist, elev, Math.cos(theta) * dist);
    LOOK.set(mobile ? 0 : -2.2 * (1 - t * 0.4), THREE.MathUtils.lerp(0, 3.4, t), 0);
    const k = THREE.MathUtils.smootherstep(p, HERO_P.built, HERO_P.enter);
    if (k > 0) {
        A.set(-1.2, PLINTH + 1.55, Z1 + (mobile ? 3.4 : 2.4));
        B.set(-1.4, PLINTH + 1.35, Z1 - 3);
        POS.lerp(A, k);
        LOOK.lerp(B, k);
    }
}

function Rig({ state, onPhase }: { state: MutableRefObject<BuildState>; onPhase: (p: HeroPhase) => void }) {
    const last = useRef<HeroPhase>('house');
    useFrame(({ camera, pointer, size }, dt) => {
        const p = state.current.p;
        const mobile = size.width < 700;
        const phase = heroPhase(p);
        const cam = camera as THREE.PerspectiveCamera;
        const changed = phase !== last.current;
        if (changed) { last.current = phase; onPhase(phase); }

        let fov: number, near: number;
        if (phase === 'house') {
            housePose(p, mobile, pointer.x, pointer.y);
            const k = THREE.MathUtils.smootherstep(p, HERO_P.built, HERO_P.enter);
            fov = THREE.MathUtils.lerp(30, mobile ? 62 : 46, k);
            near = k > 0 ? 0.05 : 0.5;
        } else {
            const living = phase === 'living';
            const path = living ? LIVING : KITCHEN;
            const t = living ? THREE.MathUtils.smootherstep(p, HERO_P.enter, HERO_P.swap) : THREE.MathUtils.smootherstep(p, HERO_P.swap, HERO_P.end);
            path.pos.getPoint(t, POS);
            path.look.getPoint(t, LOOK);
            POS.x += pointer.x * 0.12;
            POS.y += pointer.y * 0.06;
            fov = mobile ? 66 : 50;
            near = 0.05;
        }
        if (Math.abs(cam.fov - fov) > 0.01 || cam.near !== near) { cam.fov = fov; cam.near = near; cam.updateProjectionMatrix(); }
        // Cut cleanly between rooms (the overlay hides the jump); glide otherwise.
        if (changed && phase !== 'house') camera.position.copy(POS);
        const rate = phase === 'house' ? 3 : 6;
        camera.position.x = THREE.MathUtils.damp(camera.position.x, POS.x, rate, dt);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, POS.y, rate, dt);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, POS.z, rate, dt);
        camera.lookAt(LOOK);
    });
    return null;
}

/** Outdoor light: a warm afternoon sun that falls to dusk as the house is finished. */
function Daylight({ state, fx }: { state: MutableRefObject<BuildState>; fx: FxLevel }) {
    const sun = useRef<THREE.DirectionalLight>(null);
    const sky = useRef<THREE.HemisphereLight>(null);
    useFrame(() => {
        const dusk = duskOf(state.current.p);
        if (sun.current) {
            sun.current.intensity = THREE.MathUtils.lerp(2.9, 1.35, dusk);
            sun.current.color.copy(SUN_DAY).lerp(SUN_DUSK, dusk);
        }
        if (sky.current) sky.current.intensity = THREE.MathUtils.lerp(0.55, 0.32, dusk);
    });
    const map = fx === 'full' ? 2048 : 1024;
    return (
        <>
            <hemisphereLight ref={sky} args={['#fbf4ea', '#d3c6b0', 0.55]} />
            <directionalLight
                ref={sun}
                position={[-16, 15, 14]}
                intensity={2.9}
                color="#fff1de"
                castShadow
                shadow-mapSize={[map, map]}
                shadow-radius={4}
                shadow-bias={-0.0003}
                shadow-normalBias={0.03}
                shadow-camera-left={-22}
                shadow-camera-right={22}
                shadow-camera-top={22}
                shadow-camera-bottom={-22}
                shadow-camera-near={1}
                shadow-camera-far={80}
            />
        </>
    );
}

const SUN_DAY = new THREE.Color('#fff1de');
const SUN_DUSK = new THREE.Color('#ffb27a');
const SAND = new THREE.Color('#F5EFE0');
const INSIDE = new THREE.Color('#1c150e');
const LIVING_SEL = defaultSelection(INTERIOR_FINISHES);
const KITCHEN_SEL = defaultSelection(KITCHEN_FINISHES);

function Backdrop({ inside }: { inside: boolean }) {
    useFrame(({ scene, gl }) => {
        scene.background = inside ? INSIDE : SAND;
        if (scene.fog instanceof THREE.Fog) scene.fog.far = inside ? 1e4 : 110;
        gl.toneMappingExposure = inside ? 1.15 : 1;
    });
    return null;
}

export default function HouseScene({ state }: { state: MutableRefObject<BuildState> }) {
    const wrap = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(true);
    const [fx] = useState<FxLevel>(() => initialFxLevel());
    const [halfFloat, setHalfFloat] = useState(true);
    const [phase, setPhase] = useState<HeroPhase>('house');
    // Interiors mount a little before they are needed so their textures are ready.
    const [preload, setPreload] = useState(false);
    const grid = useGridTexture();

    useEffect(() => {
        const el = wrap.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    useEffect(() => {
        if (preload) return;
        const id = window.setInterval(() => { if (state.current.p > 5.5) setPreload(true); }, 400);
        return () => window.clearInterval(id);
    }, [preload, state]);

    const house = phase === 'house';

    return (
        <div ref={wrap} className="absolute inset-0">
            <Canvas
                shadows
                dpr={fx === 'full' ? [1, 1.75] : [1, 1.25]}
                frameloop={visible ? 'always' : 'never'}
                camera={{ fov: 30, near: 0.5, far: 220, position: [24, 25, 30] }}
                gl={{ antialias: fx !== 'full', alpha: false }}
                onCreated={({ gl }) => {
                    gl.shadowMap.type = THREE.PCFShadowMap;
                    // Neutral tone mapping keeps the sand background and plaster whites true.
                    gl.toneMapping = THREE.NeutralToneMapping;
                    setHalfFloat(supportsHalfFloat(gl));
                }}
            >
                <fog attach="fog" args={['#F5EFE0', 60, 110]} />
                <Backdrop inside={!house} />
                <Suspense fallback={null}>
                    {house
                        ? <Environment files="/hdri/studio.exr" environmentIntensity={0.45} />
                        : <Environment files="/hdri/night.exr" environmentIntensity={0.35} />}
                </Suspense>

                <group visible={house}>
                    <Daylight state={state} fx={fx} />
                    {/* Unlit sand ground (matches the page exactly) + a shadow-catcher above it. */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]}>
                        <planeGeometry args={[260, 260]} />
                        <meshBasicMaterial map={grid} toneMapped={false} />
                    </mesh>
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]} receiveShadow>
                        <planeGeometry args={[260, 260]} />
                        <shadowMaterial opacity={0.22} color="#3b2a14" />
                    </mesh>
                    <SiteMarks state={state} />
                    <House state={state} />
                </group>

                {preload && (
                    <>
                        <group visible={phase === 'living'}>
                            <Suspense fallback={null}>
                                <InteriorScene selection={LIVING_SEL} mood="evening" toggles={{}} />
                            </Suspense>
                        </group>
                        <group visible={phase === 'kitchen'}>
                            <Suspense fallback={null}>
                                <KitchenScene selection={KITCHEN_SEL} mood="evening" toggles={{}} />
                                <hemisphereLight args={['#ffe9cf', '#2a1d12', 0.35]} />
                            </Suspense>
                        </group>
                    </>
                )}

                <Rig state={state} onPhase={setPhase} />
                {/* Ambient occlusion only on capable desktops; lighter tiers render direct. */}
                {fx === 'full' && (
                    <EffectComposer multisampling={4} frameBufferType={halfFloat ? THREE.HalfFloatType : THREE.UnsignedByteType}>
                        <N8AO aoRadius={house ? 1.2 : 0.5} intensity={house ? 2.4 : 1.6} distanceFalloff={1} quality="performance" />
                        <ToneMapping mode={ToneMappingMode.NEUTRAL} />
                    </EffectComposer>
                )}
            </Canvas>
        </div>
    );
}
