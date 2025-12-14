
import React, { useMemo } from 'react';

interface ParticleSystemProps { 
    count: number;
    color: string;
    width?: number;
    height?: number;
    duration?: string;
    className?: string;
    opacity?: number;
    direction?: 'vertical' | 'horizontal';
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({ 
    count, 
    color, 
    width = 2, 
    height = 2, 
    duration = '1s', 
    className = '',
    opacity = 1.0,
    direction = 'vertical'
}) => {
    // Generate static random coordinates for shadows (0 to 100vw/vh)
    const shadow = useMemo(() => Array.from({ length: count }).map(() => {
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        return `${x}vw ${y}vh 0 0px ${color}`;
    }).join(','), [count, color]);

    const baseStyle = {
        width: `${width}px`,
        height: `${height}px`,
        boxShadow: shadow,
        animationDuration: duration,
        opacity: opacity,
        backfaceVisibility: 'hidden' as any
    };

    const animClass = direction === 'horizontal' ? 'animate-weather-slide' : 'animate-weather-fall';
    
    // For seamless looping:
    // Layer 1 starts at 0 and moves to +100vh (or +100vw)
    // Layer 2 starts at -100vh (or -100vw) and moves to 0
    const offsetStyle = direction === 'horizontal' ? { left: '-100vw', top: 0 } : { top: '-100vh', left: 0 };

    return (
        <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
            {/* Layer 1 */}
            <div className={`absolute top-0 left-0 w-full h-full ${animClass}`} style={baseStyle}></div>
            {/* Layer 2 */}
            <div className={`absolute w-full h-full ${animClass}`} style={{ ...baseStyle, ...offsetStyle }}></div>
        </div>
    );
};
