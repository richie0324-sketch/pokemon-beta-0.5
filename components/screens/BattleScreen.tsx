import React, { useState } from 'react';
import { useShallow } from 'zustand/shallow';
import { PokemonType, FieldTerrain, EncounterModifier } from '../../types';
import { TYPE_ENVIRONMENTS, LEGENDARY_BG_STYLE } from '../../constants';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useBattleStore } from '../../store/useBattleStore';
import { useGameStore } from '../../store/useGameStore';
import { AlertTriangle, Sword } from 'lucide-react';

// Sub-components
import { PixelPokeball } from '../battle/BattleAssets';
import { BattleTopBar } from '../battle/BattleTopBar';
import { StreakDisplay } from '../battle/StreakDisplay';
import { PlayerHud, EnemyHud } from '../battle/BattleHud';
import { EnemyTeamStatus, BattleTimer, MasterBallAnimation } from '../battle/BattleVisuals';
import { BuffDisplay } from '../battle/BuffDisplay';
import { BattleInfoModal } from '../battle/BattleInfoModal';
import { WeatherFilters, WeatherParticles, WeatherBanner } from '../WeatherOverlay';

interface BattleScreenProps {
    children: React.ReactNode; 
}

// Helper to map Game Logic state to Visual State
const resolveVisualTerrain = (activeField: FieldTerrain, mod: EncounterModifier | null): FieldTerrain => {
    // Priority 1: Quest Fields (Boss Battles)
    if (activeField !== 'NORMAL') return activeField;

    // Priority 2: Random Events (Weather Station)
    if (mod) {
        switch (mod.label) {
            case 'THUNDERSTORM': return 'THUNDER_STORM';
            case 'HARSH SUN': return 'SCORCHING_SUN';
            case 'FOG': return 'MISTY_RAIN';
            case 'SANDSTORM': return 'SANDSTORM';
            case 'BLIZZARD': return 'BLIZZARD';
            case 'ASHFALL': return 'VOLCANIC_ASH';
            case 'JUNGLE': return 'JUNGLE';
            default: return 'NORMAL';
        }
    }
    return 'NORMAL';
};

