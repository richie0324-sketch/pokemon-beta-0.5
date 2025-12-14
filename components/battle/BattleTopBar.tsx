import React, { memo } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { GameState } from '../../types';
import { audioService } from '../../services/audioService';
import { logic } from '../../hooks/useGameLogic';
import { Pause, Briefcase, Monitor } from 'lucide-react';
import { LinePokedexIcon, LinePokeballIcon } from './BattleAssets';
import { useBattleStore } from '../../store/useBattleStore';

interface BattleTopBarProps {
    className?: string;
}

export const BattleTopBar = memo(({ className }: BattleTopBarProps) => {
    const { setGameState, setBackpackTab } = useGameStore.getState();
    const isTrainerBattle = useBattleStore(state => state.isTrainerBattle);

    const onPause = () => setGameState(GameState.PAUSED);
    const onOpenBag = () => {
        audioService.playSfx('click');
        logic.syncPlayerToCaught();
        setBackpackTab('ITEMS');
        setGameState(GameState.BACKPACK, GameState.BATTLE_COMBAT);
    };
    const onOpenTeam = () => {
        audioService.playSfx('click');
        logic.syncPlayerToCaught();
        setBackpackTab('TEAM');
        setGameState(GameState.BACKPACK, GameState.BATTLE_COMBAT);
    };
    const onOpenDex = () => {
        audioService.playSfx('click');
        setGameState(GameState.POKEDEX, GameState.BATTLE_COMBAT);
    };
    const onOpenPC = () => {
        audioService.playSfx('click');
        setGameState(GameState.PC_STORAGE, GameState.BATTLE_COMBAT);
    };

    const positionClass = className || "top-3 left-3";

    // Increased to z-40 to be above HUDs (z-30) and Weather (z-20)
    return (
        <div className={`absolute z-40 flex items-center gap-2 md:gap-3 transition-all duration-300 ${positionClass}`}>
            <button onClick={() => { audioService.playSfx('click'); onPause(); }} className="w-9 h-9 md:w-12 md:h-12 bg-white/20 hover:bg-white/40 backdrop-blur rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white/20 transition-all active:scale-95">
                <Pause size={18} className="md:w-6 md:h-6" fill="currentColor" />
            </button>
            <button onClick={onOpenBag} className="w-9 h-9 md:w-12 md:h-12 bg-blue-600/80 hover:bg-blue-500 backdrop-blur rounded-full flex items-center justify-center text-white shadow-lg border-2 border-blue-400/50 transition-all active:scale-95">
                <Briefcase size={18} className="md:w-6 md:h-6" />
            </button>
            <button onClick={onOpenTeam} className="w-9 h-9 md:w-12 md:h-12 bg-green-600/80 hover:bg-green-500 backdrop-blur rounded-full flex items-center justify-center text-white shadow-lg border-2 border-green-400/50 transition-all active:scale-95 p-1">
                <LinePokeballIcon size={18} />
            </button>
            <button onClick={onOpenDex} className="w-9 h-9 md:w-12 md:h-12 bg-red-600/80 hover:bg-red-500 backdrop-blur rounded-full flex items-center justify-center text-white shadow-lg border-2 border-red-400/50 transition-all active:scale-95 p-1 md:p-1.5">
                <LinePokedexIcon size={18} />
            </button>
            <button 
                onClick={onOpenPC} 
                disabled={isTrainerBattle}
                className={`w-9 h-9 md:w-12 md:h-12 backdrop-blur rounded-full flex items-center justify-center text-white shadow-lg border-2 transition-all active:scale-95
                    ${isTrainerBattle 
                        ? 'bg-slate-700/80 border-slate-500/50 cursor-not-allowed opacity-60' 
                        : 'bg-purple-600/80 hover:bg-purple-500 border-purple-400/50'}
                `}
            >
                <Monitor size={18} className="md:w-6 md:h-6" />
            </button>
        </div>
    );
});