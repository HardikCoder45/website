'use client';
import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, RoundedBox } from '@react-three/drei';
import { EffectComposer, Bloom, N8AO, Vignette, ToneMapping } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import * as THREE from 'three';
import { usePbr } from '@/lib/three/usePbr';
import { initialFxLevel, supportsHalfFloat, type FxLevel } from '@/lib/three/quality';

export interface AtelierState {
    /** 0 → resting composition, 1 → camera pushed into the arch (scroll). */
    progress: number;
}

// ── Geometry helpers ──────────────────────────────────────────────────────

/** A thick wall with an arched opening, extruded towards the camera. */
function useArchGeometry(w = 2.6, h = 3.6, ow = 1.25, springline = 2.05, depth = 0.55) {
    return useMemo(() => {
        const outer = new THREE.Shape();
        outer.moveTo(-w / 2, 0);
        outer.lineTo(w / 2, 0);
        outer.lineTo(w / 2, h);
        outer.lineTo(-w / 2, h);
        outer.closePath();
        const hole = new THREE.Path();
        const r = ow / 2;
        hole.moveTo(-r, 0.001);
        hole.lineTo(r, 0.001);
        hole.lineTo(r, springline);
        hole.absarc(0, springline, r, 0, Math.PI, false);
        hole.lineTo(-r, 0.001);
        outer.holes.push(hole);
        const geo = new THREE.ExtrudeGeometry(outer, { depth, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 2, curveSegments: 48 });
        geo.translate(0, 0, -depth / 2);
        // ExtrudeGeometry UVs are in shape units (metres); scale so the stone reads at real size.
        const uv = geo.attributes.uv as THREE.BufferAttribute;
        for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 0.45, uv.getY(i) * 0.45);
        geo.computeVertexNormals();
        return geo;
    }, [w, h, ow, springline, depth]);
}

/** Classical fluted column: a cylinder whose radius dips into N concave flutes. */
function useFlutedGeometry(radius = 0.2, height = 2.9, flutes = 20, depth = 0.018) {
    return useMemo(() => {
        const geo = new THREE.CylinderGeometry(radius, radius, height, flutes * 8, 1, false);
        const pos = geo.attributes.position as THREE.BufferAttribute;
        const v = new THREE.Vector3();
        for (let i = 0; i < pos.count; i++) {
            v.fromBufferAttribute(pos, i);
            const r = Math.hypot(v.x, v.z);
            if (r < radius * 0.5) continue; // cap centre
            const a = Math.atan2(v.z, v.x);
            const f = Math.pow(Math.max(0, Math.cos(a * flutes)), 0.6);
            const nr = radius - depth * f;
            pos.setXYZ(i, Math.cos(a) * nr, v.y, Math.sin(a) * nr);
        }
        geo.translate(0, height / 2, 0);
        geo.computeVertexNormals();
        return geo;
    }, [radius, height, flutes, depth]);
}

/** Wall with a window opening; it sits off-camera and casts the window light. */
function useWindowOccluder() {
    return useMemo(() => {
        const s = new THREE.Shape();
        s.moveTo(-6, -6); s.lineTo(6, -6); s.lineTo(6, 6); s.lineTo(-6, 6); s.closePath();
        const panes = [[-0.62, 0.05], [0.04, 0.05], [-0.62, -1.05], [0.04, -1.05]];
        panes.forEach(([x, y]) => {
            const p = new THREE.Path();
            p.moveTo(x, y); p.lineTo(x + 0.58, y); p.lineTo(x + 0.58, y + 1.0); p.lineTo(x, y + 1.0); p.closePath();
            s.holes.push(p);
        });
        return new THREE.ShapeGeometry(s);
    }, []);
}

/** Soft radial glow texture for the light beyond the arch. */
function useGlowTexture() {
    return useMemo(() => {
        const c = document.createElement('canvas');
        c.width = 64; c.height = 256;
        const g = c.getContext('2d')!;
        const grad = g.createLinearGradient(0, 256, 0, 0);
        grad.addColorStop(0, 'rgba(255,214,160,1)');
        grad.addColorStop(0.55, 'rgba(255,196,130,0.85)');
        grad.addColorStop(1, 'rgba(120,80,50,0.35)');
        g.fillStyle = grad;
        g.fillRect(0, 0, 64, 256);
        const t = new THREE.CanvasTexture(c);
        t.colorSpace = THREE.SRGBColorSpace;
        return t;
    }, []);
}

// ── Scene ─────────────────────────────────────────────────────────────────

const TARGET = new THREE.Vector3();
const POS = new THREE.Vector3();
const REST = { pos: new THREE.Vector3(0.15, 1.55, 7.2), look: new THREE.Vector3(0.75, 1.35, 0) };
const PUSH = { pos: new THREE.Vector3(1.1, 1.55, 3.4), look: new THREE.Vector3(1.15, 1.45, -1.2) };
const LIGHT_TARGET = new THREE.Vector3(1.1, 0.9, -0.5);
const SUN_DIR = new THREE.Vector3();
const N_FLOOR = new THREE.Vector2(0.4, 0.4);
const N_WALL = new THREE.Vector2(0.6, 0.6);
const N_STONE = new THREE.Vector2(0.35, 0.35);

