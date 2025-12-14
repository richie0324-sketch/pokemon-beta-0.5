
import React, { useState } from 'react';
import { GameEvent, EventChoice, EventResult } from '../../../types';
import { audioService } from '../../../services/audioService';
import { getGameActions } from '../../../services/gameContext';
import { HelpCircle, Star, ArrowRight } from 'lucide-react';

interface QuizMasterViewProps {
    event: GameEvent;
    onClose: () => void;
}

export const QuizMasterView: React.FC<QuizMasterViewProps> = ({ event, onClose }) => {
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
            <div className="w-full max-w-lg bg-blue-900 p-1 rounded-2xl shadow-2xl relative overflow-hidden font-sans border-4 border-yellow-400">
                <div className="absolute inset-0 bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-blue-700 via-blue-900 to-black opacity-80 pointer-events-none"></div>
                <div className="relative z-10 flex flex-col items-center pt-8 pb-8 px-6 text-center">
                    <div className="w-20 h-20 rounded-full bg-white border-4 border-yellow-400 flex items-center justify-center mb-6 shadow-lg">
                        {result.type === 'positive' 
                            ? <Star size={48} className="text-yellow-500 fill-yellow-500 animate-spin-slow" />
                            : <HelpCircle size={48} className="text-gray-400" />
                        }
                    </div>
                    <h2 className="text-3xl font-black text-white italic tracking-wider mb-4 drop-shadow-md">
                        {result.type === 'positive' ? "WINNER!" : "GAME OVER"}
                    </h2>
                    <div className="bg-blue-800/90 border-2 border-blue-400 rounded-xl p-6 w-full mb-8">
                        <p className="text-xl text-white font-bold">{result.description}</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-full py-4 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xl rounded-full shadow-lg transition-transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                        CONTINUE <ArrowRight size={24} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-lg bg-blue-900 p-1 rounded-2xl shadow-2xl relative overflow-hidden font-sans border-4 border-yellow-400">
            {/* Stage Lights BG */}
            <div className="absolute inset-0 bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-blue-700 via-blue-900 to-black opacity-80 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col items-center pt-8 pb-4 px-4">
                <div className="w-20 h-20 rounded-full bg-yellow-400 border-4 border-white shadow-[0_0_30px_rgba(250,204,21,0.6)] flex items-center justify-center mb-6 animate-bounce">
                    <HelpCircle size={48} className="text-blue-900" strokeWidth={3} />
                </div>

                <div className="bg-blue-800/80 border-2 border-blue-400 rounded-xl p-6 w-full text-center mb-6 backdrop-blur-md shadow-lg">
                    <h2 className="text-2xl font-black text-white italic tracking-wider mb-2 drop-shadow-md">MATH QUIZ TIME!</h2>
                    <p className="text-blue-100 font-medium text-lg">{event.description.replace(/^.*"(.+)".*$/, '$1')}</p>
                </div>

                <div className="grid grid-cols-1 w-full gap-3">
                    {event.choices.map((c, i) => (
                        <button 
                            key={i} 
                            onClick={() => handleSelect(c)}
                            className="w-full bg-gradient-to-r from-blue-700 to-blue-600 hover:from-yellow-500 hover:to-yellow-400 hover:text-black hover:border-yellow-200 text-white font-bold py-4 rounded-full border-2 border-blue-400 transition-all shadow-md flex items-center px-6 group"
                        >
                            <span className="text-yellow-400 group-hover:text-black mr-4 font-black text-xl">{String.fromCharCode(65 + i)}.</span>
                            <span className="text-lg">{c.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
