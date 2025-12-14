
import React, { memo } from 'react';
import { useShallow } from 'zustand/shallow';
import { useBattleStore } from '../../store/useBattleStore';
import { useGameStore } from '../../store/useGameStore';
import { PixelPokeball } from './BattleAssets';
import { Sword, Shield, CloudRain, Sun, Hexagon, Ghost } from 'lucide-react';

export const BuffDisplay = memo(() => {
    const { preppedBall, battleModifiers } = useBattleStore(useShallow(state => ({
        preppedBall: state.preppedBall,
        battleModifiers: state.battleModifiers
    })));
    
    const { activeBuffs, encounterModifier } = useGameStore(useShallow(state => ({
        activeBuffs: state.activeBuffs,
        encounterModifier: state.encounterModifier
    })));

    const activeBallType = preppedBall?.id;

    // Set z-index to 30 to sit above weather (z-20)
    // Updated position: 
    // Mobile: bottom-22 -> bottom-24 (Up 8px)
    // Desktop: bottom-28 -> bottom-[7.5rem] (Up 8px), left-80 -> left-[21rem] (Right 16px)
    return (
        <div className="absolute bottom-24 left-32 md:bottom-[7.5rem] md:left-[21rem] z-30 flex flex-col items-start gap-1">
            <div className="flex items-end gap-1 md:gap-2">
                {activeBallType && activeBallType !== 'poke-ball' && (
                    <div className="flex items-center gap-1 bg-slate-900/80 p-0.5 pr-2 rounded-full border border-yellow-400/50 animate-pulse">
                        <div className="bg-yellow-400/20 p-0.5 rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center">
                            <PixelPokeball className="w-full h-full" type={activeBallType} />
                        </div>
                        <span className="text-[8px] font-bold text-yellow-400">READY</span>
                    </div>
                )}
                <div className="flex gap-1">
                    {battleModifiers.atk > 1.0 && (
                        <div className="bg-red-600/90 text-white px-2 py-1 rounded border border-red-400 shadow-md flex items-center gap-1 animate-bounce">
                            <Sword size={10} /> <span className="text-[9px] font-bold">ATK x{battleModifiers.atk}</span>
                        </div>
                    )}
                    {battleModifiers.def < 1.0 && (
                        <div className="bg-blue-600/90 text-white px-2 py-1 rounded border border-blue-400 shadow-md flex items-center gap-1 animate-bounce" style={{ animationDelay: '0.1s' }}>
                            <Shield size={10} /> <span className="text-[9px] font-bold">DEF UP</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Weather / Terrain Effects */}
            {encounterModifier && (
                <div className="flex items-center gap-1 bg-purple-900/80 px-2 py-1 rounded border border-purple-400 shadow-md animate-pulse">
                    {encounterModifier.label === 'THUNDERSTORM' && <CloudRain size={10} className="text-blue-300"/>}
                    {encounterModifier.label === 'HARSH SUN' && <Sun size={10} className="text-orange-300"/>}
                    {encounterModifier.label === 'JUNGLE' && <Hexagon size={10} className="text-green-300"/>}
                    {encounterModifier.label === 'FOG' && <Ghost size={10} className="text-gray-300"/>}
                    <span className="text-[9px] font-bold text-white uppercase">{encounterModifier.label}</span>
                </div>
            )}

            {/* Special Buffs */}
            <div className="flex flex-wrap gap-1 max-w-[150px]">
                {activeBuffs['efficiency_v'] > 0 && (
                    <div className="bg-green-700/80 text-white px-2 py-0.5 rounded text-[8px] border border-green-500">
                        EFFICIENCY V
                    </div>
                )}
                {activeBuffs['sharpness_iv'] > 0 && (
                    <div className="bg-red-700/80 text-white px-2 py-0.5 rounded text-[8px] border border-red-500">
                        SHARPNESS IV
                    </div>
                )}
                {activeBuffs['lag_switch'] > 0 && (
                    <div className="bg-yellow-700/80 text-white px-2 py-0.5 rounded text-[8px] border border-yellow-500">
                        LAG SWITCH
                    </div>
                )}
                {activeBuffs['bush_camp'] > 0 && (
                    <div className="bg-green-800/80 text-white px-2 py-0.5 rounded text-[8px] border border-green-600">
                        BUSH CAMP
                    </div>
                )}
                {activeBuffs['gravity_coil'] > 0 && (
                    <div className="bg-blue-700/80 text-white px-2 py-0.5 rounded text-[8px] border border-blue-500">
                        GRAVITY COIL
                    </div>
                )}
            </div>
        </div>
    );
});
