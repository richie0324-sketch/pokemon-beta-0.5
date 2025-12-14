
import React, { useState } from 'react';
import { GameEvent, EventChoice, EventResult } from '../../../types';
import { audioService } from '../../../services/audioService';
import { getGameActions } from '../../../services/gameContext';
import { ArrowRight } from 'lucide-react';

interface FortniteStormViewProps {
    event: GameEvent;
    onClose: () => void;
}

export const FortniteStormView: React.FC<FortniteStormViewProps> = ({ event, onClose }) => {
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
            <div className="w-full max-w-lg bg-purple-900 flex flex-col items-center justify-center p-6 relative overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-[radial-gradient(circle,transparent,rgba(76,29,149,0.8))] z-0"></div>
                <div className="z-10 w-full text-center">
                    <div className="bg-yellow-400 text-black font-black italic p-4 mb-6 skew-x-[-10deg] shadow-lg border-4 border-white transform rotate-2">
                        <h2 className="text-3xl uppercase">MISSION UPDATE</h2>
                    </div>
                    <div className="bg-blue-600/90 skew-x-[-5deg] p-8 mb-8 border-l-8 border-white shadow-xl">
                        <p className="text-white font-bold text-xl leading-tight">{result.description}</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-full bg-white hover:bg-gray-100 text-purple-900 font-black uppercase italic py-4 text-2xl skew-x-[-10deg] shadow-lg transform hover:scale-105 transition-transform border-b-8 border-gray-300"
                    >
                        RETURN TO LOBBY
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="w-full max-w-lg bg-purple-900 flex flex-col items-center justify-center p-6 relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle,transparent,rgba(76,29,149,0.8))] z-0"></div>
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-purple-500 blur-[100px] opacity-50"></div>
            
            <div className="z-10 w-full">
                <h2 className="text-4xl font-black italic text-white text-center mb-2 drop-shadow-lg uppercase skew-x-[-10deg]">{event.title}</h2>
                <div className="bg-blue-600/90 skew-x-[-5deg] p-6 mb-8 border-l-8 border-yellow-400 shadow-xl transform -rotate-1">
                    <p className="text-white font-bold text-lg leading-tight">{event.description}</p>
                </div>
                
                <div className="space-y-3">
                     {event.choices.map((c, i) => (
                         <button key={i} onClick={() => handleSelect(c)} className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black uppercase italic py-4 text-xl skew-x-[-10deg] shadow-lg transform hover:scale-105 transition-transform border-b-8 border-yellow-600">
                             {c.label}
                         </button>
                     ))}
                </div>
            </div>
        </div>
    );
};
