
import React, { useState } from 'react';
import { GameEvent, EventChoice, EventResult } from '../../../types';
import { audioService } from '../../../services/audioService';
import { getGameActions } from '../../../services/gameContext';
import { showToast } from '../../../store/useToastStore';
import { ShieldAlert, ArrowRight } from 'lucide-react';

interface UltraSignalViewProps {
    event: GameEvent;
    onClose: () => void;
}

export const UltraSignalView: React.FC<UltraSignalViewProps> = ({ event, onClose }) => {
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
            // Battle start
            onClose();
        }
    };

    if (result) {
        return (
            <div className="w-full max-w-lg bg-gray-950 flex flex-col items-center justify-center p-8 font-mono text-red-500 border-[10px] border-red-900 relative rounded-2xl text-center">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(255,0,0,0.02),rgba(255,0,0,0.06))] z-0" style={{ backgroundSize: '100% 2px, 3px 100%' }}></div>
                
                <div className="z-10 w-full bg-black/90 p-6 border-2 border-red-500 shadow-2xl">
                    <h3 className="text-xl font-bold mb-4 uppercase tracking-widest border-b border-red-800 pb-2">TRANSMISSION LOG</h3>
                    <p className="text-red-300 text-lg mb-6">{result.description}</p>
                    <button 
                        onClick={onClose} 
                        className="w-full py-4 border border-red-500 hover:bg-red-500 hover:text-black transition-colors font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                        END CONNECTION <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="w-full max-w-lg bg-gray-950 flex flex-col items-center justify-center p-6 font-mono text-red-500 border-[10px] border-red-900 relative rounded-2xl">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(255,0,0,0.02),rgba(255,0,0,0.06))] z-0" style={{ backgroundSize: '100% 2px, 3px 100%' }}></div>
            
            <div className="z-10 border-2 border-red-500 p-8 w-full bg-black/90 shadow-[0_0_50px_rgba(220,38,38,0.2)]">
                <ShieldAlert size={48} className="mx-auto mb-4 animate-pulse" />
                <h2 className="text-2xl font-bold text-center mb-4 uppercase tracking-widest">{event.title}</h2>
                <p className="text-center text-red-300 mb-8 border-t border-b border-red-900 py-4">
                    {event.description}
                </p>
                <div className="space-y-4">
                    {event.choices.map((c, i) => (
                        <button key={i} onClick={() => handleSelect(c)} className="w-full py-3 border border-red-500 hover:bg-red-500 hover:text-black transition-colors font-bold uppercase tracking-wider">
                            {c.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
