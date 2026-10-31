'use client';
import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Html, Line } from '@react-three/drei';
import { EffectComposer, N8AO, ToneMapping } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import * as THREE from 'three';
import { initialFxLevel, supportsHalfFloat, type FxLevel } from '@/lib/three/quality';

/** Shared with the HTML overlay: P runs from about -0.6 (empty plot) to 8.4 (handover). */
export interface BuildState { p: number }

// ── Model: a G+1 house on a 30×50 ft (9 × 15 m) Delhi plot ──────────────
const W = 9, X0 = -4.5, X1 = 4.5;
const Z0 = -7.5, Z1 = 4.5;          // building footprint (3 m front garden to z = 7.5)
const PLINTH = 0.6, FLOOR = 3.2, SLAB = 0.15, WALL = 0.23;
const L1 = PLINTH + FLOOR;          // first-floor slab top
const L2 = L1 + FLOOR;              // roof slab top
const COLS_X = [-4.35, 0, 4.35];
const COLS_Z = [-7.35, -3.6, 0.15, 4.35];

type MatKey = 'footing' | 'struct' | 'wall' | 'frame' | 'glass' | 'clad' | 'lawn' | 'clay' | 'wood' | 'accentSoft';
type Anim = 'grow' | 'drop' | 'pop';

interface Part {
    stage: number;
    delay: number; // 0..1 within the stage
    anim: Anim;
    pos: [number, number, number]; // base centre (y = bottom)
    size: [number, number, number];
    mat: MatKey;
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

/** Window/door frame (4 slim members) + glass, appearing in the openings stage. */
function frameParts(axis: 'x' | 'z', fixed: number, y0: number, o: Opening, stage: number, delay: number): Part[] {
    const t = 0.06, depth = 0.1;
    const h = o.head - o.sill;
    const yb = y0 + o.sill;
    const along = (c: number, len: number): [number, number, number] => (axis === 'x' ? [len, 0, depth] : [depth, 0, len]) as [number, number, number];
    const at = (c: number, y: number): [number, number, number] => (axis === 'x' ? [c, y, fixed] : [fixed, y, c]);
    const parts: Part[] = [];
    const sz = (w: number, hh: number): [number, number, number] => { const s = along(0, w); return [s[0], hh, s[2]]; };
    parts.push({ stage, delay, anim: 'pop', mat: 'frame', pos: at(o.c - o.w / 2 + t / 2, yb), size: sz(t, h) });
    parts.push({ stage, delay, anim: 'pop', mat: 'frame', pos: at(o.c + o.w / 2 - t / 2, yb), size: sz(t, h) });
    parts.push({ stage, delay, anim: 'pop', mat: 'frame', pos: at(o.c, yb), size: sz(o.w, t) });
    parts.push({ stage, delay, anim: 'pop', mat: 'frame', pos: at(o.c, yb + h - t), size: sz(o.w, t) });
    if (o.w > 1.6) parts.push({ stage, delay, anim: 'pop', mat: 'frame', pos: at(o.c, yb), size: sz(t, h) });
    const g = along(0, o.w - t);
    parts.push({ stage, delay: Math.min(1, delay + 0.1), anim: 'pop', mat: 'glass', pos: at(o.c, yb + t), size: [axis === 'x' ? g[0] : 0.02, h - 2 * t, axis === 'x' ? 0.02 : g[2]] });
    return parts;
}

function buildModel(): Part[] {
    const P: Part[] = [];

    // 1 · Foundation: footings, plinth beams, plinth slab
    COLS_X.forEach((x, i) => COLS_Z.forEach((z, j) => {
        P.push({ stage: 1, delay: (i * 4 + j) / 14, anim: 'grow', mat: 'footing', pos: [x, -0.05, z], size: [1.3, 0.35, 1.3] });
    }));
    COLS_Z.forEach((z, j) => P.push({ stage: 1, delay: 0.55 + j * 0.05, anim: 'grow', mat: 'footing', pos: [0, 0.2, z], size: [W, 0.4, 0.3] }));
    COLS_X.forEach((x, i) => P.push({ stage: 1, delay: 0.6 + i * 0.05, anim: 'grow', mat: 'footing', pos: [x, 0.2, (Z0 + Z1) / 2], size: [0.3, 0.4, Z1 - Z0] }));
    P.push({ stage: 1, delay: 0.85, anim: 'grow', mat: 'struct', pos: [0, 0.45, (Z0 + Z1) / 2], size: [W, PLINTH - 0.45, Z1 - Z0] });

    // 2 · Frame: columns for both floors
    COLS_X.forEach((x, i) => COLS_Z.forEach((z, j) => {
        P.push({ stage: 2, delay: (i * 4 + j) / 24, anim: 'grow', mat: 'struct', pos: [x, PLINTH, z], size: [0.3, FLOOR - SLAB, 0.3] });
        P.push({ stage: 2, delay: 0.5 + (i * 4 + j) / 24, anim: 'grow', mat: 'struct', pos: [x, L1, z], size: [0.3, FLOOR - SLAB, 0.3] });
    }));

    // 3 · Slabs + perimeter beams + front balcony
    [L1, L2].forEach((top, k) => {
        P.push({ stage: 3, delay: k * 0.5, anim: 'drop', mat: 'struct', pos: [0, top - SLAB, (Z0 + Z1) / 2], size: [W + 0.1, SLAB, Z1 - Z0 + 0.1] });
        P.push({ stage: 3, delay: k * 0.5 + 0.1, anim: 'drop', mat: 'struct', pos: [0, top - 0.45, Z1 - 0.15], size: [W, 0.3, 0.3] });
        P.push({ stage: 3, delay: k * 0.5 + 0.1, anim: 'drop', mat: 'struct', pos: [0, top - 0.45, Z0 + 0.15], size: [W, 0.3, 0.3] });
    });
    P.push({ stage: 3, delay: 0.35, anim: 'drop', mat: 'struct', pos: [1.6, L1 - SLAB, Z1 + 0.75], size: [4.6, SLAB, 1.5] });

    // 4 · Walls with openings (ground + first) and roof parapet / stair room
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
    // Parapet
    P.push({ stage: 4, delay: 0.85, anim: 'grow', mat: 'wall', pos: [0, L2, Z1 - 0.1], size: [W, 0.9, 0.2] });
    P.push({ stage: 4, delay: 0.85, anim: 'grow', mat: 'wall', pos: [X1 - 0.1, L2, (Z0 + Z1) / 2], size: [0.2, 0.9, Z1 - Z0] });
    P.push({ stage: 4, delay: 0.85, anim: 'grow', mat: 'wall', pos: [X0 + 0.1, L2, (Z0 + Z1) / 2], size: [0.2, 0.9, Z1 - Z0] });
    P.push({ stage: 4, delay: 0.85, anim: 'grow', mat: 'wall', pos: [0, L2, Z0 + 0.1], size: [W, 0.9, 0.2] });
    // Stair room on the roof
    P.push({ stage: 4, delay: 0.9, anim: 'grow', mat: 'wall', pos: [-3, L2, -5.6], size: [3, 2.6, 3.4] });
    P.push({ stage: 4, delay: 0.98, anim: 'drop', mat: 'struct', pos: [-3, L2 + 2.6, -5.6], size: [3.3, 0.15, 3.7] });

    // 5 · Openings: frames + glass, balcony glass rail
    gFront.forEach((o, i) => P.push(...frameParts('x', Z1 + 0.02, PLINTH, o, 5, i * 0.12)));
    fFront.forEach((o, i) => P.push(...frameParts('x', Z1 + 0.02, L1, o, 5, 0.25 + i * 0.12)));
    side.forEach((o, i) => { P.push(...frameParts('z', X1 + 0.02, PLINTH, o, 5, 0.4 + i * 0.08)); P.push(...frameParts('z', X1 + 0.02, L1, o, 5, 0.5 + i * 0.08)); });
    P.push({ stage: 5, delay: 0.7, anim: 'pop', mat: 'glass', pos: [1.6, L1, Z1 + 1.48], size: [4.6, 1.0, 0.03] });
    P.push({ stage: 5, delay: 0.7, anim: 'pop', mat: 'frame', pos: [1.6, L1 + 1.0, Z1 + 1.48], size: [4.6, 0.05, 0.06] });

    // 6 · Finishes: terracotta slat cladding, stone plinth band, garden, boundary wall
    for (let i = 0; i < 15; i++) {
        P.push({ stage: 6, delay: i / 22, anim: 'grow', mat: 'clad', pos: [-4.1 + i * 0.13, L1 + 2.45, Z1 + 0.06], size: [0.07, FLOOR - 2.45 + 0.6, 0.08] });
    }
    for (let i = 0; i < 9; i++) {
        P.push({ stage: 6, delay: 0.3 + i / 30, anim: 'grow', mat: 'clad', pos: [3.55 + i * 0.11, PLINTH, Z1 + 0.06], size: [0.06, FLOOR - 0.2, 0.08] });
    }
    P.push({ stage: 6, delay: 0.5, anim: 'pop', mat: 'lawn', pos: [0, 0.01, 6.0], size: [W - 0.4, 0.04, 2.8] });
    P.push({ stage: 6, delay: 0.6, anim: 'grow', mat: 'clay', pos: [-2.6, 0, 7.4], size: [3.6, 0.9, 0.2] });
    P.push({ stage: 6, delay: 0.62, anim: 'grow', mat: 'clay', pos: [3.25, 0, 7.4], size: [2.5, 0.9, 0.2] });
    P.push({ stage: 6, delay: 0.7, anim: 'grow', mat: 'clay', pos: [X1 - 0.1, 0, 6], size: [0.2, 0.9, 3] });
    P.push({ stage: 6, delay: 0.7, anim: 'grow', mat: 'clay', pos: [X0 + 0.1, 0, 6], size: [0.2, 0.9, 3] });

    // 7 · Interiors seen through the glazing: floor, island, counter, sofa
    P.push({ stage: 7, delay: 0, anim: 'pop', mat: 'wood', pos: [0, PLINTH + 0.005, (Z0 + Z1) / 2], size: [W - 0.5, 0.02, Z1 - Z0 - 0.5] });
    P.push({ stage: 7, delay: 0.2, anim: 'grow', mat: 'clay', pos: [-1.6, PLINTH, 1.2], size: [2.4, 0.92, 0.95] });
    P.push({ stage: 7, delay: 0.25, anim: 'grow', mat: 'clad', pos: [-1.6, PLINTH + 0.92, 1.2], size: [2.5, 0.05, 1.0] });
    P.push({ stage: 7, delay: 0.35, anim: 'grow', mat: 'clay', pos: [-1.6, PLINTH, -1.6], size: [5.2, 0.9, 0.62] });
    P.push({ stage: 7, delay: 0.4, anim: 'grow', mat: 'wood', pos: [-1.6, PLINTH + 1.55, -1.75], size: [5.2, 0.75, 0.35] });
    P.push({ stage: 7, delay: 0.5, anim: 'grow', mat: 'accentSoft', pos: [2.4, PLINTH, -0.4], size: [2.2, 0.75, 0.9] });

    return P;
}

// ── Materials & colours ──────────────────────────────────────────────────
const C = {
    accent: new THREE.Color('#B4502F'),
    clay: new THREE.Color('#EEEAE3'),
    concrete: new THREE.Color('#C9C3B8'),
    footing: new THREE.Color('#B9B2A6'),
    brick: new THREE.Color('#C69A80'),
    frame: new THREE.Color('#2A2A2A'),
    glass: new THREE.Color('#A9BEC4'),
    clad: new THREE.Color('#B4603F'),
    lawn: new THREE.Color('#B8BDA3'),
    wood: new THREE.Color('#B48D66'),
    soft: new THREE.Color('#D9D2C5'),
};
const TMP = new THREE.Color();

function baseColor(key: MatKey, p: number, out: THREE.Color) {
    const finish = THREE.MathUtils.clamp(p - 6, 0, 1); // finishes stage paints everything
    switch (key) {
        case 'struct': return out.copy(C.concrete).lerp(C.clay, finish);
        case 'wall': return out.copy(C.brick).lerp(C.clay, finish);
        case 'footing': return out.copy(C.footing);
        case 'frame': return out.copy(C.frame);
        case 'glass': return out.copy(C.glass);
        case 'clad': return out.copy(C.clad);
        case 'lawn': return out.copy(C.lawn);
        case 'wood': return out.copy(C.wood);
        case 'accentSoft': return out.copy(C.soft);
        default: return out.copy(C.clay);
    }
}

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

function House({ state }: { state: MutableRefObject<BuildState> }) {
    const parts = useMemo(() => buildModel(), []);
    const groups = useRef<(THREE.Group | null)[]>([]);

    // One material per (material key, stage) so each stage can glow on its own.
    const materials = useMemo(() => {
        const m = new Map<string, THREE.MeshStandardMaterial>();
        parts.forEach((p) => {
            const k = `${p.mat}-${p.stage}`;
            if (m.has(k)) return;
            const glass = p.mat === 'glass';
            m.set(k, new THREE.MeshStandardMaterial({
                color: '#ffffff',
                roughness: glass ? 0.08 : p.mat === 'frame' ? 0.5 : 0.88,
                metalness: glass ? 0.1 : 0,
                transparent: glass,
                opacity: glass ? 0.42 : 1,
                emissive: glass ? new THREE.Color('#ffb36b') : new THREE.Color('#000000'),
                emissiveIntensity: 0,
            }));
        });
        return m;
    }, [parts]);

    const geo = useMemo(() => new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0), []);
    const warm = useRef<THREE.PointLight>(null);
    const warm2 = useRef<THREE.PointLight>(null);

