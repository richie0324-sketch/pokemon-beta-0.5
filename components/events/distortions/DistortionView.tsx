
import React, { useState } from 'react';
import { GameEvent, EventChoice, EventResult } from '../../../types';
import { audioService } from '../../../services/audioService';
import { getGameActions } from '../../../services/gameContext';
import { ArrowRight, Terminal } from 'lucide-react';

interface DistortionViewProps {
    event: GameEvent;
    onClose: () => void;
}

export const DistortionView: React.FC<DistortionViewProps> = ({ event, onClose }) => {
    const [result, setResult] = useState<EventResult | null>(null);

    const handleSelect = (choice: EventChoice) => {
        audioService.playSfx('click');
        const actions = getGameActions();
        const outcome = choice.onSelect(actions, event);
        if (outcome) {
            setResult(outcome);
            if (outcome.type === 'positive') audioService.playSfx('correct');
            else if (outcome.type === 'negative') audioService.playSfx('damage'); // Glitch sound ideally
        } else {
            onClose();
        }
    };

    if (result) {
        return (
            <div className="w-full max-w-lg bg-black flex flex-col p-8 relative overflow-hidden font-mono border-4 border-green-500/50 rounded-2xl text-center">
                <div className="absolute inset-0 bg-green-500/5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(34, 197, 94, .05) 25%, rgba(34, 197, 94, .05) 26%, transparent 27%, transparent 74%, rgba(34, 197, 94, .05) 75%, rgba(34, 197, 94, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(34, 197, 94, .05) 25%, rgba(34, 197, 94, .05) 26%, transparent 27%, transparent 74%, rgba(34, 197, 94, .05) 75%, rgba(34, 197, 94, .05) 76%, transparent 77%, transparent)', backgroundSize: '50px 50px' }}></div>
                
                <div className="z-10 flex flex-col items-center">
                    <Terminal size={48} className="text-green-500 mb-6 animate-pulse" />
                    <h2 className="text-2xl font-bold text-green-500 mb-6 tracking-widest border-b border-green-500/50 pb-4 w-full">
                        SYSTEM OUTPUT
                    </h2>
                    <p className="text-green-400 text-lg mb-8 leading-relaxed">
                        {`> ${result.description}`}
                    </p>
                    <button 
                        onClick={onClose}
                        className="w-full py-4 bg-gray-900 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                    >
                        ACKNOWLEDGE <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-lg bg-black flex flex-col p-6 relative overflow-hidden font-mono border-4 border-green-500/50 rounded-2xl">
            <div className="absolute inset-0 bg-green-500/5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(34, 197, 94, .05) 25%, rgba(34, 197, 94, .05) 26%, transparent 27%, transparent 74%, rgba(34, 197, 94, .05) 75%, rgba(34, 197, 94, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(34, 197, 94, .05) 25%, rgba(34, 197, 94, .05) 26%, transparent 27%, transparent 74%, rgba(34, 197, 94, .05) 75%, rgba(34, 197, 94, .05) 76%, transparent 77%, transparent)', backgroundSize: '50px 50px' }}></div>
            
            <div className="z-10 flex flex-col items-center text-center mt-10">
                 <div className="bg-red-500 text-black px-4 py-1 font-bold text-xs animate-pulse mb-4">SYSTEM ERROR // ANOMALY DETECTED</div>
                 <h2 className="text-4xl font-bold text-green-500 mb-6 tracking-tighter glitch-text">{event.title}</h2>
                 <div className="bg-black/80 border border-green-500/50 p-6 rounded-sm max-w-lg mb-8 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                     <p className="text-green-400 typing-effect">{event.description}</p>
                 </div>
                 
                 <div className="w-full max-w-md space-y-4">
                     {event.choices.map((c, i) => (
                         <button key={i} onClick={() => handleSelect(c)} className="w-full py-4 bg-gray-900 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black font-bold uppercase tracking-widest transition-colors">
                             {`> ${c.label}`}
                         </button>
                     ))}
                 </div>
            </div>
        </div>
    );
};
