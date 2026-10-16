'use client';
import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { WARDROBE_FINISHES } from '@/lib/data/tours';
import { useFinishMaterials } from '@/lib/three/useFinishMaterials';
import { usePbr } from '@/lib/three/usePbr';
import Prop from '@/components/three/Prop';
import type { SceneProps } from './types';

// Wardrobe spans x -1.4..1.4, back at z -0.3, front at z 0.3.
const W = 2.8, H = 2.75, D = 0.6, T = 0.018;
const DOOR_H = 2.1, LOFT_H = H - DOOR_H - 0.05;
const BAY = W / 4;

const BASE = {
    'wardrobe-shutter': { color: '#6d5440', roughness: 0.55, metalness: 0, clearcoat: 0.2 },
    'wardrobe-glass': { color: '#b08860', roughness: 0.06, metalness: 1 },
    'wardrobe-handle': { color: '#c9a86a', roughness: 0.3, metalness: 1 },
};

// A muted, real-wardrobe palette: navy, camel, ivory, charcoal, olive, stone.
const CLOTHES = ['#2c3242', '#b9a487', '#e7e1d6', '#2a2927', '#5d6150', '#cfc4b2', '#8c7a66', '#f1ede6', '#3d4452', '#a89a86'];

function Door({ x, hinge, mat, handle, open }: { x: number; hinge: 'left' | 'right'; mat: THREE.Material; handle: THREE.Material; open: boolean }) {
    const ref = useRef<THREE.Group>(null);
    const target = open ? (hinge === 'left' ? -1.9 : 1.9) : 0;
    useFrame((_, dt) => {
        if (ref.current) ref.current.rotation.y = THREE.MathUtils.damp(ref.current.rotation.y, target, 3.5, dt);
    });
    const pivotX = hinge === 'left' ? x - BAY / 2 : x + BAY / 2;
    const dir = hinge === 'left' ? 1 : -1;
    return (
        <group ref={ref} position={[pivotX, 0.05, D / 2]}>
            <mesh material={mat} position={[dir * (BAY / 2 - 0.002), DOOR_H / 2, T / 2]}>
                <boxGeometry args={[BAY - 0.006, DOOR_H, T]} />
            </mesh>
            {/* Vertical profile handle near the free edge */}
            <mesh material={handle} position={[dir * (BAY - 0.05), DOOR_H * 0.5, T + 0.012]}>
                <boxGeometry args={[0.012, 0.9, 0.018]} />
            </mesh>
        </group>
    );
}

