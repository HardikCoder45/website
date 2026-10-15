'use client';
import { useRef, type RefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, PerspectiveCamera, PresentationControls, View } from '@react-three/drei';
import * as THREE from 'three';
import Prop from '@/components/three/Prop';
import type { ShowroomItem } from './Showroom';

function Turntable({ children }: { children: React.ReactNode }) {
    const ref = useRef<THREE.Group>(null);
    useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * 0.25; });
    return <group ref={ref}>{children}</group>;
}

function Piece({ item }: { item: ShowroomItem }) {
    const wide = item.model === 'velvetSofa' || item.model === 'leatherSofa';
    const dist = wide ? 3.1 : item.model === 'lamp' ? 1.5 : 2.3;
    return (
        <>
            <PerspectiveCamera makeDefault fov={30} position={[0, item.height * 0.9, dist]} onUpdate={(c) => c.lookAt(0, item.height * 0.45, 0)} />
            <Environment files="/hdri/studio.exr" environmentIntensity={0.9} />
            <directionalLight position={[3, 4, 3]} intensity={1.6} />
            <PresentationControls
                global={false}
                cursor
                snap
                speed={1.4}
                zoom={1}
                polar={[-0.1, 0.25]}
                azimuth={[-Infinity, Infinity]}
            >
                <Turntable>
                    <Prop name={item.model} height={item.height} rotation={[0, -0.5, 0]} />
                </Turntable>
            </PresentationControls>
            <ContactShadows position={[0, 0.001, 0]} scale={wide ? 4 : 2.4} blur={2.4} opacity={0.45} far={1.5} resolution={512} />
        </>
    );
}

interface ShowroomCanvasProps {
    items: ShowroomItem[];
    tracks: RefObject<HTMLDivElement | null>[];
    eventSource: RefObject<HTMLElement | null>;
}

export default function ShowroomCanvas({ items, tracks, eventSource }: ShowroomCanvasProps) {
    return (
        <Canvas
            className="!absolute inset-0 !pointer-events-none"
            eventSource={eventSource as RefObject<HTMLElement>}
            dpr={[1, 1.75]}
            gl={{ antialias: true, alpha: true }}
            onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; }}
        >
            {items.map((item, i) => (
                <View key={item.id} track={tracks[i] as RefObject<HTMLElement>}>
                    <Piece item={item} />
                </View>
            ))}
        </Canvas>
    );
}
