'use client';
import { useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface MagneticProps {
    children: ReactNode;
    strength?: number;
    className?: string;
}

/** Pulls its child toward the pointer while hovered, then springs back. */
export default function Magnetic({ children, strength = 0.35, className = '' }: MagneticProps) {
    const ref = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const el = ref.current;
        if (!el || !window.matchMedia('(pointer: fine)').matches) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const inner = el.firstElementChild as HTMLElement | null;
        if (!inner) return;
        const xTo = gsap.quickTo(inner, 'x', { duration: 0.6, ease: 'power3' });
        const yTo = gsap.quickTo(inner, 'y', { duration: 0.6, ease: 'power3' });

        const onMove = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            xTo((e.clientX - r.left - r.width / 2) * strength);
            yTo((e.clientY - r.top - r.height / 2) * strength);
        };
        const onLeave = () => {
            gsap.to(inner, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.35)' });
        };
        el.addEventListener('pointermove', onMove);
        el.addEventListener('pointerleave', onLeave);
        return () => {
            el.removeEventListener('pointermove', onMove);
            el.removeEventListener('pointerleave', onLeave);
        };
    }, { scope: ref });

    return <div ref={ref} className={`inline-block ${className}`}>{children}</div>;
}