function Atelier({ state, fx }: { state: MutableRefObject<AtelierState>; fx: FxLevel }) {
    const travertine = usePbr('travertine', [1, 1]);
    const plinthStone = usePbr('travertine', [0.8, 0.8]);
    const wallPlaster = usePbr('plaster', [3, 1.6]);
    const floorPlaster = usePbr('plaster', [4, 3]);
    const oak = usePbr('oak', [1, 0.35]);
    const nero = usePbr('nero', [0.6, 0.6]);
    const calacatta = usePbr('calacatta', [0.6, 0.6]);
    const terrazzo = usePbr('terrazzo', [0.5, 0.5]);
    const brushed = usePbr('brushed', [1, 1]);

    const arch = useArchGeometry();
    const fluted = useFlutedGeometry();
    const occluder = useWindowOccluder();
    const glow = useGlowTexture();

    const sun = useRef<THREE.DirectionalLight>(null);
    const occ = useRef<THREE.Mesh>(null);

    useFrame(({ camera, pointer, clock }, dt) => {
        const t = clock.elapsedTime;
        const p = THREE.MathUtils.smootherstep(state.current.progress, 0, 1);

        // Camera: rest → push into the arch, with gentle pointer parallax.
        POS.lerpVectors(REST.pos, PUSH.pos, p);
        TARGET.lerpVectors(REST.look, PUSH.look, p);
        POS.x += pointer.x * 0.35 * (1 - p * 0.6);
        POS.y += pointer.y * 0.18 * (1 - p * 0.6);
        camera.position.x = THREE.MathUtils.damp(camera.position.x, POS.x, 3, dt);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, POS.y, 3, dt);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, POS.z, 3, dt);
        camera.lookAt(TARGET);

        // The "sun" drifts slowly so window light glides across stone and plaster.
        if (sun.current && occ.current) {
            const a = -0.55 + Math.sin(t * 0.07) * 0.22;
            SUN_DIR.set(Math.sin(a) * 0.95, 0.52, Math.cos(a) * 0.6).normalize();
            sun.current.position.copy(LIGHT_TARGET).addScaledVector(SUN_DIR, 12);
            // The light's target isn't in the scene graph, so update it by hand.
            sun.current.target.position.copy(LIGHT_TARGET);
            sun.current.target.updateMatrixWorld();
            // Keep the window wall perpendicular to the light, 6.5 m up the beam.
            occ.current.position.copy(LIGHT_TARGET).addScaledVector(SUN_DIR, 6.5);
            occ.current.lookAt(LIGHT_TARGET);
        }
    });

    const shadowSize = fx === 'full' ? 2048 : 1024;

    return (
        <>
            <color attach="background" args={['#0d0c0a']} />
            <fog attach="fog" args={['#0d0c0a', 9, 18]} />
            <Environment files="/hdri/studio.exr" environmentIntensity={0.12} />
            <hemisphereLight args={['#3b342c', '#0d0c0a', 0.35]} />

            <directionalLight
                ref={sun}
                color="#ffd9ad"
                intensity={8}
                castShadow
                shadow-mapSize={[shadowSize, shadowSize]}
                shadow-radius={fx === 'full' ? 7 : 4}
                shadow-bias={-0.0004}
                shadow-normalBias={0.02}
                shadow-camera-left={-7}
                shadow-camera-right={7}
                shadow-camera-top={7}
                shadow-camera-bottom={-7}
                shadow-camera-near={0.5}
                shadow-camera-far={30}
            />
            {/* Window wall: invisible to the camera, but it shapes the light. */}
            <mesh ref={occ} geometry={occluder} castShadow>
                <meshBasicMaterial colorWrite={false} depthWrite={false} side={THREE.DoubleSide} />
            </mesh>

            {/* Room */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.8, 0, 1.5]} receiveShadow>
                <planeGeometry args={[16, 11]} />
                <meshStandardMaterial {...floorPlaster} color="#6d655c" roughness={0.85} normalScale={N_FLOOR} />
            </mesh>
            <mesh position={[0.8, 3, -1.25]} receiveShadow>
                <planeGeometry args={[16, 6]} />
                <meshStandardMaterial {...wallPlaster} color="#8a8178" roughness={0.95} normalScale={N_WALL} />
            </mesh>

            {/* Travertine arch with warm light beyond */}
            <group position={[1.15, 0, -0.7]}>
                <mesh geometry={arch} castShadow receiveShadow>
                    <meshStandardMaterial {...travertine} color="#ddd1bc" roughness={0.9} normalScale={N_STONE} />
                </mesh>
                <mesh position={[0, 1.4, -0.52]}>
                    <planeGeometry args={[1.4, 2.9]} />
                    <meshBasicMaterial map={glow} toneMapped={false} color={[1.6, 1.25, 0.9]} />
                </mesh>
                <pointLight position={[0, 1.6, -0.2]} color="#ffbe82" intensity={2.2} distance={4.5} decay={2} />
            </group>

            {/* Fluted column */}
            <group position={[-1.55, 0, -0.35]}>
                <mesh geometry={fluted} castShadow receiveShadow>
                    <meshStandardMaterial {...plinthStone} color="#d6c9b2" roughness={0.85} />
                </mesh>
                <RoundedBox args={[0.6, 0.12, 0.6]} radius={0.01} position={[0, 0.06, 0]} castShadow receiveShadow>
                    <meshStandardMaterial {...plinthStone} color="#cbbda5" roughness={0.9} />
                </RoundedBox>
                <RoundedBox args={[0.6, 0.1, 0.6]} radius={0.01} position={[0, 2.95, 0]} castShadow receiveShadow>
                    <meshStandardMaterial {...plinthStone} color="#cbbda5" roughness={0.9} />
                </RoundedBox>
            </group>

            {/* Plinths, brass sphere and a stack of material samples */}
            <group position={[2.75, 0, 0.55]} rotation={[0, -0.35, 0]}>
                <RoundedBox args={[0.7, 1.05, 0.7]} radius={0.012} position={[0, 0.525, 0]} castShadow receiveShadow>
                    <meshStandardMaterial {...plinthStone} color="#dccfb9" roughness={0.88} />
                </RoundedBox>
                <mesh position={[0, 1.05 + 0.24, 0]} castShadow>
                    <sphereGeometry args={[0.24, 96, 64]} />
                    <meshPhysicalMaterial color="#d9b47a" metalness={0.88} roughness={0.42} roughnessMap={brushed.roughnessMap} envMapIntensity={9} clearcoat={0.25} clearcoatRoughness={0.35} />
                </mesh>
                {/* Small warm key so the brass reads as brass, not a black mirror. */}
                <pointLight position={[-0.6, 1.9, 0.9]} color="#ffd7a3" intensity={4} distance={2.4} decay={2} />
            </group>
            <group position={[1.95, 0, 1.25]} rotation={[0, 0.25, 0]}>
                <RoundedBox args={[0.95, 0.42, 0.62]} radius={0.012} position={[0, 0.21, 0]} castShadow receiveShadow>
                    <meshStandardMaterial {...plinthStone} color="#d4c6ae" roughness={0.9} />
                </RoundedBox>
                {[
                    { mat: oak, color: '#a47a52', r: 0.5, rot: -0.06 },
                    { mat: nero, color: '#ffffff', r: 0.15, rot: 0.08 },
                    { mat: calacatta, color: '#ffffff', r: 0.18, rot: -0.12 },
                    { mat: terrazzo, color: '#ffffff', r: 0.4, rot: 0.04 },
                ].map((s, i) => (
                    <RoundedBox key={i} args={[0.6, 0.035, 0.38]} radius={0.004} position={[0.02 * i, 0.42 + 0.018 + i * 0.037, -0.01 * i]} rotation={[0, s.rot, 0]} castShadow receiveShadow>
                        <meshPhysicalMaterial {...s.mat} color={s.color} roughness={s.r} clearcoat={s.r < 0.3 ? 0.6 : 0} />
                    </RoundedBox>
                ))}
            </group>
        </>
    );
}

