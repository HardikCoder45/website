'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useAppStore } from '@/lib/store/useAppStore';

const SEEN_KEY = 'ams-intro-seen';

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
            gsap.to(root, { autoAlpha: 0, duration: 0.4, onComplete: finish });
            return;
        }

        const counter = { v: 0 };
        const tl = gsap.timeline({ onComplete: finish });
        tl.fromTo(root.querySelectorAll('.pl-letter'),
            { yPercent: 110 },
            { yPercent: 0, duration: 0.9, stagger: 0.06, ease: 'expo.out' })
            .fromTo(root.querySelector('.pl-tag'), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.6 }, '-=0.5')
            .to(counter, {
                v: 100,
                duration: 1.4,
                ease: 'power2.inOut',
                onUpdate: () => { if (countRef.current) countRef.current.textContent = String(Math.round(counter.v)).padStart(3, '0'); },
            }, 0.2)
            .to(root.querySelector('.pl-bar'), { scaleX: 1, duration: 1.4, ease: 'power2.inOut' }, 0.2)
            .to(root.querySelectorAll('.pl-letter, .pl-tag, .pl-meta'), { yPercent: -110, autoAlpha: 0, duration: 0.5, stagger: 0.02, ease: 'power3.in' })
            .to(root, { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'expo.inOut' }, '-=0.15');

        return () => { tl.kill(); };
    }, [setIntroDone]);

    if (gone) return null;

    return (
        <div
            ref={rootRef}
            aria-hidden="true"
            className="fixed inset-0 z-[20000] flex flex-col items-center justify-center"
            style={{ background: '#140F08', clipPath: 'inset(0 0 0% 0)' }}
        >
            <div className="grain absolute inset-0 opacity-[0.06] pointer-events-none" />
            <div className="flex items-baseline gap-3 overflow-hidden">
                <span className="line-mask">
                    {'AMS'.split('').map((l, i) => (
                        <span key={i} className="pl-letter inline-block font-display font-bold text-7xl md:text-9xl tracking-tighter" style={{ color: '#F5EFE0' }}>{l}</span>
                    ))}
                </span>
                <span className="line-mask">
                    <span className="pl-letter inline-block font-display italic text-3xl md:text-5xl text-brass-gradient">Interiors</span>
                </span>
            </div>
            <p className="pl-tag mt-4 text-[10px] md:text-xs uppercase tracking-[0.5em]" style={{ color: 'rgba(245,239,224,0.5)', visibility: 'hidden' }}>
                Love to make designs &amp; ideas
            </p>

            <div className="pl-meta absolute bottom-10 left-0 right-0 container-site flex items-end justify-between">
                <span className="text-[10px] uppercase tracking-[0.4em]" style={{ color: 'rgba(245,239,224,0.4)' }}>Delhi NCR · Est. 2014</span>
                <span ref={countRef} className="font-display text-5xl md:text-7xl font-light tabular-nums" style={{ color: 'var(--color-brass-light)' }}>000</span>
            </div>
            <div className="pl-bar absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0" style={{ background: 'linear-gradient(90deg, #8A6318, #D4A84B)' }} />
        </div>
    );
}
