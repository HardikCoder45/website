'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const INTERACTIVE = 'a, button, [role="button"], label, select, [data-cursor]';

export default function CustomCursor() {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const fine = window.matchMedia('(pointer: fine)').matches;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const dot = dotRef.current;
        const ring = ringRef.current;
        const label = labelRef.current;
        if (!fine || reduced || !dot || !ring || !label) return;

        document.documentElement.classList.add('has-custom-cursor');
        gsap.set([dot, ring], { xPercent: -50, yPercent: -50, autoAlpha: 0 });

        const dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3' });
        const dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3' });
        const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' });
        const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });

        let hovering: Element | null = null;

        const onMove = (e: PointerEvent) => {
            gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3, overwrite: 'auto' });
            dotX(e.clientX); dotY(e.clientY);
            ringX(e.clientX); ringY(e.clientY);
        };

        // Event delegation, so elements rendered after mount (modals, filtered
        // gallery items) get the hover state too.
        const onOver = (e: PointerEvent) => {
            const target = (e.target as Element | null)?.closest(INTERACTIVE) ?? null;
            if (target === hovering) return;
            hovering = target;
            const text = target?.getAttribute('data-cursor') ?? '';
            label.textContent = text;
            if (target) {
                gsap.to(ring, { scale: text ? 2.2 : 1.6, backgroundColor: text ? 'rgba(184,137,42,0.92)' : 'rgba(184,137,42,0.12)', borderColor: 'rgba(184,137,42,0.6)', duration: 0.35 });
                gsap.to(dot, { scale: 0, duration: 0.25 });
                gsap.to(label, { autoAlpha: text ? 1 : 0, duration: 0.2 });
            } else {
                gsap.to(ring, { scale: 1, backgroundColor: 'rgba(184,137,42,0)', borderColor: 'rgba(184,137,42,0.45)', duration: 0.35 });
                gsap.to(dot, { scale: 1, duration: 0.25 });
                gsap.to(label, { autoAlpha: 0, duration: 0.2 });
            }
        };

        const onDown = () => gsap.to(ring, { scale: '-=0.25', duration: 0.15 });
        const onUp = () => gsap.to(ring, { scale: '+=0.25', duration: 0.2 });
        const onLeave = () => gsap.to([dot, ring], { autoAlpha: 0, duration: 0.3 });

        window.addEventListener('pointermove', onMove, { passive: true });
        document.addEventListener('pointerover', onOver, { passive: true });
        window.addEventListener('pointerdown', onDown);
        window.addEventListener('pointerup', onUp);
        document.documentElement.addEventListener('pointerleave', onLeave);

        return () => {
            document.documentElement.classList.remove('has-custom-cursor');
            window.removeEventListener('pointermove', onMove);
            document.removeEventListener('pointerover', onOver);
            window.removeEventListener('pointerdown', onDown);
            window.removeEventListener('pointerup', onUp);
            document.documentElement.removeEventListener('pointerleave', onLeave);
        };
    }, []);

    return (
        <div aria-hidden="true" className="hidden lg:block">
            <div
                ref={dotRef}
                className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full z-[9999] pointer-events-none invisible"
                style={{ background: 'var(--color-brass)' }}
            />
            <div
                ref={ringRef}
                className="fixed top-0 left-0 w-9 h-9 rounded-full z-[9998] pointer-events-none flex items-center justify-center invisible"
                style={{ border: '1px solid rgba(184,137,42,0.45)' }}
            >
                <span ref={labelRef} className="text-[5px] font-bold uppercase tracking-[0.15em] text-white invisible" />
            </div>
        </div>
    );
}
