'use client';
import KitchenModel from '@/components/three/KitchenModel';
import type { SceneProps } from './types';

export default function KitchenScene({ selection, mood }: SceneProps) {
    const evening = mood === 'evening';
    return (
        <group>
            <KitchenModel selection={selection} mood={mood} />
            {!evening && <directionalLight position={[9, 4, 1]} intensity={2} color="#fff2df" />}
            {evening && (
                <>
                    <pointLight position={[0.8, 2.4, 0.2]} color="#ffbf80" intensity={5} distance={6} decay={2} />
                    <pointLight position={[0, 2.2, -3.0]} color="#ffd29a" intensity={3} distance={4} decay={2} />
                    <pointLight position={[-3.2, 2.2, -1.5]} color="#ffd29a" intensity={2} distance={3.5} decay={2} />
                </>
            )}
        </group>
    );
}
