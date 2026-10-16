'use client';
import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { INTERIOR_FINISHES } from '@/lib/data/tours';
import { useFinishMaterials } from '@/lib/three/useFinishMaterials';
import { usePbr } from '@/lib/three/usePbr';
import Prop from '@/components/three/Prop';
import type { SceneProps } from './types';

// Room: x -4..4, z -3..3.5, ceiling at 3 m. Back wall (z = -3) and left wall
// (x = -4) are solid; the other two are left open like a dollhouse cutaway.
const ROOM = { x0: -4, x1: 4, z0: -3, z1: 3.5, h: 3 };
const SKY_DAY = new THREE.Color('#e3edf6');
// Profile for a slender ceramic vase (radius, height) spun on a lathe.
const VASE = [[0, 0], [0.07, 0], [0.09, 0.04], [0.11, 0.14], [0.1, 0.24], [0.06, 0.32], [0.045, 0.38], [0.055, 0.42], [0, 0.42]].map(([x, y]) => new THREE.Vector2(x, y));
const SKY_NIGHT = new THREE.Color('#1d2840');

const BASE = {
    'room-wall': { color: '#e7dccb', roughness: 0.9 },
    'room-panel': { color: '#5c4130', roughness: 0.55, clearcoat: 0.15 },
    'room-floor': { color: '#dcc4a6', roughness: 0.45, clearcoat: 0.3, clearcoatRoughness: 0.4 },
    'room-cove': { color: '#ffc27a', emissive: '#ffc27a', emissiveIntensity: 2.5 },
};

