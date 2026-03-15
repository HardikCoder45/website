'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { CONTACT_INFO } from '@/lib/data/config';
import LeadForm from '../forms/LeadForm';

export default function ContactSection() {
    const [ref, inView] = useInView({ triggerOnce: true, rootMargin: '200px 0px' });
    const [activeTab, setActiveTab] = useState<'studio' | 'factory'>('studio');

    const locations = {
        studio: {
            title: "Experience Studio",
            tag: "Corporate HQ & Design Hub",
            address: CONTACT_INFO.address,
            query: CONTACT_INFO.mapQuery,
            hours: "Mon - Sat, 10:00 - 19:00"
        },
        factory: {
            title: "Production Factory",
            tag: "High-Tech Manufacturing",
            address: CONTACT_INFO.factoryAddress,
            query: CONTACT_INFO.factoryMapQuery,
            hours: "Mon - Sat, 09:30 - 18:30"
        }
    };

    return (
        <section id="contact" className="section-pad scroll-mt-16 bg-surface relative z-10" style={{ background: 'var(--color-surface)' }}>
            <div className="container-site">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">

                    {/* Left: Dual Map Hub */}
                    <div className="w-full lg:w-3/5 flex flex-col">
                        <span className="text-[10px] font-bold tracking-[0.4em] uppercase mb-4 text-brass">
                            Connect with us
                        </span>
                        <h2 className="text-5xl md:text-7xl font-display font-bold mb-8 text-charcoal tracking-tight">
                            The Hubs of <span className="text-brass">Excellence.</span>
                        </h2>

                        {/* Tab Switcher */}
                        <div className="flex gap-2 p-1.5 bg-black/5 rounded-2xl mb-8 w-fit">
                            <button
                                onClick={() => setActiveTab('studio')}
                                className={`px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'studio' ? 'bg-white text-charcoal shadow-lg' : 'text-mute hover:text-charcoal'}`}
                            >
                                Experience Studio
                            </button>
                            <button
                                onClick={() => setActiveTab('factory')}
                                className={`px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'factory' ? 'bg-white text-charcoal shadow-lg' : 'text-mute hover:text-charcoal'}`}
                            >
                                Production Factory
                            </button>
                        </div>

                        {/* Location Details Overlay */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="p-8 rounded-3xl bg-sand/50 border border-brass/20 flex flex-col"
                                >
                                    <span className="text-[9px] font-black tracking-widest uppercase text-brass mb-3">
                                        {locations[activeTab].tag}
                                    </span>
                                    <h4 className="text-2xl font-display font-bold text-charcoal mb-4">
                                        {locations[activeTab].title}
                                    </h4>
                                    <address className="not-italic text-sm text-mute leading-relaxed mb-6">
                                        {locations[activeTab].address}
                                    </address>
                                    <div className="mt-auto pt-6 border-t border-brass/10 flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest">Operation Hours</span>
                                        <span className="text-[10px] font-bold text-charcoal uppercase tracking-widest">{locations[activeTab].hours}</span>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            <div className="p-8 rounded-3xl bg-charcoal text-white flex flex-col justify-center">
                                <span className="text-[9px] font-black tracking-widest uppercase text-brass mb-6">Immediate Support</span>
                                <div className="space-y-4">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Inquiry Line 01</span>
                                        <a href={`tel:${CONTACT_INFO.phone1}`} className="text-xl font-bold font-display hover:text-brass transition-colors">{CONTACT_INFO.phone1Display}</a>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Inquiry Line 02</span>
                                        <a href={`tel:${CONTACT_INFO.phone2}`} className="text-xl font-bold font-display hover:text-brass transition-colors">{CONTACT_INFO.phone2Display}</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Map View */}
                        <div ref={ref} className="w-full aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white relative bg-sand group">
                            <AnimatePresence mode="wait">
                                {inView && (
                                    <motion.div
                                        key={activeTab}
                                        initial={{ opacity: 0, filter: 'grayscale(1) contrast(1.2) scale(1.05)' }}
                                        animate={{ opacity: 1, filter: 'grayscale(0) contrast(1) scale(1)' }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.8 }}
                                        className="w-full h-full"
                                    >
                                        <iframe
                                            title={locations[activeTab].title}
                                            src={`https://maps.google.com/maps?q=${locations[activeTab].query}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            allowFullScreen
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Visual Hint */}
                            <div className="absolute top-8 left-8 p-3 rounded-full bg-white/90 backdrop-blur-md shadow-xl border border-white/20 pointer-events-none group-hover:scale-110 transition-transform">
                                <svg width="20" height="20" fill="none" stroke="var(--color-brass)" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Right: Embedded Form */}
                    <div className="w-full lg:w-2/5">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="p-10 md:p-14 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] sticky top-28 bg-white"
                            style={{ border: '1px solid rgba(0,0,0,0.05)' }}
                        >
                            <h3 className="text-3xl md:text-4xl font-display font-bold text-charcoal mb-4">
                                Start Your <span className="text-brass">Design.</span>
                            </h3>
                            <p className="text-mute mb-10 text-sm leading-relaxed max-w-xs">
                                Submit your details and our lead designer will provide a personalized estimate within 24 hours.
                            </p>

                            <LeadForm />
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
