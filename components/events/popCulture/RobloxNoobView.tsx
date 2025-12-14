
import React, { useState } from 'react';
import { GameEvent, EventChoice, EventResult } from '../../../types';
import { audioService } from '../../../services/audioService';
import { getGameActions } from '../../../services/gameContext';
import { ArrowRight } from 'lucide-react';

interface RobloxNoobViewProps {
    event: GameEvent;
    onClose: () => void;
}

export const RobloxNoobView: React.FC<RobloxNoobViewProps> = ({ event, onClose }) => {
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
            <div className="w-full max-w-md bg-sky-400 flex flex-col items-center justify-center p-6 relative font-sans rounded-2xl">
                <div className="bg-slate-800 text-white p-8 rounded-lg shadow-2xl w-full border-4 border-slate-900 text-center">
                    <h2 className="text-3xl font-bold mb-4">## SYSTEM MSG ##</h2>
                    <p className="text-slate-200 text-lg mb-8 font-mono">{result.description}</p>
                    <button 
                        onClick={onClose}
                        className="w-full bg-slate-700 hover:bg-slate-600 py-4 rounded font-bold border-b-4 border-slate-900 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2"
                    >
                        OK <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="w-full max-w-md bg-sky-400 flex flex-col items-center justify-center p-6 relative font-sans rounded-2xl">
            <div className="bg-slate-800 text-white p-6 rounded-lg shadow-2xl w-full border-4 border-slate-900">
                 <div className="w-20 h-20 bg-yellow-400 rounded mx-auto mb-4 border-4 border-black shadow-lg"></div>
                 <h2 className="text-2xl font-bold text-center mb-2">{event.title}</h2>
                 <p className="text-slate-300 text-center mb-6 text-sm">"OOF! {event.description}"</p>
                 <div className="space-y-2">
                    {event.choices.map((c, i) => (
                        <button key={i} onClick={() => handleSelect(c)} className="w-full bg-slate-700 hover:bg-slate-600 py-3 rounded font-bold border-b-4 border-slate-900 active:border-b-0 active:translate-y-1 transition-all">
                            {c.label}
                        </button>
                    ))}
                 </div>
            </div>
        </div>
    );
};
