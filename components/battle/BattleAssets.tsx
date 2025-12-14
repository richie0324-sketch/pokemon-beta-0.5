
import React, { memo } from 'react';
import { PokemonRarity } from '../../types';
import { CATCH_RATES } from '../../constants';
import { Star, Crown } from 'lucide-react';

export const PixelPokeball = memo(({ className, type = 'poke-ball' }: { className?: string, type?: string }) => {
    let topColor = '#ef4444'; // Red
    let topHighlight = '#fca5a5';
    let bandColor = '#1f2937'; // Black/Grey
    
    if (type === 'great-ball') { topColor = '#3b82f6'; topHighlight = '#93c5fd'; } 
    else if (type === 'ultra-ball') { topColor = '#1f2937'; topHighlight = '#374151'; } 
    else if (type === 'master-ball') { topColor = '#9333ea'; topHighlight = '#d8b4fe'; }

    return (
        <svg viewBox="0 0 16 16" className={className} shapeRendering="crispEdges">
            <path d="M5 1h6v1h2v1h1v2h1v6h-1v2h-1v1h-2v1h-6v-1h-2v-1h-1v-2h-1v-6h1v-2h1v-1h2v-1z" fill={bandColor} />
            <path d="M5 14h6v-1h2v-1h1v-3h-4v1h-4v-1h-4v3h1v1h2v1z" fill="white" />
            <path d="M3 11h2v1h6v-1h2v-1h-10v1z" fill="#e5e7eb" opacity="0.5" /> 
            <path d="M5 2h6v1h2v1h1v3h-4v-1h-4v1h-4v-3h1v-1h2v-1z" fill={topColor} />
            <path d="M5 2h2v1h-2z" fill={topHighlight} opacity="0.6"/>
            <path d="M11 4h1v2h-1z" fill={topHighlight} opacity="0.4"/>
            {type === 'great-ball' && <><path d="M4 3h1v3h-1z" fill="#ef4444" /><path d="M11 3h1v3h-1z" fill="#ef4444" /></>}
            {type === 'ultra-ball' && <><path d="M4 3h3v1h-3z" fill="#eab308" /><path d="M9 3h3v1h-3z" fill="#eab308" /></>}
            {type === 'master-ball' && <><path d="M4 3h1v1h1v1h-2z" fill="#ec4899" /><path d="M10 5h1v-1h1v-1h-2z" fill="#ec4899" /><path d="M7 3h2v1h-2z" fill="#ec4899" /></>}
            <path d="M1 8h14v1h-14z" fill={bandColor} />
            <path d="M6 7h4v4h-4z" fill={bandColor} />
            <path d="M7 8h2v2h-2z" fill="white" />
            <path d="M8 9h1v1h-1z" fill="#9ca3af" />
        </svg>
    );
});

export const LinePokedexIcon = ({ size = 24 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="3" />
        <path d="M8 6h8" /><path d="M8 10h8" /><path d="M8 14h8" /><circle cx="12" cy="18" r="1" />
    </svg>
);

export const LinePokeballIcon = ({ size = 24 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

export const getHpColor = (curr: number, max: number) => {
    const pct = (curr / max) * 100;
    if (pct < 20) return 'bg-red-500';
    if (pct < 50) return 'bg-yellow-400';
    return 'bg-green-500';
};

export const renderRarityIcon = (rarity: PokemonRarity) => {
    switch (rarity) {
        case 'Common': return null;
        case 'Rare': return <Star size={12} className="text-blue-400 fill-blue-400 drop-shadow-sm" />;
        case 'Elite': return <Star size={12} className="text-purple-400 fill-purple-400 drop-shadow-sm" />;
        case 'Ultra': return <Star size={12} className="text-red-500 fill-red-500 drop-shadow-sm" />;
        case 'Legendary': return <Crown size={14} className="text-yellow-400 fill-yellow-400 drop-shadow-sm animate-pulse" />;
        default: return null;
    }
};

export const getBaseCatchRateLabel = (rarity: PokemonRarity) => {
    const rate = CATCH_RATES[rarity];
    if (rate >= 1.0) return { label: "Easy (100%)", color: "text-green-400" };
    if (rate >= 0.7) return { label: "Normal (70-90%)", color: "text-blue-400" };
    if (rate >= 0.4) return { label: "Hard (40-60%)", color: "text-yellow-400" };
    return { label: "Extreme (20%)", color: "text-red-500" };
};
