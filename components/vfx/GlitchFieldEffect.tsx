import React, { useState, useEffect } from 'react';

// A noise pattern data URI (base64 of a small noise png)
const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`;

interface Block {
    id: number;
    top: string;
    left: string;
    width: string;
    height: string;
    color: string;
    blendMode: any;
}

export const GlitchFieldFilters: React.FC = () => {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
            {/* 1. Base Darkening & Color Grading */}
            <div className="absolute inset-0 bg-indigo-900/30 mix-blend-hard-light"></div>
            
            {/* 2. CRT Scanlines (Static) */}
            <div className="absolute inset-0" 
                 style={{
                     background: 'repeating-linear-gradient(0deg, transparent 0, transparent 2px, rgba(0,0,0,0.3) 3px)'
                 }}>
            </div>

            {/* 4. Digital Noise Grain */}
            <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay animate-noise-grain"
                 style={{ backgroundImage: NOISE_SVG, filter: 'contrast(150%)' }}>
            </div>

            {/* 7. Occasional Screen Inversion Flash */}
             <div className="absolute inset-0 bg-white/10 mix-blend-difference animate-double-flash" style={{ opacity: 0, animationDuration: '8s' }}></div>
        </div>
    );
};

export const GlitchFieldParticles: React.FC = () => {
    const [blocks, setBlocks] = useState<Block[]>([]);

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout>;
        let isActive = true;

        const loop = () => {
            if (!isActive) return;
            const cooldown = Math.random() * 1000 + 200; 

            timeoutId = setTimeout(() => {
                const count = Math.floor(Math.random() * 4) + 1; 
                const newBlocks: Block[] = Array.from({ length: count }).map((_, i) => {
                    const isVerticalStrip = Math.random() > 0.7; 
                    
                    const w = isVerticalStrip 
                        ? Math.random() * 2 + 0.5 + 'vw' 
                        : Math.random() * 30 + 5 + 'vw';
                    
                    const h = isVerticalStrip 
                        ? Math.random() * 40 + 20 + 'vh' 
                        : Math.random() * 20 + 5 + 'vh';

                    const colors = ['#fff', '#f0f', '#0ff', '#ff0', '#000']; 
                    const blends = ['exclusion', 'difference', 'hard-light', 'overlay'];

                    return {
                        id: Date.now() + i,
                        top: Math.random() * 90 + '%',
                        left: Math.random() * 90 + '%',
                        width: w,
                        height: h,
                        color: colors[Math.floor(Math.random() * colors.length)],
                        blendMode: blends[Math.floor(Math.random() * blends.length)]
                    };
                });

                setBlocks(newBlocks);

                const duration = Math.random() * 600 + 300;
                
                setTimeout(() => {
                    if (isActive) {
                        setBlocks([]);
                        loop(); 
                    }
                }, duration);

            }, cooldown);
        };

        loop();

        return () => {
            isActive = false;
            clearTimeout(timeoutId);
        };
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
            {/* 3. Moving Scanline Bar */}
            <div className="absolute left-0 w-full h-[50px] bg-gradient-to-b from-transparent via-white/10 to-transparent animate-scanline"></div>

            {/* 5. Chromatic Aberration Layers (Full Screen Shifts) */}
            <div className="absolute inset-0 mix-blend-screen opacity-30 animate-glitch-layer text-red-500" style={{ transform: 'translateX(-2px)' }}></div>
            <div className="absolute inset-0 mix-blend-screen opacity-30 animate-glitch-layer text-blue-500" style={{ animationDirection: 'reverse', transform: 'translateX(2px)' }}></div>

            {/* 6. Dynamic Glitch Blocks */}
            {blocks.map((block) => (
                <div 
                    key={block.id}
                    className="absolute shadow-sm"
                    style={{
                        top: block.top,
                        left: block.left,
                        width: block.width,
                        height: block.height,
                        backgroundColor: block.color,
                        mixBlendMode: block.blendMode,
                        opacity: 0.3,
                    }}
                />
            ))}
        </div>
    );
};