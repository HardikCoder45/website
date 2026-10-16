'use client';
import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { usePbr, preloadPbr, PBR_NAMES } from '@/lib/three/usePbr';
import type { Material } from '@/lib/data/work';

preloadPbr(PBR_NAMES);

function Specimen({ material }: { material: Material }) {
    const group = useRef<THREE.Group>(null);
    const slab = usePbr(material.texture, [0.9, 1.2]);
    const small = usePbr(material.texture, [0.6, 0.6]);
    const swap = useRef(0);
    const last = useRef(material.id);

    useFrame(({ clock, pointer }, dt) => {
        const g = group.current;
        if (!g) return;
        // A quick turn whenever the material changes, then a slow idle drift.
        if (last.current !== material.id) { last.current = material.id; swap.current = 1; }
        swap.current = Math.max(0, swap.current - dt * 1.4);
        const spin = (1 - Math.pow(1 - swap.current, 3)) * Math.PI * 0.5;
        g.rotation.y = THREE.MathUtils.damp(g.rotation.y, -0.45 + Math.sin(clock.elapsedTime * 0.25) * 0.12 + pointer.x * 0.25 + spin, 4, dt);
        g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -pointer.y * 0.06, 4, dt);
    });

    const props = {
        color: material.color,
        roughness: material.roughness,
        metalness: material.metalness,
        clearcoat: material.clearcoat,
        clearcoatRoughness: 0.25,
        // Metals are all reflection, so give them a brighter environment.
        envMapIntensity: material.metalness ? 2.6 : 1,
    };

    return (
        <group ref={group}>
            <RoundedBox args={[1.25, 1.75, 0.09]} radius={0.012} smoothness={4} position={[0, 0.875, 0]} castShadow>
                <meshPhysicalMaterial {...slab} {...props} />
            </RoundedBox>
            <mesh position={[0.95, 0.24, 0.35]} castShadow>
                <sphereGeometry args={[0.24, 96, 64]} />
                <meshPhysicalMaterial {...small} {...props} />
            </mesh>
            <mesh position={[-0.9, 0.3, 0.3]} castShadow>
                <cylinderGeometry args={[0.2, 0.2, 0.6, 96]} />
                <meshPhysicalMaterial {...small} {...props} />
            </mesh>
        </group>
    );
}

export default function AtelierCanvas({ material }: { material: Material }) {
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
                shadows
                dpr={[1, 1.75]}
                frameloop={visible ? 'always' : 'never'}
                camera={{ fov: 26, position: [0, 1.25, 7.3] }}
                gl={{ alpha: true, antialias: true }}
                onCreated={({ camera, gl }) => { camera.lookAt(0, 0.72, 0); gl.toneMapping = THREE.AgXToneMapping; gl.toneMappingExposure = 1.1; }}
            >
                <Suspense fallback={null}>
                    {/* Studio HDRI for clean reflections (a Lightformer cube-map render
                        fails on some GPUs, leaving metals black). Key + rim lights shape it. */}
                    <Environment files="/hdri/studio.exr" environmentIntensity={1.1} />
                    <directionalLight position={[3, 2.5, 4]} intensity={0.8} color="#fff4e6" />
                    <directionalLight position={[-3, 5, 3]} intensity={1.6} castShadow shadow-mapSize={[1024, 1024]} shadow-radius={6} />
                    <Specimen material={material} />
                    <ContactShadows position={[0, 0.001, 0]} scale={6} blur={2.8} opacity={0.45} far={2} resolution={512} color="#3a3128" />
                </Suspense>
                {/* Shadow-only floor: the specimen sits directly on the section colour. */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                    <planeGeometry args={[30, 30]} />
                    <shadowMaterial opacity={0.18} color="#3a3128" />
                </mesh>
            </Canvas>
        </div>
    );
}
