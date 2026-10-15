'use client';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type ComponentType } from 'react';
import Link from 'next/link';
import { Canvas } from '@react-three/fiber';
import { CameraControls, Environment, Html, PerformanceMonitor, useProgress } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, N8AO, ToneMapping } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import * as THREE from 'three';
import { AnimatePresence, motion } from 'framer-motion';
import type { TourDef } from '@/lib/data/tours';
import { defaultSelection, describeSelection, selectionPriceDelta, type FinishSelection } from '@/lib/three/finishes';
import { CONTACT_INFO } from '@/lib/data/config';
import type { Mood } from '@/components/three/KitchenModel';
import type { SceneProps } from './scenes/types';

interface TourExperienceProps {
    tour: TourDef;
    Scene: ComponentType<SceneProps>;
}

function formatINR(n: number) {
    if (n >= 1e5) return `₹${(n / 1e5).toFixed(n >= 1e6 ? 1 : 2).replace(/\.?0+$/, '')}L`;
    return `₹${Math.round(n / 1000)}K`;
}

function Loader() {
    const { progress, active } = useProgress();
    // three's global progress counter doesn't always reach 100 (e.g. assets that
    // were already cached), so hide once loading has gone idle.
    const [done, setDone] = useState(false);
    useEffect(() => {
        if (active) return;
        const t = setTimeout(() => setDone(true), 400);
        return () => clearTimeout(t);
    }, [active]);
    return (
        <AnimatePresence>
            {!done && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.8 } }}
                    className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none"
                    style={{ background: '#140F08' }}
                >
                    <span className="font-display text-6xl md:text-8xl font-light tabular-nums" style={{ color: 'var(--color-brass-light)' }}>
                        {Math.round(progress)}%
                    </span>
                    <span className="mt-4 text-[10px] uppercase tracking-[0.4em]" style={{ color: 'rgba(245,239,224,0.5)' }}>Building your space in 3D</span>
                    <span className="mt-8 block w-48 h-px overflow-hidden" style={{ background: 'rgba(245,239,224,0.1)' }}>
                        <span className="block h-full origin-left transition-transform duration-300" style={{ background: 'var(--color-brass-light)', transform: `scaleX(${progress / 100})` }} />
                    </span>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function readParams() {
    if (typeof window === 'undefined') return new URLSearchParams();
    return new URLSearchParams(window.location.search);
}

