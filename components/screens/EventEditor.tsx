
import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { usePlayerStore } from '../../store/usePlayerStore';
import { GLOBAL_EVENTS } from '../../data/eventRegistry';
import { ITEM_REGISTRY } from '../../data/itemData';
import { audioService } from '../../services/audioService';
import { ArrowLeft, RefreshCw, Smartphone, Tablet, Monitor } from 'lucide-react';

// New Modular Imports (Pointing to production components)
import { ShopEventView } from '../events/travelingShop/ShopEventView';
import { ElementalShrineView } from '../events/elementalShrine/ElementalShrineView';
import { WeatherStationView } from '../events/weatherStation/WeatherStationView';
import { DistortionView } from '../events/distortions/DistortionView';
import { UltraSignalView } from '../events/distortions/UltraSignalView';
import { MinecraftSteveView } from '../events/popCulture/MinecraftSteveView';
import { RobloxNoobView } from '../events/popCulture/RobloxNoobView';
import { FortniteStormView } from '../events/popCulture/FortniteStormView';
import { LinkTradeView } from '../events/misc/LinkTradeView';

// NEW IMPORTS
import { StrangeTreeView } from '../events/exploration/StrangeTreeView';
import { FossilExcavationView } from '../events/exploration/FossilExcavationView';
import { AncientTruckView } from '../events/exploration/AncientTruckView'; 
import { JohtoLegendsView } from '../events/quest/JohtoLegendsView'; // NEW

import { MagikarpSalesmanView } from '../events/risk/MagikarpSalesmanView';
import { MadScientistView } from '../events/risk/MadScientistView';
import { DayCareView } from '../events/services/DayCareView';
import { MoveTutorView } from '../events/services/MoveTutorView';
import { QuizMasterView } from '../events/math/QuizMasterView';
import { GlitchedATMView } from '../events/math/GlitchedATMView';

