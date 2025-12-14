
import React, { useState } from 'react';
import { GameEvent, EventChoice, EventResult } from '../../../types';
import { audioService } from '../../../services/audioService';
import { getGameActions } from '../../../services/gameContext';
import { useGameStore } from '../../../store/useGameStore';
import { Flame, ArrowUp, Coins, Skull } from 'lucide-react';

interface TowerTrialViewProps {
    event: GameEvent;
    onClose: () => void;
}

export const TowerTrialView: React.FC<TowerTrialViewProps> = ({ event, onClose }) => {
    const [result, setResult] = useState<EventResult | null>(null);
    const { activeQuest } = useGameStore();
    
    // Calculate current floor (1-based)
    const currentFloor = (activeQuest?.currentProgress || 0) + 1;
    const totalFloors = activeQuest?.requiredProgress || 5;

    const handleSelect = (choice: EventChoice) => {
        audioService.playSfx('click');
        const actions = getGameActions();
        const outcome = choice.onSelect(actions, event);
        
        if (outcome) {
            setResult(outcome);
            if (outcome.type === 'positive') audioService.playSfx('correct');
            else if (outcome.type === 'negative') audioService.playSfx('damage');
        } else {
            onClose();
        }
    };

    if (result) {
        return (
            <div className="w-full max-w-lg bg-amber-950 border-[12px] border-amber-800 rounded-xl p-8 relative overflow-hidden shadow-2xl text-center">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-10 pointer-events-none"></div>
                <div className="relative z-10">
                    <h3 className={`text-3xl font-pixel mb-6 ${result.type === 'negative' ? 'text-red-400' : 'text-amber-300'}`}>
                        {result.type === 'negative' ? 'BURNED!' : 'ASCENDED!'}
                    </h3>
                    <div className="bg-black/40 p-4 rounded-lg border border-amber-700/50 mb-8">
                        <p className="text-amber-100 text-lg font-serif italic leading-relaxed">{result.description}</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="bg-amber-700 hover:bg-amber-600 text-white font-bold py-4 px-8 rounded-lg border-b-4 border-amber-900 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 mx-auto"
                    >
                        NEXT FLOOR <ArrowUp size={20} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-lg bg-amber-950 border-[12px] border-amber-800 rounded-xl p-6 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-10 pointer-events-none"></div>
            
            {/* Header */}
            <div className="flex flex-col items-center mb-8 relative z-10">
                <div className="bg-black/50 px-6 py-2 rounded-full border border-amber-600/50 mb-4">
                    <span className="text-amber-400 font-bold tracking-widest uppercase">Floor {currentFloor} of {totalFloors}</span>
                </div>
                <div className="relative">
                    <Flame size={80} className="text-orange-500 animate-pulse drop-shadow-[0_0_15px_rgba(249,115,22,0.6)]" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-2 bg-orange-500/20 blur-md rounded-full"></div>
                </div>
                <h2 className="text-2xl font-pixel text-amber-200 mt-4 text-center">THE TRIAL OF RISK</h2>
            </div>

            <div className="relative z-10 space-y-4">
                {event.choices.map((c, i) => (
                    <button 
                        key={i} 
                        onClick={() => handleSelect(c)}
                        className={`w-full py-5 px-6 rounded-lg font-bold border-b-4 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-between group relative overflow-hidden
                            ${i === 0 ? 'bg-yellow-700 hover:bg-yellow-600 border-yellow-900 text-yellow-100' : ''}
                            ${i === 1 ? 'bg-red-800 hover:bg-red-700 border-red-950 text-red-100' : ''}
                        `}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent pointer-events-none"></div>
                        
                        <div className="flex flex-col items-start relative z-10">
                            <span className="flex items-center gap-2 text-lg">
                                {i === 0 ? <Coins size={20} /> : <Skull size={20} />}
                                {c.label}
                            </span>
                            <span className="text-xs opacity-70 font-mono mt-1">{i === 0 ? "Guaranteed Passage" : "50% Success Rate"}</span>
                        </div>
                        
                        <div className="bg-black/30 px-3 py-1 rounded text-xs font-bold border border-white/10 relative z-10">
                            {c.riskText}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};
