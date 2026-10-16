'use client';
import { useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export type PbrName = 'travertine' | 'calacatta' | 'nero' | 'oak' | 'plaster' | 'terrazzo' | 'linen' | 'brushed';

export const PBR_NAMES: PbrName[] = ['travertine', 'calacatta', 'nero', 'oak', 'plaster', 'terrazzo', 'linen', 'brushed'];

const paths = (n: PbrName) => [`/textures/${n}_albedo.webp`, `/textures/${n}_rough.webp`, `/textures/${n}_normal.webp`];

export interface PbrSet {
    map: THREE.Texture;
    roughnessMap: THREE.Texture;
    normalMap: THREE.Texture;
}

/**
 * Loads a tileable texture set from /public/textures and returns clones
 * configured for the given repeat, so several meshes can tile differently.
 */
export function usePbr(name: PbrName, repeat: [number, number] = [1, 1], rotation = 0): PbrSet {
    const [map, rough, normal] = useTexture(paths(name));
    const [rx, ry] = repeat;
    return useMemo(() => {
        const setup = (t: THREE.Texture, srgb: boolean) => {
            const c = t.clone();
            c.wrapS = c.wrapT = THREE.RepeatWrapping;
            c.repeat.set(rx, ry);
            c.rotation = rotation;
            c.center.set(0.5, 0.5);
            c.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
            c.anisotropy = 8;
            c.needsUpdate = true;
            return c;
        };
        return { map: setup(map, true), roughnessMap: setup(rough, false), normalMap: setup(normal, false) };
    }, [map, rough, normal, rx, ry, rotation]);
}

export function preloadPbr(names: PbrName[]) {
    names.forEach((n) => useTexture.preload(paths(n)));
}