export const EventEditor: React.FC = () => {
    const { setEventEditorOpen } = useGameStore.getState();
    const [activeEventId, setActiveEventId] = useState(GLOBAL_EVENTS[0].id);
    const [viewportMode, setViewportMode] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
    const [refreshKey, setRefreshKey] = useState(0);

    const activeEvent = GLOBAL_EVENTS.find(e => e.id === activeEventId) || GLOBAL_EVENTS[0];

    const setupMockState = () => {
        // Mock state for specific complex events
        if (activeEventId === 'traveling_shop') {
             // Inject stock
             const fullStock = Object.values(ITEM_REGISTRY)
                .filter(item => item.price > 0 && item.id !== 'poke-ball')
                .map(item => ({ itemId: item.id, price: item.price, count: 1 }));
             activeEvent.data = { stock: fullStock };
             usePlayerStore.setState({ money: 5000, inventory: [] });
        }
        setRefreshKey(p => p + 1);
    };

    const handleSelectEvent = (id: string) => {
        audioService.playSfx('click');
        setActiveEventId(id);
        setTimeout(setupMockState, 10);
    };

    const renderActiveEvent = () => {
        switch (activeEventId) {
            case 'traveling_shop': return <ShopEventView event={activeEvent} onClose={() => {}} />;
            case 'elemental_shrine': return <ElementalShrineView event={activeEvent} onClose={() => {}} />;
            case 'weather_station': return <WeatherStationView event={activeEvent} onClose={() => {}} />;
            case 'distortion_signal': return <DistortionView event={activeEvent} onClose={() => {}} />;
            case 'minecraft_steve': return <MinecraftSteveView event={activeEvent} onClose={() => {}} />;
            case 'roblox_noob': return <RobloxNoobView event={activeEvent} onClose={() => {}} />;
            case 'fortnite_storm': return <FortniteStormView event={activeEvent} onClose={() => {}} />;
            case 'ultra_signal': return <UltraSignalView event={activeEvent} onClose={() => {}} />;
            case 'link_trade': return <LinkTradeView event={activeEvent} onClose={() => {}} />;
            
            // NEW
            case 'strange_tree': return <StrangeTreeView event={activeEvent} onClose={() => {}} />;
            case 'fossil_excavation': return <FossilExcavationView event={activeEvent} onClose={() => {}} />;
            case 'ancient_truck': return <AncientTruckView event={activeEvent} onClose={() => {}} />;
            
            case 'johto_hooh': 
            case 'johto_lugia': return <JohtoLegendsView event={activeEvent} onClose={() => {}} />; // NEW

            case 'magikarp_salesman': return <MagikarpSalesmanView event={activeEvent} onClose={() => {}} />;
            case 'mad_scientist': return <MadScientistView event={activeEvent} onClose={() => {}} />;
            case 'day_care': return <DayCareView event={activeEvent} onClose={() => {}} />;
            case 'move_tutor': return <MoveTutorView event={activeEvent} onClose={() => {}} />;
            case 'quiz_master': return <QuizMasterView event={activeEvent} onClose={() => {}} />;
            case 'glitched_atm': return <GlitchedATMView event={activeEvent} onClose={() => {}} />;

            default:
                return <div className="text-white text-center mt-20">Preview not configured for {activeEventId}</div>;
        }
    };

    const viewportClass = {
        'mobile': 'w-[375px] h-[667px]',
        'tablet': 'w-[768px] h-[1024px]',
        'desktop': 'w-full h-full'
    }[viewportMode];

    return (
        <div className="min-h-screen flex bg-black font-mono overflow-hidden fixed inset-0 z-[200]">
            {/* Sidebar */}
            <div className="w-64 bg-slate-900 border-r border-slate-700 flex flex-col shrink-0 z-50">
                <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800">
                    <h2 className="text-yellow-400 font-bold font-pixel text-xs">EVENT LIBRARY</h2>
                    <button onClick={() => setEventEditorOpen(false)} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white">
                        <ArrowLeft size={20} />
                    </button>
                </div>
                
                <div className="flex justify-center gap-2 p-2 bg-slate-950 border-b border-slate-800">
                    <button onClick={() => setViewportMode('mobile')} className={`p-2 rounded ${viewportMode === 'mobile' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}><Smartphone size={16}/></button>
                    <button onClick={() => setViewportMode('tablet')} className={`p-2 rounded ${viewportMode === 'tablet' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}><Tablet size={16}/></button>
                    <button onClick={() => setViewportMode('desktop')} className={`p-2 rounded ${viewportMode === 'desktop' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}><Monitor size={16}/></button>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {GLOBAL_EVENTS.map(e => (
                        <button
                            key={e.id}
                            onClick={() => handleSelectEvent(e.id)}
                            className={`w-full text-left px-4 py-3 rounded text-xs font-bold transition-colors border-l-4
                                ${activeEventId === e.id 
                                    ? 'bg-slate-800 text-white border-yellow-500' 
                                    : 'text-slate-400 border-transparent hover:bg-slate-800/50'}
                            `}
                        >
                            <div className="truncate">{e.title}</div>
                            <div className="text-[10px] opacity-50 truncate">{e.id}</div>
                        </button>
                    ))}
                </div>

                <div className="p-2 border-t border-slate-800">
                    <button onClick={setupMockState} className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded flex items-center justify-center gap-2 text-xs font-bold">
                        <RefreshCw size={14} /> RELOAD STATE
                    </button>
                </div>
            </div>

            {/* Preview Stage */}
            <div className="flex-1 bg-slate-950 flex items-center justify-center relative overflow-hidden p-8">
                <div 
                    className={`relative bg-slate-900 shadow-2xl transition-all duration-300 overflow-hidden border border-slate-800 ${viewportClass}`}
                    style={{ transform: 'translateZ(0)' }} 
                >
                    <div key={refreshKey} className="w-full h-full relative">
                        {renderActiveEvent()}
                    </div>
                </div>
            </div>
        </div>
    );
};
