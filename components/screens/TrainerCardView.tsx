
import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { usePlayerStore } from '../../store/usePlayerStore';
import { TrainerCard } from '../TrainerCard';
import { ArrowLeft, Share2 } from 'lucide-react';
import { audioService } from '../../services/audioService';
import { GameState } from '../../types';

export const TrainerCardView: React.FC = () => {
    const { setGameState, playerName, playerAvatar, prevState } = useGameStore();
    const { money, trainerId, badges } = usePlayerStore();

    const handleBack = () => {
        audioService.playSfx('click');
        setGameState(prevState || GameState.MENU_MAIN);
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative font-mono">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
            
            <div className="relative z-10 w-full max-w-lg">
                <div className="flex justify-between items-center mb-6">
                    <button 
                        onClick={handleBack}
                        className="flex items-center gap-2 text-slate-400 hover:text-white bg-slate-800 px-4 py-2 rounded-full border border-slate-700 hover:border-slate-500 transition-all"
                    >
                        <ArrowLeft size={20} /> BACK
                    </button>
                    <div className="text-yellow-400 font-pixel text-sm uppercase tracking-widest">
                        Official Record
                    </div>
                </div>

                <div className="transform transition-transform hover:scale-[1.01] duration-500">
                    <TrainerCard 
                        name={playerName}
                        id={trainerId}
                        money={money}
                        badges={badges}
                        avatar={playerAvatar}
                    />
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center">
                        <div className="text-slate-500 text-xs font-bold uppercase mb-1">Region</div>
                        <div className="text-white font-mono font-bold">KANTO / JOHTO</div>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center">
                        <div className="text-slate-500 text-xs font-bold uppercase mb-1">Status</div>
                        <div className="text-green-400 font-mono font-bold">ACTIVE</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
