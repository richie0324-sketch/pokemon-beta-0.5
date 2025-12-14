
import React, { useState } from 'react';
import { GameEvent, EventChoice, EventResult } from '../../../types';
import { audioService } from '../../../services/audioService';
import { getGameActions } from '../../../services/gameContext';
import { Package, UserX, ArrowRight } from 'lucide-react';

interface MagikarpSalesmanViewProps {
    event: GameEvent;
    onClose: () => void;
}

export const MagikarpSalesmanView: React.FC<MagikarpSalesmanViewProps> = ({ event, onClose }) => {
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
            <div className="w-full max-w-md bg-purple-950 flex flex-col items-center p-8 rounded-2xl border-4 border-purple-500 shadow-[0_0_50px_rgba(168,85,247,0.3)] relative overflow-hidden font-mono text-center">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-600 rounded-full blur-[50px] opacity-20"></div>
                <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest border-b-2 border-purple-700 pb-2">Transaction Complete</h3>
                <p className="text-purple-100 text-lg mb-8 font-medium">"{result.description}"</p>
                <button 
                    onClick={onClose}
                    className="w-full bg-purple-700 hover:bg-purple-600 text-white font-bold py-3 rounded-xl border border-purple-500 shadow-lg flex items-center justify-center gap-2"
                >
                    WALK AWAY <ArrowRight size={20} />
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md bg-purple-950 flex flex-col items-center p-8 rounded-2xl border-4 border-purple-500 shadow-[0_0_50px_rgba(168,85,247,0.3)] relative overflow-hidden font-mono">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-600 rounded-full blur-[50px] opacity-20"></div>
            
            <div className="w-24 h-24 bg-black rounded-full border-4 border-purple-400 flex items-center justify-center mb-6 shadow-xl relative z-10">
                <UserX size={48} className="text-purple-400" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2 text-center relative z-10">{event.title}</h2>
            <p className="text-purple-200 text-center text-sm mb-8 relative z-10 italic">"{event.description}"</p>

            <div className="w-full space-y-4 relative z-10">
                <button 
                    onClick={() => handleSelect(event.choices[0])}
                    className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold py-4 rounded-xl shadow-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 border-2 border-yellow-300"
                >
                    <Package size={20} /> {event.choices[0].label}
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                    {event.choices.slice(1).map((c, i) => (
                        <button 
                            key={i} 
                            onClick={() => handleSelect(c)}
                            className="bg-purple-900/50 hover:bg-purple-800 text-purple-200 py-3 rounded-lg border border-purple-700 text-xs font-bold transition-colors"
                        >
                            {c.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
