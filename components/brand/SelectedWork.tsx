'use client';
import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { PROJECTS } from '@/lib/data/work';
import 'yet-another-react-lightbox/styles.css';

gsap.registerPlugin(ScrollTrigger);

const Lightbox = dynamic(() => import('yet-another-react-lightbox'), { ssr: false });

export default function SelectedWork() {
    const ref = useRef<HTMLElement>(null);
    const [index, setIndex] = useState(-1);

    useGSAP(() => {
        gsap.utils.toArray<HTMLElement>('.work-item').forEach((item) => {
            const frame = item.querySelector('.work-frame');
            const img = item.querySelector('img');
            gsap.fromTo(frame, { clipPath: 'inset(100% 0% 0% 0%)' }, {
                clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut',
                scrollTrigger: { trigger: item, start: 'top 85%' },
            });
            gsap.fromTo(img, { scale: 1.25, yPercent: -6 }, {
                scale: 1.05, yPercent: 6, ease: 'none',
                scrollTrigger: { trigger: item, start: 'top bottom', end: 'bottom top', scrub: true },
            });
            gsap.fromTo(item.querySelector('.work-cap'), { autoAlpha: 0, y: 20 }, {
                autoAlpha: 1, y: 0, duration: 1, ease: 'expo.out',
                scrollTrigger: { trigger: item, start: 'top 75%' },
            });
        });
    }, { scope: ref });

    return (
        <section ref={ref} id="work" className="relative pb-28 md:pb-44 scroll-mt-24" style={{ background: 'var(--color-sand)', color: 'var(--color-charcoal)' }}>
            <div className="container-site">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 md:pb-20 border-b" style={{ borderColor: 'var(--color-border-strong)' }}>
                    <div>
                        <p className="label mb-6" style={{ color: 'var(--color-mute)' }}>( 02 ) &nbsp;Selected work</p>
                        <h2 className="display" style={{ fontSize: 'clamp(44px, 6.4vw, 112px)' }}>
                            Rooms with a<br /><span className="italic" style={{ color: 'var(--color-brass-dark)' }}>point of view.</span>
                        </h2>
                    </div>
                    <p className="max-w-sm text-sm leading-relaxed" style={{ color: 'var(--color-mute)' }}>
                        A selection of kitchens, bedrooms and living spaces — alongside 3D visualisations from our design studio.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-20 md:gap-y-32 mt-16 md:mt-24">
                    {PROJECTS.map((p, i) => {
                        const large = p.span === 'large';
                        // Asymmetric rhythm: large/small alternate sides, small items drop lower.
                        const left = i % 4 < 2;
                        const col = large
                            ? (left ? 'md:col-start-1 md:col-span-7' : 'md:col-start-6 md:col-span-7')
                            : (left ? 'md:col-start-9 md:col-span-4 md:mt-48' : 'md:col-start-1 md:col-span-4 md:mt-48');
                        return (
                            <figure key={p.id} className={`work-item group ${col} ${!large && !left ? 'md:row-start-auto' : ''}`}>
                                <button
                                    onClick={() => setIndex(i)}
                                    data-cursor="View"
                                    aria-label={`View ${p.title}`}
                                    className={`work-frame relative block w-full overflow-hidden ${large ? 'aspect-[4/3]' : 'aspect-[3/4]'}`}
                                    style={{ background: 'var(--color-stone)' }}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={p.image} alt={p.title} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover transition-[filter] duration-700 group-hover:brightness-90" />
                                    {p.render && (
                                        <span className="absolute top-4 left-4 label px-3 py-1.5 rounded-full backdrop-blur-md" style={{ background: 'rgba(20,19,16,0.45)', color: '#EEE9E1' }}>3D render</span>
                                    )}
                                </button>
                                <figcaption className="work-cap flex items-start justify-between gap-6 mt-5">
                                    <div>
                                        <p className="label mb-2" style={{ color: 'var(--color-mute)' }}>{String(i + 1).padStart(2, '0')} — {p.category}</p>
                                        <h3 className="display text-2xl md:text-3xl" style={{ lineHeight: 1.15 }}>{p.title}</h3>
                                    </div>
                                    <p className="label shrink-0 text-right" style={{ color: 'var(--color-mute)' }}>{p.place}<br />{p.year}</p>
                                </figcaption>
                            </figure>
                        );
                    })}
                </div>
            </div>

            {index >= 0 && (
                <Lightbox
                    open
                    close={() => setIndex(-1)}
                    index={index}
                    slides={PROJECTS.map((p) => ({ src: p.image, alt: p.title }))}
                    styles={{ container: { backgroundColor: 'rgba(13,12,10,0.97)' } }}
                />
            )}
        </section>
    );
}
