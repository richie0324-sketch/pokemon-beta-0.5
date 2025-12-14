
import React from 'react';
import { useShallow } from 'zustand/shallow';
import { GameState } from './types';

// SERVICES, HOOKS & STORES
import { StorageService } from './services/storageService';
import { audioService } from './services/audioService';
import { useGameAudio } from './hooks/useGameAudio';
import { useGameLogic, logic } from './hooks/useGameLogic';
import { useGameStore } from './store/useGameStore';
import { usePlayerStore } from './store/usePlayerStore';
import { useBattleStore } from './store/useBattleStore';

// COMPONENTS
import MathBattle from './components/MathBattle';
import BackpackView from './components/BackpackView';
import PokedexView from './components/PokedexView';
import { DebugMenu } from './components/DebugMenu';
import { EventModal } from './components/EventModal';
import { PCBox } from './components/PCBox';
import { GameToast } from './components/GameToast'; 

// SCREENS
import { MainMenu } from './components/screens/MainMenu';
import { TopicSelect } from './components/screens/TopicSelect';
import { NameInput } from './components/screens/NameInput';
import { StarterSelect } from './components/screens/StarterSelect';
import { EncounterScreen } from './components/screens/EncounterScreen';
import { VictoryScreen } from './components/screens/VictoryScreen';
import { DefeatScreen } from './components/screens/DefeatScreen';
import { EvolutionScreen } from './components/screens/EvolutionScreen';
import { BattleScreen } from './components/screens/BattleScreen';
import { MultiplayerMenu } from './components/screens/MultiplayerMenu';
import { TrainerIntro } from './components/screens/TrainerIntro';
import { RescueCenter } from './components/screens/RescueCenter';
import { WeatherLab } from './components/screens/WeatherLab';
import { UIDebugger } from './components/screens/UIDebugger'; 
import { EventEditor } from './components/screens/EventEditor'; // New
import { AchievementsScreen } from './components/screens/AchievementsScreen'; // New
import { TrainerCardView } from './components/screens/TrainerCardView'; // NEW

import { Play, Save, Wrench, LogOut, Volume2, VolumeX, Wifi, Trophy, CreditCard } from 'lucide-react';

const GameModals: React.FC = () => {
    const { gameState, isMuted, isDebugOpen, currentEvent } = useGameStore(useShallow(state => ({
        gameState: state.gameState,
        isMuted: state.isMuted,
        isDebugOpen: state.isDebugOpen,
        currentEvent: state.currentEvent,
    })));
    
    const { saveGame, toggleMute, resolveEvent } = logic;
    
    const { setGameState, setIsDebugOpen } = useGameStore.getState();

    const handleOpenMultiplayer = () => {
      audioService.playSfx('click');
      setGameState(GameState.MENU_MULTIPLAYER, gameState);
    };

    const handleOpenAchievements = () => {
        audioService.playSfx('click');
        setGameState(GameState.ACHIEVEMENTS, gameState);
    };

    const handleOpenTrainerCard = () => {
        audioService.playSfx('click');
        setGameState(GameState.TRAINER_CARD, gameState);
    };

    return <>
        {isDebugOpen && <DebugMenu />}
        {currentEvent && gameState === GameState.EVENT_ACTIVE && <EventModal event={currentEvent} onClose={resolveEvent} />}
        {gameState === GameState.PC_STORAGE && <PCBox />}
        
        {gameState === GameState.PAUSED && (
            <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-slate-800 p-8 rounded-xl border-4 border-slate-600 shadow-2xl w-full max-w-sm text-center space-y-3 relative">
                    <h2 className="text-3xl font-pixel text-white mb-6 border-b border-slate-700 pb-4">GAME PAUSED</h2>
                    
                    <button onClick={() => { audioService.playSfx('click'); setGameState(GameState.BATTLE_COMBAT); }} className="w-full py-4 bg-blue-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-transform active:scale-95"><Play size={20} fill="currentColor" /> RESUME</button>
                    
                    <button onClick={handleOpenTrainerCard} className="w-full py-3 bg-slate-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 border border-slate-600 transition-transform active:scale-95">
                        <CreditCard size={20} /> TRAINER CARD
                    </button>

                    <button onClick={toggleMute} className="w-full py-3 bg-slate-700 text-yellow-400 font-bold rounded-lg flex items-center justify-center gap-2 border border-slate-600 transition-transform active:scale-95">
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />} 
                        {isMuted ? "UNMUTE SOUND" : "MUTE SOUND"}
                    </button>
                    
                    <button onClick={() => { audioService.playSfx('click'); saveGame(); }} className="w-full py-3 bg-green-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-transform active:scale-95"><Save size={20} /> SAVE GAME</button>
                    
                    <div className="flex gap-2">
                        <button onClick={handleOpenAchievements} className="flex-1 py-3 bg-yellow-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 border-b-4 border-yellow-800 active:border-b-0 active:translate-y-1 transition-transform active:scale-95 text-sm">
                            <Trophy size={18} /> AWARDS
                        </button>
                        <button onClick={handleOpenMultiplayer} className="flex-1 py-3 bg-purple-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 border-b-4 border-purple-800 active:border-b-0 active:translate-y-1 transition-transform active:scale-95 text-sm">
                            <Wifi size={18} /> P2P LINK
                        </button>
                    </div>

                    <button onClick={() => { audioService.playSfx('click'); setIsDebugOpen(true); }} className="w-full py-3 bg-slate-700 text-red-400 font-bold rounded-lg flex items-center justify-center gap-2 border border-red-500/30 transition-transform active:scale-95 text-sm"><Wrench size={18} /> ADMIN TOOLS</button>
                    
                    <button onClick={() => { audioService.playSfx('click'); setGameState(GameState.MENU_MAIN); }} className="w-full py-3 bg-red-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 mt-2 transition-transform active:scale-95"><LogOut size={20} /> QUIT TITLE</button>
                </div>
            </div>
        )}
    </>;
}

