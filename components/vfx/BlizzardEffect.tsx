import React from 'react';
import { ParticleSystem } from './ParticleSystem';

export const BlizzardFilters: React.FC = () => {
    return <div className="absolute inset-0 bg-white/10 mix-blend-screen pointer-events-none"></div>;
};

export const BlizzardParticles: React.FC = () => {
    return (
        <>
            {/* Background small flakes */}
            <ParticleSystem count={150} color="#FFF" width={2} height={2} duration="8s" opacity={0.8} />
            {/* Foreground large flakes */}
            <ParticleSystem count={50} color="#FFF" width={4} height={4} duration="5s" opacity={0.6} />
        </>
    );
};