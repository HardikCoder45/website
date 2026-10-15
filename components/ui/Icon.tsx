import type { ReactNode } from 'react';

const paths: Record<string, ReactNode> = {
    factory: <><path d="M2 20h20M4 20V10l5 3V10l5 3V6l6 4v10" /><path d="M8 20v-3M12 20v-3M16 20v-3" /></>,
    cube: <><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" /></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></>,
    receipt: <><path d="M4 2v20l3-2 3 2 2-2 2 2 3-2 3 2V2l-3 2-3-2-2 2-2-2-3 2z" /><path d="M8 9h8M8 13h6" /></>,
    clock: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    arrow: <path d="M5 12h14M12 5l7 7-7 7" />,
};

export default function Icon({ name, size = 22, className }: { name: string; size?: number; className?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
            {paths[name]}
        </svg>
    );
}