const AppScreens: React.FC = () => {
    const gameState = useGameStore(state => state.gameState);
    const evolutionData = useGameStore(state => state.evolutionData);
    const enemyPokemon = useBattleStore(state => state.enemyPokemon);

    const { handleEvolutionComplete } = useGameLogic();
    
    switch(gameState) {
        case GameState.MENU_MAIN: return <MainMenu />;
        case GameState.MENU_TOPIC_SELECT: return <TopicSelect />;
        case GameState.MENU_NAME_INPUT: return <NameInput />;
        case GameState.MENU_STARTER_SELECT: return <StarterSelect />;
        case GameState.MENU_MULTIPLAYER: return <MultiplayerMenu />;
        
        case GameState.WILD_ENCOUNTER: return <EncounterScreen isLegendary={enemyPokemon?.isLegendary} />;
        case GameState.TRAINER_INTRO: return <TrainerIntro />;

        case GameState.VICTORY_CAUGHT: return <VictoryScreen />;
        case GameState.DEFEAT: return <DefeatScreen />;

        case GameState.EVOLUTION: 
            return evolutionData ? <EvolutionScreen {...evolutionData} onComplete={handleEvolutionComplete} /> : null;
        
        case GameState.RESCUE_CENTER: return <RescueCenter />;
        case GameState.WEATHER_LAB: return <WeatherLab />;
            
        case GameState.BACKPACK: return <BackpackView />;
        case GameState.POKEDEX: return <PokedexView />;
        case GameState.ACHIEVEMENTS: return <AchievementsScreen />;
        case GameState.TRAINER_CARD: return <TrainerCardView />;

        default: return null;
    }
}

export const App: React.FC = () => {
  const gameState = useGameStore(state => state.gameState);
  const isUiDebuggerOpen = useGameStore(state => state.isUiDebuggerOpen);
  const isEventEditorOpen = useGameStore(state => state.isEventEditorOpen);
  const playerPokemon = usePlayerStore(state => state.playerPokemon);
  const enemyPokemon = useBattleStore(state => state.enemyPokemon);
  
  // This hook is now responsible for initializing side effects like timers.
  useGameLogic();
  // This hook manages BGM changes based on gameState.
  useGameAudio(gameState);

  // DEBUGGER OVERRIDES
  if (isEventEditorOpen) {
      return (
          <>
            <GameToast />
            <EventEditor />
          </>
      );
  }
  
  if (isUiDebuggerOpen) {
      return (
          <>
            <GameToast />
            <UIDebugger />
          </>
      );
  }

  // Treat MULTIPLAYER_BATTLE same as BATTLE_COMBAT for rendering purposes
  const shouldRenderBattle = playerPokemon && enemyPokemon && [
    GameState.BATTLE_COMBAT, GameState.CATCH_PHASE, GameState.PAUSED, 
    GameState.BACKPACK, GameState.POKEDEX, GameState.EVENT_ACTIVE,
    GameState.MULTIPLAYER_BATTLE,
    GameState.ACHIEVEMENTS, // Keep battle in BG for these overlays
    GameState.TRAINER_CARD
  ].includes(gameState);

  const isBattleHidden = [
    GameState.BACKPACK, GameState.POKEDEX, GameState.EVENT_ACTIVE, 
    GameState.ACHIEVEMENTS, GameState.TRAINER_CARD
  ].includes(gameState);

  return (
    <>
        <GameToast />
        <GameModals />

        <div style={{ display: shouldRenderBattle && !isBattleHidden ? 'block' : 'none' }}>
            <BattleScreen>
                <MathBattle />
            </BattleScreen>
        </div>
        
        <div style={{ display: shouldRenderBattle && !isBattleHidden ? 'none' : 'block' }}>
            <AppScreens />
        </div>
    </>
  );
};

export default App;
