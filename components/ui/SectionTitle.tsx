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
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 1.2, ease: "expo.out" },
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
            <span className="st-eyebrow opacity-0 label inline-block mb-6" style={{ color: dark ? 'var(--color-ash)' : 'var(--color-mute)' }}>
                ( {eyebrow} )
            </span>
            <h2
                className="st-title opacity-0 display mb-6"
                style={{ color: dark ? '#EEE9E1' : 'var(--color-charcoal)', fontSize: 'clamp(40px, 5.2vw, 88px)' }}
            >
                {title}
            </h2>
            <p className="st-desc opacity-0 text-base leading-relaxed max-w-xl" style={{ color: dark ? 'var(--color-ash)' : 'var(--color-mute)', marginInline: align === 'center' ? 'auto' : undefined }}>
                {description}
            </p>
        </div>
    );
}
