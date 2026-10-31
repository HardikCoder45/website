'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useAppStore } from '@/lib/store/useAppStore';

const SEEN_KEY = 'ams-intro-seen';

/** The mark draws itself like a pen on tracing paper, then the sheet lifts. */
export default function Preloader() {
    const rootRef = useRef<HTMLDivElement>(null);
    const countRef = useRef<HTMLSpanElement>(null);
    const [gone, setGone] = useState(false);
    const setIntroDone = useAppStore((s) => s.setIntroDone);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;

        let seen = false;
        try { seen = sessionStorage.getItem(SEEN_KEY) === '1'; } catch { /* storage blocked */ }
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const finish = () => {
            try { sessionStorage.setItem(SEEN_KEY, '1'); } catch { /* storage blocked */ }
            setIntroDone();
            setGone(true);
        };

        if (seen || reduced) {
            gsap.to(root, { autoAlpha: 0, duration: 0.35, onComplete: finish });
            return;
        }

        const strokes = root.querySelectorAll<SVGPathElement>('.pl-stroke');
        strokes.forEach((p) => {
            const len = p.getTotalLength();
            p.style.strokeDasharray = `${len}`;
            p.style.strokeDashoffset = `${len}`;
        });
        const counter = { v: 0 };
        const tl = gsap.timeline({ onComplete: finish });
        tl.to(strokes, { strokeDashoffset: 0, duration: 0.7, stagger: 0.18, ease: 'power2.inOut' })
            .fromTo(root.querySelector('.pl-window'), { scale: 0 }, { scale: 1, duration: 0.4, ease: 'back.out(2)', transformOrigin: '50% 50%' }, '-=0.1')
            .fromTo(root.querySelectorAll('.pl-text'), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08 }, '-=0.3')
            .to(counter, {
                v: 100, duration: 1.6, ease: 'power2.inOut',
                onUpdate: () => { if (countRef.current) countRef.current.textContent = String(Math.round(counter.v)).padStart(3, '0'); },
            }, 0)
            .to(root, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, '+=0.15');

        return () => { tl.kill(); };
    }, [setIntroDone]);

    if (gone) return null;

    return (
        <div ref={rootRef} aria-hidden="true" className="fixed inset-0 z-[20000] flex flex-col items-center justify-center drafting-grid" style={{ background: '#F5EFE0', color: '#2C2416' }}>
            <svg width="120" height="120" viewBox="0 0 48 48" fill="none">
                <path className="pl-stroke" d="M10 39.6 L24 10 L38 39.6" stroke="currentColor" strokeWidth="2.6" />
                <path className="pl-stroke" d="M15.6 27 H32.4" stroke="currentColor" strokeWidth="2.6" />
                <path className="pl-stroke" d="M5 39.6 H43" stroke="currentColor" strokeWidth="1.4" />
                <rect className="pl-window" x="21.8" y="20.4" width="4.4" height="4.4" fill="#B8892A" />
            </svg>
            <p className="pl-text font-display font-bold text-5xl mt-6 invisible tracking-[-0.03em]">AMS</p>
            <p className="pl-text font-display font-semibold text-sm tracking-[0.34em] uppercase mt-2 invisible" style={{ color: '#B8892A' }}>Interiors</p>
            <div className="absolute bottom-8 inset-x-0 container-site flex justify-between label" style={{ color: '#6B6358' }}>
                <span>Sheet 00 · Cover</span>
                <span className="tabular-nums"><span ref={countRef}>000</span> %</span>
            </div>
        </div>
    );
}