interface AtelierSceneProps {
    state: MutableRefObject<AtelierState>;
    onReady?: () => void;
}

function Ready({ onReady }: { onReady?: () => void }) {
    useEffect(() => { onReady?.(); }, [onReady]);
    return null;
}

export default function AtelierScene({ state, onReady }: AtelierSceneProps) {
    const wrap = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(true);
    const [fx] = useState<FxLevel>(() => initialFxLevel());
    const [halfFloat, setHalfFloat] = useState(true);

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
                camera={{ fov: 30, near: 0.1, far: 40, position: REST.pos.toArray() }}
                gl={{ antialias: fx !== 'full', powerPreference: 'high-performance' }}
                onCreated={({ gl }) => {
                    // PCF with shadow.radius gives soft edges (drei's PCSS chunk doesn't compile on three r183).
                    gl.shadowMap.type = THREE.PCFShadowMap;
                    setHalfFloat(supportsHalfFloat(gl));
                }}
            >
                <Suspense fallback={null}>
                    <Atelier state={state} fx={fx} />
                    <Ready onReady={onReady} />
                </Suspense>
                {fx !== 'off' && (
                    <EffectComposer multisampling={fx === 'full' ? 4 : 0} frameBufferType={halfFloat ? THREE.HalfFloatType : THREE.UnsignedByteType}>
                        {fx === 'full' ? <N8AO aoRadius={0.5} intensity={2.5} distanceFalloff={0.5} quality="performance" /> : <></>}
                        <Bloom mipmapBlur luminanceThreshold={0.85} intensity={0.55} radius={0.7} />
                        <ToneMapping mode={ToneMappingMode.AGX} />
                        <Vignette offset={0.25} darkness={0.7} />
                    </EffectComposer>
                )}
            </Canvas>
        </div>
    );
}
