
import React, { useState } from 'react';
import { GameEvent, EventChoice, EventResult } from '../../../types';
import { audioService } from '../../../services/audioService';
import { getGameActions } from '../../../services/gameContext';
import { Pickaxe, Mountain, Search, ArrowRight } from 'lucide-react';

interface FossilExcavationViewProps {
    event: GameEvent;
    onClose: () => void;
}

export const FossilExcavationView: React.FC<FossilExcavationViewProps> = ({ event, onClose }) => {
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
            <div className="w-full max-w-lg bg-stone-800 border-[12px] border-stone-600 rounded-lg p-8 relative shadow-2xl text-center">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-10 pointer-events-none"></div>
                <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-stone-200 font-pixel uppercase tracking-widest mb-6 border-b-4 border-stone-700 pb-2">
                        EXCAVATION REPORT
                    </h3>
                    <p className="text-stone-300 text-lg font-serif italic mb-8">"{result.description}"</p>
                    <button 
                        onClick={onClose}
                        className="w-full py-4 bg-yellow-700 border-yellow-500 hover:bg-yellow-600 text-yellow-100 font-bold rounded border-2 transition-all flex items-center justify-center gap-2"
                    >
                        LEAVE SITE <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-lg bg-stone-800 border-[12px] border-stone-600 rounded-lg p-6 relative shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-10 pointer-events-none"></div>
            
            <div className="flex items-center gap-4 mb-6 border-b-4 border-stone-700 pb-4">
                <div className="bg-stone-900 p-3 rounded-full border-2 border-yellow-600">
                    <Mountain size={32} className="text-yellow-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-stone-200 font-pixel uppercase tracking-widest">Excavation Site</h2>
                    <p className="text-stone-400 text-xs font-mono">Sector 7-G</p>
                </div>
            </div>

            <div className="bg-stone-900/80 p-4 rounded border-l-4 border-yellow-600 mb-6 relative z-10">
                <p className="text-stone-300 italic font-serif">"{event.description}"</p>
            </div>

            <div className="grid grid-cols-1 gap-3 relative z-10">
                {event.choices.map((c, i) => (
                    <button 
                        key={i} 
                        onClick={() => handleSelect(c)}
                        className={`group relative w-full py-3 px-4 rounded font-bold border-2 transition-all flex items-center gap-3
                            ${i === 0 ? 'bg-yellow-700 border-yellow-500 hover:bg-yellow-600 text-yellow-100' : ''}
                            ${i === 1 ? 'bg-stone-700 border-stone-500 hover:bg-stone-600 text-stone-200' : ''}
                            ${i === 2 ? 'bg-transparent border-stone-700 hover:bg-stone-900 text-stone-500' : ''}
                        `}
                    >
                        <div className="shrink-0">
                            {i === 0 && <Pickaxe size={20} className="group-hover:rotate-12 transition-transform"/>}
                            {i === 1 && <Search size={20} />}
                        </div>
                        <div className="text-left flex-1">
                            <div className="leading-none">{c.label}</div>
                            {c.riskText && <div className="text-[10px] opacity-70 font-mono mt-1">{c.riskText}</div>}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};
