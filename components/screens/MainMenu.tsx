
import React from 'react';
import { ArrowRight, Beaker, Layout, Zap, Trophy } from 'lucide-react';
import { logic } from '../../hooks/useGameLogic';
import { StorageService } from '../../services/storageService';
import { useGameStore } from '../../store/useGameStore';
import { GameState } from '../../types';
import { audioService } from '../../services/audioService';

export const MainMenu: React.FC = () => {
    const hasSave = StorageService.hasSave();
    const { setGameState, setUiDebuggerOpen, setEventEditorOpen } = useGameStore.getState();

    const handleOpenAchievements = () => {
        audioService.playSfx('click');
        setGameState(GameState.ACHIEVEMENTS, GameState.MENU_MAIN);
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black z-0"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0"></div>
            
            {/* Debug Shortcuts */}
            <div className="absolute top-4 right-4 z-50 flex gap-2">
                <button 
                    onClick={() => { audioService.playSfx('click'); setGameState(GameState.WEATHER_LAB); }}
                    className="p-3 bg-slate-800/80 text-slate-400 hover:text-yellow-400 rounded-full border-2 border-slate-700 hover:border-yellow-400 transition-all hover:scale-110 shadow-lg"
                    title="Open FX Studio"
                >
                    <Beaker size={24} />
                </button>
                <button 
                    onClick={() => { audioService.playSfx('click'); setEventEditorOpen(true); }}
                    className="p-3 bg-slate-800/80 text-slate-400 hover:text-purple-400 rounded-full border-2 border-slate-700 hover:border-purple-400 transition-all hover:scale-110 shadow-lg"
                    title="Open Event Library"
                >
                    <Zap size={24} />
                </button>
                <button 
                    onClick={() => { audioService.playSfx('click'); setUiDebuggerOpen(true); }}
                    className="p-3 bg-slate-800/80 text-slate-400 hover:text-cyan-400 rounded-full border-2 border-slate-700 hover:border-cyan-400 transition-all hover:scale-110 shadow-lg"
                    title="Open UI Gallery"
                >
                    <Layout size={24} />
                </button>
            </div>

            {/* Legendary Decoration Layer */}
            <div className="absolute top-10 left-10 opacity-20 animate-float" style={{ animationDuration: '6s' }}>
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/249.png" className="w-48 h-48 md:w-64 md:h-64 object-contain brightness-0 invert" />
            </div>
            <div className="absolute bottom-10 right-10 opacity-20 animate-float" style={{ animationDuration: '7s', animationDelay: '1s' }}>
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/250.png" className="w-48 h-48 md:w-64 md:h-64 object-contain brightness-0 invert" />
            </div>

            <div className="z-10 text-center space-y-8 flex flex-col items-center w-full max-w-4xl">
                
                <div className="relative">
                    {/* Central Mascot */}
                    <div className="absolute left-1/2 -translate-x-1/2 -top-32 md:-top-48 z-0 opacity-80">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png" className="w-64 h-64 md:w-96 md:h-96 object-contain drop-shadow-[0_0_50px_rgba(168,85,247,0.5)] animate-pulse" />
                    </div>

                    <h1 className="relative z-10 text-4xl md:text-7xl font-pixel text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-[4px_4px_0_#000] mb-2 tracking-tighter leading-tight">
                        POKEMON<br/>MATH ADVENTURE
                    </h1>
                    <div className="h-1 w-32 bg-yellow-500 mx-auto rounded-full mb-4 shadow-[0_0_10px_#fbbf24]"></div>
                    <p className="text-blue-200 font-mono tracking-[0.5em] text-sm md:text-lg uppercase drop-shadow-md">
                        Year 8 Mathematics RPG
                    </p>
                </div>

                <div className="flex flex-col gap-4 w-full max-w-xs mx-auto mt-12 relative z-20">
                    <button onClick={logic.handleStartGame} className="group relative py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-xl shadow-lg border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 transition-all overflow-hidden">
                        <span className="relative z-10 flex items-center justify-center gap-2 text-xl font-pixel">
                          NEW GAME <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </button>
                    
                    {hasSave && (
                        <button onClick={logic.handleLoadGame} className="group relative py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold rounded-xl shadow-lg border-b-4 border-green-800 active:border-b-0 active:translate-y-1 transition-all overflow-hidden">
                            <span className="relative z-10 flex items-center justify-center gap-2 text-xl font-pixel">
                              CONTINUE
                            </span>
                        </button>
                    )}

                    {hasSave && (
                        <button onClick={handleOpenAchievements} className="group relative py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white font-bold rounded-xl shadow-lg border-b-4 border-yellow-800 active:border-b-0 active:translate-y-1 transition-all overflow-hidden">
                            <span className="relative z-10 flex items-center justify-center gap-2 text-base font-pixel">
                              <Trophy size={16} /> ACHIEVEMENTS
                            </span>
                        </button>
                    )}
                </div>
            </div>
            <div className="absolute bottom-4 text-slate-500 text-xs font-mono">MathMon v2.5 (P2P Enabled)</div>
        </div>
    );
}