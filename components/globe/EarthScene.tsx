'use client';
import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { OFFICE_GEO } from '@/lib/data/config';

export interface GlobeState {
    /** Scroll progress through the section, 0..1. */
    t: number;
}

type AltitudeFn = (km: number) => void;

/** Lat/lon → point on a unit sphere, matching three's SphereGeometry UV layout. */
function latLonToVec(lat: number, lon: number) {
    const phi = ((lon + 180) * Math.PI) / 180;
    const theta = ((90 - lat) * Math.PI) / 180;
    return new THREE.Vector3(-Math.cos(phi) * Math.sin(theta), Math.cos(theta), Math.sin(phi) * Math.sin(theta));
}

/** Euler (XYZ) that turns a surface point to face +Z with north kept up. */
function faceCamera(p: THREE.Vector3) {
    const beta = Math.atan2(-p.x, p.z);
    const r = Math.hypot(p.x, p.z);
    const gamma = Math.atan2(p.y, r);
    return { x: gamma, y: beta };
}

const EARTH_VERT = /* glsl */ `
varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vPosW;
void main() {
    vUv = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vPosW = world.xyz;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * world;
}`;

const EARTH_FRAG = /* glsl */ `
uniform sampler2D dayMap;
uniform sampler2D nightMap;
uniform sampler2D brcMap; // r: bump, g: roughness (oceans low), b: clouds
uniform vec3 sunDir;
uniform float cloudShift;
uniform float cloudAmount;
varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vPosW;
void main() {
    vec3 n = normalize(vNormalW);
    vec3 v = normalize(cameraPosition - vPosW);
    float sun = dot(n, sunDir);
    float dayMix = smoothstep(-0.18, 0.22, sun);

    vec3 day = texture2D(dayMap, vUv).rgb;
    vec3 night = texture2D(nightMap, vUv).rgb;
    vec4 brc = texture2D(brcMap, vUv);
    float clouds = texture2D(brcMap, vUv + vec2(cloudShift, 0.0)).b;
    float rough = brc.g;

    vec3 lit = day * (0.06 + 1.15 * max(sun, 0.0));
    vec3 col = mix(night * vec3(1.6, 1.35, 1.0) * 1.4, lit, dayMix);

    // Sun glint on the oceans.
    vec3 h = normalize(sunDir + v);
    float spec = pow(max(dot(n, h), 0.0), 60.0) * (1.0 - rough) * max(sun, 0.0);
    col += vec3(1.0, 0.92, 0.8) * spec * 0.55;

    // Clouds, lit only on the day side.
    col = mix(col, vec3(0.95) * (0.08 + max(sun, 0.0)), clouds * 0.75 * cloudAmount * smoothstep(-0.1, 0.3, sun));

    // Atmospheric rim.
    float fres = pow(1.0 - max(dot(n, v), 0.0), 3.0);
    col += vec3(0.35, 0.55, 1.0) * fres * (0.25 + 0.75 * dayMix) * 0.9;

    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}`;

const ATMO_VERT = /* glsl */ `
varying vec3 vNormalW;
varying vec3 vPosW;
void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vPosW = world.xyz;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * world;
}`;

const ATMO_FRAG = /* glsl */ `
uniform vec3 sunDir;
varying vec3 vNormalW;
varying vec3 vPosW;
void main() {
    vec3 n = normalize(vNormalW);
    vec3 v = normalize(cameraPosition - vPosW);
    // On the back faces of the shell, |n·v| is ~0.33 right at Earth's limb and 0
    // at the shell's edge, so this peaks against the planet and fades outward.
    float a = abs(dot(n, v));
    float glow = pow(smoothstep(0.0, 0.33, a), 2.2) * (1.0 - smoothstep(0.33, 0.55, a));
    float lit = smoothstep(-0.5, 0.6, dot(n, sunDir));
    gl_FragColor = vec4(vec3(0.42, 0.62, 1.0) * glow * (0.25 + lit) * 1.2, glow);
}`;

const SUN = new THREE.Vector3(0.75, 0.35, 0.6).normalize();
const TARGET = latLonToVec(OFFICE_GEO.lat, OFFICE_GEO.lon);
const FACE = faceCamera(TARGET);
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