export default function TourExperience({ tour, Scene }: TourExperienceProps) {
    const params = useMemo(() => readParams(), []);
    const clean = params.get('clean') === '1';
    const initialStop = Math.max(0, tour.stops.findIndex((s) => s.id === params.get('stop')));

    const [stop, setStop] = useState(initialStop);
    const [mood, setMood] = useState<Mood>(params.get('mood') === 'evening' ? 'evening' : 'day');
    const [selection, setSelection] = useState<FinishSelection>(() => {
        const sel = defaultSelection(tour.finishes);
        tour.finishes.forEach((g) => { const v = params.get(g.id); if (v && g.choices.some((c) => c.id === v)) sel[g.id] = v; });
        return sel;
    });
    const [toggles, setToggles] = useState<Record<string, boolean>>(() =>
        Object.fromEntries(tour.toggles.map((t) => [t.id, params.get(t.id) === '1' ? true : t.default])));
    const [autoplay, setAutoplay] = useState(false);
    const [panelOpen, setPanelOpen] = useState(false);
    // fx=0 disables post-processing; fx=lite keeps bloom/tone mapping but drops AO.
    const [degraded, setDegraded] = useState(params.get('fx') === '0');
    const [lite, setLite] = useState(params.get('fx') === 'lite');
    const [halfFloat, setHalfFloat] = useState(true);
    const [moved, setMoved] = useState(false);

    // State (not a ref) so the camera effect re-runs once the controls mount
    // inside the canvas, which happens after this component's first effects.
    const [cc, setCC] = useState<CameraControls | null>(null);
    const glRef = useRef<HTMLCanvasElement | null>(null);
    const first = useRef(true);

    const current = tour.stops[stop];

    // Fly the camera to the active stop.
    useEffect(() => {
        if (!cc) return;
        const { position: p, target: t } = current;
        cc.setLookAt(p[0], p[1], p[2], t[0], t[1], t[2], !first.current);
        first.current = false;
    }, [current, cc]);

    const resetView = () => {
        const { position: p, target: t } = current;
        cc?.setLookAt(p[0], p[1], p[2], t[0], t[1], t[2], true);
        setMoved(false);
    };

    const go = useCallback((delta: number) => {
        setMoved(false);
        setStop((s) => (s + delta + tour.stops.length) % tour.stops.length);
    }, [tour.stops.length]);

    useEffect(() => {
        if (!autoplay) return;
        const id = setInterval(() => go(1), 7000);
        return () => clearInterval(id);
    }, [autoplay, go]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement) return;
            if (e.key === 'ArrowRight') go(1);
            if (e.key === 'ArrowLeft') go(-1);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [go]);

    const delta = selectionPriceDelta(tour.finishes, selection);
    const low = (tour.rate[0] + delta) * tour.area;
    const high = (tour.rate[1] + delta) * tour.area;

    const quoteHref = useMemo(() => {
        const lines = [
            `Hi AMS Interiors! I designed this in your 3D ${tour.title} tour:`,
            '',
            ...describeSelection(tour.finishes, selection).map((l) => `• ${l}`),
            ...tour.toggles.filter((t) => toggles[t.id]).map((t) => `• ${t.label}`),
            '',
            `Estimate shown: ${formatINR(low)} – ${formatINR(high)} for ~${tour.area} sq.ft.`,
            'Please share an exact quote and book a free site visit.',
        ];
        return `${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`;
    }, [tour, selection, toggles, low, high]);

    const saveImage = () => {
        const canvas = glRef.current;
        if (!canvas) return;
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = `ams-${tour.slug}-design.png`;
        a.click();
    };

    const toggleFullscreen = () => {
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen?.();
    };

    const evening = mood === 'evening';

    return (
        <main className="fixed inset-0 overflow-hidden" style={{ background: '#140F08' }}>
            <Canvas
                className="!absolute inset-0"
                dpr={degraded ? 1 : [1, 1.75]}
                camera={{ fov: 50, near: 0.05, far: 60, position: current.position }}
                gl={{ antialias: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' }}
                onCreated={({ gl }) => {
                    glRef.current = gl.domElement;
                    // Some GPUs/drivers (and software renderers) can't render to
                    // half-float targets; fall back to 8-bit so effects never go black.
                    const ctx = gl.getContext();
                    setHalfFloat(!!(ctx.getExtension('EXT_color_buffer_half_float') || ctx.getExtension('EXT_color_buffer_float')) && !/swiftshader/i.test(String(ctx.getParameter(ctx.getExtension('WEBGL_debug_renderer_info')?.UNMASKED_RENDERER_WEBGL ?? ctx.RENDERER))));
                }}
                onPointerDown={() => setAutoplay(false)}
            >
                <PerformanceMonitor onDecline={() => (lite ? setDegraded(true) : setLite(true))} />
                <color attach="background" args={[evening ? '#0c0a08' : '#e9e2d6']} />
                <Suspense fallback={null}>
                    <Environment files={evening ? tour.hdri.evening : tour.hdri.day} environmentIntensity={evening ? 0.35 : 1.0} />
                    <Scene selection={selection} mood={mood} toggles={toggles} />
                    {!clean && tour.stops.map((s, i) => (
                        <Html key={s.id} position={s.hotspot ?? s.target} center zIndexRange={[20, 0]}>
                            <button
                                onClick={() => { setStop(i); setMoved(false); setAutoplay(false); }}
                                aria-label={`Go to ${s.label}`}
                                className="group relative flex items-center justify-center"
                            >
                                <span className="absolute w-9 h-9 rounded-full pulse-ring" style={{ background: 'rgba(212,168,75,0.35)' }} />
                                <span
                                    className="relative w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border transition-transform group-hover:scale-125"
                                    style={{
                                        background: i === stop ? 'var(--color-brass)' : 'rgba(20,15,8,0.75)',
                                        borderColor: 'rgba(212,168,75,0.8)',
                                        color: '#fff',
                                    }}
                                >
                                    {i + 1}
                                </span>
                                <span className="absolute left-9 whitespace-nowrap px-3 py-1.5 rounded-full text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ background: 'rgba(20,15,8,0.85)', color: '#F5EFE0' }}>
                                    {s.label}
                                </span>
                            </button>
                        </Html>
                    ))}
                </Suspense>
                <CameraControls
                    ref={setCC}
                    makeDefault
                    smoothTime={0.9}
                    minDistance={0.4}
                    maxDistance={9}
                    dollySpeed={0.4}
                    onStart={() => setMoved(true)}
                />
                {!degraded && (
                    <EffectComposer multisampling={lite ? 0 : 4} frameBufferType={lite || !halfFloat ? THREE.UnsignedByteType : THREE.HalfFloatType}>
                        {lite ? <></> : <N8AO aoRadius={0.6} intensity={2.2} distanceFalloff={0.6} quality="performance" />}
                        <Bloom mipmapBlur luminanceThreshold={0.9} intensity={evening ? 1.1 : 0.45} />
                        <ToneMapping mode={ToneMappingMode.AGX} />
                        <Vignette offset={0.3} darkness={0.55} />
                    </EffectComposer>
                )}
            </Canvas>

            <Loader />

            {!clean && (
                <>
                    {/* Top bar */}
                    <header className="absolute top-0 inset-x-0 z-20 flex items-start justify-between gap-4 p-4 md:p-6 pointer-events-none">
                        <div className="flex items-center gap-3 pointer-events-auto">
                            <Link href="/#tours" aria-label="Back to home" className="w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-xl border transition-colors hover:bg-white/20" style={{ background: 'rgba(20,15,8,0.55)', borderColor: 'rgba(245,239,224,0.15)', color: '#F5EFE0' }}>
                                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                            </Link>
                            <div className="px-4 py-2 rounded-2xl backdrop-blur-xl border" style={{ background: 'rgba(20,15,8,0.55)', borderColor: 'rgba(245,239,224,0.12)' }}>
                                <p className="text-[9px] uppercase tracking-[0.3em] font-bold" style={{ color: 'var(--color-brass-light)' }}>{tour.eyebrow}</p>
                                <h1 className="font-display text-lg md:text-xl font-bold leading-tight" style={{ color: '#F5EFE0' }}>{tour.title}</h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pointer-events-auto">
                            <div className="hidden sm:flex p-1 rounded-full backdrop-blur-xl border" style={{ background: 'rgba(20,15,8,0.55)', borderColor: 'rgba(245,239,224,0.12)' }} role="group" aria-label="Lighting mood">
                                {(['day', 'evening'] as Mood[]).map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => setMood(m)}
                                        aria-pressed={mood === m}
                                        className="px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest transition-colors"
                                        style={{ background: mood === m ? 'var(--color-brass)' : 'transparent', color: mood === m ? '#fff' : 'rgba(245,239,224,0.7)' }}
                                    >
                                        {m === 'day' ? '☀ Day' : '☾ Evening'}
                                    </button>
                                ))}
                            </div>
                            <IconButton label="Save image" onClick={saveImage}>
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                            </IconButton>
                            <IconButton label="Fullscreen" onClick={toggleFullscreen} className="hidden sm:flex">
                                <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
                            </IconButton>
                        </div>
                    </header>

                    {/* Stop card */}
                    <section className="absolute z-20 left-4 right-4 bottom-20 md:bottom-6 md:left-6 md:right-auto md:w-[400px]" aria-live="polite">
                        <div className="flex gap-1.5 mb-3 overflow-x-auto hide-scrollbar">
                            {tour.stops.map((s, i) => (
                                <button
                                    key={s.id}
                                    onClick={() => { setStop(i); setMoved(false); setAutoplay(false); }}
                                    aria-current={i === stop ? 'step' : undefined}
                                    className="shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-xl border transition-all"
                                    style={{
                                        background: i === stop ? 'rgba(245,239,224,0.95)' : 'rgba(20,15,8,0.55)',
                                        color: i === stop ? 'var(--color-charcoal)' : 'rgba(245,239,224,0.75)',
                                        borderColor: 'rgba(245,239,224,0.12)',
                                    }}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={current.id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                                className="p-5 md:p-6 rounded-3xl backdrop-blur-xl border"
                                style={{ background: 'rgba(20,15,8,0.65)', borderColor: 'rgba(245,239,224,0.12)' }}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-display text-sm tabular-nums" style={{ color: 'var(--color-brass-light)' }}>
                                        {String(stop + 1).padStart(2, '0')} / {String(tour.stops.length).padStart(2, '0')}
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        <SmallBtn label="Previous stop" onClick={() => go(-1)}><path d="M15 18l-6-6 6-6" /></SmallBtn>
                                        <SmallBtn label={autoplay ? 'Pause tour' : 'Play guided tour'} onClick={() => setAutoplay((a) => !a)} active={autoplay}>
                                            {autoplay ? <path d="M10 4H6v16h4zM18 4h-4v16h4z" /> : <path d="M6 4l14 8-14 8z" />}
                                        </SmallBtn>
                                        <SmallBtn label="Next stop" onClick={() => go(1)}><path d="M9 18l6-6-6-6" /></SmallBtn>
                                    </div>
                                </div>
                                <h2 className="font-display text-2xl md:text-3xl font-bold mb-2" style={{ color: '#F5EFE0' }}>{current.label}</h2>
                                <p className="text-sm leading-relaxed" style={{ color: 'rgba(245,239,224,0.7)' }}>{current.description}</p>
                                {moved && (
                                    <button onClick={resetView} className="mt-3 text-[11px] font-bold uppercase tracking-widest underline underline-offset-4" style={{ color: 'var(--color-brass-light)' }}>
                                        Reset view
                                    </button>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </section>

                    {/* Mobile: open configurator */}
                    <button
                        onClick={() => setPanelOpen(true)}
                        className="md:hidden absolute z-20 bottom-4 left-4 right-4 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest text-white"
                        style={{ background: 'linear-gradient(135deg, var(--color-brass), var(--color-brass-dark))' }}
                    >
                        Customise · {formatINR(low)}–{formatINR(high)}
                    </button>

                    {/* Configurator */}
                    <aside
                        data-lenis-prevent
                        className={`absolute z-30 md:z-20 inset-x-0 bottom-0 md:inset-auto md:top-24 md:right-6 md:bottom-6 md:w-[340px] max-h-[78vh] md:max-h-none overflow-y-auto rounded-t-3xl md:rounded-3xl backdrop-blur-xl border transition-transform duration-500 md:translate-y-0 ${panelOpen ? 'translate-y-0' : 'translate-y-full'}`}
                        style={{ background: 'rgba(20,15,8,0.82)', borderColor: 'rgba(245,239,224,0.12)' }}
                        aria-label="Customise this design"
                    >
                        <div className="p-5 md:p-6">
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-[10px] uppercase tracking-[0.3em] font-bold" style={{ color: 'var(--color-brass-light)' }}>Customise</p>
                                <button onClick={() => setPanelOpen(false)} className="md:hidden text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(245,239,224,0.6)' }}>Close</button>
                            </div>
                            <p className="text-xs leading-relaxed mb-6" style={{ color: 'rgba(245,239,224,0.55)' }}>{tour.intro}</p>

                            <div className="sm:hidden flex p-1 rounded-full border mb-6" style={{ borderColor: 'rgba(245,239,224,0.12)' }}>
                                {(['day', 'evening'] as Mood[]).map((m) => (
                                    <button key={m} onClick={() => setMood(m)} aria-pressed={mood === m} className="flex-1 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest" style={{ background: mood === m ? 'var(--color-brass)' : 'transparent', color: mood === m ? '#fff' : 'rgba(245,239,224,0.7)' }}>
                                        {m === 'day' ? '☀ Day' : '☾ Evening'}
                                    </button>
                                ))}
                            </div>

                            {tour.finishes.map((g) => {
                                const active = g.choices.find((c) => c.id === selection[g.id]);
                                return (
                                    <fieldset key={g.id} className="mb-6">
                                        <legend className="flex w-full items-baseline justify-between mb-3">
                                            <span className="text-xs font-bold" style={{ color: '#F5EFE0' }}>{g.label}</span>
                                            <span className="text-[11px]" style={{ color: 'rgba(245,239,224,0.55)' }}>{active?.label}</span>
                                        </legend>
                                        <div className="flex flex-wrap gap-2.5">
                                            {g.choices.map((c) => {
                                                const on = selection[g.id] === c.id;
                                                return (
                                                    <button
                                                        key={c.id}
                                                        onClick={() => setSelection((s) => ({ ...s, [g.id]: c.id }))}
                                                        aria-pressed={on}
                                                        aria-label={`${g.label}: ${c.label}`}
                                                        title={c.label}
                                                        className="relative w-10 h-10 rounded-full transition-transform hover:scale-110"
                                                        style={{
                                                            background: c.swatch,
                                                            boxShadow: on ? '0 0 0 2px #140F08, 0 0 0 4px var(--color-brass-light)' : 'inset 0 0 0 1px rgba(255,255,255,0.15)',
                                                        }}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </fieldset>
                                );
                            })}

                            {tour.toggles.map((t) => (
                                <label key={t.id} className="flex items-center justify-between mb-6 cursor-pointer">
                                    <span className="text-xs font-bold" style={{ color: '#F5EFE0' }}>{t.label}</span>
                                    <span className="relative inline-flex">
                                        <input type="checkbox" className="peer sr-only" checked={!!toggles[t.id]} onChange={(e) => setToggles((s) => ({ ...s, [t.id]: e.target.checked }))} />
                                        <span className="w-11 h-6 rounded-full transition-colors peer-checked:bg-brass peer-focus-visible:ring-2 peer-focus-visible:ring-brass-light" style={{ background: toggles[t.id] ? 'var(--color-brass)' : 'rgba(245,239,224,0.15)' }} />
                                        <span className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform" style={{ transform: toggles[t.id] ? 'translateX(20px)' : 'none' }} />
                                    </span>
                                </label>
                            ))}

                            <div className="pt-5 mt-2 border-t" style={{ borderColor: 'rgba(245,239,224,0.1)' }}>
                                <p className="text-[10px] uppercase tracking-[0.25em] font-bold mb-1" style={{ color: 'rgba(245,239,224,0.5)' }}>Estimate for ~{tour.area} sq.ft</p>
                                <p className="font-display text-4xl font-bold tabular-nums mb-1" style={{ color: '#F5EFE0' }}>
                                    {formatINR(low)} <span className="text-2xl font-light" style={{ color: 'var(--color-brass-light)' }}>–</span> {formatINR(high)}
                                </p>
                                <p className="text-[11px] mb-5" style={{ color: 'rgba(245,239,224,0.45)' }}>Indicative, excl. GST. Exact quote after a free site visit.</p>
                                <a
                                    href={quoteHref}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn-sheen flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-xs font-bold uppercase tracking-widest text-white mb-2"
                                    style={{ background: 'linear-gradient(135deg, var(--color-brass), var(--color-brass-dark))' }}
                                >
                                    Get this design quoted
                                </a>
                                <Link href="/#contact" className="flex items-center justify-center w-full py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest border" style={{ borderColor: 'rgba(245,239,224,0.2)', color: '#F5EFE0' }}>
                                    Book free site visit
                                </Link>
                            </div>
                        </div>
                    </aside>
                    {panelOpen && <button aria-label="Close customiser" className="md:hidden absolute inset-0 z-[25] bg-black/40" onClick={() => setPanelOpen(false)} />}

                    <p className="hidden md:block absolute z-10 bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] pointer-events-none" style={{ color: evening ? 'rgba(245,239,224,0.45)' : 'rgba(20,15,8,0.45)' }}>
                        Drag to look · scroll to zoom · ← → to move
                    </p>
                </>
            )}
        </main>
    );
}

function IconButton({ label, onClick, children, className = '' }: { label: string; onClick: () => void; children: React.ReactNode; className?: string }) {
    return (
        <button onClick={onClick} aria-label={label} title={label} className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-xl border transition-colors hover:bg-white/20 ${className}`} style={{ background: 'rgba(20,15,8,0.55)', borderColor: 'rgba(245,239,224,0.15)', color: '#F5EFE0' }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">{children}</svg>
        </button>
    );
}

function SmallBtn({ label, onClick, children, active = false }: { label: string; onClick: () => void; children: React.ReactNode; active?: boolean }) {
    return (
        <button onClick={onClick} aria-label={label} title={label} className="w-8 h-8 rounded-full flex items-center justify-center border transition-colors" style={{ borderColor: 'rgba(245,239,224,0.18)', background: active ? 'var(--color-brass)' : 'transparent', color: '#F5EFE0' }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">{children}</svg>
        </button>
    );
}
