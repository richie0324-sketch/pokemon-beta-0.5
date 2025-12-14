
import React, { useState } from 'react';
import { GameEvent, EventChoice, EventResult } from '../../../types';
import { audioService } from '../../../services/audioService';
import { getGameActions } from '../../../services/gameContext';
import { CloudRain, Flame, Activity, Hexagon, Wind, Snowflake, Power, ArrowRight } from 'lucide-react';

interface WeatherStationViewProps {
    event: GameEvent;
    onClose: () => void;
}

export const WeatherStationView: React.FC<WeatherStationViewProps> = ({ event, onClose }) => {
    const [result, setResult] = useState<EventResult | null>(null);

    const handleSelect = (choice: EventChoice) => {
        audioService.playSfx('click');
        const actions = getGameActions();
        const outcome = choice.onSelect(actions, event);
        if (outcome) {
            setResult(outcome);
            // Weather changes are usually neutral/positive
            audioService.playSfx('correct');
        } else {
            onClose();
        }
    };

    if (result) {
        return (
            <div className="w-full max-w-3xl bg-slate-800 flex flex-col p-8 border-8 border-slate-600 relative rounded-xl font-mono text-center shadow-2xl">
                <div className="bg-slate-900 border-b-4 border-slate-700 p-4 mb-6 flex items-center justify-center gap-3">
                     <Power className="text-green-400 animate-pulse" />
                     <h2 className="text-xl font-bold text-green-400 tracking-wider">SYSTEM UPDATED</h2>
                </div>
                
                <div className="bg-black/60 p-6 rounded border border-green-500/30 mb-8">
                    <p className="text-green-300 text-lg md:text-xl typing-effect">
                        {`> ${result.description}`}
                    </p>
                </div>

                <button 
                    onClick={onClose}
                    className="w-full py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg border-b-4 border-slate-900 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                    LOGOUT <ArrowRight size={20} />
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-3xl bg-slate-800 flex flex-col p-6 border-8 border-slate-600 relative rounded-xl font-mono">
            <div className="bg-slate-900 border-b-4 border-slate-700 p-4 mb-6 flex items-center justify-between shadow-lg">
                 <div className="flex items-center gap-3">
                     <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                     <h2 className="text-xl font-bold text-slate-200 tracking-wider">WEATHER_CTRL_SYS_V2</h2>
                 </div>
                 <CloudRain className="text-blue-400" />
            </div>
            
            <div className="flex-1 flex flex-col items-center">
                <div className="bg-black/40 p-4 rounded border border-slate-600 mb-8 w-full max-w-2xl text-center">
                    <p className="text-cyan-300 text-sm md:text-base">{event.description}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-3xl">
                     {event.choices.map((c, i) => {
                        const iconMap = [
                            <Flame size={24} className="text-orange-500 group-hover:scale-125 transition-transform" />,
                            <CloudRain size={24} className="text-blue-500 group-hover:scale-125 transition-transform" />,
                            <Wind size={24} className="text-yellow-600 group-hover:scale-125 transition-transform" />,
                            <Snowflake size={24} className="text-cyan-300 group-hover:scale-125 transition-transform" />,
                            <Hexagon size={24} className="text-green-500 group-hover:scale-125 transition-transform" />,
                            <Activity size={24} className="text-purple-500 group-hover:scale-125 transition-transform" />,
                        ];
                         return (
                             <button key={i} onClick={() => handleSelect(c)} className="aspect-square md:aspect-video bg-slate-700 rounded-lg border-b-4 border-slate-900 active:border-b-0 active:translate-y-1 transition-all flex flex-col items-center justify-center gap-2 hover:bg-slate-600 group">
                                 {iconMap[i] || <Activity />}
                                 <span className="font-bold text-xs md:text-sm text-slate-300">{c.label.split(' ')[2] || 'ACTIVATE'}</span>
                             </button>
                         )
                     })}
                </div>
            </div>
        </div>
    );
};