export default function InteriorScene({ selection, mood, toggles }: SceneProps) {
    const floorOak = usePbr('oak', [6, 10]);
    const plaster = usePbr('plaster', [4, 2]);
    const panelOak = usePbr('oak', [1, 3], Math.PI / 2);
    const calacatta = usePbr('calacatta', [1, 1]);
    const nero = usePbr('nero', [1.5, 0.4]);
    const linen = usePbr('linen', [3, 2]);
    const travertine = usePbr('travertine', [1, 1]);
    const mats = useFinishMaterials(BASE, INTERIOR_FINISHES, selection, (m) => {
        Object.assign(m['room-floor'], floorOak);
        Object.assign(m['room-wall'], plaster);
        Object.assign(m['room-panel'], { map: panelOak.map, roughnessMap: panelOak.roughnessMap });
    });
    const evening = mood === 'evening';

    const env = useMemo(() => {
        return {
            ceiling: new THREE.MeshStandardMaterial({ color: '#f4efe6', roughness: 0.95, emissive: '#3a342c', emissiveIntensity: 0.6 }),
            tv: new THREE.MeshStandardMaterial({ color: '#0b0b0c', roughness: 0.15, metalness: 0.4, emissive: '#1a2230', emissiveIntensity: 0.4 }),
            console: new THREE.MeshPhysicalMaterial({ ...nero, color: '#ffffff', roughness: 0.2, clearcoat: 0.6 }),
            marble: new THREE.MeshPhysicalMaterial({ ...calacatta, color: '#ffffff', roughness: 0.15, clearcoat: 0.6 }),
            brass: new THREE.MeshStandardMaterial({ color: '#c9a86a', roughness: 0.3, metalness: 1 }),
            rug: new THREE.MeshStandardMaterial({ ...linen, color: '#ddd2bf', roughness: 1 }),
            rugBorder: new THREE.MeshStandardMaterial({ color: '#8f6b3e', roughness: 1 }),
            sky: new THREE.MeshBasicMaterial({ color: '#dfe9f2', toneMapped: false }),
            frame: new THREE.MeshStandardMaterial({ color: '#2b2622', roughness: 0.4, metalness: 0.3 }),
            cushion: new THREE.MeshStandardMaterial({ color: '#c6b59a', roughness: 1 }),
            spot: new THREE.MeshStandardMaterial({ color: '#fff6e5', emissive: '#fff1d6', emissiveIntensity: 3 }),
            pot: new THREE.MeshStandardMaterial({ ...travertine, color: '#e3d8c6', roughness: 0.8 }),
            ceramic: new THREE.MeshPhysicalMaterial({ color: '#2b2824', roughness: 0.35, clearcoat: 0.4 }),
            art: new THREE.MeshStandardMaterial({ color: '#b58457', roughness: 0.8 }),
        };
    }, [nero, calacatta, linen, travertine]);

    // Animated materials are reached through a ref so per-frame mutation stays
    // outside React's render data.
    const live = useRef<{ cove: THREE.MeshPhysicalMaterial; sky: THREE.MeshBasicMaterial; tv: THREE.MeshStandardMaterial } | null>(null);
    useEffect(() => { live.current = { cove: mats['room-cove'], sky: env.sky, tv: env.tv }; }, [mats, env]);
    useFrame((_, dt) => {
        const l = live.current;
        if (!l) return;
        l.cove.emissiveIntensity = THREE.MathUtils.damp(l.cove.emissiveIntensity, evening ? 5 : 1.4, 3, dt);
        l.sky.color.lerp(evening ? SKY_NIGHT : SKY_DAY, 1 - Math.exp(-3 * dt));
        l.tv.emissiveIntensity = evening ? 0.8 : 0.3;
    });

    const slats = useMemo(() => Array.from({ length: 44 }, (_, i) => -1.62 + i * 0.075), []);
    const leather = !!toggles.leather;

    return (
        <group>
            {/* Shell */}
            <mesh material={mats['room-floor']} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, (ROOM.z0 + ROOM.z1) / 2]}>
                <planeGeometry args={[ROOM.x1 - ROOM.x0, ROOM.z1 - ROOM.z0]} />
            </mesh>
            <mesh material={mats['room-wall']} position={[0, ROOM.h / 2, ROOM.z0]}>
                <planeGeometry args={[ROOM.x1 - ROOM.x0, ROOM.h]} />
            </mesh>

            {/* Left wall with a window opening (built from four panels) */}
            <group position={[ROOM.x0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                <mesh material={mats['room-wall']} position={[1.75 + 0.25, ROOM.h / 2, 0]}><planeGeometry args={[3.0, ROOM.h]} /></mesh>
                <mesh material={mats['room-wall']} position={[-2.6, ROOM.h / 2, 0]}><planeGeometry args={[0.8, ROOM.h]} /></mesh>
                <mesh material={mats['room-wall']} position={[-0.6, 0.25, 0]}><planeGeometry args={[3.2, 0.5]} /></mesh>
                <mesh material={mats['room-wall']} position={[-0.6, 2.75, 0]}><planeGeometry args={[3.2, 0.5]} /></mesh>
                <mesh material={env.sky} position={[-0.6, 1.5, -0.3]}><planeGeometry args={[3.2, 2]} /></mesh>
                {[-2.2, -0.6, 1.0].map((x) => (
                    <mesh key={x} material={env.frame} position={[x, 1.5, 0]}><boxGeometry args={[0.05, 2, 0.06]} /></mesh>
                ))}
                {[0.5, 2.5].map((y) => (
                    <mesh key={y} material={env.frame} position={[-0.6, y, 0]}><boxGeometry args={[3.25, 0.05, 0.06]} /></mesh>
                ))}
            </group>

            {/* Window seat */}
            <mesh material={mats['room-panel']} position={[ROOM.x0 + 0.3, 0.22, 0.6]}><boxGeometry args={[0.6, 0.44, 3.2]} /></mesh>
            <mesh material={env.cushion} position={[ROOM.x0 + 0.3, 0.49, 0.6]}><boxGeometry args={[0.56, 0.1, 3.1]} /></mesh>

            {/* Feature wall: real fluted slats */}
            <group position={[0, 0, ROOM.z0 + 0.03]}>
                <mesh material={mats['room-panel']} position={[0, ROOM.h / 2, 0]}><boxGeometry args={[3.4, ROOM.h, 0.02]} /></mesh>
                {slats.map((x) => (
                    <mesh key={x} material={mats['room-panel']} position={[x, ROOM.h / 2, 0.025]}>
                        <boxGeometry args={[0.045, ROOM.h, 0.03]} />
                    </mesh>
                ))}
                {/* TV and floating console */}
                <mesh material={env.tv} position={[0, 1.45, 0.07]}><boxGeometry args={[1.65, 0.93, 0.04]} /></mesh>
                <mesh material={env.console} position={[0, 0.42, 0.25]}><boxGeometry args={[2.6, 0.34, 0.42]} /></mesh>
                <mesh material={mats['room-cove']} position={[0, 0.245, 0.3]}><boxGeometry args={[2.5, 0.01, 0.3]} /></mesh>
                {/* Décor on console */}
                <mesh material={env.ceramic} position={[-1.0, 0.59, 0.25]}><latheGeometry args={[VASE, 64]} /></mesh>
                <mesh material={env.pot} position={[-0.72, 0.59, 0.25]} scale={0.6}><latheGeometry args={[VASE, 64]} /></mesh>
                <mesh material={env.brass} position={[1.0, 0.64, 0.25]}><torusGeometry args={[0.09, 0.012, 12, 40]} /></mesh>
            </group>

            {/* Art on the back wall, beside the panel */}
            <mesh material={env.frame} position={[2.6, 1.6, ROOM.z0 + 0.02]}><boxGeometry args={[1.1, 1.4, 0.03]} /></mesh>
            <mesh material={env.art} position={[2.6, 1.6, ROOM.z0 + 0.04]}><planeGeometry args={[0.98, 1.28]} /></mesh>

            {/* False ceiling with recessed cove (visible from below) */}
            <group position={[0, ROOM.h, 0.25]}>
                <mesh material={env.ceiling} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.18, 0]}><planeGeometry args={[4.6, 3.6]} /></mesh>
                {/* Perimeter drop ceiling */}
                {[
                    [0, -2.75, 8, 2.1],
                    [0, 3.0, 8, 2.1],
                ].map(([x, z, w, d], i) => (
                    <mesh key={i} material={env.ceiling} rotation={[Math.PI / 2, 0, 0]} position={[x, -0.3, z / 1.48]}><planeGeometry args={[w, d]} /></mesh>
                ))}
                {[-3.15, 3.15].map((x) => (
                    <mesh key={x} material={env.ceiling} rotation={[Math.PI / 2, 0, 0]} position={[x, -0.3, 0]}><planeGeometry args={[1.7, 3.8]} /></mesh>
                ))}
                {/* Cove LED strips */}
                {[[-2.3, 0, 0.02, 3.6], [2.3, 0, 0.02, 3.6], [0, -1.8, 4.6, 0.02], [0, 1.8, 4.6, 0.02]].map(([x, z, w, d], i) => (
                    <mesh key={`c${i}`} material={mats['room-cove']} position={[x, -0.25, z]}><boxGeometry args={[w, 0.015, d]} /></mesh>
                ))}
                {/* Spotlights */}
                {[[-3.1, -2.4], [3.1, -2.4], [-3.1, 2.6], [3.1, 2.6], [-3.1, 0.1], [3.1, 0.1]].map(([x, z], i) => (
                    <mesh key={`s${i}`} material={env.spot} position={[x, -0.31, z]} rotation={[Math.PI / 2, 0, 0]}><circleGeometry args={[0.045, 24]} /></mesh>
                ))}
            </group>

            {/* Rug + coffee table */}
            <mesh material={env.rugBorder} position={[0, 0.004, 0.9]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[3.0, 2.2]} /></mesh>
            <mesh material={env.rug} position={[0, 0.006, 0.9]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[2.85, 2.05]} /></mesh>
            <mesh material={env.marble} position={[0, 0.38, 0.6]}><cylinderGeometry args={[0.5, 0.5, 0.04, 64]} /></mesh>
            <mesh material={env.brass} position={[0, 0.18, 0.6]}><cylinderGeometry args={[0.05, 0.12, 0.36, 24]} /></mesh>

            {/* Furniture models */}
            {leather
                ? <Prop name="leatherSofa" height={0.85} position={[0, 0, 2.15]} rotation={[0, Math.PI, 0]} />
                : <Prop name="velvetSofa" height={0.85} position={[0, 0, 2.15]} rotation={[0, Math.PI, 0]} />}
            <Prop name="sheenChair" height={0.85} position={[-1.85, 0, 0.5]} rotation={[0, Math.PI / 2 + 0.35, 0]} />
            <mesh material={env.console} position={[1.9, 0.28, 2.1]}><cylinderGeometry args={[0.24, 0.24, 0.56, 32]} /></mesh>
            <Prop name="lamp" height={0.5} position={[1.9, 0.56, 2.1]} />

            {/* Plant in the corner */}
            <mesh material={env.pot} position={[-3.4, 0, -2.4]} scale={2.6}><latheGeometry args={[VASE, 64]} /></mesh>

            {/* Lighting */}
            <hemisphereLight args={[evening ? '#3a3040' : '#fff6ea', evening ? '#1a120a' : '#b89a78', evening ? 0.25 : 0.9]} />
            {!evening && <directionalLight position={[-8, 5, 1]} intensity={2.2} color="#fff4e2" />}
            {evening && (
                <>
                    <pointLight position={[1.9, 1.1, 2.1]} color="#ffb870" intensity={3} distance={5} decay={2} />
                    <pointLight position={[0, 2.6, 0.3]} color="#ffcf94" intensity={4} distance={7} decay={2} />
                    <pointLight position={[0, 0.3, ROOM.z0 + 0.6]} color="#ffc27a" intensity={1.5} distance={3} decay={2} />
                </>
            )}
        </group>
    );
}
