
import { create } from 'zustand';
import { GameState, MathTopic, GameEvent, Pokemon, PokedexEntry, SaveData, EncounterModifier, QuestState, FieldTerrain } from '../types';

interface GameStoreState {
    gameState: GameState;
    prevState: GameState;
    playerName: string;
    playerAvatar: string; 
    currentSlotId: number; // NEW: Track which slot is active
    selectedTopic: MathTopic;
    isMuted: boolean;
    isDebugOpen: boolean;
    isUiDebuggerOpen: boolean; 
    isEventEditorOpen: boolean; 
    debugModeEnabled: boolean; // NEW: Hidden Dev Mode
    backpackTab: 'ITEMS' | 'TEAM';
    evolutionData: { prev: Pokemon, next: Pokemon } | null;
    evolutionQueue: { pokemon: Pokemon, target: PokedexEntry }[];
    currentEvent: GameEvent | null;
    encounterCount: number;
    forcedCurioUsed: boolean;
    rescueLesson: string | null;
    
    // Encounter Logic
    encounterModifier: EncounterModifier | null;
    activeBuffs: Record<string, number>; 
    
    // NEW: Quest & Field System
    activeField: FieldTerrain;
    activeQuest: QuestState | null;

    // Actions
    setGameState: (state: GameState, prevState?: GameState) => void;
    setPlayerName: (name: string) => void;
    setPlayerAvatar: (url: string) => void; 
    setCurrentSlotId: (slotId: number) => void; // NEW Action
    setSelectedTopic: (topic: MathTopic) => void;
    setIsMuted: (muted: boolean) => void;
    setIsDebugOpen: (open: boolean) => void;
    setUiDebuggerOpen: (open: boolean) => void;
    setEventEditorOpen: (open: boolean) => void;
    setDebugModeEnabled: (enabled: boolean) => void; // NEW Action
    setBackpackTab: (tab: 'ITEMS' | 'TEAM') => void;
    setEvolutionData: (data: { prev: Pokemon, next: Pokemon } | null) => void;
    queueEvolutions: (evolutions: { pokemon: Pokemon, target: PokedexEntry }[]) => void;
    dequeueEvolution: () => void;
    setCurrentEvent: (event: GameEvent | null) => void;
    incrementEncounterCount: () => number;
    resetEncounterCounter: () => void;
    markForcedCurioUsed: () => void;
    setRescueLesson: (lesson: string | null) => void;
    
    setEncounterModifier: (mod: EncounterModifier | null) => void;
    addBuff: (id: string, duration: number) => void;
    decrementBuffs: () => void;

    // New Quest Actions
    setActiveField: (field: FieldTerrain) => void;
    startQuest: (quest: QuestState) => void;
    updateQuestProgress: (amount: number) => void;
    completeQuest: () => void;
    
    // Global Reset
    resetGame: () => void;
    
    loadGameState: (data: Partial<SaveData>) => void;
}

