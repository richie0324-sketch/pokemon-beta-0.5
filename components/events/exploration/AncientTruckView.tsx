
import React, { useState } from 'react';
import { GameEvent, EventChoice, EventResult } from '../../../types';
import { audioService } from '../../../services/audioService';
import { getGameActions } from '../../../services/gameContext';
import { Truck, Anchor, HelpCircle, ArrowRight } from 'lucide-react';

interface AncientTruckViewProps {
    event: GameEvent;
    onClose: () => void;
}

export const AncientTruckView: React.FC<AncientTruckViewProps> = ({ event, onClose }) => {
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
            // Battle started
            onClose();
        }
    };

    if (result) {
        return (
            <div className="w-full max-w-lg bg-slate-800 border-8 border-slate-600 rounded-xl p-8 relative overflow-hidden shadow-2xl text-center">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')] opacity-20 pointer-events-none"></div>
                <div className="relative z-10">
                    <h3 className={`text-2xl font-bold font-pixel mb-6 ${result.type === 'negative' ? 'text-slate-400' : 'text-blue-300'}`}>
                        {result.type === 'negative' ? 'NOTHING HAPPENED' : 'DISCOVERY!'}
                    </h3>
                    <p className="text-slate-200 text-lg font-mono leading-relaxed mb-8">{result.description}</p>
                    <button 
                        onClick={onClose}
                        className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-lg border-b-4 border-slate-900 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2"
                    >
                        WALK AWAY <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-lg bg-slate-800 border-8 border-slate-600 rounded-xl p-6 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')] opacity-20 pointer-events-none"></div>
            
            {/* Header */}
            <div className="flex flex-col items-center mb-6 relative z-10">
                <div className="w-24 h-24 bg-blue-900/50 rounded-full flex items-center justify-center border-4 border-blue-500 mb-4 shadow-lg animate-float">
                    <Truck size={48} className="text-blue-300" />
                </div>
                <div className="bg-black/40 px-4 py-2 rounded-lg border border-slate-500/50 text-center">
                    <h2 className="text-xl font-bold font-pixel text-blue-200 mb-1">{event.title}</h2>
                    <div className="flex items-center justify-center gap-2 text-slate-400 text-xs uppercase tracking-widest">
                        <Anchor size={12} /> Vermilion Pier <Anchor size={12} />
                    </div>
                </div>
            </div>

            <div className="relative z-10 mb-6 bg-slate-900/50 p-4 rounded border-l-4 border-blue-500">
                <p className="text-slate-300 text-sm font-mono italic">"{event.description}"</p>
            </div>

            <div className="relative z-10 space-y-3">
                {event.choices.map((c, i) => (
                    <button 
                        key={i} 
                        onClick={() => handleSelect(c)}
                        className={`w-full py-4 px-6 rounded-lg font-bold border-b-4 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-between group
                            ${i === 0 ? 'bg-blue-700 hover:bg-blue-600 border-blue-900 text-white' : ''}
                            ${i === 1 ? 'bg-slate-700 hover:bg-slate-600 border-slate-900 text-slate-200' : ''}
                            ${i === 2 ? 'bg-transparent border-slate-700 hover:bg-slate-800 text-slate-500 hover:text-slate-400' : ''}
                        `}
                    >
                        <span className="flex items-center gap-3">
                            {i === 0 && <div className="bg-blue-900 p-1 rounded"><Truck size={16} /></div>}
                            {i === 1 && <div className="bg-slate-800 p-1 rounded"><HelpCircle size={16} /></div>}
                            {c.label}
                        </span>
                        {c.riskText && (
                            <span className="text-[10px] bg-black/30 px-2 py-1 rounded text-blue-200 border border-blue-500/30">
                                {c.riskText}
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};
