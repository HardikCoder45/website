'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const TOURS = [
    { href: '/kitchen', title: 'The Kitchen', note: 'Five guided stops · day & evening · live finishes' },
    { href: '/wardrobe', title: 'The Wardrobe', note: 'Open the doors · four shutter finishes' },
    { href: '/interior', title: 'The Living Room', note: 'Restyle walls, panels, floor & light' },
];

export default function Experience() {
    const ref = useRef<HTMLElement>(null);

    useGSAP(() => {
        gsap.fromTo('.xp-img', { scale: 1.18 }, {
            scale: 1, ease: 'none',
            scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true },
        });
        gsap.fromTo('.xp-frame', { clipPath: 'inset(12% 8% 12% 8%)' }, {
            clipPath: 'inset(0% 0% 0% 0%)', ease: 'none',
            scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'top top', scrub: true },
        });
    }, { scope: ref });

    return (
        <section ref={ref} id="tours" className="relative scroll-mt-24" style={{ background: 'var(--color-charcoal)', color: '#EEE9E1' }}>
            <div className="xp-frame relative min-h-[100svh] md:h-[100svh] md:min-h-[640px] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/renders/cy-wenge-evening-overview.webp" alt="AMS kitchen design rendered in the evening" className="xp-img absolute inset-0 w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,12,10,0.92) 0%, rgba(13,12,10,0.35) 50%, rgba(13,12,10,0.55) 100%)' }} />

                <div className="relative min-h-[100svh] md:min-h-0 md:h-full container-site flex flex-col justify-between gap-16 py-24 md:py-28">
                    <div className="flex items-start justify-between gap-6">
                        <p className="label" style={{ color: 'var(--color-ash)' }}>( 05 ) &nbsp;Live 3D</p>
                        <p className="label text-right hidden sm:block" style={{ color: 'var(--color-ash)' }}>Ray-traced render · AMS design studio</p>
                    </div>

                    <div>
                        <h2 className="display max-w-5xl" style={{ fontSize: 'clamp(44px, 7vw, 128px)' }}>
                            Walk through it<br /><span className="italic" style={{ color: 'var(--color-brass-light)' }}>before we build it.</span>
                        </h2>
                        <p className="mt-6 max-w-lg text-sm md:text-base leading-relaxed" style={{ color: 'var(--color-ash)' }}>
                            Every AMS project is designed in 3D first. Step inside three of our signature spaces in real time — change the stone, the timber and the light, and see the estimate move with you.
                        </p>

                        <ul className="mt-12 grid md:grid-cols-3 border-t" style={{ borderColor: 'var(--color-line-dark)' }}>
                            {TOURS.map((t, i) => (
                                <li key={t.href} className={`border-b md:border-b-0 ${i > 0 ? 'md:border-l' : ''}`} style={{ borderColor: 'var(--color-line-dark)' }}>
                                    <a href={t.href} data-cursor="Enter" className="group flex items-end justify-between gap-4 py-6 md:px-6 first:md:pl-0 transition-colors">
                                        <span>
                                            <span className="label block mb-2" style={{ color: 'var(--color-ash)' }}>0{i + 1}</span>
                                            <span className="display text-3xl md:text-4xl block transition-all duration-500 group-hover:italic">{t.title}</span>
                                            <span className="text-xs mt-2 block" style={{ color: 'var(--color-ash)' }}>{t.note}</span>
                                        </span>
                                        <span className="shrink-0 w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-500 group-hover:bg-[#EEE9E1] group-hover:text-[#141310]" style={{ borderColor: 'rgba(238,233,225,0.35)' }}>
                                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9" /></svg>
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