    useFrame(() => {
        const P = state.current.p;
        materials.forEach((mat, key) => {
            const [mk, st] = key.split('-');
            const stage = Number(st);
            baseColor(mk as MatKey, P, TMP);
            // The stage being built glows brick red, then settles to its raw colour.
            const local = P - stage;
            const glow = local >= 0 && local < 1.3 ? 1 - THREE.MathUtils.clamp((local - 0.7) / 0.6, 0, 1) : 0;
            if (mk !== 'glass' && mk !== 'frame') TMP.lerp(C.accent, glow * 0.65);
            mat.color.copy(TMP);
            if (mk === 'glass') mat.emissiveIntensity = THREE.MathUtils.clamp((P - 7.2) * 1.2, 0, 0.9);
        });
        parts.forEach((part, i) => {
            const g = groups.current[i];
            if (!g) return;
            const start = part.stage + part.delay * 0.55;
            const t = ease(THREE.MathUtils.clamp((P - start) / 0.45, 0, 1));
            const [x, y, z] = part.pos;
            g.visible = t > 0.001;
            if (part.anim === 'grow') { g.scale.set(1, Math.max(t, 0.001), 1); g.position.set(x, y, z); }
            else if (part.anim === 'drop') { g.scale.set(1, 1, 1); g.position.set(x, y + (1 - t) * 3, z); }
            else { const s = 0.6 + 0.4 * t; g.scale.set(s, Math.max(t, 0.001), s); g.position.set(x, y, z); }
        });
        const lights = THREE.MathUtils.clamp((P - 7.1) * 1.5, 0, 1);
        if (warm.current) warm.current.intensity = lights * 9;
        if (warm2.current) warm2.current.intensity = lights * 6;
    });

