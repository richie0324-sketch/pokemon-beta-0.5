import React from 'react';
import { ParticleSystem } from './ParticleSystem';

export const SandstormFilters: React.FC = () => {
    return <div className="absolute inset-0 bg-yellow-900/30 mix-blend-multiply pointer-events-none"></div>;
};

export const SandstormParticles: React.FC = () => {
    return (
        <ParticleSystem 
            count={400} 
            color="#d6d3d1" 
            width={4} 
            height={2} 
            duration="0.4s" 
            className="scale-110" 
            opacity={0.6}
            direction='horizontal'
        />
    );
};