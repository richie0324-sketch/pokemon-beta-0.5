
import React, { useState } from 'react';
import { useShallow } from 'zustand/shallow';
import { audioService } from '../../services/audioService';
import { useGameStore } from '../../store/useGameStore';
import { useBattleStore } from '../../store/useBattleStore';
import { logic } from '../../hooks/useGameLogic';
import { Sword, LogOut, MessageSquare } from 'lucide-react';

export const TrainerIntro: React.FC = () => {
    // UPDATED: Grab Player Avatar and Name
    const { playerAvatar, playerName } = useGameStore(useShallow(state => ({
        playerAvatar: state.playerAvatar,
        playerName: state.playerName
    })));
    
    const trainer = useBattleStore(state => state.currentTrainer);
    
    const [phase, setPhase] = useState<'intro' | 'flipping' | 'result'>('intro');
    const [coinResult, setCoinResult] = useState<'heads' | 'tails' | null>(null);

    if (!trainer) return null;

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
            }, 2000);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-black flex flex-col font-mono relative overflow-hidden">
            
            {/* --- VISUAL SPLIT CONTAINER --- */}
            <div className="absolute inset-0 flex flex-col md:flex-row">
                
                {/* 1. PLAYER SECTION (Top on Mobile, Left on Desktop) */}
                <div className="relative flex-1 bg-blue-900 flex items-center justify-center overflow-hidden border-b-4 md:border-b-0 md:border-r-4 border-black/50">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-800 to-slate-900 opacity-90"></div>
                    
                    {/* Player Content */}
                    <div className="relative z-10 flex flex-row md:flex-col items-center gap-4 md:gap-8 animate-slide-in-left w-full max-w-lg p-4">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full scale-110"></div>
                            <img 
                                src={playerAvatar} 
                                className="w-32 h-32 md:w-80 md:h-80 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                                style={{ imageRendering: 'pixelated' }}
                            />
                        </div>
                        
                        {/* Text Info */}
                        <div className="flex-1 text-left md:text-center">
                            <div className="inline-block bg-blue-600 text-white px-3 py-1 text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-full mb-1 border border-blue-400">
                                Challenger
                            </div>
                            <h2 className="text-2xl md:text-5xl font-bold font-pixel text-white leading-none drop-shadow-md uppercase truncate">
                                {playerName || 'YOU'}
                            </h2>
                            <div className="h-1 w-12 md:w-24 bg-blue-400 mt-2 md:mx-auto"></div>
                        </div>
                    </div>
                </div>

                {/* 2. ENEMY SECTION (Bottom on Mobile, Right on Desktop) */}
                <div className="relative flex-1 bg-red-900 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-tl from-red-950 to-red-800 opacity-90"></div>

                    {/* Enemy Content */}
                    <div className="relative z-10 flex flex-row-reverse md:flex-col items-center gap-4 md:gap-8 animate-slide-in-right w-full max-w-lg p-4">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-black/30 blur-2xl rounded-full scale-110"></div>
                            <img 
                                src={trainer.spriteUrl} 
                                className="w-32 h-32 md:w-80 md:h-80 object-contain drop-shadow-xl"
                                style={{ imageRendering: 'pixelated' }}
                            />
                        </div>

                        {/* Text Info */}
                        <div className="flex-1 text-right md:text-center">
                            <div className="inline-block bg-red-600 text-white px-3 py-1 text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-full mb-1 border border-red-400">
                                {trainer.title}
                            </div>
                            <h2 className="text-2xl md:text-5xl font-bold font-pixel text-white leading-none drop-shadow-md uppercase truncate">
                                {trainer.name}
                            </h2>
                            <div className="h-1 w-12 md:w-24 bg-red-400 mt-2 ml-auto md:mx-auto"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- CENTRAL ELEMENTS --- */}
            
            {/* VS LOGO */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                <div className="relative">
                    <span className="absolute inset-0 text-7xl md:text-[10rem] font-pixel text-black blur-md transform scale-110">VS</span>
                    <span className="relative text-7xl md:text-[10rem] font-pixel text-yellow-400 drop-shadow-[4px_4px_0_#000] italic animate-bounce block">VS</span>
                </div>
            </div>

            {/* DIALOGUE BUBBLE (Floating) */}
            {/* Desktop: Moved further up to top-15% (Upper Right). Mobile: top-55% (Upper part of Bottom/Red section) */}
            <div className="absolute top-[55%] md:top-[15%] right-4 md:right-[20%] z-30 max-w-[200px] md:max-w-xs animate-pop-in">
                <div className="bg-white text-black p-3 md:p-4 rounded-xl border-4 border-slate-900 shadow-2xl relative">
                    <div className="absolute -bottom-3 right-8 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[15px] border-t-slate-900"></div>
                    <div className="absolute -bottom-1 right-8 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[11px] border-t-white"></div>
                    
                    <div className="flex items-start gap-2">
                        <MessageSquare size={16} className="shrink-0 mt-1 text-slate-400" />
                        <p className="font-bold text-xs md:text-sm italic leading-tight">
                            "{trainer.dialogue.intro}"
                        </p>
                    </div>
                </div>
            </div>

            {/* --- FOOTER CONTROLS --- */}
            <div className="absolute bottom-0 w-full z-30 bg-gradient-to-t from-black via-black/90 to-transparent pt-12 pb-6 px-4">
                <div className="max-w-xl mx-auto text-center space-y-4">
                    
                    {phase === 'intro' && (
                        <div className="flex gap-3 md:gap-6 justify-center items-end h-20">
                            <button 
                                onClick={handleBattleClick}
                                className="flex-1 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold font-pixel rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.4)] border-b-8 border-yellow-700 active:border-b-0 active:translate-y-2 transition-all flex items-center justify-center gap-2 text-lg md:text-2xl group"
                            >
                                <Sword className="group-hover:rotate-12 transition-transform" size={24} /> BATTLE
                            </button>
                            <button 
                                onClick={() => { audioService.playSfx('run'); logic.declineTrainerBattle(); }}
                                className="w-1/3 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl border-b-8 border-slate-900 active:border-b-0 active:translate-y-2 transition-all flex items-center justify-center gap-2 text-sm md:text-base"
                            >
                                <LogOut size={20} /> FLEE
                            </button>
                        </div>
                    )}

                    {phase === 'flipping' && (
                        <div className="flex flex-col items-center justify-center h-20 animate-pulse">
                            <div className="w-12 h-12 rounded-full border-4 border-yellow-400 bg-yellow-900/50 flex items-center justify-center animate-spin mb-2">
                                <span className="text-xl font-bold text-yellow-400">$</span>
                            </div>
                            <p className="text-yellow-400 font-mono text-xs uppercase tracking-widest">Coin Toss...</p>
                        </div>
                    )}

                    {phase === 'result' && (
                        <div className="flex flex-col items-center justify-center h-20 animate-pop-in">
                            <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center mb-1 shadow-lg ${coinResult === 'heads' ? 'border-green-400 bg-green-900 text-green-400' : 'border-red-400 bg-red-900 text-red-400'}`}>
                                <span className="text-xl font-bold">{coinResult === 'heads' ? 'H' : 'T'}</span>
                            </div>
                            <div className={`font-bold font-pixel text-sm md:text-lg uppercase ${coinResult === 'heads' ? 'text-green-400' : 'text-red-400'}`}>
                                {coinResult === 'heads' ? "YOU GO FIRST!" : "OPPONENT STARTS!"}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};