    return (
        <group>
            {parts.map((p, i) => (
                <group key={i} ref={(el) => { groups.current[i] = el; }} visible={false}>
                    <mesh
                        geometry={geo}
                        material={materials.get(`${p.mat}-${p.stage}`)}
                        scale={p.size}
                        castShadow={p.mat !== 'glass'}
                        receiveShadow
                    />
                </group>
            ))}
            <pointLight ref={warm} position={[-1.4, 2.6, 0.8]} color="#ffb877" intensity={0} distance={9} decay={2} />
            <pointLight ref={warm2} position={[0, L1 + 2.2, 1]} color="#ffc48f" intensity={0} distance={8} decay={2} />
        </group>
    );
}

/** Drafting grid on the ground plane. */
function useGridTexture() {
    return useMemo(() => {
        const c = document.createElement('canvas');
        c.width = c.height = 256;
        const g = c.getContext('2d')!;
        g.fillStyle = '#F1EEE7';
        g.fillRect(0, 0, 256, 256);
        g.strokeStyle = 'rgba(18,18,18,0.10)';
        g.lineWidth = 2;
        g.strokeRect(0, 0, 256, 256);
        g.strokeStyle = 'rgba(18,18,18,0.05)';
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
    const ref = useRef<THREE.Group>(null);
    const [show, setShow] = useState(true);
    useFrame(() => {
        const p = state.current.p;
        const visible = p < 2.2;
        if (visible !== show) setShow(visible);
    });
    const plot: [number, number, number][] = [[-4.6, 0.02, -7.6], [4.6, 0.02, -7.6], [4.6, 0.02, 7.6], [-4.6, 0.02, 7.6], [-4.6, 0.02, -7.6]];
    return (
        <group ref={ref} visible={show}>
            <Line points={plot} color="#B4502F" lineWidth={1.6} dashed dashSize={0.35} gapSize={0.22} />
            <Line points={[[-4.6, 0.02, 8.6], [4.6, 0.02, 8.6]]} color="#121212" lineWidth={1} />
            <Line points={[[5.6, 0.02, -7.6], [5.6, 0.02, 7.6]]} color="#121212" lineWidth={1} />
            {show && (
                <>
                    <Html position={[0, 0.05, 8.6]} center zIndexRange={[5, 0]}><span className="mono text-[11px] px-1.5 whitespace-nowrap" style={{ background: '#F1EEE7', color: '#121212' }}>30 FT · 9.1 M</span></Html>
                    <Html position={[5.6, 0.05, 0]} center zIndexRange={[5, 0]}><span className="mono text-[11px] px-1.5 whitespace-nowrap" style={{ background: '#F1EEE7', color: '#121212' }}>50 FT · 15.2 M</span></Html>
                </>
            )}
        </group>
    );
}

// Camera path: high site survey → low three-quarter view of the finished house.
const POS = new THREE.Vector3();
const LOOK = new THREE.Vector3();

function Rig({ state }: { state: MutableRefObject<BuildState> }) {
    useFrame(({ camera, pointer, size }, dt) => {
        const t = THREE.MathUtils.smootherstep(state.current.p, -0.6, 8.2);
        const mobile = size.width < 700;
        const theta = THREE.MathUtils.lerp(0.95, 0.5, t) + pointer.x * 0.06;
        const dist = THREE.MathUtils.lerp(38, 24, t) * (mobile ? 1.45 : 1);
        const elev = THREE.MathUtils.lerp(25, 6.2, t) + pointer.y * 0.8;
        POS.set(Math.sin(theta) * dist, elev, Math.cos(theta) * dist);
        LOOK.set(mobile ? 0 : -2.2 * (1 - t * 0.4), THREE.MathUtils.lerp(0, 3.4, t), 0);
        camera.position.x = THREE.MathUtils.damp(camera.position.x, POS.x, 3, dt);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, POS.y, 3, dt);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, POS.z, 3, dt);
        camera.lookAt(LOOK);
    });
    return null;
}

