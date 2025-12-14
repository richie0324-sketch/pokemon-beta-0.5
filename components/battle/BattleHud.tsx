
import React, { memo } from 'react';
import { Pokemon } from '../../types';
import { TYPE_COLORS } from '../../constants';
import { getHpColor, renderRarityIcon } from './BattleAssets';
import { Timer } from 'lucide-react';

export const TurnCounter = memo(({ count }: { count: number }) => (
    <div className="absolute top-12 right-3 z-40 flex items-center gap-1 bg-black/30 px-2 py-1 rounded text-white border border-white/10 shadow-sm backdrop-blur-sm">
        <Timer size={12} className="text-slate-300" />
        <span className="font-mono text-[10px] md:text-xs font-bold tracking-wider text-slate-200">TURN {count}</span>
    </div>
));

interface HudProps {
    pokemon: Pokemon;
    className?: string;
}

export const EnemyHud = memo(({ pokemon, className }: HudProps) => {
    const positionClass = className || "top-10 right-32 md:top-16 md:right-80";

    return (
        // Increased z-index to z-30 to float ABOVE weather effects (z-20)
        <div className={`absolute bg-white/90 p-2 md:p-3 rounded-xl border-b-4 border-r-4 border-slate-700 shadow-xl min-w-[140px] md:min-w-[200px] z-30 pop-in transform translate-x-4 md:translate-x-0 transition-all duration-300 ${positionClass}`}>
            <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-bold text-slate-800 uppercase text-xs md:text-sm tracking-wider truncate">
                        {pokemon.name}
                    </span>
                    <span className={`text-[8px] px-1.5 py-0.5 rounded text-white font-bold tracking-wider uppercase shadow-sm ${TYPE_COLORS[pokemon.type]}`}>
                        {pokemon.type}
                    </span>
                    {renderRarityIcon(pokemon.rarity)}
                </div>
                <span className="text-[10px] md:text-xs text-slate-500 font-bold ml-1.5 whitespace-nowrap">
                    Lv.{pokemon.level}
                </span>
            </div>
            
            <div className="w-full bg-slate-300 h-1.5 md:h-2 rounded-full overflow-hidden border border-slate-400">
                <div className={`h-full transition-all duration-500 ${getHpColor(pokemon.currHp, pokemon.maxHp)}`} style={{ width: `${(pokemon.currHp / pokemon.maxHp) * 100}%` }} />
            </div>
        </div>
    );
});

export const PlayerHud = memo(({ pokemon }: { pokemon: Pokemon }) => (
    // Increased z-index to z-30 to float ABOVE weather effects (z-20)
    // Updated position: md:left-80 -> md:left-[21rem] (Right 16px)
    <div className="absolute bottom-4 left-32 md:bottom-8 md:left-[21rem] bg-white/90 p-2 md:p-3 rounded-xl border-b-4 border-r-4 border-slate-700 shadow-xl min-w-[150px] md:min-w-[220px] pop-in z-30">
        <div className="flex justify-between items-center mb-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-bold text-slate-800 uppercase text-xs md:text-sm tracking-wider truncate">
                    {pokemon.name}
                </span>
                <span className={`text-[8px] px-1.5 py-0.5 rounded text-white font-bold tracking-wider uppercase shadow-sm ${TYPE_COLORS[pokemon.type]}`}>
                    {pokemon.type}
                </span>
                {renderRarityIcon(pokemon.rarity)}
            </div>
            <span className="text-[10px] md:text-xs text-slate-500 font-bold ml-1.5 whitespace-nowrap">
                Lv.{pokemon.level}
            </span>
        </div>

        {/* HP BAR */}
        <div className="w-full bg-slate-300 h-1.5 md:h-2 rounded-full overflow-hidden mb-1 border border-slate-400 relative">
            <div className={`h-full transition-all duration-500 ${getHpColor(pokemon.currHp, pokemon.maxHp)}`} style={{ width: `${(pokemon.currHp / pokemon.maxHp) * 100}%` }} />
        </div>
        <div className="text-right text-[8px] md:text-[10px] font-mono text-slate-500 mb-1">HP {Math.ceil(pokemon.currHp)}/{pokemon.maxHp}</div>
        
        {/* EXP BAR */}
        <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
            <div className="h-full bg-blue-400 transition-all duration-500" style={{ width: `${(pokemon.exp / pokemon.maxExp) * 100}%` }} />
        </div>
    </div>
));
