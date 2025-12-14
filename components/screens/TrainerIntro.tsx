
import React, { useState, useEffect } from 'react';
import { Trainer, Pokemon } from '../../types';
import { audioService } from '../../services/audioService';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useBattleStore } from '../../store/useBattleStore';
import { logic } from '../../hooks/useGameLogic';
import { Sword, Coins, LogOut } from 'lucide-react';

export const TrainerIntro: React.FC = () => {
    const playerPokemon = usePlayerStore(state => state.playerPokemon);
    const trainer = useBattleStore(state => state.currentTrainer);
    
    const [phase, setPhase] = useState<'intro' | 'flipping' | 'result'>('intro');
    const [coinResult, setCoinResult] = useState<'heads' | 'tails' | null>(null);

    if (!trainer || !playerPokemon) return null;

    const handleBattleClick = () => {
        audioService.playSfx('click');
        setPhase('flipping');
        
        // Simulate Coin Flip
        setTimeout(() => {
            const isHeads = Math.random() > 0.5;
            setCoinResult(isHeads ? 'heads' : 'tails');
            setPhase('result');
            
            if (isHeads) audioService.playSfx('correct');
            else audioService.playSfx('incorrect'); // Ominous sound for going second

            setTimeout(() => {
                logic.handleTrainerBattleStart(isHeads);
            }, 2500);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col relative overflow-hidden font-mono">
            {/* Background Split */}
            <div className="absolute inset-0 flex">
                <div className="w-1/2 bg-blue-900/50 skew-x-12 -ml-10 border-r-4 border-white/20"></div>
                <div className="w-1/2 bg-red-900/50 skew-x-12 border-l-4 border-white/20"></div>
            </div>

            {/* VS Content */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
                
                {/* VS LOGO */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                    <span className="text-7xl md:text-9xl font-pixel text-yellow-400 drop-shadow-[4px_4px_0_#000] italic animate-bounce">VS</span>
                </div>

                <div className="flex flex-col md:flex-row w-full max-w-5xl justify-between items-center h-full gap-8">
                    
                    {/* PLAYER SIDE */}
                    <div className="flex flex-col items-center md:items-start animate-slide-in-left">
                        <div className="w-40 h-40 md:w-64 md:h-64 bg-blue-800 rounded-full border-4 border-white shadow-2xl flex items-center justify-center overflow-hidden mb-4">
                            <img src={playerPokemon.imageUrl} className="w-32 h-32 md:w-56 md:h-56 object-contain" />
                        </div>
                        <div className="bg-blue-600 text-white px-6 py-2 rounded-r-full border-l-4 border-white shadow-lg">
                            <h2 className="text-xl md:text-3xl font-bold font-pixel uppercase">YOU</h2>
                            <p className="text-blue-200">Ready for battle</p>
                        </div>
                    </div>

                    {/* TRAINER SIDE */}
                    <div className="flex flex-col items-center md:items-end animate-slide-in-right text-right">
                        <div className="w-40 h-40 md:w-64 md:h-64 bg-red-800 rounded-full border-4 border-white shadow-2xl flex items-center justify-center overflow-hidden mb-4">
                            <img src={trainer.spriteUrl} className="w-full h-full object-cover" />
                        </div>
                        <div className="bg-red-600 text-white px-6 py-2 rounded-l-full border-r-4 border-white shadow-lg">
                            <h2 className="text-xl md:text-3xl font-bold font-pixel uppercase">{trainer.title} {trainer.name}</h2>
                            <p className="text-red-200">Wants to battle!</p>
                        </div>
                        
                        {/* Dialogue Bubble */}
                        <div className="mt-6 bg-white text-black p-4 rounded-xl border-4 border-slate-800 shadow-xl max-w-xs relative md:mr-8">
                            <div className="absolute -top-3 right-8 w-6 h-6 bg-white border-t-4 border-l-4 border-slate-800 transform rotate-45"></div>
                            <p className="font-bold italic">"{trainer.dialogue.intro}"</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ACTION FOOTER */}
            <div className="relative z-30 bg-slate-800 p-6 border-t-4 border-slate-600">
                <div className="max-w-2xl mx-auto text-center">
                    
                    {phase === 'intro' && (
                        <div className="flex gap-4 justify-center">
                            <button 
                                onClick={handleBattleClick}
                                className="flex-1 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold font-pixel rounded-lg shadow-lg border-b-4 border-yellow-700 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 text-xl"
                            >
                                <Sword size={24} /> BATTLE
                            </button>
                            <button 
                                onClick={() => { audioService.playSfx('run'); logic.declineTrainerBattle(); }}
                                className="w-1/3 py-4 bg-slate-600 hover:bg-slate-500 text-white font-bold rounded-lg shadow-lg border-b-4 border-slate-700 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2"
                            >
                                <LogOut size={20} /> DECLINE
                            </button>
                        </div>
                    )}

                    {phase === 'flipping' && (
                        <div className="flex flex-col items-center animate-pulse">
                            <div className="w-16 h-16 rounded-full border-4 border-yellow-400 bg-yellow-200 flex items-center justify-center mb-2 animate-spin">
                                <span className="text-2xl font-bold text-yellow-800">$</span>
                            </div>
                            <p className="text-white font-bold text-lg">Flipping coin for initiative...</p>
                        </div>
                    )}

                    {phase === 'result' && (
                        <div className="flex flex-col items-center animate-pop-in">
                            <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center mb-2 ${coinResult === 'heads' ? 'border-green-400 bg-green-200' : 'border-red-400 bg-red-200'}`}>
                                <span className={`text-2xl font-bold ${coinResult === 'heads' ? 'text-green-800' : 'text-red-800'}`}>
                                    {coinResult === 'heads' ? 'H' : 'T'}
                                </span>
                            </div>
                            <p className={`font-bold text-xl ${coinResult === 'heads' ? 'text-green-400' : 'text-red-400'}`}>
                                {coinResult === 'heads' ? "HEADS! You go first!" : "TAILS! Enemy attacks first!"}
                            </p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};
