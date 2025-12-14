
import React, { useState } from 'react';
import { GameEvent, EventChoice, EventResult } from '../../../types';
import { audioService } from '../../../services/audioService';
import { getGameActions } from '../../../services/gameContext';
import { ArrowRight } from 'lucide-react';

interface MinecraftSteveViewProps {
    event: GameEvent;
    onClose: () => void;
}

export const MinecraftSteveView: React.FC<MinecraftSteveViewProps> = ({ event, onClose }) => {
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
            <div className="w-full max-w-lg bg-[#18120e] flex flex-col items-center justify-center p-6 font-mono border-[16px] border-[#5d4037] relative rounded-lg text-center">
                <div className="bg-[#c6c6c6] border-4 border-black p-1 w-full max-w-lg mb-6 shadow-xl">
                    <div className="bg-[#8b8b8b] border-2 border-white/50 border-r-black/50 border-b-black/50 p-6">
                        <h2 className="text-[#ffff55] font-bold text-xl mb-4 font-pixel">ACHIEVEMENT GET!</h2>
                        <p className="text-white text-lg">{result.description}</p>
                    </div>
                </div>
                <button 
                    onClick={onClose}
                    className="bg-[#8b8b8b] border-2 border-white hover:bg-[#a0a0a0] active:bg-[#6b6b6b] p-4 text-white font-bold text-shadow-sm flex items-center justify-center gap-2 w-full max-w-xs"
                >
                    Respawn <ArrowRight size={20} />
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-lg bg-[#18120e] flex flex-col items-center justify-center p-6 font-mono border-[16px] border-[#5d4037] relative rounded-lg">
             <div className="bg-[#c6c6c6] border-4 border-black p-1 w-full max-w-lg mb-6 shadow-xl">
                 <div className="bg-[#8b8b8b] border-2 border-white/50 border-r-black/50 border-b-black/50 p-4 text-center">
                     <h2 className="text-[#3f3f3f] font-bold text-xl mb-2">{event.title}</h2>
                     <p className="text-[#3f3f3f] text-sm">{event.description}</p>
                 </div>
             </div>
             <div className="grid grid-cols-1 gap-2 w-full max-w-md">
                 {event.choices.map((c, i) => (
                     <button key={i} onClick={() => handleSelect(c)} className="bg-[#8b8b8b] border-2 border-white hover:bg-[#a0a0a0] active:bg-[#6b6b6b] p-3 text-white font-bold text-shadow-sm flex items-center justify-between px-6">
                         <span>{c.label}</span>
                         {c.riskText && <span className="text-yellow-300 text-xs">{c.riskText}</span>}
                     </button>
                 ))}
             </div>
        </div>
    );
};
