
import React, { useState } from 'react';
import { GameEvent, EventChoice, EventResult } from '../../../types';
import { audioService } from '../../../services/audioService';
import { getGameActions } from '../../../services/gameContext';
import { Terminal, DollarSign, ArrowRight } from 'lucide-react';

interface GlitchedATMViewProps {
    event: GameEvent;
    onClose: () => void;
}

export const GlitchedATMView: React.FC<GlitchedATMViewProps> = ({ event, onClose }) => {
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
            <div className="w-full max-w-lg bg-black border-4 border-green-500/50 p-8 rounded-lg relative overflow-hidden font-mono text-green-500 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'repeating-linear-gradient(0deg, transparent 0, transparent 2px, rgba(0,0,0,0.5) 3px)' }}></div>
                <div className="relative z-10 flex flex-col items-center text-center">
                    <Terminal size={48} className="mb-4 text-green-400" />
                    <h3 className="text-xl font-bold mb-6 tracking-widest border-b border-green-500/30 pb-2 w-full">
                        TRANSACTION STATUS
                    </h3>
                    <div className="bg-green-900/10 p-6 border border-green-500/30 mb-8 w-full">
                        <p className="text-lg glitch-text leading-relaxed">
                            {`> ${result.description}`}
                        </p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-full bg-black hover:bg-green-900/30 border border-green-500 text-green-400 font-bold py-4 px-6 flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                    >
                        LOGOUT <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-lg bg-black border-4 border-green-500/50 p-6 rounded-lg relative overflow-hidden font-mono text-green-500 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
            {/* Scanlines */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'repeating-linear-gradient(0deg, transparent 0, transparent 2px, rgba(0,0,0,0.5) 3px)' }}></div>
            
            <div className="relative z-10">
                <div className="flex justify-between items-center mb-8 border-b border-green-500/30 pb-2">
                    <div className="flex items-center gap-2">
                        <Terminal size={20} />
                        <span className="font-bold text-sm tracking-widest">BANK_SYS_ERR_404</span>
                    </div>
                    <div className="text-xs animate-pulse">CONNECTION UNSTABLE</div>
                </div>

                <div className="bg-green-900/10 p-4 border border-green-500/30 mb-8 min-h-[100px] flex flex-col justify-center items-center text-center">
                    <DollarSign size={40} className="mb-2 opacity-50" />
                    <p className="text-lg md:text-xl font-bold glitch-text animate-pulse leading-relaxed">
                        {event.description}
                    </p>
                </div>

                <div className="space-y-3">
                    <div className="text-xs text-green-700 mb-1">SELECT INPUT_VALUE:</div>
                    {event.choices.map((c, i) => (
                        <button 
                            key={i} 
                            onClick={() => handleSelect(c)}
                            className="w-full bg-black hover:bg-green-900/30 border border-green-700 hover:border-green-400 text-green-400 hover:text-green-300 py-3 px-4 text-left font-bold transition-all group flex justify-between items-center"
                        >
                            <span>{`> ${c.label}`}</span>
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity">█</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
