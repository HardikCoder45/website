// Section header styled like the title block of an architectural drawing sheet.
interface SheetHeaderProps {
    sheet: string;          // e.g. "A-03"
    eyebrow: string;        // e.g. "Construction packages"
    title: React.ReactNode;
    intro?: React.ReactNode;
    dark?: boolean;
}

export default function SheetHeader({ sheet, eyebrow, title, intro, dark = false }: SheetHeaderProps) {
    const mute = dark ? 'var(--color-ash)' : 'var(--color-mute)';
    const line = dark ? 'var(--color-line-dark)' : 'var(--color-border-strong)';
    return (
        <header className="grid md:grid-cols-[1fr_auto] gap-8 md:gap-16 items-end pb-10 md:pb-14 mb-12 md:mb-16 border-b" style={{ borderColor: line }}>
            <div>
                <p className="label mb-5" style={{ color: mute }}>{eyebrow}</p>
                <h2 className="display" style={{ fontSize: 'clamp(46px, 7vw, 120px)' }}>{title}</h2>
                {intro && <p className="mt-6 max-w-xl text-base leading-relaxed" style={{ color: mute }}>{intro}</p>}
            </div>
            <dl className="hidden md:grid grid-cols-2 mono text-[10px] uppercase tracking-[0.08em] border" style={{ borderColor: line, color: mute }}>
                <div className="px-3 py-2 border-r border-b" style={{ borderColor: line }}><dt className="opacity-70">Sheet</dt><dd className="text-sm mt-0.5" style={{ color: dark ? '#F1EEE7' : 'var(--color-charcoal)' }}>{sheet}</dd></div>
                <div className="px-3 py-2 border-b" style={{ borderColor: line }}><dt className="opacity-70">Rev</dt><dd className="text-sm mt-0.5" style={{ color: dark ? '#F1EEE7' : 'var(--color-charcoal)' }}>2026.1</dd></div>
                <div className="px-3 py-2 col-span-2"><dt className="opacity-70">Drawn by</dt><dd className="mt-0.5" style={{ color: dark ? '#F1EEE7' : 'var(--color-charcoal)' }}>AMS Interiors &amp; Construction</dd></div>
            </dl>
        </header>
    );
}
