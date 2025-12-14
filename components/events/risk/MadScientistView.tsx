
import React, { useState } from 'react';
import { GameEvent, EventChoice, EventResult } from '../../../types';
import { audioService } from '../../../services/audioService';
import { getGameActions } from '../../../services/gameContext';
import { FlaskConical, ArrowRight } from 'lucide-react';

interface MadScientistViewProps {
    event: GameEvent;
    onClose: () => void;
}

export const MadScientistView: React.FC<MadScientistViewProps> = ({ event, onClose }) => {
    const [result, setResult] = useState<EventResult | null>(null);

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
            <div className="w-full max-w-lg bg-slate-900 border-4 border-slate-700 rounded-xl overflow-hidden shadow-2xl relative font-mono text-center">
                <div className="bg-slate-800 p-4 border-b border-slate-700">
                    <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2"><FlaskConical className="text-cyan-400"/> EXPERIMENT COMPLETE</h2>
                </div>
                <div className="p-8">
                    <p className={`text-lg font-bold mb-6 ${result.type === 'negative' ? 'text-red-400' : 'text-green-400'}`}>
                        {result.description}
                    </p>
                    <button 
                        onClick={onClose}
                        className="w-full py-4 text-slate-900 bg-cyan-400 hover:bg-cyan-300 font-bold rounded flex items-center justify-center gap-2"
                    >
                        CONTINUE <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-lg bg-slate-900 border-4 border-slate-700 rounded-xl overflow-hidden shadow-2xl relative font-mono">
            {/* Header */}
            <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white flex items-center gap-2"><FlaskConical className="text-cyan-400"/> LABORATORY</h2>
                <div className="px-2 py-1 bg-red-900/50 text-red-400 text-[10px] font-bold rounded border border-red-500/50 animate-pulse">DANGER</div>
            </div>

            <div className="p-6">
                <p className="text-slate-300 text-center mb-8 text-sm md:text-base">{event.description}</p>

                <div className="flex gap-4 md:gap-6 justify-center">
                    {/* Red Potion */}
                    <button 
                        onClick={() => handleSelect(event.choices[0])}
                        className="group relative w-32 h-40 bg-slate-800 rounded-xl border-2 border-slate-600 hover:border-red-500 transition-all hover:-translate-y-2 flex flex-col items-center justify-end overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-red-500/20 group-hover:bg-red-500/30 transition-colors"></div>
                        <div className="w-16 h-16 mb-4 relative animate-bounce">
                            <FlaskConical size={64} className="text-red-500 fill-red-500/50" />
                        </div>
                        <div className="bg-slate-900/90 w-full py-2 text-center text-red-400 font-bold text-xs border-t border-slate-700">RED</div>
                    </button>

                    {/* Blue Potion */}
                    <button 
                        onClick={() => handleSelect(event.choices[1])}
                        className="group relative w-32 h-40 bg-slate-800 rounded-xl border-2 border-slate-600 hover:border-blue-500 transition-all hover:-translate-y-2 flex flex-col items-center justify-end overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors"></div>
                        <div className="w-16 h-16 mb-4 relative animate-bounce" style={{ animationDelay: '0.5s' }}>
                            <FlaskConical size={64} className="text-blue-500 fill-blue-500/50" />
                        </div>
                        <div className="bg-slate-900/90 w-full py-2 text-center text-blue-400 font-bold text-xs border-t border-slate-700">BLUE</div>
                    </button>
                </div>

                <button 
                    onClick={() => handleSelect(event.choices[2])}
                    className="w-full mt-8 py-3 text-slate-500 hover:text-white hover:bg-slate-800 rounded transition-colors text-xs font-bold"
                >
                    RUN AWAY
                </button>
            </div>
        </div>
    );
};
