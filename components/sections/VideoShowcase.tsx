'use client';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const VIDEOS = [
    {
        id: 1,
        title: "Modern Minimalist Kitchen",
        description: "A seamless blend of charcoal and brass accents.",
        thumbnail: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800",
        videoUrl: "#" // Placeholder
    },
    {
        id: 2,
        title: "Luxury Penthouse Suite",
        description: "Full-floor renovation with panoramic city views.",
        thumbnail: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800",
        videoUrl: "#"
    },
    {
        id: 3,
        title: "Bespoke Master Wardrobe",
        description: "Smart storage solutions for a boutique feel.",
        thumbnail: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800",
        videoUrl: "#"
    }
];

export default function VideoShowcase() {
    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const cards = gsap.utils.toArray('.video-card');

        cards.forEach((card: any, i) => {
            gsap.fromTo(card,
                { opacity: 0, scale: 0.9, y: 50 },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top bottom-=100',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });

        // Parallax effect on the container
        gsap.to(containerRef.current, {
            y: -100,
            ease: "none",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="section-pad bg-charcoal relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-brass/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container-site relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
                    <div className="max-w-2xl">
                        <span className="inline-block px-4 py-2 rounded-full bg-brass/10 border border-brass/20 text-brass-light text-[10px] font-bold uppercase tracking-[0.4em] mb-6">
                            Cinematic Portfolio
                        </span>
                        <h2 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">
                            Design in <span className="text-brass">Motion.</span>
                        </h2>
                        <p className="text-white/50 text-lg leading-relaxed max-w-lg">
                            Experience the flow of our spaces through professionally captured walkthroughs and design reels.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-20 h-[1px] bg-brass/30 hidden lg:block" />
                        <span className="text-xs font-bold text-white uppercase tracking-widest opacity-40">Press play to explore</span>
                    </div>
                </div>

                <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {VIDEOS.map((video) => (
                        <div
                            key={video.id}
                            className="video-card group relative aspect-[9/16] md:aspect-[3/4] rounded-[2rem] overflow-hidden bg-black cursor-pointer shadow-2xl"
                        >
                            <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-all duration-700 group-hover:scale-110"
                            />

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                            {/* Content */}
                            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                <h3 className="text-2xl font-display font-bold text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    {video.title}
                                </h3>
                                <p className="text-sm text-white/60 mb-6 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                                    {video.description}
                                </p>

                                <div className="flex items-center gap-4 translate-y-10 group-hover:translate-y-0 transition-all duration-500 delay-200">
                                    <div className="w-12 h-12 rounded-full bg-brass flex items-center justify-center text-white shadow-lg shadow-brass/20 group-hover:scale-110 transition-transform">
                                        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Watch Reel</span>
                                </div>
                            </div>

                            {/* Decorative Corner */}
                            <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-brass/40 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
