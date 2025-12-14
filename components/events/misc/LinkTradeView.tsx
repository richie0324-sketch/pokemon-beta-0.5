
import React, { useState } from 'react';
import { GameEvent, EventChoice, EventResult } from '../../../types';
import { audioService } from '../../../services/audioService';
import { getGameActions } from '../../../services/gameContext';
import { Radio, ArrowRight, CheckCircle, XCircle } from 'lucide-react';

interface LinkTradeViewProps {
    event: GameEvent;
    onClose: () => void;
}

export const LinkTradeView: React.FC<LinkTradeViewProps> = ({ event, onClose }) => {
    const [result, setResult] = useState<EventResult | null>(null);

    const handleSelect = (choice: EventChoice) => {
        audioService.playSfx('click');
        const actions = getGameActions();
        const outcome = choice.onSelect(actions, event);
        // Special case: Link trade might close itself on success via actions.ui.closeEvent()
        // If it returns an object, we display it.
        if (outcome) {
            setResult(outcome);
            if (outcome.type === 'positive') audioService.playSfx('correct');
            else if (outcome.type === 'negative') audioService.playSfx('incorrect');
        } else {
            // Usually this means evolution triggered and scene changed, so we just close the modal
            onClose();
        }
    };
    
    if (result) {
        return (
            <div className="w-full max-w-md bg-white rounded-xl p-1 border-b-8 border-gray-300 shadow-2xl">
                <div className="bg-indigo-100 p-8 rounded-lg border-4 border-indigo-300 flex flex-col items-center text-center">
                    {result.type === 'negative' ? (
                        <XCircle size={64} className="text-red-500 mb-4" />
                    ) : (
                        <CheckCircle size={64} className="text-green-500 mb-4" />
                    )}
                    <h3 className="text-xl font-bold text-indigo-900 mb-4">
                        {result.type === 'negative' ? 'CONNECTION ERROR' : 'TRADE STATUS'}
                    </h3>
                    <p className="text-indigo-800 text-lg mb-8">{result.description}</p>
                    <button 
                        onClick={onClose}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded shadow-lg flex items-center justify-center gap-2"
                    >
                        CLOSE <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md bg-white rounded-xl p-1 border-b-8 border-gray-300 shadow-2xl">
            <div className="bg-indigo-100 p-6 rounded-lg border-4 border-indigo-300 flex flex-col items-center">
                <Radio size={48} className="text-indigo-600 mb-2 animate-bounce" />
                <h2 className="text-xl font-bold text-indigo-800 mb-4">{event.title}</h2>
                <div className="bg-white p-3 rounded border border-indigo-200 mb-6 text-sm text-indigo-900 text-center">
                    {event.description}
                </div>
                <div className="flex gap-4 w-full">
                    {event.choices.map((c, i) => (
                        <button 
                            key={i} 
                            onClick={() => handleSelect(c)} 
                            className={`flex-1 py-3 font-bold rounded shadow-md border-b-4 active:border-b-0 active:translate-y-1 transition-all ${i===0 ? 'bg-blue-500 border-blue-700 text-white' : 'bg-gray-200 border-gray-400 text-gray-700'}`}
                        >
                            {c.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
