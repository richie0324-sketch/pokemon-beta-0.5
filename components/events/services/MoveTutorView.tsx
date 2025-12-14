
import React, { useState } from 'react';
import { GameEvent, EventChoice, EventResult } from '../../../types';
import { audioService } from '../../../services/audioService';
import { getGameActions } from '../../../services/gameContext';
import { Swords, Zap, Scroll, ArrowRight } from 'lucide-react';

interface MoveTutorViewProps {
    event: GameEvent;
    onClose: () => void;
}

export const MoveTutorView: React.FC<MoveTutorViewProps> = ({ event, onClose }) => {
    const [result, setResult] = useState<EventResult | null>(null);

    const handleSelect = (choice: EventChoice) => {
        audioService.playSfx('click');
        const actions = getGameActions();
        const outcome = choice.onSelect(actions, event);
        if (outcome) {
            setResult(outcome);
            if (outcome.type === 'positive') audioService.playSfx('correct');
            else if (outcome.type === 'negative') audioService.playSfx('incorrect');
        } else {
            onClose();
        }
    };

    if (result) {
        return (
            <div className="w-full max-w-2xl bg-orange-950 text-orange-100 border-y-8 border-orange-700 p-8 relative font-mono shadow-2xl text-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.1),transparent)] pointer-events-none"></div>
                <h3 className="text-2xl font-bold font-serif text-orange-400 mb-6 uppercase tracking-widest border-b border-orange-800 pb-4">
                    TRAINING RESULT
                </h3>
                <p className="text-lg text-orange-100 leading-relaxed mb-8">
                    {result.description}
                </p>
                <button 
                    onClick={onClose}
                    className="mx-auto bg-orange-800 hover:bg-orange-700 text-orange-100 border-2 border-orange-500 px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-transform active:scale-95"
                >
                    BOW AND LEAVE <ArrowRight size={20} />
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl bg-orange-950 text-orange-100 border-y-8 border-orange-700 p-6 relative font-mono shadow-2xl">
            {/* Dojo Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.1),transparent)] pointer-events-none"></div>
            
            <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="shrink-0 flex flex-col items-center">
                    <div className="w-24 h-24 bg-orange-900 rounded-full border-4 border-orange-500 flex items-center justify-center mb-2">
                        <Scroll size={40} className="text-orange-300" />
                    </div>
                    <div className="bg-black/40 px-3 py-1 rounded text-xs text-orange-400 font-bold uppercase tracking-widest">Master</div>
                </div>

                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl font-bold font-serif text-orange-400 mb-2">{event.title}</h2>
                    <p className="text-orange-200/80 italic mb-6">"{event.description}"</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <button 
                            onClick={() => handleSelect(event.choices[0])}
                            className="bg-orange-900/50 hover:bg-orange-800 border-2 border-orange-600/50 hover:border-orange-500 p-4 rounded-lg flex flex-col items-center gap-2 transition-all active:scale-95 group"
                        >
                            <Zap className="text-yellow-400 group-hover:scale-125 transition-transform" />
                            <span className="font-bold">{event.choices[0].label}</span>
                            <span className="text-[10px] bg-black/40 px-2 py-0.5 rounded text-orange-300">{event.choices[0].riskText}</span>
                        </button>

                        <button 
                            onClick={() => handleSelect(event.choices[1])}
                            className="bg-red-900/30 hover:bg-red-900/50 border-2 border-red-600/50 hover:border-red-500 p-4 rounded-lg flex flex-col items-center gap-2 transition-all active:scale-95 group"
                        >
                            <Swords className="text-red-400 group-hover:rotate-45 transition-transform" />
                            <span className="font-bold">{event.choices[1].label}</span>
                            <span className="text-[10px] bg-black/40 px-2 py-0.5 rounded text-red-300">{event.choices[1].riskText}</span>
                        </button>
                    </div>
                </div>
            </div>

            <button 
                onClick={() => handleSelect(event.choices[2])}
                className="absolute top-2 right-2 text-orange-500 hover:text-orange-300 font-bold p-2"
            >
                ✕
            </button>
        </div>
    );
};
