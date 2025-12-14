
import React, { useState } from 'react';
import { GameEvent, EventChoice, EventResult } from '../types';
import { audioService } from '../services/audioService';
import { Sparkles, ArrowRight, AlertTriangle } from 'lucide-react';
import { getGameActions } from '../services/gameContext';
import { showToast } from '../store/useToastStore';
import { ITEM_REGISTRY } from '../data/itemData';
import { usePlayerStore } from '../store/usePlayerStore';

// --- Import All Themed Event Views ---
import { ShopEventView } from './events/travelingShop/ShopEventView';
import { ElementalShrineView } from './events/elementalShrine/ElementalShrineView';
import { WeatherStationView } from './events/weatherStation/WeatherStationView';
import { DistortionView } from './events/distortions/DistortionView';
import { UltraSignalView } from './events/distortions/UltraSignalView';
import { MinecraftSteveView } from './events/popCulture/MinecraftSteveView';
import { RobloxNoobView } from './events/popCulture/RobloxNoobView';
import { FortniteStormView } from './events/popCulture/FortniteStormView';
import { LinkTradeView } from './events/misc/LinkTradeView';

// --- Exploration & Misc ---
import { StrangeTreeView } from './events/exploration/StrangeTreeView';
import { FossilExcavationView } from './events/exploration/FossilExcavationView';
import { AncientTruckView } from './events/exploration/AncientTruckView'; 
import { MagikarpSalesmanView } from './events/risk/MagikarpSalesmanView';
import { MadScientistView } from './events/risk/MadScientistView';
import { DayCareView } from './events/services/DayCareView';
import { MoveTutorView } from './events/services/MoveTutorView';
import { QuizMasterView } from './events/math/QuizMasterView';
import { GlitchedATMView } from './events/math/GlitchedATMView';

// --- Legends & Dungeons ---
import { JohtoLegendsView } from './events/quest/JohtoLegendsView';
import { TowerTrialView } from './dungeon/TowerTrialView';
import { WhirlpoolTrialView } from './dungeon/WhirlpoolTrialView';


interface EventModalProps {
    event: GameEvent;
    onClose: () => void;
}

// --- Generic Fallback View ---
const GenericEventView: React.FC<EventModalProps> = ({ event, onClose }) => {
    const [result, setResult] = useState<EventResult | null>(null);

    const handleChoice = (choice: EventChoice) => {
        if (choice.reqItem) {
            const hasItem = usePlayerStore.getState().inventory.some(i => i.itemId === choice.reqItem && i.count > 0);
            if (!hasItem) {
                audioService.playSfx('incorrect');
                showToast(`Requires ${ITEM_REGISTRY[choice.reqItem]?.name || choice.reqItem}`, "warning");
                return;
            }
            usePlayerStore.getState().removeItem(choice.reqItem, 1);
        }

        audioService.playSfx('click');
        const actions = getGameActions();
        const output = choice.onSelect(actions, event);
        
        if (output) {
            setResult(output);
            if (output.type === 'positive') audioService.playSfx('correct');
            if (output.type === 'negative') audioService.playSfx('damage');
        } else {
            // No result returned means the action closes the modal itself (e.g. starts a battle)
        }
    };
    
    if (result) {
        return (
             <div className="bg-slate-800 w-full max-w-lg rounded-2xl border-4 border-slate-600 shadow-lg relative p-6 space-y-6 text-center">
                <h3 className="text-xl font-bold font-pixel text-yellow-400">EVENT RESULT</h3>
                <p className="text-lg text-slate-200">{result.description}</p>
                 <button 
                    onClick={onClose}
                    className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold font-pixel rounded-xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
                >
                    CONTINUE <ArrowRight size={20} />
                </button>
             </div>
        )
    }

    return (
        <div className="bg-slate-800 w-full max-w-lg rounded-2xl border-4 border-slate-600 shadow-lg relative flex flex-col max-h-[85vh]">
            <div className="bg-slate-700 p-4 relative z-10 flex items-center justify-center gap-2 border-b border-slate-600">
                <Sparkles className="text-yellow-400" size={20} />
                <h2 className="text-xl font-pixel text-white text-center">{event.title}</h2>
            </div>
            <div className="p-6 relative z-10 flex-1 overflow-y-auto space-y-6">
                 <div className="flex justify-center">
                    <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center border-2 border-slate-500">
                        <AlertTriangle size={32} className="text-yellow-500" />
                    </div>
                </div>
                <div className="bg-black/30 p-4 rounded-xl border border-white/10 text-center">
                    <p className="text-slate-200 font-medium">{event.description}</p>
                </div>
                <div className="space-y-3">
                    {event.choices.map((choice, idx) => (
                        <button key={idx} onClick={() => handleChoice(choice)} className="group w-full bg-slate-700 hover:bg-slate-600 border-b-4 border-slate-800 active:border-b-0 active:translate-y-1 text-white p-4 rounded-xl transition-all">
                             <div className="flex justify-between items-center">
                                <span className="font-bold text-lg">{choice.label}</span>
                                {choice.riskText && (
                                    <span className="text-xs font-mono bg-black/40 px-2 py-1 rounded text-yellow-300 border border-yellow-500/30">
                                        {choice.riskText}
                                    </span>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};


// --- Main Router Component ---
export const EventModal: React.FC<EventModalProps> = ({ event, onClose }) => {
    
    const renderEventView = () => {
        switch (event.id) {
            case 'traveling_shop': return <ShopEventView event={event} onClose={onClose} />;
            case 'elemental_shrine': return <ElementalShrineView event={event} onClose={onClose} />;
            case 'weather_station': return <WeatherStationView event={event} onClose={onClose} />;
            case 'distortion_signal': return <DistortionView event={event} onClose={onClose} />;
            case 'ultra_signal': return <UltraSignalView event={event} onClose={onClose} />;
            case 'minecraft_steve': return <MinecraftSteveView event={event} onClose={onClose} />;
            case 'roblox_noob': return <RobloxNoobView event={event} onClose={onClose} />;
            case 'fortnite_storm': return <FortniteStormView event={event} onClose={onClose} />;
            case 'link_trade': return <LinkTradeView event={event} onClose={onClose} />;
            
            // Exploration
            case 'strange_tree': return <StrangeTreeView event={event} onClose={onClose} />;
            case 'fossil_excavation': return <FossilExcavationView event={event} onClose={onClose} />;
            case 'ancient_truck': return <AncientTruckView event={event} onClose={onClose} />; 
            
            // Legends & Quests
            case 'johto_hooh': 
            case 'johto_lugia': return <JohtoLegendsView event={event} onClose={onClose} />;
            case 'tower_step': return <TowerTrialView event={event} onClose={onClose} />;
            case 'whirlpool_step': return <WhirlpoolTrialView event={event} onClose={onClose} />;

            case 'magikarp_salesman': return <MagikarpSalesmanView event={event} onClose={onClose} />;
            case 'mad_scientist': return <MadScientistView event={event} onClose={onClose} />;
            case 'day_care': return <DayCareView event={event} onClose={onClose} />;
            case 'move_tutor': return <MoveTutorView event={event} onClose={onClose} />;
            case 'quiz_master': return <QuizMasterView event={event} onClose={onClose} />;
            case 'glitched_atm': return <GlitchedATMView event={event} onClose={onClose} />;

            default:
                // Fallback for any event without a custom UI
                return <GenericEventView event={event} onClose={onClose} />;
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-300">
            {/* The container now just holds the rendered view */}
            {renderEventView()}
        </div>
    );
};
