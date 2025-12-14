
import React, { useState } from 'react';
import { GameEvent, EventChoice, EventResult } from '../../../types';
import { audioService } from '../../../services/audioService';
import { getGameActions } from '../../../services/gameContext';
import { Trees, Apple, AlertTriangle, ArrowRight } from 'lucide-react';

interface StrangeTreeViewProps {
    event: GameEvent;
    onClose: () => void;
}

export const StrangeTreeView: React.FC<StrangeTreeViewProps> = ({ event, onClose }) => {
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
            // If no outcome returned (e.g. battle started), close immediately
            onClose();
        }
    };

    if (result) {
        return (
            <div className="w-full max-w-lg bg-emerald-900 border-8 border-emerald-800 rounded-xl p-8 relative overflow-hidden shadow-2xl text-center">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/forest.png')] opacity-20 pointer-events-none"></div>
                <div className="relative z-10">
                    <h3 className={`text-2xl font-pixel mb-6 ${result.type === 'negative' ? 'text-red-300' : 'text-emerald-200'}`}>
                        {result.type === 'negative' ? 'OH NO...' : 'SUCCESS!'}
                    </h3>
                    <p className="text-white text-lg font-medium leading-relaxed mb-8">{result.description}</p>
                    <button 
                        onClick={onClose}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-lg border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 mx-auto"
                    >
                        CONTINUE <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-lg bg-emerald-900 border-8 border-emerald-800 rounded-xl p-6 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/forest.png')] opacity-20 pointer-events-none"></div>
            
            {/* Tree Graphic */}
            <div className="flex justify-center mb-6 relative z-10">
                <div className="relative animate-float">
                    <Trees size={120} className="text-emerald-400 drop-shadow-lg" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-red-500 rounded-full animate-pulse blur-md"></div>
                </div>
            </div>

            <div className="relative z-10 bg-black/40 p-4 rounded-lg border border-emerald-500/30 text-center mb-6 backdrop-blur-sm">
                <h2 className="text-2xl font-pixel text-emerald-200 mb-2">{event.title}</h2>
                <p className="text-emerald-100/90 text-sm font-mono leading-relaxed">{event.description}</p>
            </div>

            <div className="relative z-10 space-y-3">
                {event.choices.map((c, i) => (
                    <button 
                        key={i} 
                        onClick={() => handleSelect(c)}
                        className={`w-full py-4 rounded-lg font-bold border-b-4 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-between px-6
                            ${i === 0 ? 'bg-green-600 hover:bg-green-500 border-green-800 text-white' : ''}
                            ${i === 1 ? 'bg-amber-600 hover:bg-amber-500 border-amber-800 text-white' : ''}
                            ${i === 2 ? 'bg-slate-600 hover:bg-slate-500 border-slate-800 text-slate-200' : ''}
                        `}
                    >
                        <span className="flex items-center gap-2">
                            {i === 0 && <Apple size={18} className="fill-current"/>}
                            {i === 1 && <AlertTriangle size={18}/>}
                            {c.label}
                        </span>
                        {c.riskText && <span className="text-xs bg-black/20 px-2 py-1 rounded">{c.riskText}</span>}
                    </button>
                ))}
            </div>
        </div>
    );
};
