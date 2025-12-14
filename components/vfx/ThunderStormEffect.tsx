import React from 'react';
import { ParticleSystem } from './ParticleSystem';

export const ThunderStormFilters: React.FC = () => {
    return (
        <>
            <div className="absolute inset-0 bg-slate-900/50 mix-blend-multiply pointer-events-none"></div>
            {/* Realistic Flash System - Moved here to be part of background filter layer */}
            <div className="absolute inset-0 bg-white animate-double-flash mix-blend-overlay pointer-events-none" style={{ animationDuration: '11s' }}></div>
            <div className="absolute inset-0 bg-white animate-double-flash mix-blend-overlay pointer-events-none" style={{ animationDuration: '17s', animationDelay: '5s', opacity: 0.5 }}></div>
        </>
    );
};

export const ThunderStormParticles: React.FC = () => {
    return (
        <>
            {/* Fast Heavy Rain Streaks */}
            <ParticleSystem 
                count={300} 
                color="#60a5fa" 
                width={1} 
                height={40} 
                duration="0.5s" 
                className="rotate-[15deg] scale-150" 
                opacity={0.7}
            />
            {/* Background Layer */}
            <ParticleSystem 
                count={150} 
                color="#3b82f6" 
                width={1} 
                height={25} 
                duration="0.7s" 
                className="rotate-[15deg] scale-150"
                opacity={0.4}
            />
        </>
    );
};