export default function WardrobeScene({ selection, mood, toggles }: SceneProps) {
    const oak = usePbr('oak', [1, 2.4], Math.PI / 2);
    const floorOak = usePbr('oak', [3.5, 7]);
    const plaster = usePbr('plaster', [3, 1.5]);
    const linen = usePbr('linen', [3, 2]);
    const mats = useFinishMaterials(BASE, WARDROBE_FINISHES, selection, (m) => {
        m['wardrobe-shutter'].map = oak.map;
        m['wardrobe-shutter'].roughnessMap = oak.roughnessMap;
        m['wardrobe-shutter'].normalMap = oak.normalMap;
        m['wardrobe-shutter'].normalScale.set(0.3, 0.3);
    });
    const open = !!toggles.open;
    const evening = mood === 'evening';

    const env = useMemo(() => {
        return {
            floor: new THREE.MeshStandardMaterial({ ...floorOak, color: '#c9a77f', roughness: 0.6 }),
            wall: new THREE.MeshStandardMaterial({ ...plaster, color: '#e6ddcf', roughness: 0.95 }),
            carcass: new THREE.MeshStandardMaterial({ ...linen, color: '#f1ebe1', roughness: 0.75 }),
            rail: new THREE.MeshStandardMaterial({ color: '#d8dade', roughness: 0.15, metalness: 1 }),
            led: new THREE.MeshStandardMaterial({ color: '#fff3dc', emissive: '#ffd9a0', emissiveIntensity: 2 }),
            rug: new THREE.MeshStandardMaterial({ ...linen, color: '#d8ccb6', roughness: 1 }),
            wood: new THREE.MeshStandardMaterial({ color: '#7a5a40', roughness: 0.5 }),
            drawer: new THREE.MeshStandardMaterial({ color: '#d9cdb8', roughness: 0.5 }),
            skirting: new THREE.MeshStandardMaterial({ color: '#f1ebe0', roughness: 0.6 }),
        };
    }, [floorOak, plaster, linen]);

    const clothes = useMemo(() => CLOTHES.map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.95 })), []);

    // LED intensity rises when doors open or in the evening.
    const led = useRef<THREE.MeshStandardMaterial | null>(null);
    useEffect(() => { led.current = env.led; }, [env]);
    useFrame((_, dt) => {
        if (!led.current) return;
        const t = (open ? 3.5 : 0.6) * (evening ? 1.6 : 1);
        led.current.emissiveIntensity = THREE.MathUtils.damp(led.current.emissiveIntensity, t, 3, dt);
    });

    const hanging = (x0: number, x1: number, y: number, seed: number) =>
        Array.from({ length: 9 }, (_, i) => {
            const x = x0 + ((i + 0.5) / 9) * (x1 - x0);
            const len = 0.7 + ((i * 37 + seed) % 5) * 0.12;
            return (
                <mesh key={i} material={clothes[(i + seed) % clothes.length]} position={[x, y - len / 2 - 0.05, 0]} rotation={[0, 0.25 * Math.sin(i + seed), 0]}>
                    <boxGeometry args={[0.035, len, 0.44]} />
                </mesh>
            );
        });

    return (
        <group>
            {/* Room */}
            <mesh material={env.floor} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[9, 9]} />
            </mesh>
            <mesh material={env.wall} position={[0, 1.5, -0.32]}>
                <planeGeometry args={[9, 3]} />
            </mesh>
            <mesh material={env.wall} position={[-3.2, 1.5, 2]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[6, 3]} />
            </mesh>
            <mesh material={env.skirting} position={[0, 0.05, -0.3]}>
                <boxGeometry args={[9, 0.1, 0.02]} />
            </mesh>

            {/* Carcass */}
            <group position={[0, 0, 0]}>
                <mesh material={env.carcass} position={[0, H / 2, -D / 2 + 0.005]}><boxGeometry args={[W, H, 0.01]} /></mesh>
                {[-W / 2, -W / 4, 0, W / 4, W / 2].map((x, i) => (
                    <mesh key={i} material={i === 0 || i === 4 ? mats['wardrobe-shutter'] : env.carcass} position={[x, H / 2, 0]}>
                        <boxGeometry args={[T, H, D]} />
                    </mesh>
                ))}
                <mesh material={mats['wardrobe-shutter']} position={[0, H, 0]}><boxGeometry args={[W + T, T, D]} /></mesh>
                <mesh material={env.carcass} position={[0, DOOR_H + 0.05, 0]}><boxGeometry args={[W, T, D]} /></mesh>
                <mesh material={env.carcass} position={[0, 0.05, 0]}><boxGeometry args={[W, T, D]} /></mesh>

                {/* LED strips under each bay top */}
                {[0, 1, 2, 3].map((i) => (
                    <mesh key={i} material={env.led} position={[-W / 2 + BAY * (i + 0.5), DOOR_H + 0.03, D / 2 - 0.06]}>
                        <boxGeometry args={[BAY - 0.06, 0.008, 0.012]} />
                    </mesh>
                ))}

                {/* Bay 1: long hanging */}
                <mesh material={env.rail} position={[-W / 2 + BAY / 2, 1.95, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.012, 0.012, BAY - 0.04]} /></mesh>
                <group position={[-W / 2 + BAY / 2, 0, 0]}>{hanging(-BAY / 2 + 0.06, BAY / 2 - 0.06, 1.95, 1)}</group>

                {/* Bay 2: shelves with folded stacks */}
                {[0.45, 0.85, 1.25, 1.65].map((y, i) => (
                    <group key={y}>
                        <mesh material={env.carcass} position={[-BAY / 2, y, 0]}><boxGeometry args={[BAY - T, T, D - 0.02]} /></mesh>
                        {[-0.18, 0.05].map((dx, k) => (
                            <mesh key={k} material={clothes[(i * 2 + k + 3) % clothes.length]} position={[-BAY / 2 + dx, y + 0.08, 0.02]}>
                                <boxGeometry args={[0.2, 0.14, 0.32]} />
                            </mesh>
                        ))}
                    </group>
                ))}

                {/* Bay 3: shelves + short hanging */}
                <mesh material={env.carcass} position={[BAY / 2, 1.1, 0]}><boxGeometry args={[BAY - T, T, D - 0.02]} /></mesh>
                <mesh material={env.rail} position={[BAY / 2, 1.95, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.012, 0.012, BAY - 0.04]} /></mesh>
                <group position={[BAY / 2, 0, 0]}>{hanging(-BAY / 2 + 0.06, BAY / 2 - 0.06, 1.95, 4).slice(0, 7)}</group>
                {[0.35, 0.72].map((y) => (
                    <mesh key={y} material={env.carcass} position={[BAY / 2, y, 0]}><boxGeometry args={[BAY - T, T, D - 0.02]} /></mesh>
                ))}

                {/* Bay 4: drawer bank + hanging */}
                {[0.18, 0.46, 0.74].map((y) => (
                    <group key={y}>
                        <mesh material={env.drawer} position={[W / 2 - BAY / 2, y, D / 2 - 0.05]}><boxGeometry args={[BAY - 0.04, 0.26, 0.02]} /></mesh>
                        <mesh material={mats['wardrobe-handle']} position={[W / 2 - BAY / 2, y + 0.1, D / 2 - 0.035]}><boxGeometry args={[0.3, 0.012, 0.012]} /></mesh>
                    </group>
                ))}
                <mesh material={env.carcass} position={[W / 2 - BAY / 2, 0.9, 0]}><boxGeometry args={[BAY - T, T, D - 0.02]} /></mesh>
                <mesh material={env.rail} position={[W / 2 - BAY / 2, 1.95, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.012, 0.012, BAY - 0.04]} /></mesh>
                <group position={[W / 2 - BAY / 2, 0, 0]}>{hanging(-BAY / 2 + 0.06, BAY / 2 - 0.06, 1.95, 7).slice(0, 6)}</group>

                {/* Doors */}
                <Door x={-W / 2 + BAY / 2} hinge="left" mat={mats['wardrobe-shutter']} handle={mats['wardrobe-handle']} open={open} />
                <Door x={-W / 2 + BAY * 1.5} hinge="right" mat={mats['wardrobe-shutter']} handle={mats['wardrobe-handle']} open={open} />
                <Door x={-W / 2 + BAY * 2.5} hinge="left" mat={mats['wardrobe-glass']} handle={mats['wardrobe-handle']} open={open} />
                <Door x={-W / 2 + BAY * 3.5} hinge="right" mat={mats['wardrobe-shutter']} handle={mats['wardrobe-handle']} open={open} />

                {/* Loft shutters */}
                {[0, 1, 2, 3].map((i) => (
                    <mesh key={i} material={mats['wardrobe-shutter']} position={[-W / 2 + BAY * (i + 0.5), DOOR_H + 0.08 + LOFT_H / 2, D / 2 + T / 2]}>
                        <boxGeometry args={[BAY - 0.006, LOFT_H - 0.02, T]} />
                    </mesh>
                ))}
                {[0, 1, 2, 3].map((i) => (
                    <mesh key={`h${i}`} material={mats['wardrobe-handle']} position={[-W / 2 + BAY * (i + 0.5), DOOR_H + 0.12, D / 2 + T + 0.008]}>
                        <boxGeometry args={[0.24, 0.012, 0.012]} />
                    </mesh>
                ))}
            </group>

            {/* Styled corner */}
            <mesh material={env.rug} position={[1.7, 0.005, 1.6]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[2.2, 1.6]} /></mesh>
            <Prop name="damaskChair" height={0.95} position={[2.3, 0, 1.5]} rotation={[0, -2.3, 0]} />
            <mesh material={env.wood} position={[2.6, 0.27, 0.6]}><cylinderGeometry args={[0.22, 0.22, 0.54, 32]} /></mesh>
            <Prop name="lamp" height={0.5} position={[2.6, 0.54, 0.6]} />

            <hemisphereLight args={[evening ? '#3a3040' : '#fff6ea', evening ? '#1a120a' : '#b89a78', evening ? 0.25 : 0.8]} />
            {!evening && <directionalLight position={[4, 5, 6]} intensity={1.4} color="#fff2df" />}
            {evening && <pointLight position={[2.6, 1.0, 0.7]} color="#ffb870" intensity={2.5} distance={4} decay={2} />}
            {open && <pointLight position={[0, 1.9, 0.25]} color="#ffe2b8" intensity={evening ? 3 : 1.5} distance={2.5} decay={2} />}
        </group>
    );
}
