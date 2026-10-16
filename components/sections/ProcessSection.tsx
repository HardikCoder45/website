'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { PROCESS_STEPS } from '@/lib/data/config';
import { useAppStore } from '@/lib/store/useAppStore';

gsap.registerPlugin(ScrollTrigger);

export default function ProcessSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const listRef = useRef<HTMLOListElement>(null);
    const openLeadModal = useAppStore((s) => s.openLeadModal);

    useGSAP(() => {
        // Brass line draws itself as you scroll through the steps.
        gsap.fromTo('.process-line-fill',
            { scaleY: 0 },
            {
                scaleY: 1, ease: 'none',
                scrollTrigger: { trigger: listRef.current, start: 'top 60%', end: 'bottom 60%', scrub: 0.6 },
            });

        gsap.utils.toArray<HTMLElement>('.process-step').forEach((step) => {
            gsap.fromTo(step,
                { autoAlpha: 0.25, x: 40 },
                {
                    autoAlpha: 1, x: 0, duration: 0.9, ease: 'expo.out',
                    scrollTrigger: { trigger: step, start: 'top 72%', toggleActions: 'play none none reverse' },
                });
            ScrollTrigger.create({
                trigger: step,
                start: 'top 60%',
                end: 'bottom 60%',
                toggleClass: { targets: step, className: 'is-active' },
            });
        });
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} id="process" className="section-pad scroll-mt-16 relative overflow-hidden" style={{ background: 'var(--color-charcoal)' }}>
            
            <div className="container-site relative">
                <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-16 lg:gap-24">
                    {/* Sticky intro */}
                    <div className="lg:sticky lg:top-32 self-start">
                        <p className="label mb-6" style={{ color: 'var(--color-ash)' }}>( 06 ) &nbsp;Process</p>
                        <h2 className="display mb-8" style={{ color: '#EEE9E1', fontSize: 'clamp(44px, 5.6vw, 96px)' }}>
                            From first visit<br />to <span className="italic font-normal text-brass-gradient">move-in day.</span>
                        </h2>
                        <p className="text-lg leading-relaxed max-w-md mb-10" style={{ color: 'rgba(245,239,224,0.6)' }}>
                            A clear five-step journey with one point of contact. Most modular kitchens go from measurement to handover in under 30 days.
                        </p>
                        <button
                            onClick={() => openLeadModal({ service: 'General Enquiry' })}
                            className="label inline-flex items-center gap-3 px-8 py-4 rounded-full border transition-colors duration-500 hover:bg-transparent hover:text-[#EEE9E1]"
                            style={{ background: '#EEE9E1', color: '#141310', borderColor: '#EEE9E1' }}
                        >
                            Start with step one
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </button>
                    </div>

                    {/* Steps */}
                    <ol ref={listRef} className="relative pl-12 md:pl-20">
                        <span className="absolute left-[15px] md:left-[23px] top-2 bottom-2 w-px" style={{ background: 'rgba(245,239,224,0.1)' }} aria-hidden="true" />
                        <span className="process-line-fill absolute left-[15px] md:left-[23px] top-2 bottom-2 w-px origin-top" style={{ background: 'linear-gradient(to bottom, var(--color-brass-light), var(--color-brass-dark))', boxShadow: '0 0 12px rgba(212,168,75,0.6)' }} aria-hidden="true" />

                        {PROCESS_STEPS.map((step) => (
                            <li key={step.step} className="process-step group relative pb-14 last:pb-0">
                                <span
                                    className="process-dot absolute -left-12 md:-left-20 top-1 w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center font-display font-light text-xs md:text-base border transition-all duration-500"
                                    aria-hidden="true"
                                >
                                    {step.step}
                                </span>
                                <div className="flex items-baseline gap-4 mb-3 flex-wrap">
                                    <h3 className="font-display font-light text-3xl md:text-4xl" style={{ color: '#F5EFE0' }}>{step.title}</h3>
                                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold" style={{ color: 'var(--color-brass-light)' }}>{step.duration}</span>
                                </div>
                                <p className="text-base md:text-lg leading-relaxed max-w-xl" style={{ color: 'rgba(245,239,224,0.6)' }}>{step.description}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </section>
    );
}
