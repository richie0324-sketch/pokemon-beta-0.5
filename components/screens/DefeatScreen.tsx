
import React from 'react';
import { useShallow } from 'zustand/shallow';
import { audioService } from '../../services/audioService';
import { useGameStore } from '../../store/useGameStore';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useBattleStore } from '../../store/useBattleStore';
import { logic } from '../../hooks/useGameLogic';
import { AlertOctagon, HeartPulse, ArrowRight, ShieldAlert, LogOut, Backpack } from 'lucide-react';
import { GameState } from '../../types';

// --- SUB COMPONENTS ---

const WipeoutView = () => {
    const handleRescue = () => {
        audioService.playSfx('click');
        logic.enterRescueCenter();
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden font-mono text-white">
             {/* Background Effects */}
             <div className="absolute inset-0 bg-red-950/30 z-0"></div>
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10 z-0"></div>
             
             <div className="relative z-10 w-full max-w-lg text-center space-y-8 animate-in zoom-in-95 duration-300">
                 <div className="flex justify-center mb-4">
                    <div className="relative">
                        <div className="absolute inset-0 bg-red-500 blur-xl opacity-50 animate-pulse"></div>
                        <AlertOctagon size={100} className="text-red-500 fill-red-950 relative z-10" />
                    </div>
                 </div>
                 
                 <div className="space-y-2">
                     <h1 className="text-5xl md:text-6xl font-pixel text-red-500 tracking-widest drop-shadow-[0_0_25px_rgba(220,38,38,0.6)]">
                         CRITICAL
                     </h1>
                     <p className="text-red-400 font-bold text-xl uppercase tracking-[0.5em] border-y-2 border-red-900/50 py-3 inline-block w-full">
                         SYSTEM FAILURE
                     </p>
                 </div>

                 <div className="bg-red-950/40 border border-red-800/50 p-6 rounded-xl backdrop-blur-sm shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                     <p className="text-red-200 mb-4 text-sm md:text-base leading-relaxed font-bold">
                         All available Pokemon have fainted.
                     </p>
                     <p className="text-slate-400 text-xs">
                         Immediate emergency evacuation required.
                     </p>
                 </div>

                 <button 
                    onClick={handleRescue}
                    className="group w-full py-5 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold rounded-xl border-b-4 border-red-900 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                 >
                    <ShieldAlert className="group-hover:animate-ping" size={20} />
                    <span className="tracking-wider">INITIATE RESCUE</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                 </button>
             </div>
        </div>
    );
};

const SwitchPokemonView = ({ pokemonName }: { pokemonName: string }) => {
    const handleOpenBag = () => {
        audioService.playSfx('click');
        logic.syncPlayerToCaught(); 
        useGameStore.getState().setBackpackTab('TEAM');
        useGameStore.getState().setGameState(GameState.BACKPACK, GameState.DEFEAT);
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8 text-white text-center">
             <div className="animate-pulse mb-8">
                 <HeartPulse size={64} className="text-yellow-500 mx-auto" />
             </div>
             <h2 className="text-4xl font-pixel text-yellow-400 mb-4">POKEMON DOWN!</h2>
             <p className="text-slate-300 mb-8 max-w-md">
                 {pokemonName} has fainted, but you still have healthy Pokemon in your party!
             </p>
             <button 
                onClick={handleOpenBag}
                className="w-full max-w-xs py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-2"
             >
                <Backpack size={20} /> SWITCH POKEMON
             </button>
        </div>
    );
};

const EscapedView = () => {
    const { enemyPokemon } = useBattleStore(useShallow(state => ({
        enemyPokemon: state.enemyPokemon
    })));

    const handleFindNew = () => {
        audioService.playSfx('click');
        logic.findWildPokemon(0, undefined, true);
    };

    return (
        <div className="min-h-screen bg-orange-900 flex flex-col items-center justify-center p-8 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.2),transparent)] pointer-events-none"></div>
            
            <div className="relative z-10 animate-pop-in">
                <LogOut size={64} className="text-white mx-auto mb-6 opacity-80" />
                <h2 className="text-5xl md:text-7xl font-pixel mb-6 drop-shadow-xl">ESCAPED!</h2>
                
                <div className="bg-black/30 p-6 rounded-xl backdrop-blur-sm max-w-md w-full mb-8 border border-white/10 mx-auto">
                    <p className="text-lg font-bold text-orange-200">
                        You ran away safely from {enemyPokemon?.name}!
                    </p>
                </div>

                <button 
                    onClick={handleFindNew}
                    className="w-full max-w-xs py-4 bg-white text-black font-bold rounded-xl shadow-xl hover:scale-105 transition-transform text-lg flex items-center justify-center gap-2 border-b-4 border-slate-300 active:border-b-0 active:translate-y-1 mx-auto"
                >
                    CONTINUE JOURNEY <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---

export const DefeatScreen: React.FC = () => {
    const playerPokemon = usePlayerStore(state => state.playerPokemon);
    const caughtPokemon = usePlayerStore(state => state.caughtPokemon);

    // Logic Checks
    // 1. Is active pokemon fainted?
    const activeFainted = !playerPokemon || playerPokemon.currHp <= 0;
    
    // 2. Are ALL pokemon fainted?
    // We filter for any pokemon with HP > 0
    const hasHealthyPokemon = caughtPokemon.some(p => p.currHp > 0);
    const allFainted = !hasHealthyPokemon;

    // 3. Did we escape? (State is DEFEAT but active pokemon is healthy means we fled)
    // Note: Escaping sets DEFEAT state manually in items.ts, but doesn't lower HP.
    const isEscaped = !activeFainted;

    if (isEscaped) {
        return <EscapedView />;
    }

    if (allFainted) {
        return <WipeoutView />;
    }

    // Default: Switch Request
    return <SwitchPokemonView pokemonName={playerPokemon?.name || 'Pokemon'} />;
};
