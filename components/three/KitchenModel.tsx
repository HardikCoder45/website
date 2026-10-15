'use client';
import { useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { KITCHEN_FINISHES, type FinishSelection } from '@/lib/three/finishes';
import { prepareFinishes } from '@/lib/three/applyFinishes';

export const KITCHEN_URL = '/models/kitchen.glb';

// Emissive materials that read as "lights on" in the evening mood.
const GLOW = /LED|Glow|CofferLight|BulbGlow|Cove|Emission|Recessed_Light_Glow|CandleFlame/i;

export type Mood = 'day' | 'evening';

// The Blender export dropped the base colour of several materials (they load
// as plain white). Restore the intended look from each material's name.
const AUTHORED: Record<string, { color: string; roughness?: number; metalness?: number }> = {
    Cabinet_Dark_Wood_Wenge: { color: '#3a281c', roughness: 0.38 },
    Dark_Wood_Panel: { color: '#2e2018', roughness: 0.4 },
    Marble_Countertop_Dark: { color: '#1d1c1e', roughness: 0.12 },
    Mat_DarkMarble_Countertop: { color: '#18171a' },
    Black_Smoked_Glass: { color: '#1b1b1d', roughness: 0.05, metalness: 0.3 },
    BrushedSteel: { color: '#c8cacd' },
    Fridge_Stainless_Steel: { color: '#c6c8cb' },
    ToeKick_Dark: { color: '#1a1512' },
    Board_Wood: { color: '#9a6f45' },
    Textured_Dark_Wall: { color: '#2b2622' },
    GoldTextured: { color: '#c9a25e' },
    Tray_Cream: { color: '#e9dfcc' },
    Ceiling_Plaster: { color: '#efe9df' },
    Rug_Fabric: { color: '#b9a88c' },
    Rug_GoldBorder: { color: '#b8892a' },
    Emerald_Backsplash_Tile: { color: '#1f5a46' },
};

function restoreAuthoredColours(scene: THREE.Object3D) {
    if (scene.userData.amsColoursFixed) return;
    scene.userData.amsColoursFixed = true;
    const done = new Set<THREE.Material>();
    scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (!mesh.isMesh) return;
        (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach((m) => {
            const fix = AUTHORED[m.name];
            if (!fix || done.has(m)) return;
            done.add(m);
            const sm = m as THREE.MeshStandardMaterial;
            sm.color.set(fix.color);
            if (fix.roughness !== undefined) sm.roughness = fix.roughness;
            if (fix.metalness !== undefined) sm.metalness = fix.metalness;
        });
    });
}

interface KitchenModelProps {
    selection: FinishSelection;
    mood?: Mood;
}

export default function KitchenModel({ selection, mood = 'day' }: KitchenModelProps) {
    const { scene } = useGLTF(KITCHEN_URL);

    // Clone per instance so the hero and a tour never share mutated materials.
    const { root, apply, glow } = useMemo(() => {
        restoreAuthoredColours(scene);
        const root = scene.clone(true);
        const apply = prepareFinishes(root, KITCHEN_FINISHES);
        const glow: { m: THREE.MeshStandardMaterial; base: number }[] = [];
        const owned = new Map<THREE.Material, THREE.MeshStandardMaterial>();
        const own = (m: THREE.Material) => {
            const sm = m as THREE.MeshStandardMaterial;
            if (!GLOW.test(sm.name) || !('emissiveIntensity' in sm)) return m;
            let c = owned.get(sm);
            if (!c) {
                c = sm.clone();
                owned.set(sm, c);
                glow.push({ m: c, base: c.emissiveIntensity || 1 });
            }
            return c;
        };
        root.traverse((o) => {
            const mesh = o as THREE.Mesh;
            if (!mesh.isMesh) return;
            mesh.material = Array.isArray(mesh.material) ? mesh.material.map(own) : own(mesh.material);
        });
        return { root, apply, glow };
    }, [scene]);

    useEffect(() => { apply(selection); }, [apply, selection]);

    useEffect(() => {
        glow.forEach(({ m, base }) => { m.emissiveIntensity = mood === 'evening' ? base * 2.2 : base * 0.6; });
    }, [glow, mood]);

    return <primitive object={root} />;
}

useGLTF.preload(KITCHEN_URL);