export const useGameStore = create<GameStoreState>((set, get) => ({
    gameState: GameState.MENU_MAIN,
    prevState: GameState.MENU_MAIN,
    playerName: '',
    playerAvatar: 'https://play.pokemonshowdown.com/sprites/trainers/red.png',
    currentSlotId: 1, // Default to slot 1
    selectedTopic: 'linear',
    isMuted: false,
    isDebugOpen: false,
    isUiDebuggerOpen: false,
    isEventEditorOpen: false, 
    debugModeEnabled: false, // Default locked
    backpackTab: 'ITEMS',
    evolutionData: null,
    evolutionQueue: [],
    currentEvent: null,
    encounterCount: 0,
    forcedCurioUsed: false,
    rescueLesson: null,
    
    encounterModifier: null,
    activeBuffs: {},
    
    activeField: 'NORMAL',
    activeQuest: null,

    setGameState: (newState, oldState) => set(state => ({
        gameState: newState,
        prevState: oldState ?? state.gameState
    })),
    setPlayerName: (name) => set({ playerName: name }),
    setPlayerAvatar: (url) => set({ playerAvatar: url }),
    setCurrentSlotId: (slotId) => set({ currentSlotId: slotId }),
    setSelectedTopic: (topic) => set({ selectedTopic: topic }),
    setIsMuted: (muted) => set({ isMuted: muted }),
    setIsDebugOpen: (open) => set({ isDebugOpen: open }),
    setUiDebuggerOpen: (open) => set({ isUiDebuggerOpen: open }),
    setEventEditorOpen: (open) => set({ isEventEditorOpen: open }),
    setDebugModeEnabled: (enabled) => set({ debugModeEnabled: enabled }),
    setBackpackTab: (tab) => set({ backpackTab: tab }),
    setEvolutionData: (data) => set({ evolutionData: data }),
    queueEvolutions: (evolutions) => set(state => ({ evolutionQueue: [...state.evolutionQueue, ...evolutions] })),
    dequeueEvolution: () => set(state => ({ evolutionQueue: state.evolutionQueue.slice(1) })),
    setCurrentEvent: (event) => set({ currentEvent: event }),
    incrementEncounterCount: () => {
        let next = 0;
        set(state => {
            next = state.encounterCount + 1;
            return { encounterCount: next };
        });
        return next;
    },
    resetEncounterCounter: () => set({ encounterCount: 0, forcedCurioUsed: false }),
    markForcedCurioUsed: () => set({ forcedCurioUsed: true }),
    setRescueLesson: (lesson) => set({ rescueLesson: lesson }),

    setEncounterModifier: (mod) => set({ encounterModifier: mod }),
    addBuff: (id, duration) => set(state => ({
        activeBuffs: { ...state.activeBuffs, [id]: duration }
    })),
    decrementBuffs: () => set(state => {
        const nextBuffs = { ...state.activeBuffs };
        for (const key in nextBuffs) {
            if (nextBuffs[key] > 0) {
                nextBuffs[key] -= 1;
            }
            if (nextBuffs[key] <= 0) {
                delete nextBuffs[key];
            }
        }
        return { activeBuffs: nextBuffs };
    }),

    setActiveField: (field) => set({ activeField: field }),
    startQuest: (quest) => set({ activeQuest: quest }), 
    updateQuestProgress: (amount) => set(state => {
        if (!state.activeQuest) return {};
        return { 
            activeQuest: { 
                ...state.activeQuest, 
                currentProgress: state.activeQuest.currentProgress + amount 
            } 
        };
    }),
    completeQuest: () => set({ activeQuest: null, activeField: 'NORMAL' }),

    // CLEARS ALL GAMEPLAY STATE (For New Game)
    resetGame: () => set({
        encounterCount: 0,
        forcedCurioUsed: false,
        rescueLesson: null,
        encounterModifier: null,
        activeBuffs: {},
        activeField: 'NORMAL',
        activeQuest: null,
        currentEvent: null,
        evolutionQueue: [],
        evolutionData: null,
        isUiDebuggerOpen: false,
        isEventEditorOpen: false,
        // Do NOT reset debugModeEnabled here so it persists through resets
    }),

    loadGameState: (data) => {
        set({
            playerName: data.playerName,
            playerAvatar: data.playerAvatar || 'https://play.pokemonshowdown.com/sprites/trainers/red.png',
            selectedTopic: data.selectedTopic,
            backpackTab: 'TEAM',
            gameState: GameState.BACKPACK,
            prevState: GameState.MENU_MAIN,
            encounterCount: 0,
            forcedCurioUsed: false,
            rescueLesson: null,
            encounterModifier: null,
            
            // Restore persisted logic state
            activeBuffs: data.activeBuffs || {},
            activeField: data.activeField || 'NORMAL',
            activeQuest: data.activeQuest || null
        });
    }
}));
