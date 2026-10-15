'use client';
import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import type { ThreeElements } from '@react-three/fiber';

export const PROP_MODELS = {
    velvetSofa: '/models/velvet-sofa.glb',
    leatherSofa: '/models/leather-sofa.glb',
    sheenChair: '/models/sheen-chair.glb',
    damaskChair: '/models/damask-chair.glb',
    lamp: '/models/iridescence-lamp.glb',
} as const;

export type PropName = keyof typeof PROP_MODELS;

type PropProps = Omit<ThreeElements['group'], 'children'> & {
    name: PropName;
    /** Real-world height in metres; the model is scaled to match and sat on y = 0. */
    height: number;
};

export default function Prop({ name, height, ...rest }: PropProps) {
    const { scene } = useGLTF(PROP_MODELS[name]);
    const { object, scale, offset } = useMemo(() => {
        const object = scene.clone(true);
        const box = new THREE.Box3().setFromObject(object);
        const size = box.getSize(new THREE.Vector3());
        const scale = height / (size.y || 1);
        const center = box.getCenter(new THREE.Vector3());
        // Centre on x/z and rest the base on the floor.
        const offset: [number, number, number] = [-center.x * scale, -box.min.y * scale, -center.z * scale];
        return { object, scale, offset };
    }, [scene, height]);

    return (
        <group {...rest}>
            <primitive object={object} scale={scale} position={offset} />
        </group>
    );
}

export function preloadProps(names: PropName[]) {
    names.forEach((n) => useGLTF.preload(PROP_MODELS[n]));
}
