'use client';
import { Suspense, useEffect, useRef, useState, type MutableRefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import KitchenModel from '@/components/three/KitchenModel';
import type { FinishSelection } from '@/lib/three/finishes';

export interface HeroSceneState {
    /** 0 → framed window, 1 → full-bleed, driven by scroll. */
    progress: number;
    /** Vertical centre of the visible window, in px from the canvas centre. */
    focusOffset: number;
}

// Camera keyframes: wide establishing shot → close on the island.
const FROM = { pos: new THREE.Vector3(3.6, 2.2, 2.6), look: new THREE.Vector3(-0.4, 1.0, -1.4) };
const TO = { pos: new THREE.Vector3(2.0, 1.45, 1.9), look: new THREE.Vector3(0.2, 0.95, -0.6) };

// Scratch vectors reused every frame (the hero renders a single rig).
const pos = new THREE.Vector3();
const look = new THREE.Vector3();

function Rig({ state }: { state: MutableRefObject<HeroSceneState> }) {
    const offset = useRef(0);

    useFrame(({ clock, camera, size, pointer }, dt) => {
        const p = THREE.MathUtils.smootherstep(state.current.progress, 0, 1);
        const t = clock.elapsedTime;
        pos.lerpVectors(FROM.pos, TO.pos, p);
        look.lerpVectors(FROM.look, TO.look, p);
        // Slow idle drift + gentle pointer parallax.
        pos.x += Math.sin(t * 0.15) * 0.12 + pointer.x * 0.18;
        pos.y += Math.cos(t * 0.11) * 0.05 + pointer.y * 0.08;
        camera.position.x = THREE.MathUtils.damp(camera.position.x, pos.x, 4, dt);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, pos.y, 4, dt);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, pos.z, 4, dt);
        camera.lookAt(look);

        // Shift the projection so the kitchen is centred in the visible window,
        // not in the (partly hidden) full canvas.
        offset.current = THREE.MathUtils.damp(offset.current, state.current.focusOffset * (1 - p), 6, dt);
        const cam = camera as THREE.PerspectiveCamera;
        cam.setViewOffset(size.width, size.height, 0, -offset.current, size.width, size.height);
    });
    return null;
}

interface HeroSceneProps {
    state: MutableRefObject<HeroSceneState>;
    selection: FinishSelection;
    onReady?: () => void;
}

function Ready({ onReady }: { onReady?: () => void }) {
    useEffect(() => { onReady?.(); }, [onReady]);
    return null;
}

export default function HeroScene({ state, selection, onReady }: HeroSceneProps) {
    const wrap = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(true);

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
                dpr={[1, 1.5]}
                frameloop={visible ? 'always' : 'never'}
                camera={{ fov: 42, near: 0.05, far: 40, position: FROM.pos.toArray() }}
                gl={{ antialias: true, powerPreference: 'high-performance' }}
                onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.05; }}
            >
                <color attach="background" args={['#1a140e']} />
                <Suspense fallback={null}>
                    <Environment files="/hdri/apartment.exr" environmentIntensity={1.1} />
                    <KitchenModel selection={selection} mood="day" />
                    <directionalLight position={[9, 4, 1]} intensity={2} color="#fff2df" />
                    <pointLight position={[0.8, 2.4, 0.2]} color="#ffcf9a" intensity={2.5} distance={6} decay={2} />
                    <Ready onReady={onReady} />
                </Suspense>
                <Rig state={state} />
            </Canvas>
        </div>
    );
}
