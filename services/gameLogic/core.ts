
import { GameState, MathTopic, SaveData, Pokemon } from '../../types';
import { useGameStore } from '../../store/useGameStore';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useBattleStore } from '../../store/useBattleStore';
import { StorageService } from '../storageService';
import { audioService } from '../audioService';
import { showToast } from '../../store/useToastStore';
import { encounters } from './encounters'; // Import strictly for cross-module calls
import { achievementService } from '../achievementService';

export const core = {
    registerPlayer: (name: string, avatar: string, id: string = '00000') => {
        if (!name.trim()) return;
        audioService.playSfx('click');
        useGameStore.getState().setPlayerName(name);
        useGameStore.getState().setPlayerAvatar(avatar);
        usePlayerStore.getState().setTrainerId(id); // Save the ID
        useGameStore.getState().setGameState(GameState.MENU_STARTER_SELECT);
    },

    setPlayerName: (name: string) => {
        // Fallback or legacy wrapper
        core.registerPlayer(name, 'https://play.pokemonshowdown.com/sprites/trainers/red.png');
    },

    handleTopicSelect: (topic: MathTopic) => {
        audioService.playSfx('click');
        useGameStore.getState().setSelectedTopic(topic);
        useGameStore.getState().setGameState(GameState.MENU_NAME_INPUT);
    },

    handleStartGame: () => {
        audioService.init(); 
        audioService.playSfx('start');
        useGameStore.getState().setGameState(GameState.MENU_TOPIC_SELECT);
    },

    // Updated to accept slotId explicitly (e.g., from the new Slot UI)
    handleLoadGame: (slotId: number) => {
        audioService.init();
        audioService.playSfx('start');
        
        const data = StorageService.load(slotId);
        
        if (data) {
            // Set current slot
            useGameStore.getState().setCurrentSlotId(slotId);
            
            useGameStore.getState().loadGameState(data);
            usePlayerStore.getState().loadPlayerState(data);
            useBattleStore.getState().loadBattleState(data);
            
            useGameStore.getState().setBackpackTab('TEAM'); 
            useGameStore.getState().setGameState(GameState.BACKPACK, GameState.MENU_MAIN);
        } else {
            showToast("No save data found in this slot!", "warning");
        }
    },

    saveGame: () => {
        const playerState = usePlayerStore.getState();
        const gameState = useGameStore.getState();
        const battleState = useBattleStore.getState();
        
        // Use the active slot ID from the store
        const slotId = gameState.currentSlotId || 1;

        StorageService.save({
          ...playerState,
          playerName: gameState.playerName,
          playerAvatar: gameState.playerAvatar,
          selectedTopic: gameState.selectedTopic,
          streak: battleState.streak,
          targetStreak: battleState.targetStreak,
          saveDate: Date.now(),
          
          // Persist New Features
          activeBuffs: gameState.activeBuffs,
          activeQuest: gameState.activeQuest,
          activeField: gameState.activeField,
          
          // Identity
          trainerId: playerState.trainerId,
          badges: playerState.badges
        } as SaveData, slotId);
        
        showToast(`Game Saved to Slot ${slotId}!`, "success");
    },

    chooseStarter: (starter: Pokemon) => {
        audioService.playSfx('correct');
        
        // CRITICAL FIX: Reset global game state to prevent weather/buffs from previous sessions persisting
        useGameStore.getState().resetGame();

        const playerStore = usePlayerStore.getState();
        playerStore.setPlayerPokemon(starter);
        playerStore.setCaughtPokemon(() => [starter]);
        playerStore.setStoragePokemon(() => []);
        playerStore.setInventory(() => [ { itemId: 'poke-ball', count: 10 }, { itemId: 'potion', count: 5 } ]);
        playerStore.setMoney(() => 500);
        playerStore.registerSeen(starter.speciesId);
        playerStore.registerCaught(starter.speciesId);

        // ** BUG FIX: Trigger achievement check for the first catch **
        achievementService.processEvent('POKEMON_CAUGHT', { speciesId: starter.speciesId, rarity: starter.rarity });
        
        useBattleStore.getState().setStreak(() => 0);
        
        encounters.findWildPokemon(0, starter);
    },

    // --- DEFEAT & RESCUE LOGIC ---

    enterRescueCenter: () => {
        const { setGameState } = useGameStore.getState();
        // NOTE: We no longer set 'rescueLesson' text here. 
        // The RescueCenter component now picks a random lesson from the registry.
        setGameState(GameState.RESCUE_CENTER, GameState.DEFEAT);
    },

    completeRescueLesson: () => {
        const { setRescueLesson, resetEncounterCounter } = useGameStore.getState();
        setRescueLesson(null); // Clear any old state just in case
        resetEncounterCounter();
        core.healPartyAfterDefeat(true);
    },

    healPartyAfterDefeat: (openBackpack: boolean = false) => {
        const playerStore = usePlayerStore.getState();
        const { setBackpackTab, setGameState } = useGameStore.getState();

        const healedParty = playerStore.caughtPokemon.map(p => ({...p, currHp: p.maxHp }));
        playerStore.setCaughtPokemon(() => healedParty);
        
        const activeHealed = healedParty.find(p => p.id === playerStore.playerPokemon?.id);
        if (activeHealed) playerStore.setPlayerPokemon(activeHealed);

        if (openBackpack) {
            setBackpackTab('ITEMS');
            setGameState(GameState.BACKPACK, GameState.MENU_MAIN);
        } else {
            encounters.findWildPokemon(0); // Restart with a new battle
        }
    },

    syncPlayerToCaught: () => {
        usePlayerStore.getState().syncPlayerToCaught();
    },
    
    toggleMute: () => {
        const muted = audioService.toggleMute();
        useGameStore.getState().setIsMuted(muted);
        audioService.playSfx('click');
    }
};