export const BattleScreen: React.FC<BattleScreenProps> = ({ children }) => {
    const [showInfo, setShowInfo] = useState(false);
    
    const playerPokemon = usePlayerStore(state => state.playerPokemon)!;
    
    // Global Game State (For Weather/Field)
    const { activeField, encounterModifier } = useGameStore(useShallow(state => ({
        activeField: state.activeField,
        encounterModifier: state.encounterModifier
    })));

    // Select all battle state in one go to minimize re-renders
    const {
        enemyPokemon, streak, targetStreak, turnCount, attackAnim, damageAnim,
        catchAnim, isMasterBallActive, isTrainerBattle, trainerName,
        enemyTeamCount, enemyTeamIndex, currentTrainer, timeRemaining, preppedBall
    } = useBattleStore(useShallow(state => ({
        enemyPokemon: state.enemyPokemon,
        streak: state.streak,
        targetStreak: state.targetStreak,
        turnCount: state.turnCount,
        attackAnim: state.attackAnim,
        damageAnim: state.damageAnim,
        catchAnim: state.catchAnim,
        isMasterBallActive: state.isMasterBallActive,
        isTrainerBattle: state.isTrainerBattle,
        trainerName: state.currentTrainer?.name,
        enemyTeamCount: state.enemyTeam.length,
        enemyTeamIndex: state.enemyTeamIndex,
        currentTrainer: state.currentTrainer,
        timeRemaining: state.battleTimer,
        preppedBall: state.preppedBall
    })));

    if (!playerPokemon || !enemyPokemon) return null; // Should not happen if rendered correctly
    
    const bgStyle = enemyPokemon.isLegendary
        ? LEGENDARY_BG_STYLE
        : (TYPE_ENVIRONMENTS[enemyPokemon.type] || TYPE_ENVIRONMENTS[PokemonType.NORMAL]);
    
    const activeBallType = preppedBall?.id;
    const currentTerrain = resolveVisualTerrain(activeField, encounterModifier);
    
    // UI SHIFT LOGIC: When weather is active, shift top elements down to clear the banner
    const isWeatherActive = currentTerrain !== 'NORMAL';
    const topBarClass = isWeatherActive ? "top-12 md:top-14 left-3" : "top-3 md:top-3 left-3";
    const streakClass = isWeatherActive ? "top-12 md:top-14 right-3" : "top-3 md:top-3 right-3";
    const enemyInfoClass = isWeatherActive ? "top-24 right-32 md:top-28 md:right-80" : "top-14 right-32 md:top-16 md:right-80";
    const enemySpriteClass = isWeatherActive ? "top-24 right-2 md:top-28 md:right-32" : "top-12 right-2 md:top-16 md:right-32";
    const teamStatusClass = isWeatherActive ? "top-24 left-1/2 -translate-x-1/2" : "top-14 left-1/2 -translate-x-1/2";

    return (
        <div className="h-[100dvh] bg-gray-900 flex flex-col font-mono relative overflow-hidden">
            <MasterBallAnimation isActive={isMasterBallActive} />

            <BattleInfoModal 
                isOpen={showInfo}
                onClose={() => setShowInfo(false)}
                playerLevel={playerPokemon.level}
                enemyPokemon={enemyPokemon}
                streak={streak}
                targetStreak={targetStreak}
                isTrainerBattle={isTrainerBattle}
                trainerName={trainerName}
                enemyTeamCount={enemyTeamCount}
                currentTrainer={currentTrainer}
            />

            {enemyPokemon.isLegendary && (
                <div className="bg-red-600 text-white text-center py-1 font-bold font-pixel text-[10px] md:text-sm animate-pulse z-40 shadow-lg border-b border-yellow-400">
                    <AlertTriangle className="inline-block mr-2" size={12} /> LEGENDARY BATTLE <AlertTriangle className="inline-block ml-2" size={12} />
                </div>
            )}
            
            {isTrainerBattle && trainerName && (
                <div className="bg-blue-800 text-white text-center py-1 font-bold font-pixel text-[10px] md:text-sm z-40 shadow-lg border-b border-blue-400 flex justify-center items-center gap-2">
                    <Sword size={12} /> TRAINER BATTLE: {trainerName} <Sword size={12} />
                </div>
            )}

            {/* BATTLE SCENE */}
            <div className="relative h-[45vh] md:h-[60vh] shrink-0 overflow-hidden border-b-4 border-slate-700" style={bgStyle}>
                
                {/* LAYER 1: WEATHER FILTERS (Atmosphere) - Z-0 */}
                {/* Only for THUNDER_STORM: Kept behind Pokemon as per request */}
                {currentTerrain === 'THUNDER_STORM' && (
                    <div className="absolute inset-0 z-0">
                        <WeatherFilters terrain={currentTerrain} />
                    </div>
                )}

                {/* LAYER 3: WEATHER PARTICLES & FOREGROUND FILTERS - Z-20 */}
                {/* Moved outside inner container to ensure full-width coverage */}
                <div className="absolute inset-0 z-20 pointer-events-none">
                    {/* For all other terrains: Filters overlay the Pokemon */}
                    {currentTerrain !== 'THUNDER_STORM' && (
                        <WeatherFilters terrain={currentTerrain} />
                    )}
                    <WeatherParticles terrain={currentTerrain} />
                </div>

                {/* LAYER 4: WEATHER BANNER */}
                <WeatherBanner terrain={currentTerrain} />

                {/* INNER CONTAINER FOR DESKTOP ALIGNMENT */}
                <div className="max-w-5xl mx-auto w-full h-full relative">
                    {/* Top Bar - Higher Z-Index */}
                    <BattleTopBar className={topBarClass} />
                    <StreakDisplay onClick={() => setShowInfo(true)} className={streakClass} />
                    
                    {isTrainerBattle && (
                        <EnemyTeamStatus total={enemyTeamCount} current={enemyTeamIndex} className={teamStatusClass} />
                    )}
                    
                    {/* LAYER 2: POKEMON - Z-10 */}
                    
                    {/* ENEMY */}
                    <div className={`absolute z-10 w-28 h-28 md:w-56 md:h-56 flex items-center justify-center transition-all duration-300 ${enemySpriteClass}`}>
                        {catchAnim !== 'none' && !isMasterBallActive && (
                            <div className={`absolute z-30 transition-all duration-500 ${catchAnim === 'throwing' ? 'animate-throw' : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'} ${catchAnim === 'shaking' ? 'animate-shake-ball' : ''} ${catchAnim === 'success' ? 'animate-glow-gold' : ''}`}>
                                <PixelPokeball className="w-12 h-12 md:w-16 md:h-16 drop-shadow-2xl" type={activeBallType} />
                            </div>
                        )}
                        <img src={enemyPokemon.imageUrl} className={`w-full h-full object-contain drop-shadow-2xl transition-all duration-200 ${attackAnim === 'enemy' ? 'animate-tackle-enemy' : 'animate-float'} ${damageAnim === 'enemy' ? 'animate-flash-red' : ''} ${catchAnim !== 'none' && catchAnim !== 'throwing' && catchAnim !== 'fail' && !isMasterBallActive ? 'scale-0 opacity-0' : 'opacity-100'}`} />
                        <div className="absolute bottom-2 md:bottom-4 w-3/4 h-3 md:h-4 bg-black/20 rounded-[50%] blur-sm -z-10"></div>
                    </div>
                    
                    {/* PLAYER */}
                    <div className="absolute bottom-4 left-2 md:bottom-8 md:left-32 w-32 h-32 md:w-64 md:h-64 z-10">
                        <img src={playerPokemon.imageUrl} className={`w-full h-full object-contain drop-shadow-2xl scale-x-[-1] ${attackAnim === 'player' ? 'animate-tackle-player' : ''} ${damageAnim === 'player' ? 'animate-flash-red' : ''}`} />
                        <div className="absolute bottom-4 w-3/4 h-4 bg-black/20 rounded-[50%] blur-sm -z-10 left-1/2 -translate-x-1/2"></div>
                    </div>
                    
                    {/* HUDs - Z-Index 30 (Above Weather) */}
                    <EnemyHud pokemon={enemyPokemon} className={enemyInfoClass} />
                    <PlayerHud pokemon={playerPokemon} />
                    
                    {/* BuffDisplay - Z-Index 30 */}
                    <BuffDisplay />
                </div>
            </div>

            {/* QUESTION AREA */}
            <div className="flex-1 bg-slate-900 border-t-4 border-slate-700 p-0 md:p-0 overflow-y-auto flex flex-col relative">
                {isTrainerBattle && timeRemaining !== undefined && (
                    <BattleTimer timeRemaining={timeRemaining} />
                )}
                
                <div className="p-2 md:p-4 flex-1">
                    <div className="max-w-5xl mx-auto h-full flex flex-col justify-center">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};