function Earth({ state, onAltitude }: { state: MutableRefObject<GlobeState>; onAltitude?: AltitudeFn }) {
    // Configure textures in the load callback, before their first upload.
    const [day, night, brc] = useTexture(['/earth/day.jpg', '/earth/night.jpg', '/earth/bump-rough-clouds.jpg'], (tex) => {
        const list = Array.isArray(tex) ? tex : [tex];
        list.forEach((t, i) => {
            t.anisotropy = 8;
            t.wrapS = THREE.RepeatWrapping;
            if (i < 2) t.colorSpace = THREE.SRGBColorSpace;
        });
    });

    const earthMat = useMemo(() => new THREE.ShaderMaterial({
        uniforms: { dayMap: { value: day }, nightMap: { value: night }, brcMap: { value: brc }, sunDir: { value: SUN }, cloudShift: { value: 0 }, cloudAmount: { value: 1 } },
        vertexShader: EARTH_VERT,
        fragmentShader: EARTH_FRAG,
    }), [day, night, brc]);
    const atmoMat = useMemo(() => new THREE.ShaderMaterial({
        uniforms: { sunDir: { value: SUN } },
        vertexShader: ATMO_VERT,
        fragmentShader: ATMO_FRAG,
        side: THREE.BackSide,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    }), []);

    const earth = useRef<THREE.Group>(null);
    const earthMesh = useRef<THREE.Mesh>(null);
    const [label, setLabel] = useState(false);


    useFrame(({ camera, clock, size }, dt) => {
        const t = state.current.t;
        const g = earth.current;
        if (!g) return;
        // Rotation: idle spin early, then turn India to face the camera.
        const turn = ease(clamp01((t - 0.08) / 0.5));
        const idle = clock.elapsedTime * 0.04 * (1 - turn);
        const dive = ease(clamp01((t - 0.55) / 0.33));
        const small = size.width < 700;
        // Final framing: Delhi left of centre on desktop, in the top third on phones (card below).
        const y = THREE.MathUtils.lerp(FACE.y - 2.4 + idle, FACE.y - (small ? 0 : 0.1) * dive, turn);
        const x = THREE.MathUtils.lerp(0.32, FACE.x - (small ? 0.075 : 0.05) * dive, turn);
        g.rotation.x = THREE.MathUtils.damp(g.rotation.x, x, 5, dt);
        g.rotation.y = THREE.MathUtils.damp(g.rotation.y, y, 5, dt);

        // Camera: far → Earth fills the view → dive towards Delhi.
        const mobile = size.width < 700;
        const zoomA = ease(clamp01(t / 0.55));
        const zoomB = ease(clamp01((t - 0.55) / 0.33));
        const far = mobile ? 5.2 : 4.2;
        const mid = mobile ? 2.9 : 2.25;
        const near = mobile ? 1.48 : 1.38;
        const d = THREE.MathUtils.lerp(THREE.MathUtils.lerp(far, mid, zoomA), near, zoomB);
        const lift = zoomB * 0.08;
        camera.position.set(0, lift, d);
        camera.lookAt(0, lift * 0.5, zoomB * 0.55);
        onAltitude?.(Math.max(0, (camera.position.length() - 1) * 6371));

        const mat = earthMesh.current?.material as THREE.ShaderMaterial | undefined;
        if (mat) {
            mat.uniforms.cloudShift.value = clock.elapsedTime * 0.0015;
            mat.uniforms.cloudAmount.value = 1 - zoomB * 0.8;
        }

        const showLabel = t > 0.8;
        if (showLabel !== label) setLabel(showLabel);
    });

    return (
        <group ref={earth}>
            <mesh ref={earthMesh} material={earthMat}>
                <sphereGeometry args={[1, 160, 80]} />
            </mesh>
            <mesh material={atmoMat} scale={1.06}>
                <sphereGeometry args={[1, 96, 48]} />
            </mesh>
            {/* Crisp HTML marker: drops onto the studio, then pulses. */}
            {label && (
                <Html position={TARGET.toArray()} center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
                    <div className="relative" style={{ animation: 'pinDrop 0.9s cubic-bezier(0.34,1.4,0.64,1) both' }}>
                        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full pulse-ring" style={{ background: 'rgba(224,122,85,0.45)' }} />
                        <span className="relative block w-3.5 h-3.5 rounded-full" style={{ background: '#E07A55', boxShadow: '0 0 0 3px #F1EEE7, 0 6px 18px rgba(0,0,0,0.45)' }} />
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 mono text-[11px] whitespace-nowrap px-2.5 py-1.5" style={{ background: '#F1EEE7', color: '#121212' }}>
                            AMS STUDIO · JAGAT PURI
                        </span>
                    </div>
                </Html>
            )}
        </group>
    );
}

function Stars() {
    const geo = useMemo(() => {
        const g = new THREE.BufferGeometry();
        const n = 1400;
        const pos = new Float32Array(n * 3);
        let seed = 7;
        const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
        for (let i = 0; i < n; i++) {
            const u = rnd() * 2 - 1, a = rnd() * Math.PI * 2, r = 40 + rnd() * 20;
            const s = Math.sqrt(1 - u * u);
            pos.set([Math.cos(a) * s * r, u * r, Math.sin(a) * s * r], i * 3);
        }
        g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        return g;
    }, []);
    return (
        <points geometry={geo}>
            <pointsMaterial size={1.3} sizeAttenuation={false} color="#F1EEE7" transparent opacity={0.55} depthWrite={false} />
        </points>
    );
}

export default function EarthScene({ state, onAltitude }: { state: MutableRefObject<GlobeState>; onAltitude?: AltitudeFn }) {
    const wrap = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = wrap.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '200px 0px' });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <div ref={wrap} className="absolute inset-0">
            <Canvas
                dpr={[1, 1.75]}
                frameloop={visible ? 'always' : 'never'}
                camera={{ fov: 35, near: 0.001, far: 200, position: [0, 0, 4.2] }}
                gl={{ antialias: true }}
                onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.05; }}
            >
                <color attach="background" args={['#0b0b0c']} />
                <Stars />
                <Suspense fallback={null}>
                    <Earth state={state} onAltitude={onAltitude} />
                </Suspense>
            </Canvas>
        </div>
    );
}
