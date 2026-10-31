// AMS Interiors mark: an "A" drawn as a gable roof on a ground line, the
// crossbar as the first-floor slab and a brass window under the ridge.
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
            <span className="flex items-baseline gap-1.5 leading-none">
                <span className="font-display font-bold text-[30px] md:text-[32px] tracking-[-0.03em]" style={{ lineHeight: 0.8 }}>AMS</span>
                {!compact && <span className="font-display font-semibold text-[12px] md:text-[13px] tracking-[0.3em] uppercase" style={{ color: 'var(--color-brass)' }}>Interiors</span>}
            </span>
        </span>
    );
}