export default function HouseScene({ state }: { state: MutableRefObject<BuildState> }) {
    const wrap = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(true);
    const [fx] = useState<FxLevel>(() => initialFxLevel());
    const [halfFloat, setHalfFloat] = useState(true);
    const grid = useGridTexture();

    useEffect(() => {
        const el = wrap.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <div ref={wrap} className="absolute inset-0">
            <Canvas
                shadows
                dpr={fx === 'full' ? [1, 1.75] : [1, 1.25]}
                frameloop={visible ? 'always' : 'never'}
                camera={{ fov: 30, near: 0.5, far: 200, position: [24, 25, 30] }}
                gl={{ antialias: fx !== 'full', alpha: false }}
                onCreated={({ gl }) => {
                    gl.shadowMap.type = THREE.PCFShadowMap;
                    // Neutral tone mapping keeps the paper background and clay whites true.
                    gl.toneMapping = THREE.NeutralToneMapping;
                    setHalfFloat(supportsHalfFloat(gl));
                }}
            >
                <color attach="background" args={['#F1EEE7']} />
                <fog attach="fog" args={['#F1EEE7', 55, 110]} />
                <Suspense fallback={null}>
                    <Environment files="/hdri/studio.exr" environmentIntensity={0.4} />
                </Suspense>
                <hemisphereLight args={['#fff7ec', '#d9d2c5', 0.4]} />
                <directionalLight
                    position={[-14, 22, 16]}
                    intensity={2.4}
                    color="#fff6ea"
                    castShadow
                    shadow-mapSize={[fx === 'full' ? 2048 : 1024, fx === 'full' ? 2048 : 1024]}
                    shadow-radius={5}
                    shadow-bias={-0.0003}
                    shadow-normalBias={0.03}
                    shadow-camera-left={-18}
                    shadow-camera-right={18}
                    shadow-camera-top={18}
                    shadow-camera-bottom={-18}
                    shadow-camera-near={1}
                    shadow-camera-far={70}
                />
                {/* Unlit paper ground (matches the page exactly) + a shadow-catcher above it. */}
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[240, 240]} />
                    <meshBasicMaterial map={grid} toneMapped={false} />
                </mesh>
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]} receiveShadow>
                    <planeGeometry args={[240, 240]} />
                    <shadowMaterial opacity={0.18} color="#3b3226" />
                </mesh>
                <SiteMarks state={state} />
                <House state={state} />
                <Rig state={state} />
                {/* Ambient occlusion only on capable desktops; lighter tiers render direct. */}
                {fx === 'full' && (
                    <EffectComposer multisampling={4} frameBufferType={halfFloat ? THREE.HalfFloatType : THREE.UnsignedByteType}>
                        <N8AO aoRadius={1.2} intensity={2.6} distanceFalloff={1} quality="performance" />
                        <ToneMapping mode={ToneMappingMode.NEUTRAL} />
                    </EffectComposer>
                )}
            </Canvas>
        </div>
    );
}
