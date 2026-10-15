'use client';
import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// Small deterministic PRNG so particle layout is pure and stable across renders.
function mulberry32(seed: number) {
    return () => {
        seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// Custom Particle System
function ParticleBackground({ count }: { count: number }) {
    const mesh = useRef<THREE.InstancedMesh>(null);
    const light = useRef<THREE.PointLight>(null);

    const particles = useMemo(() => {
        const rand = mulberry32(count);
        const temp = [];
        for (let i = 0; i < count; i++) {
            const time = rand() * 100;
            const factor = 20 + rand() * 100;
            const speed = 0.01 + rand() / 200;
            const x = rand() * 100 - 50;
            const y = rand() * 100 - 50;
            const z = rand() * 100 - 50;
            temp.push({ time, factor, speed, x, y, z });
        }
        return temp;
    }, [count]);


    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame((state) => {
        particles.forEach((particle, i) => {
            const { factor, speed, x, y, z } = particle;
            const time = (particle.time += speed / 2);

            dummy.position.set(
                x + Math.cos((time / 10) * factor) + (Math.sin(time * 1) * factor) / 10,
                y + Math.sin((time / 10) * factor) + (Math.cos(time * 2) * factor) / 10,
                z + Math.cos((time / 10) * factor) + (Math.sin(time * 3) * factor) / 10
            );

            const scale = Math.max(0.01, z / 200 + 0.1);
            dummy.scale.set(scale, scale, scale);

            dummy.updateMatrix();
            mesh.current?.setMatrixAt(i, dummy.matrix);
        });

        if (mesh.current) {
            mesh.current.instanceMatrix.needsUpdate = true;
        }

        const mx = (state.pointer.x * state.viewport.width) / 10;
        const my = (state.pointer.y * state.viewport.height) / 10;

        if (mesh.current) {
            mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, mx / 10, 0.05);
            mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, -my / 10, 0.05);
        }
        if (light.current) {
            light.current.position.x = THREE.MathUtils.lerp(light.current.position.x, mx, 0.1);
            light.current.position.y = THREE.MathUtils.lerp(light.current.position.y, my, 0.1);
        }
    });

    return (
        <>
            <pointLight ref={light} distance={40} intensity={8} color="#B8892A" />
            <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
                <dodecahedronGeometry args={[0.2, 0]} />
                <meshPhysicalMaterial
                    color="#D4A84B"
                    roughness={0.2}
                    metalness={0.8}
                    emissive="#5c4415"
                    emissiveIntensity={0.5}
                />
            </instancedMesh>
        </>
    );
}

export default function HeroCanvas() {
    const sketchfabRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(true);
    // Rendered client-only (dynamic import with ssr: false), so window is available.
    const [count] = useState(() => (window.innerWidth < 768 ? 600 : 1600));

    // Stop rendering particles once the hero is scrolled away, and use fewer
    // of them on small screens.
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    useGSAP(() => {
        if (!sketchfabRef.current) return;

        // Intro fade in for the iframe - make it more cinematic
        gsap.fromTo(sketchfabRef.current,
            { opacity: 0, scale: 1.3, filter: 'blur(20px)' },
            {
                opacity: 0.95,
                scale: 1.25,
                filter: 'blur(0px)',
                duration: 2.5,
                ease: "expo.out"
            }
        );

        // Robust Scroll Parallax - Fixes visibility issues on scroll up
        gsap.fromTo(sketchfabRef.current,
            { y: 0, scale: 1.25, opacity: 0.95, filter: 'blur(0px)' },
            {
                y: 350,
                scale: 1.1,
                opacity: 0,
                filter: 'blur(10px)',
                ease: "none",
                scrollTrigger: {
                    trigger: "#hero-section",
                    start: "top top",
                    end: "bottom top",
                    scrub: 0.5, // Reduced lag for better scroll-up response
                    invalidateOnRefresh: true,
                }
            }
        );
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="absolute inset-0 z-0 w-full h-full overflow-hidden flex items-center justify-center pointer-events-none">

            {/* Cinematic Grain Overlay */}
            <div className="grain absolute inset-0 z-[17] opacity-[0.05] pointer-events-none mix-blend-overlay"></div>

            {/* Sketchfab Iframe Background */}
            <div ref={sketchfabRef} className="absolute inset-0 w-full h-full scale-125 origin-center will-change-transform">
                <iframe
                    title="Modern Apartment"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; fullscreen; xr-spatial-tracking"
                    src="https://sketchfab.com/models/1fbb649cd6624f2bb7b7d6e30c6533a5/embed?autostart=1&autospin=0.03&transparent=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_watermark_link=0&ui_watermark=0&ui_hint=0&ui_theme=dark&dnt=1"
                    className="w-full h-full opacity-90 pointer-events-auto"
                />
            </div>

            {/* Light Leak / Glow Overlay */}
            <div className="absolute inset-0 z-[2] pointer-events-none" style={{ background: 'radial-gradient(circle at 70% 30%, rgba(184,137,42,0.15) 0%, transparent 60%)' }}></div>

            {/* Particle Canvas Layer */}
            <Canvas
                className="absolute inset-0 z-[10] pointer-events-none"
                camera={{ position: [0, 0, 15], fov: 45 }}
                dpr={[1, 1.75]}
                frameloop={visible ? 'always' : 'never'}
                gl={{ powerPreference: "high-performance", alpha: true, antialias: true }}
            >
                <ambientLight intensity={1.5} />
                <ParticleBackground key={count} count={count} />
            </Canvas>

            {/* Vignette */}
            <div className="absolute inset-0 z-[15] pointer-events-none" style={{ background: 'radial-gradient(circle, transparent 40%, rgba(20,15,8,0.4) 100%)' }}></div>
        </div>
    );
}
