
import React, { useState } from 'react';
import { GameEvent, EventChoice, EventResult } from '../../../types';
import { audioService } from '../../../services/audioService';
import { getGameActions } from '../../../services/gameContext';
import { Heart, Sparkles, Smile, ArrowRight } from 'lucide-react';

interface DayCareViewProps {
    event: GameEvent;
    onClose: () => void;
}

export const DayCareView: React.FC<DayCareViewProps> = ({ event, onClose }) => {
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
            <div className="w-full max-w-md bg-rose-50 rounded-3xl p-8 border-8 border-rose-200 shadow-xl relative text-slate-800 font-sans text-center">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-rose-400 text-white px-6 py-2 rounded-full font-bold shadow-md flex items-center gap-2 whitespace-nowrap">
                    <Heart className="fill-white" size={18} /> SERVICE COMPLETE
                </div>
                <div className="mt-6">
                    <div className="bg-white p-6 rounded-2xl border-2 border-rose-100 shadow-sm mb-6">
                        <p className="text-rose-900 font-bold text-lg">"{result.description}"</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-full bg-rose-400 hover:bg-rose-500 text-white font-bold py-3 rounded-xl shadow-lg transition-transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                        THANK YOU <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md bg-rose-50 rounded-3xl p-6 border-8 border-rose-200 shadow-xl relative text-slate-800 font-sans">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-rose-400 text-white px-6 py-2 rounded-full font-bold shadow-md flex items-center gap-2 whitespace-nowrap">
                <Heart className="fill-white" size={18} /> DAY CARE
            </div>

            <div className="mt-6 text-center">
                <Smile className="mx-auto text-rose-400 mb-2" size={48} />
                <p className="text-rose-900/80 font-medium mb-6 italic">"{event.description}"</p>
                
                <div className="space-y-3">
                    <button 
                        onClick={() => handleSelect(event.choices[0])}
                        className="w-full bg-white hover:bg-rose-100 border-2 border-rose-200 p-4 rounded-2xl flex items-center gap-4 transition-all hover:scale-[1.02] shadow-sm group"
                    >
                        <div className="bg-yellow-100 p-2 rounded-full text-yellow-600 group-hover:rotate-12 transition-transform">
                            <Sparkles size={24} />
                        </div>
                        <div className="text-left flex-1">
                            <div className="font-bold text-rose-900">{event.choices[0].label}</div>
                            <div className="text-xs text-rose-500 font-bold">{event.choices[0].riskText}</div>
                        </div>
                    </button>

                    <button 
                        onClick={() => handleSelect(event.choices[1])}
                        className="w-full bg-white hover:bg-rose-100 border-2 border-rose-200 p-4 rounded-2xl flex items-center gap-4 transition-all hover:scale-[1.02] shadow-sm group"
                    >
                        <div className="bg-green-100 p-2 rounded-full text-green-600 group-hover:scale-110 transition-transform">
                            <Heart size={24} />
                        </div>
                        <div className="text-left flex-1">
                            <div className="font-bold text-rose-900">{event.choices[1].label}</div>
                            <div className="text-xs text-rose-500 font-bold">{event.choices[1].riskText}</div>
                        </div>
                    </button>

                    <button 
                        onClick={() => handleSelect(event.choices[2])}
                        className="w-full py-3 text-rose-400 hover:text-rose-600 text-sm font-bold mt-2"
                    >
                        No thank you
                    </button>
                </div>
            </div>
        </div>
    );
};
