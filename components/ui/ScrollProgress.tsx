'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollProgress() {
    const progressRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.to(progressRef.current, {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                scrub: 0.3,
            }
        });
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 h-px origin-left z-[10000] pointer-events-none">
            <div
                ref={progressRef}
                className="w-full h-full scale-x-0"
                style={{ background: 'var(--color-brass)' }}
            />
        </div>
    );
}
