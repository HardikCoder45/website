'use client';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';

interface BeforeAfterProps {
    beforeImg: string;
    afterImg: string;
    beforeAlt?: string;
    afterAlt?: string;
    position?: number;
}

export default function BeforeAfter({ beforeImg, afterImg, beforeAlt = "Before", afterAlt = "After", position = 65 }: BeforeAfterProps) {
    return (
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border" style={{ borderColor: 'var(--color-border)' }}>
            <ReactCompareSlider
                boundsPadding={0}
                position={position}
                itemOne={<ReactCompareSliderImage src={beforeImg} alt={beforeAlt} />}
                itemTwo={<ReactCompareSliderImage src={afterImg} alt={afterAlt} />}
                handle={
                    <div className="absolute inset-y-0 flex items-center justify-center ba-handle shadow-2xl">
                        <div className="ba-knob" aria-label="Slider handle">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="15 18 9 12 15 6" />
                                <polyline points="9 18 15 12 9 6" className="ml-4" /> {/* Double arrow representation */}
                            </svg>
                        </div>
                    </div>
                }
            />
            {/* Labels */}
            <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded bg-black/60 backdrop-blur-md text-white text-xs tracking-widest font-bold uppercase shadow-lg border border-white/20">
                Before
            </div>
            <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded bg-charcoal/80 backdrop-blur-md text-white text-xs tracking-widest font-bold uppercase shadow-lg border border-white/20" style={{ background: 'var(--color-brass)' }}>
                After
            </div>
        </div>
    );
}
