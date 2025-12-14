
import React, { useState } from 'react';
import { GameEvent, EventChoice, EventResult } from '../../../types';
import { audioService } from '../../../services/audioService';
import { getGameActions } from '../../../services/gameContext';
import { Flame, ArrowRight } from 'lucide-react';

interface ElementalShrineViewProps {
    event: GameEvent;
    onClose: () => void;
}

export const ElementalShrineView: React.FC<ElementalShrineViewProps> = ({ event, onClose }) => {
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
            <div className="w-full max-w-2xl bg-stone-950 flex flex-col items-center justify-center p-8 border-4 border-amber-900 relative overflow-hidden rounded-2xl text-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(251,191,36,0.1),transparent)] pointer-events-none"></div>
                <Flame className="text-amber-600 mb-6 animate-pulse" size={64} />
                <h3 className="text-2xl font-serif text-amber-500 mb-6 tracking-widest uppercase border-b border-amber-800 pb-4">
                    RITUAL COMPLETE
                </h3>
                <p className="text-stone-200 font-serif text-lg leading-relaxed italic mb-8">
                    "{result.description}"
                </p>
                <button 
                    onClick={onClose}
                    className="px-8 py-3 bg-stone-900 hover:bg-stone-800 border-2 border-amber-700 text-amber-500 font-serif font-bold rounded transition-all flex items-center gap-2 mx-auto uppercase tracking-widest hover:scale-105"
                >
                    LEAVE SHRINE <ArrowRight size={20} />
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl bg-stone-950 flex flex-col items-center justify-center p-6 border-4 border-amber-900 relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(251,191,36,0.1),transparent)] pointer-events-none"></div>
            <Flame className="text-amber-600 mb-4 animate-pulse" size={48} />
            <h2 className="text-3xl font-serif text-amber-500 mb-2 text-center tracking-widest uppercase">{event.title}</h2>
            <div className="w-16 h-1 bg-amber-800 mb-6"></div>
            <p className="text-stone-300 text-center mb-8 font-serif leading-relaxed italic max-w-md">"{event.description}"</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl relative z-10">
                {event.choices.map((c, i) => (
                    <button 
                        key={i} 
                        onClick={() => handleSelect(c)}
                        className={`p-4 rounded-lg border-2 bg-stone-900 transition-all hover:-translate-y-1 active:translate-y-0 shadow-lg
                        ${i === 0 ? 'border-red-600 text-red-500 hover:bg-red-950' : ''}
                        ${i === 1 ? 'border-yellow-500 text-yellow-400 hover:bg-yellow-950' : ''}
                        ${i === 2 ? 'border-blue-500 text-blue-400 hover:bg-blue-950' : ''}
                    `}>
                        <div className="font-bold text-center">{c.label}</div>
                        <div className="text-[10px] text-center opacity-70 mt-1">{c.riskText}</div>
                    </button>
                ))}
            </div>
        </div>
    );
};
