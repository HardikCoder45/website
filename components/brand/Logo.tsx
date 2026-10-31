// AMS mark: an "A" drawn as a gable roof on a ground line, with the crossbar as
// the first-floor slab and a brick-red window under the ridge.
interface MarkProps {
    size?: number;
    className?: string;
    accent?: string;
    title?: string;
}

export function LogoMark({ size = 32, className, accent = 'var(--color-brass)', title }: MarkProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} role={title ? 'img' : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
            {title && <title>{title}</title>}
            <path d="M10 39.6 L24 10 L38 39.6" stroke="currentColor" strokeWidth="3.4" strokeLinejoin="miter" strokeMiterlimit={8} />
            <path d="M15.6 27 H32.4" stroke="currentColor" strokeWidth="3.4" />
            <rect x="21.8" y="20.4" width="4.4" height="4.4" fill={accent} />
            <path d="M5 39.6 H43" stroke="currentColor" strokeWidth="2" />
        </svg>
    );
}

export function Logo({ compact = false, className = '' }: { compact?: boolean; className?: string }) {
    return (
        <span className={`inline-flex items-center gap-3 ${className}`}>
            <LogoMark size={compact ? 28 : 34} />
            <span className="flex flex-col leading-none">
                <span className="display text-[26px] md:text-[28px] tracking-[0.02em]" style={{ lineHeight: 0.85 }}>AMS</span>
                {!compact && <span className="mono text-[8.5px] tracking-[0.14em] uppercase mt-1 opacity-70">Interiors &amp; Construction</span>}
            </span>
        </span>
    );
}
