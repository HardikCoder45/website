'use client';
import { useRef } from 'react';
import { PRODUCT_CATEGORIES } from '@/lib/data/config';
import { useAppStore } from '@/lib/store/useAppStore';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SectionTitle from '../ui/SectionTitle';

gsap.registerPlugin(ScrollTrigger);

export default function ProductShowcase() {
    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const openLeadModal = useAppStore((s) => s.openLeadModal);

    useGSAP(() => {
        if (!containerRef.current || !sectionRef.current) return;

        const panels = gsap.utils.toArray('.product-panel') as HTMLElement[];
        const totalPanels = panels.length;

        // Horizontal Scroll Animation
        const scrollTween = gsap.to(panels, {
            xPercent: -100 * (totalPanels - 1),
            ease: "none",
            scrollTrigger: {
                trigger: sectionRef.current,
                pin: true,
                scrub: 1,
                // The 'end' determines how long the section stays pinned. 
                // We want it to be proportional to its horizontal length.
                end: () => `+=${containerRef.current?.scrollWidth}`,
                snap: 1 / (totalPanels - 1),
                invalidateOnRefresh: true,
                anticipatePin: 1,
            }
        });

        gsap.fromTo('.product-progress', { scaleX: 0 }, {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top top',
                end: () => `+=${containerRef.current?.scrollWidth}`,
                scrub: true,
                invalidateOnRefresh: true,
            }
        });

        // Fade out the pinned section title as scroll begins
        gsap.to('.section-title-pinned', {
            opacity: 0,
            y: -30,
            ease: "power2.inOut",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "top -15%",
                scrub: true,
                id: 'pinned-title-fade'
            }
        });

        // Add amazing effects to each panel
        panels.forEach((panel) => {
            const content = panel.querySelector('.product-content');
            const image = panel.querySelector('.product-image');
            const number = panel.querySelector('.product-number');

            // Image Parallax (Horizontal)
            gsap.fromTo(image,
                { x: "-20%" },
                {
                    x: "20%",
                    ease: "none",
                    scrollTrigger: {
                        trigger: panel,
                        containerAnimation: scrollTween,
                        start: "left right",
                        end: "right left",
                        scrub: true
                    }
                }
            );

            // Number Parallax
            gsap.fromTo(number,
                { x: "50%", opacity: 0 },
                {
                    x: "-50%", opacity: 0.1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: panel,
                        containerAnimation: scrollTween,
                        start: "left right",
                        end: "right left",
                        scrub: true
                    }
                }
            );

            // Content Staggered Reveals
            gsap.fromTo(content,
                { opacity: 0, scale: 0.8, y: 50 },
                {
                    opacity: 1, scale: 1, y: 0,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: panel,
                        containerAnimation: scrollTween,
                        start: "left center+=20%",
                        toggleActions: "play reverse play reverse"
                    }
                }
            );

            // Magnetic Button (Local to each panel)
            const button = panel.querySelector('.magnetic-btn');
            if (button) {
                const onMouseMove = (e: MouseEvent) => {
                    const rect = (button as HTMLElement).getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    gsap.to(button, {
                        x: x * 0.4, y: y * 0.4,
                        duration: 0.6, ease: "power2.out"
                    });
                };
                const onMouseLeave = () => {
                    gsap.to(button, {
                        x: 0, y: 0,
                        duration: 0.8, ease: "elastic.out(1, 0.3)"
                    });
                };
                button.addEventListener('mousemove', onMouseMove as EventListener);
                button.addEventListener('mouseleave', onMouseLeave as EventListener);
            }
        });
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} id="products" className="relative bg-charcoal overflow-hidden scroll-mt-20">
            <div className="section-title-pinned hidden md:block absolute top-0 left-0 w-full z-20 pointer-events-none pt-24 transition-opacity duration-500">
                <div className="container-site">
                    <SectionTitle
                        eyebrow="Our Collection"
                        title="Bespoke Design Categories"
                        description="Scroll down to travel through our specialized interior services."
                        dark={true}
                        align="left"
                    />
                </div>
            </div>

            {/* Journey progress */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 hidden md:flex items-center gap-4 pointer-events-none">
                <span className="text-[10px] font-bold tracking-[0.3em] text-white/40">01</span>
                <span className="relative block w-48 h-px bg-white/10 overflow-hidden">
                    <span className="product-progress absolute inset-0 origin-left scale-x-0" style={{ background: 'var(--color-brass-light)' }} />
                </span>
                <span className="text-[10px] font-bold tracking-[0.3em] text-white/40">0{PRODUCT_CATEGORIES.length}</span>
            </div>

            <div
                ref={containerRef}
                className="flex h-screen will-change-transform"
                style={{ width: `${PRODUCT_CATEGORIES.length * 100}vw` }}
            >
                {PRODUCT_CATEGORIES.map((product, idx) => (
                    <div
                        key={product.id}
                        className="product-panel relative w-[100vw] h-full flex items-center justify-center overflow-hidden flex-shrink-0"
                    >
                        {/* Background Image with Cinematic Overlay */}
                        <div className="absolute inset-0 z-0">
                            <div className="product-image w-[140%] h-full relative left-[-20%]">
                                <img
                                    src={product.image}
                                    alt=""
                                    loading={idx === 0 ? 'eager' : 'lazy'}
                                    className="w-full h-full object-cover opacity-20 grayscale-[0.2] hover:grayscale-0 transition-all duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/90 to-charcoal/40" />
                            </div>
                        </div>

                        {/* Large Background Text to fill the 'empty' side */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                            <span className="text-[25vw] font-display font-black text-white/[0.03] uppercase tracking-tighter whitespace-nowrap select-none">
                                {product.name.split(' ')[0]}
                            </span>
                        </div>

                        {/* Content */}
                        <div className="container-site relative z-20 w-full flex flex-col lg:flex-row items-center justify-between gap-12">
                            <div className="product-content relative z-30 max-w-2xl px-6 lg:px-0">
                                <span className="inline-block px-4 py-2 rounded-full bg-brass/20 text-brass-light border border-brass/30 text-[10px] font-bold uppercase tracking-widest mb-8">
                                    {product.badge || 'Premium Selection'}
                                </span>
                                <h2 className="text-6xl md:text-9xl font-display font-bold text-white mb-8 leading-[0.85] tracking-tighter">
                                    {product.name.split(' ')[0]} <br />
                                    <span className="text-brass italic">{product.name.split(' ').slice(1).join(' ')}</span>
                                </h2>
                                <p className="text-xl text-white/70 max-w-xl mb-12 leading-relaxed font-medium">
                                    {product.description}
                                </p>

                                <div className="flex flex-wrap gap-4 mb-16">
                                    {product.tags.map(tag => (
                                        <span key={tag} className="px-5 py-2 rounded-xl border border-white/10 bg-white/5 text-[11px] text-white/80 uppercase font-bold tracking-widest backdrop-blur-sm">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex flex-wrap items-center gap-10">
                                    <button
                                        onClick={() => openLeadModal({ service: product.name })}
                                        className="magnetic-btn btn-sheen px-12 py-6 rounded-2xl bg-brass text-white font-bold text-xs uppercase tracking-[0.3em] whitespace-nowrap shadow-2xl transition-transform"
                                        style={{ boxShadow: '0 25px 50px -12px rgba(184,137,42,0.5)' }}
                                    >
                                        Get Estimate
                                    </button>

                                    {(product.id === 'kitchen' || product.id === 'interior' || product.id === 'wardrobe') && (
                                        <a
                                            href={`/${product.id}`}
                                            className="px-10 py-6 rounded-2xl border-2 border-white/20 text-white font-bold text-xs uppercase tracking-[0.3em] hover:bg-white hover:text-charcoal transition-all whitespace-nowrap"
                                        >
                                            Explore 3D Tour
                                        </a>
                                    )}

                                    <div className="flex flex-col border-l border-white/20 pl-10">
                                        <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold mb-1">Starting from</span>
                                        <span className="text-3xl font-display font-bold text-white">₹{product.startingPrice.toLocaleString('en-IN')}<span className="text-lg opacity-50 ml-1">{product.priceUnit}</span></span>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Number */}
                            <div className="hidden lg:flex justify-end pr-8 relative z-0 pointer-events-none">
                                <span className="product-number text-[450px] font-display font-black text-white/[0.03] select-none leading-none absolute right-[-10%] top-1/2 -translate-y-1/2">
                                    0{idx + 1}
                                </span>
                            </div>
                        </div>

                        {/* Side Scroll Hint */}
                        <div className="absolute bottom-12 right-12 hidden md:flex items-center gap-4 opacity-30">
                            <span className="text-[10px] uppercase tracking-[0.3em] text-white">Scroll to travel</span>
                            <div className="w-24 h-px bg-gradient-to-r from-brass to-transparent" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
