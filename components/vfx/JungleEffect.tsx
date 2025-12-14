import React from 'react';
import { ParticleSystem } from './ParticleSystem';

export const JungleFilters: React.FC = () => {
    return (
        <>
            {/* 1. Ambient Green Tint */}
            <div className="absolute inset-0 bg-green-900/30 mix-blend-overlay pointer-events-none"></div>

            {/* 2. Dappled Light / God Rays */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/10 via-transparent to-transparent opacity-50 pointer-events-none"></div>
        </>
    );
};

export const JungleParticles: React.FC = () => {
    return (
        <>
            {/* 3. Falling Leaves (Dark Green) */}
            <ParticleSystem 
                count={50} 
                color="#15803d" // green-700
                width={6} 
                height={6} 
                duration="12s" 
                className="rounded-tr-full rounded-bl-full opacity-80 rotate-45"
                opacity={0.8}
            />

            {/* 4. Falling Leaves (Lighter Green/Lime) */}
            <ParticleSystem 
                count={30} 
                color="#84cc16" // lime-500
                width={5} 
                height={5} 
                duration="15s" 
                className="rounded-tl-full rounded-br-full opacity-60 -rotate-12"
                opacity={0.6}
            />

            {/* 5. Spores/Fireflies */}
            <ParticleSystem 
                count={100} 
                color="#fef08a" // yellow-200
                width={2} 
                height={2} 
                duration="25s" 
                opacity={0.4}
            />
        </>
    );
};