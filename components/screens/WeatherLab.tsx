import React, { useState } from 'react';
import { FieldTerrain, GameState } from '../../types';
import { WeatherFilters, WeatherParticles, WeatherBanner } from '../WeatherOverlay';
import { useGameStore } from '../../store/useGameStore';
import { audioService } from '../../services/audioService';
import { ArrowLeft, CloudRain, Sun, Snowflake, Wind, Zap, CloudDrizzle, Flame, Activity, Hexagon, Ghost } from 'lucide-react';

export const WeatherLab: React.FC = () => {
    const { setGameState } = useGameStore();
    const [currentTerrain, setCurrentTerrain] = useState<FieldTerrain>('NORMAL');

    const handleBack = () => {
        audioService.playSfx('click');
        setGameState(GameState.MENU_MAIN);
    };

    const toggleEffect = (terrain: FieldTerrain) => {
        audioService.playSfx('click');
        setCurrentTerrain(terrain);
    };

    // Generic Dark Battle Background for Neutral Testing
    const bgStyle = {
        background: 'linear-gradient(to bottom, #1f2937 0%, #111827 100%)',
        boxShadow: 'inset 0 0 100px rgba(0,0,0,0.5)'
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col font-mono relative overflow-hidden">
            {/* Header */}
            <div className="p-3 md:p-4 bg-slate-900 border-b-4 border-slate-700 flex justify-between items-center z-50 shadow-lg">
                <button onClick={handleBack} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors bg-slate-800 px-4 py-2 rounded-lg border border-slate-600 hover:border-slate-400">
                    <ArrowLeft size={18} /> <span className="hidden md:inline">EXIT LAB</span>
                </button>
                <div className="text-center">
                    <h1 className="text-xl font-pixel text-yellow-400 tracking-wider">FX STUDIO</h1>
                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Visual Effects Debugger</p>
                </div>
                <div className="w-24"></div> {/* Spacer for center alignment */}
            </div>

            {/* MOCK BATTLE SCENE */}
            {/* This container replicates the layering of BattleScreen.tsx exactly */}
            <div className="flex-1 relative overflow-hidden flex items-center justify-center border-b-4 border-slate-800" style={bgStyle}>
                
                {/* LAYER 1: WEATHER FILTERS (Atmosphere/Tint/Flash) - Z-0 */}
                {/* Thunderstorm Only in BG */}
                {currentTerrain === 'THUNDER_STORM' && (
                    <div className="absolute inset-0 z-0">
                        <WeatherFilters terrain={currentTerrain} />
                    </div>
                )}

                {/* LAYER 2: POKEMON SPRITES - Z-10 */}
                <div className="relative w-full max-w-5xl h-full mx-auto z-10 pointer-events-none">
                    
                    {/* Mock Enemy (Mewtwo) */}
                    <div className="absolute top-16 right-8 md:top-24 md:right-32 w-32 h-32 md:w-64 md:h-64 flex items-center justify-center animate-float">
                        <img 
                            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png" 
                            className="w-full h-full object-contain drop-shadow-2xl z-10"
                            alt="Enemy"
                        />
                        {/* Shadow */}
                        <div className="absolute bottom-0 w-2/3 h-4 bg-black/40 rounded-[50%] blur-md -z-10 transform scale-x-125"></div>
                    </div>

                    {/* Mock Player (Charizard - Flipped) */}
                    <div className="absolute bottom-8 left-8 md:bottom-12 md:left-32 w-40 h-40 md:w-72 md:h-72 flex items-center justify-center">
                        <img 
                            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png" 
                            className="w-full h-full object-contain drop-shadow-2xl scale-x-[-1] z-10"
                            alt="Player"
                        />
                        {/* Shadow */}
                        <div className="absolute bottom-4 w-2/3 h-5 bg-black/40 rounded-[50%] blur-md -z-10 left-8"></div>
                    </div>

                </div>

                {/* LAYER 3: WEATHER PARTICLES & FG FILTERS - Z-20 */}
                {/* All other filters in FG */}
                <div className="absolute inset-0 z-20 pointer-events-none">
                    {currentTerrain !== 'THUNDER_STORM' && (
                        <WeatherFilters terrain={currentTerrain} />
                    )}
                    <WeatherParticles terrain={currentTerrain} />
                </div>

                {/* LAYER 4: WEATHER BANNER (UI) - Z-30 */}
                <WeatherBanner terrain={currentTerrain} />
                
            </div>

            {/* Control Panel */}
            <div className="h-1/3 min-h-[200px] bg-slate-900 border-t-4 border-slate-800 z-50 p-4 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                    <div className="text-xs text-slate-500 font-bold mb-3 uppercase tracking-wider text-center">Select Environment Effect</div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        <button onClick={() => toggleEffect('NORMAL')} className={getBtnClass(currentTerrain, 'NORMAL')}>
                            <span className="text-slate-400">🚫</span> NO EFFECT
                        </button>
                        
                        <button onClick={() => toggleEffect('THUNDER_STORM')} className={getBtnClass(currentTerrain, 'THUNDER_STORM')}>
                            <CloudRain size={16} className="text-blue-400"/> THUNDERSTORM
                        </button>
                        
                        <button onClick={() => toggleEffect('MISTY_RAIN')} className={getBtnClass(currentTerrain, 'MISTY_RAIN')}>
                            <CloudDrizzle size={16} className="text-teal-400"/> MISTY RAIN
                        </button>
                        
                        <button onClick={() => toggleEffect('SCORCHING_SUN')} className={getBtnClass(currentTerrain, 'SCORCHING_SUN')}>
                            <Sun size={16} className="text-orange-400"/> HARSH SUN
                        </button>
                        
                        <button onClick={() => toggleEffect('VOLCANIC_ASH')} className={getBtnClass(currentTerrain, 'VOLCANIC_ASH')}>
                            <Flame size={16} className="text-red-500"/> VOLCANIC ASH
                        </button>
                        
                        <button onClick={() => toggleEffect('BLIZZARD')} className={getBtnClass(currentTerrain, 'BLIZZARD')}>
                            <Snowflake size={16} className="text-cyan-300"/> BLIZZARD
                        </button>
                        
                        <button onClick={() => toggleEffect('SANDSTORM')} className={getBtnClass(currentTerrain, 'SANDSTORM')}>
                            <Wind size={16} className="text-amber-600"/> SANDSTORM
                        </button>
                        
                        <button onClick={() => toggleEffect('JUNGLE')} className={getBtnClass(currentTerrain, 'JUNGLE')}>
                            <Hexagon size={16} className="text-green-500"/> JUNGLE
                        </button>
                        
                        <button onClick={() => toggleEffect('STATIC_FIELD')} className={getBtnClass(currentTerrain, 'STATIC_FIELD')}>
                            <Activity size={16} className="text-yellow-400"/> STATIC FIELD
                        </button>
                        
                        <button onClick={() => toggleEffect('GLITCH_FIELD')} className={getBtnClass(currentTerrain, 'GLITCH_FIELD')}>
                            <Zap size={16} className="text-purple-500"/> GLITCH FIELD
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper for button styling
const getBtnClass = (current: FieldTerrain, target: FieldTerrain) => {
    const isActive = current === target;
    return `
        p-3 rounded-lg border-2 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95
        ${isActive 
            ? 'bg-slate-700 border-yellow-500 text-white shadow-[0_0_15px_rgba(234,179,8,0.2)]' 
            : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750 hover:border-slate-500'}
    `;
};