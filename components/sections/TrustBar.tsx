'use client';
import React from 'react';
import { TRUST_BADGES } from '@/lib/data/config';

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
    const items = [...TRUST_BADGES, ...TRUST_BADGES];
    return (
        <section
            aria-label="Credentials"
            className="relative py-8 border-y overflow-hidden"
            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
            <div className="absolute inset-y-0 left-0 w-24 md:w-48 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, var(--color-surface), transparent)' }} />
            <div className="absolute inset-y-0 right-0 w-24 md:w-48 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, var(--color-surface), transparent)' }} />
            <ul className="flex w-max animate-marquee">
                {items.map((badge, i) => (
                    <li
                        key={`${badge.label}-${i}`}
                        aria-hidden={i >= TRUST_BADGES.length ? true : undefined}
                        className="group mr-6 md:mr-10 flex items-center gap-4 px-7 py-4 rounded-2xl border bg-white/80 transition-shadow duration-500 hover:shadow-xl hover:shadow-brass/10"
                        style={{ borderColor: 'rgba(184,137,42,0.12)' }}
                    >
                        <span className="transition-transform group-hover:scale-125 duration-500" style={{ color: 'var(--color-brass)' }}>
                            {icons[badge.icon]}
                        </span>
                        <div className="flex flex-col leading-tight whitespace-nowrap">
                            <span className="text-sm font-bold font-display tracking-tight" style={{ color: 'var(--color-charcoal)' }}>
                                {badge.label}
                            </span>
                            <span className="text-[10px] uppercase font-bold tracking-widest opacity-60" style={{ color: 'var(--color-mute)' }}>
                                {badge.sub}
                            </span>
                        </div>
                        <span className="ml-6 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-brass-light)' }} aria-hidden="true" />
                    </li>
                ))}
            </ul>
        </section>
    );
}
