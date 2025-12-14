
import React, { useState } from 'react';
import { GameEvent, EventChoice, EventResult } from '../../../types';
import { audioService } from '../../../services/audioService';
import { getGameActions } from '../../../services/gameContext';
import { Feather, Waves, ArrowRight, Sun, CloudRain } from 'lucide-react';

interface JohtoLegendsViewProps {
    event: GameEvent;
    onClose: () => void;
}

export const JohtoLegendsView: React.FC<JohtoLegendsViewProps> = ({ event, onClose }) => {
    const [result, setResult] = useState<EventResult | null>(null);
    const isHoOh = event.id === 'johto_hooh';

    // Theme Config
    const theme = isHoOh ? {
        bg: 'bg-amber-950',
        border: 'border-yellow-600',
        text: 'text-yellow-100',
        accent: 'text-yellow-500',
        icon: <Feather size={64} className="text-yellow-500 animate-float" />,
        pattern: 'https://www.transparenttextures.com/patterns/gold-scale.png',
        button: 'bg-yellow-700 border-yellow-500 hover:bg-yellow-600',
        subIcon: <Sun size={20} />
    } : {
        bg: 'bg-slate-950',
        border: 'border-blue-600',
        text: 'text-blue-100',
        accent: 'text-blue-400',
        icon: <Waves size={64} className="text-blue-400 animate-pulse" />,
        pattern: 'https://www.transparenttextures.com/patterns/cubes.png',
        button: 'bg-blue-700 border-blue-500 hover:bg-blue-600',
        subIcon: <CloudRain size={20} />
    };

    const handleSelect = (choice: EventChoice) => {
        audioService.playSfx('click');
        const actions = getGameActions();
        const outcome = choice.onSelect(actions, event);
        if (outcome) {
            setResult(outcome);
            if (outcome.type === 'positive') audioService.playSfx('correct');
        } else {
            onClose();
        }
    };

    if (result) {
        return (
            <div className={`w-full max-w-lg ${theme.bg} border-[8px] ${theme.border} rounded-xl p-8 relative overflow-hidden shadow-2xl text-center`}>
                <div className={`absolute inset-0 bg-[url('${theme.pattern}')] opacity-20 pointer-events-none`}></div>
                <div className="relative z-10 flex flex-col items-center">
                    {theme.icon}
                    <h3 className={`text-2xl font-bold font-pixel mt-6 mb-4 ${theme.accent}`}>
                        QUEST STARTED
                    </h3>
                    <p className={`${theme.text} text-lg font-serif italic mb-8 leading-relaxed`}>
                        "{result.description}"
                    </p>
                    <button 
                        onClick={onClose}
                        className={`w-full py-4 ${theme.button} text-white font-bold rounded-lg border-b-4 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2`}
                    >
                        BEGIN JOURNEY <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`w-full max-w-lg ${theme.bg} border-[8px] ${theme.border} rounded-xl p-6 relative overflow-hidden shadow-2xl`}>
            <div className={`absolute inset-0 bg-[url('${theme.pattern}')] opacity-20 pointer-events-none`}></div>
            
            <div className="relative z-10 text-center mb-6">
                <div className="flex justify-center mb-4">
                    <div className={`p-4 rounded-full border-4 ${theme.border} bg-black/40 shadow-lg`}>
                        {theme.icon}
                    </div>
                </div>
                <h2 className={`text-2xl md:text-3xl font-bold font-pixel uppercase ${theme.accent} mb-2 drop-shadow-md`}>
                    {event.title}
                </h2>
                <div className="w-24 h-1 bg-white/20 mx-auto mb-4"></div>
            </div>

            <div className="relative z-10 bg-black/40 p-5 rounded-lg border border-white/10 mb-8 backdrop-blur-sm">
                <p className={`${theme.text} text-center font-serif text-lg leading-relaxed`}>
                    {event.description}
                </p>
            </div>

            <div className="relative z-10 space-y-3">
                {event.choices.map((c, i) => (
                    <button 
                        key={i} 
                        onClick={() => handleSelect(c)}
                        className={`w-full py-4 px-6 rounded-lg font-bold border-b-4 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-between group
                            ${i === 0 ? `${theme.button} text-white` : 'bg-slate-700 hover:bg-slate-600 border-slate-900 text-slate-300'}
                        `}
                    >
                        <span className="flex items-center gap-3">
                            {i === 0 && theme.subIcon}
                            {c.label}
                        </span>
                        {c.riskText && (
                            <span className="text-[10px] bg-black/40 px-2 py-1 rounded border border-white/20 uppercase tracking-wider">
                                {c.riskText}
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};
