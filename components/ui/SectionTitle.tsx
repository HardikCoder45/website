'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface SectionTitleProps {
    eyebrow: string;
    title: string;
    description: string;
    align?: 'center' | 'left';
    dark?: boolean;
}

export default function SectionTitle({ eyebrow, title, description, align = 'center', dark = false }: SectionTitleProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });

        tl.fromTo('.st-eyebrow',
            { opacity: 0, x: align === 'center' ? -20 : -30 },
            { opacity: 1, x: 0, duration: 0.8 }
        )
            .fromTo('.st-title',
                { opacity: 0, y: 30, skewY: 2 },
                { opacity: 1, y: 0, skewY: 0, duration: 1, ease: "expo.out" },
                "-=0.5"
            )
            .fromTo('.st-desc',
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8 },
                "-=0.7"
            );
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className={`max-w-3xl mb-16 ${align === 'center' ? 'mx-auto text-center' : 'text-left'}`}>
            <span className="st-eyebrow opacity-0 inline-block px-3 py-1 mb-4 text-[10px] font-bold tracking-[0.2em] uppercase rounded-full border border-brass/30 text-brass-dark bg-brass/5">
                {eyebrow}
            </span>
            <h2
                className="st-title opacity-0 text-4xl md:text-6xl font-display font-bold mb-6 leading-[1.1]"
                style={{ color: dark ? '#F5EFE0' : 'var(--color-charcoal)' }}
            >
                {title}
            </h2>
            <p className="st-desc opacity-0 text-lg leading-relaxed" style={{ color: dark ? 'rgba(245,239,224,0.6)' : 'var(--color-mute)' }}>
                {description}
            </p>
        </div>
    );
}
