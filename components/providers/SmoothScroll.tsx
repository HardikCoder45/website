'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppStore } from '@/lib/store/useAppStore';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;

/** Scroll to an element or y-offset through Lenis when it's running. */
export function scrollToTarget(target: string | number | HTMLElement) {
    if (lenisInstance) {
        lenisInstance.scrollTo(target, { offset: -80, duration: 1.4 });
        return;
    }
    if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'smooth' });
    else if (typeof target === 'string') document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
    else target.scrollIntoView({ behavior: 'smooth' });
}

export default function SmoothScroll() {
    const leadOpen = useAppStore((s) => s.isLeadModalOpen);

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const lenis = new Lenis({
            duration: 1.15,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            anchors: { offset: -80 },
        });
        lenisInstance = lenis;

        lenis.on('scroll', ScrollTrigger.update);
        const tick = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(tick);
            lenis.destroy();
            lenisInstance = null;
        };
    }, []);

    // Freeze page scroll while any modal is open.
    useEffect(() => {
        if (!lenisInstance) return;
        if (leadOpen) lenisInstance.stop();
        else lenisInstance.start();
    }, [leadOpen]);

    return null;
}
