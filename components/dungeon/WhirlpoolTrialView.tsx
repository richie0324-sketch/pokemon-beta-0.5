
import React, { useState, useEffect } from 'react';
import { GameEvent, EventChoice, EventResult } from '../../types';
import { audioService } from '../../services/audioService';
import { getGameActions } from '../../services/gameContext';
import { useGameStore } from '../../store/useGameStore';
import { randInt } from '../../services/mathUtils';
import { Waves, ArrowRight, Anchor, Compass } from 'lucide-react';

interface WhirlpoolTrialViewProps {
    event: GameEvent;
    onClose: () => void;
}

export const WhirlpoolTrialView: React.FC<WhirlpoolTrialViewProps> = ({ event, onClose }) => {
    const [result, setResult] = useState<EventResult | null>(null);
    const [options, setOptions] = useState<any[]>([]);
    const { activeQuest } = useGameStore();
    
    const currentDepth = (activeQuest?.currentProgress || 0) + 1;
    const totalDepth = activeQuest?.requiredProgress || 5;

    // Generate options on mount
    useEffect(() => {
        const opts = [
            { id: 'A', prob: randInt(10, 40), label: '' },
            { id: 'B', prob: randInt(45, 65), label: '' },
            { id: 'C', prob: randInt(70, 95), label: '' }
        ];
        
        // Format labels randomly
        opts.forEach(o => {
            const format = Math.random();
            if (format < 0.33) o.label = `${o.prob}%`;
            else if (format < 0.66) o.label = `0.${o.prob}`;
            else o.label = `${Math.floor(o.prob/10)}/10`;
        });

        // Shuffle
        setOptions(opts.sort(() => Math.random() - 0.5));
    }, []);

    const handleSelect = (opt: any) => {
        audioService.playSfx('click');
        const actions = getGameActions();
        
        // Logic: Find highest probability in the set
        const maxProb = Math.max(...options.map(o => o.prob));
        const isBestChoice = opt.prob === maxProb;
        
        // Always progress, but punish if wrong
        useGameStore.getState().updateQuestProgress(1);

        if (isBestChoice) {
            audioService.playSfx('correct');
            setResult({ description: 'You navigated the calmest current safely. Deeper you go...', type: 'positive' });
        } else {
            actions.player.damageActivePct(0.25);
            actions.game.addBuff('mist', 99); // Permanent fog
            audioService.playSfx('damage');
            setResult({ description: 'Turbulence! You were swept into the rocks. Taken damage + Permanent Fog.', type: 'negative' });
        }
    };

    if (result) {
        return (
            <div className="w-full max-w-lg bg-slate-900 border-[8px] border-blue-900 rounded-xl p-8 relative overflow-hidden shadow-2xl text-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(30,58,138,0.3),transparent)] pointer-events-none"></div>
                <div className="relative z-10">
                    <h3 className={`text-3xl font-pixel mb-6 ${result.type === 'negative' ? 'text-red-400' : 'text-cyan-300'}`}>
                        {result.type === 'negative' ? 'CRASH!' : 'SAFE!'}
                    </h3>
                    <div className="bg-black/60 p-4 rounded-lg border border-blue-800/50 mb-8">
                        <p className="text-blue-100 text-lg font-mono leading-relaxed">{result.description}</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg border-b-4 border-blue-950 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 mx-auto"
                    >
                        DIVE DEEPER <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-lg bg-slate-950 border-[8px] border-blue-900 rounded-xl p-6 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.1),transparent)] pointer-events-none"></div>
            
            {/* Header */}
            <div className="flex flex-col items-center mb-8 relative z-10">
                <div className="flex items-center gap-2 text-cyan-500 font-mono text-xs uppercase tracking-widest mb-2">
                    <Anchor size={14} /> Depth {currentDepth} / {totalDepth} <Anchor size={14} />
                </div>
                <div className="p-4 rounded-full bg-blue-900/30 border-2 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.3)] animate-float">
                    <Waves size={64} className="text-cyan-400" />
                </div>
                <h2 className="text-xl font-bold text-cyan-100 mt-4 text-center">SELECT SAFEST CURRENT</h2>
                <p className="text-cyan-400/70 text-xs mt-1">Which path has the highest probability of safety?</p>
            </div>

            <div className="relative z-10 grid grid-cols-1 gap-3">
                {options.map((opt, i) => (
                    <button 
                        key={i} 
                        onClick={() => handleSelect(opt)}
                        className="w-full py-4 px-6 rounded-lg font-bold border-2 border-blue-800 bg-blue-950/50 hover:bg-blue-900 text-cyan-300 hover:text-white hover:border-cyan-500 transition-all flex items-center justify-between group"
                    >
                        <span className="flex items-center gap-3">
                            <Compass size={20} className="text-blue-500 group-hover:text-cyan-400" />
                            Current {String.fromCharCode(65+i)}
                        </span>
                        <span className="font-mono text-lg bg-black/40 px-3 py-1 rounded border border-blue-800/50 group-hover:border-cyan-500/50">
                            {opt.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};
