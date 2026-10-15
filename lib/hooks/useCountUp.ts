'use client';
import { useEffect, useRef, useState } from 'react';

/** Animates from 0 to `target` once the returned ref scrolls into view. */
export function useCountUp<T extends HTMLElement>(target: number, { duration = 1800, decimals = 0, delay = 0, enabled = true } = {}) {
    const ref = useRef<T>(null);
    const [value, setValue] = useState(0);

    useEffect(() => {
        const el = ref.current;
        if (!el || !enabled) return;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let raf = 0;
        let timeout: ReturnType<typeof setTimeout>;
        const obs = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            obs.disconnect();
            timeout = setTimeout(() => {
                if (reduced) { setValue(target); return; }
                const start = performance.now();
                const step = (now: number) => {
                    const t = Math.min(1, (now - start) / duration);
                    const eased = 1 - Math.pow(1 - t, 4);
                    setValue(target * eased);
                    if (t < 1) raf = requestAnimationFrame(step);
                };
                raf = requestAnimationFrame(step);
            }, delay);
        }, { threshold: 0.4 });
        obs.observe(el);

        return () => {
            obs.disconnect();
            clearTimeout(timeout);
            cancelAnimationFrame(raf);
        };
    }, [target, duration, delay, enabled]);

    const factor = Math.pow(10, decimals);
    return { ref, display: (Math.round(value * factor) / factor).toFixed(decimals) };
}
