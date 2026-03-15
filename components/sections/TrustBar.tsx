'use client';
import React, { useRef } from 'react';
import { TRUST_BADGES } from '@/lib/data/config';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const icons: Record<string, React.ReactNode> = {
    verified: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    ),
    trade: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
    ),
    star: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    ),
    photo: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
        </svg>
    ),
    location: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
        </svg>
    ),
};

export default function TrustBar() {
    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const badges = containerRef.current?.querySelectorAll('.trust-badge');
        if (!badges) return;

        // Entrance animation
        gsap.fromTo(badges,
            { opacity: 0, scale: 0.8, rotateY: 30 },
            {
                opacity: 1,
                scale: 1,
                rotateY: 0,
                duration: 1.2,
                stagger: 0.1,
                ease: "expo.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 95%",
                    toggleActions: "play none none reverse"
                }
            }
        );

        // Magnetic effect logic
        badges.forEach((badge) => {
            const onMouseMove = (e: MouseEvent) => {
                const rect = (badge as HTMLElement).getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                gsap.to(badge, {
                    x: x * 0.3,
                    y: y * 0.3,
                    rotateX: -y * 0.1,
                    rotateY: x * 0.1,
                    duration: 0.5,
                    ease: "power2.out"
                });
            };

            const onMouseLeave = () => {
                gsap.to(badge, {
                    x: 0,
                    y: 0,
                    rotateX: 0,
                    rotateY: 0,
                    duration: 0.8,
                    ease: "elastic.out(1, 0.3)"
                });
            };

            badge.addEventListener('mousemove', onMouseMove as any);
            badge.addEventListener('mouseleave', onMouseLeave as any);
        });
    }, { scope: sectionRef });

    return (
        <section
            ref={sectionRef}
            className="py-12 border-y overflow-hidden perspective-1000"
            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
            <div className="container-site">
                <div
                    ref={containerRef}
                    className="flex flex-wrap items-center justify-center gap-6 md:gap-12"
                >
                    {TRUST_BADGES.map((badge) => (
                        <div
                            key={badge.label}
                            className="trust-badge flex items-center gap-4 px-8 py-4 rounded-2xl border bg-white/80 backdrop-blur-sm transition-shadow hover:shadow-2xl hover:shadow-brass/20 group cursor-default"
                            style={{
                                borderColor: 'rgba(184,137,42,0.1)',
                                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
                            }}
                        >
                            <span
                                className="transition-transform group-hover:scale-125 duration-500"
                                style={{ color: 'var(--color-brass)' }}
                            >
                                {icons[badge.icon]}
                            </span>
                            <div className="flex flex-col leading-tight">
                                <span className="text-sm font-bold font-display tracking-tight" style={{ color: 'var(--color-charcoal)' }}>
                                    {badge.label}
                                </span>
                                <span className="text-[10px] uppercase font-bold tracking-widest opacity-60" style={{ color: 'var(--color-mute)' }}>
                                    {badge.sub}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
