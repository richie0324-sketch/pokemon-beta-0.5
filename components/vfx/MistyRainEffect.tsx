import React from 'react';
import { ParticleSystem } from './ParticleSystem';

export const MistyRainFilters: React.FC = () => {
    return (
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] animate-pulse pointer-events-none" style={{ animationDuration: '5s' }}></div>
    );
};

export const MistyRainParticles: React.FC = () => {
    return (
        <ParticleSystem 
            count={100} 
            color="#bae6fd" 
            width={1} 
            height={15} 
            duration="1.0s" 
            className="rotate-[10deg] scale-125"
            opacity={0.5}
        />
    );
};