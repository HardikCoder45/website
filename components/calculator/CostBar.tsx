'use client';

interface CostBarProps {
    materialsPct: number;
    laborPct: number;
    finishingPct: number;
}

export default function CostBar({ materialsPct, laborPct, finishingPct }: CostBarProps) {
    return (
        <div className="w-full">
            <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-mute mb-2">
                <span>Cost Breakdown</span>
                <span>100% Transparent</span>
            </div>
            <div className="h-4 rounded-full overflow-hidden flex" style={{ background: 'var(--color-surface)' }}>
                <div
                    className="h-full cost-bar-segment"
                    style={{ width: `${materialsPct}%`, background: 'var(--color-brass)' }}
                    title="Materials"
                />
                <div
                    className="h-full cost-bar-segment"
                    style={{ width: `${laborPct}%`, background: 'var(--color-brass-dark)' }}
                    title="Labor"
                />
                <div
                    className="h-full cost-bar-segment"
                    style={{ width: `${finishingPct}%`, background: 'var(--color-charcoal)' }}
                    title="Finishing & Hardware"
                />
            </div>
            <div className="flex flex-wrap gap-4 mt-3 text-xs text-mute font-medium">
                <div className="flex items-center gap-1.5 border border-transparent rounded px-1">
                    <span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-brass)' }} />
                    Materials {materialsPct}%
                </div>
                <div className="flex items-center gap-1.5 border border-transparent rounded px-1">
                    <span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-brass-dark)' }} />
                    Labor {laborPct}%
                </div>
                <div className="flex items-center gap-1.5 border border-transparent rounded px-1">
                    <span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-charcoal)' }} />
                    Hardware & Polish {finishingPct}%
                </div>
            </div>
        </div>
    );
}
