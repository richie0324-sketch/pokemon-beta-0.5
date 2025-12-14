
import React, { memo } from 'react';
import { PixelPokeball } from './BattleAssets';

export const EnemyTeamStatus = memo(({ total, current, className }: { total: number, current: number, className?: string }) => {
    const positionClass = className || "top-10 left-1/2 -translate-x-1/2";
    
    return (
        <div className={`absolute z-40 flex gap-1 bg-black/40 px-2 py-1 rounded-full backdrop-blur border border-white/10 transition-all duration-300 ${positionClass}`}>
            {Array.from({ length: total }).map((_, i) => (
                <div 
                    key={i} 
                    className={`w-3 h-3 rounded-full border border-black transition-colors duration-500 ${i < current ? 'bg-gray-600' : 'bg-red-500'}`}
                />
            ))}
        </div>
    );
});

export const BattleTimer = ({ timeRemaining }: { timeRemaining: number | null }) => {
    if (timeRemaining === null) return null;
    const pct = (timeRemaining / 30) * 100;
    const isCritical = timeRemaining <= 5;
    
    return (
        <div className="absolute top-0 left-0 w-full h-2 z-[60] shadow-md bg-slate-800">
            <div 
                className={`h-full transition-all duration-1000 ease-linear ${isCritical ? 'bg-red-600 animate-pulse' : 'bg-yellow-400'}`} 
                style={{ width: `${pct}%` }} 
            />
        </div>
    );
};

export const MasterBallAnimation = memo(({ isActive }: { isActive: boolean }) => {
    if (!isActive) return null;
    return (
        <div className="absolute inset-0 z-[100] pointer-events-none flex items-center justify-center animate-cosmic-flash">
            <div className="w-full h-full absolute bg-purple-900/30 mix-blend-overlay"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <PixelPokeball className="w-48 h-48 drop-shadow-[0_0_50px_rgba(147,51,234,1)] animate-master-throw" type="master-ball" />
            </div>
        </div>
    );
});
