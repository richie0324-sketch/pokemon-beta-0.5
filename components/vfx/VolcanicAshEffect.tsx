import React from 'react';
import { ParticleSystem } from './ParticleSystem';

export const VolcanicAshFilters: React.FC = () => {
    return (
        <>
            <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 to-transparent animate-heat-haze pointer-events-none"></div>
            <div className="absolute inset-0 bg-orange-950/30 mix-blend-multiply pointer-events-none"></div>
        </>
    );
};

export const VolcanicAshParticles: React.FC = () => {
    return (
        <>
            <ParticleSystem count={100} color="#111" width={3} height={3} duration="6s" opacity={0.7} />
            <ParticleSystem count={50} color="#333" width={5} height={5} duration="4s" opacity={0.5} />
        </>
    );
};