
import { useEffect, useRef } from 'react';
import { Pokemon, GameState, MathTopic, InventorySlot, GameEvent, EventTriggerType, GameContext, Trainer, PokedexEntry, SaveData, PokemonRarity } from '../types';
import { useGameStore } from '../store/useGameStore';
import { usePlayerStore } from '../store/usePlayerStore';
import { useBattleStore } from '../store/useBattleStore';
import { showToast } from '../store/useToastStore';

import { POKEDEX_REGISTRY } from '../data/pokedexData';
import { ITEM_REGISTRY, EVOLUTION_ITEM_MAP } from '../data/itemData';
import { GLOBAL_EVENTS } from '../data/eventRegistry';
import { NPC_REGISTRY } from '../data/trainerData';
import { generateWildPokemon, evolvePokemon } from '../services/pokemonGenService';
import { calculateDamage, calculateExpGain, processLevelUp } from '../services/battleMechanics';
import { StorageService } from '../services/storageService';
import { audioService } from '../services/audioService';
import { CATCH_RATES, getExpToNextLevel, MAX_LEVEL } from '../constants';
import { achievementService } from '../services/achievementService';

// Import split modules
import { core } from '../services/gameLogic/core';
import { encounters } from '../services/gameLogic/encounters';
import { battles } from '../services/gameLogic/battles';
import { items } from '../services/gameLogic/items';
import { trainers } from '../services/gameLogic/trainers';

// Assemble the logic facade
export const logic = {
    ...core,
    ...encounters,
    ...battles,
    ...items,
    ...trainers,
};

// --- SUBSCRIPTION HOOK ---
// Kept in this file as it needs React lifecycle
const useStoreSubscriber = () => {
    const returnStateRef = useRef<GameState>(GameState.MENU_MAIN);
    const timerRef = useRef<number | null>(null);

    // Battle Timer Effect
    useEffect(() => {
        const checkTimer = () => {
            const { gameState, activeBuffs } = useGameStore.getState();
            const { isTrainerBattle, battleTimer, battleMessage } = useBattleStore.getState();

            // Determine if the timer SHOULD be running
            const shouldRun = 
                gameState === GameState.BATTLE_COMBAT &&
                isTrainerBattle &&
                battleTimer !== null &&
                battleTimer > 0 &&
                !battleMessage &&
                (!activeBuffs['lag_switch'] || activeBuffs['lag_switch'] <= 0);

            if (shouldRun) {
                // If it should run but isn't running, start it
                if (!timerRef.current) {
                    timerRef.current = window.setInterval(() => {
                        const current = useBattleStore.getState().battleTimer;
                        if (current !== null && current > 0) {
                            useBattleStore.getState().setBattleTimer(current - 1);
                        } else if (current === 0) {
                            // If it hits 0, the next store update will catch it in the 'else' block below
                            // but we can also force the check here to be precise
                            logic.handleTimerExpiry();
                        }
                    }, 1000);
                }
            } else {
                // If it shouldn't run but IS running, stop it
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                    timerRef.current = null;
                }
                
                // Handle expiry case specifically (when timer hits 0)
                if (battleTimer === 0) {
                    logic.handleTimerExpiry();
                }
            }
        };

        // Subscribe to BOTH stores to ensure we catch Pause/Resume AND Battle Events
        const unsubBattle = useBattleStore.subscribe(checkTimer);
        const unsubGame = useGameStore.subscribe(checkTimer);

        // Initial Check
        checkTimer();

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            unsubBattle();
            unsubGame();
        };
    }, []);

    const processNextEvolution = () => {
        const { evolutionQueue, setEvolutionData, setGameState } = useGameStore.getState();
        if (evolutionQueue.length === 0) return;

        const nextEvo = evolutionQueue[0];
        const evolvedForm = evolvePokemon(nextEvo.pokemon, nextEvo.target);
        
        const playerStore = usePlayerStore.getState();
        playerStore.setCaughtPokemon(prev => prev.map(p => p.id === evolvedForm.id ? evolvedForm : p));
        if (playerStore.playerPokemon && playerStore.playerPokemon.id === evolvedForm.id) {
            playerStore.setPlayerPokemon(evolvedForm);
        }
        playerStore.registerSeen(evolvedForm.speciesId);
        playerStore.registerCaught(evolvedForm.speciesId);

        // Trigger achievement event for evolution
        achievementService.processEvent('POKEMON_EVOLVED', { 
            prevSpeciesId: nextEvo.pokemon.speciesId, 
            nextSpeciesId: evolvedForm.speciesId 
        });

        setEvolutionData({ prev: nextEvo.pokemon, next: evolvedForm });
        setGameState(GameState.EVOLUTION);
    };

    // Evolution Queue Effect
    useEffect(() => {
        const unsubscribe = useGameStore.subscribe((state, prevState) => {
            if (state.evolutionQueue.length > 0 && state.evolutionQueue.length !== prevState.evolutionQueue.length && state.gameState !== GameState.EVOLUTION) {
                const { gameState } = useGameStore.getState();
                
                // Only capture state if we are NOT already evolving/paused to avoid getting stuck
                if (gameState !== GameState.EVOLUTION && gameState !== GameState.PAUSED && gameState !== GameState.TRAINER_INTRO) {
                    returnStateRef.current = gameState;
                }
                
                processNextEvolution();
            }
        });
        return unsubscribe;
    }, []);

    const handleEvolutionComplete = () => {
        const { dequeueEvolution, setEvolutionData, setGameState } = useGameStore.getState();
        
        // Remove the completed evolution
        dequeueEvolution();
        
        // Check if there are more in the queue (get fresh state)
        const currentQueue = useGameStore.getState().evolutionQueue;
        
        if (currentQueue.length > 0) {
            // Process the next one immediately
            processNextEvolution();
        } else {
            // All done, return to previous state
            setEvolutionData(null);
            setGameState(returnStateRef.current);
        }
    };

    return { handleEvolutionComplete };
};

type GameLogic = typeof logic & { handleEvolutionComplete: () => void };

// --- THE HOOK ---
export const useGameLogic = (): GameLogic => {
    const { handleEvolutionComplete } = useStoreSubscriber();
    
    return {
        ...logic,
        handleEvolutionComplete,
    };
};
