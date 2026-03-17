
import { GameState, Pokemon, Trainer, GameEvent, GameContext } from '../../types';
import { useGameStore } from '../../store/useGameStore';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useBattleStore } from '../../store/useBattleStore';
import { POKEDEX_REGISTRY } from '../../data/pokedexData';
import { GLOBAL_EVENTS } from '../../data/eventRegistry';
import { ITEM_REGISTRY } from '../../data/itemData';
import { createPokemonInstance, generateWildPokemon } from '../../services/pokemonGenService';
import { audioService } from '../../services/audioService';
import { battles } from './battles'; 
import { environment } from './environment';
import { trainers } from './trainers';

const GLOBAL_EVENT_PROBABILITY = 0.15;

const cloneEvent = (template: GameEvent): GameEvent => ({
    ...template,
    data: template.data ? { ...template.data } : undefined,
    choices: [...template.choices] 
});

const buildTradeEvent = (): GameEvent | null => {
    const playerStore = usePlayerStore.getState();
    const candidate = playerStore.caughtPokemon.find(p => {
        const entry = POKEDEX_REGISTRY.find(e => e.speciesId === p.speciesId);
        return entry?.evolutionReq?.method === 'trade' && entry.evolvesTo && entry.evolutionReq.level && p.level >= entry.evolutionReq.level;
    });
    if (!candidate) return null;
    const entry = POKEDEX_REGISTRY.find(e => e.speciesId === candidate.speciesId);
    const nextEntry = entry?.evolvesTo ? POKEDEX_REGISTRY.find(e => e.speciesId === entry.evolvesTo) : null;
    const template = GLOBAL_EVENTS.find(e => e.id === 'link_trade');
    if (!template || !nextEntry) return null;
    
    const event = cloneEvent(template);
    event.description = `Your ${candidate.name} senses a distant trainer. Trade-evolve into ${nextEntry.name}?`;
    event.data = { tradeId: candidate.id, targetSpeciesId: nextEntry.speciesId };
    return event;
};

const buildUltraEvent = (gen: 1 | 2): GameEvent | null => {
    const template = GLOBAL_EVENTS.find(e => e.id === 'ultra_signal');
    if (!template) return null;
    const pool = POKEDEX_REGISTRY.filter(p => p.generation === gen && p.rarity === 'Ultra' && p.isBasic);
    if (!pool.length) return null;
    const entry = pool[Math.floor(Math.random() * pool.length)];
    const event = cloneEvent(template);
    event.data = { entry, level: 35 };
    return event;
};

const buildShopEvent = (): GameEvent | null => {
    const template = GLOBAL_EVENTS.find(e => e.id === 'traveling_shop');
    if (!template) return null;
    const fullStock = Object.values(ITEM_REGISTRY)
        .filter(item => item.price > 0 && item.id !== 'poke-ball')
        .map(item => ({ itemId: item.id, price: item.price, count: item.category === 'BALL' ? 3 : 1 }));
    const event = cloneEvent(template);
    event.data = { stock: fullStock };
    return event;
};

const maybeTriggerRandomEvent = (currentStreak: number): boolean => {
    // 1. Global Probability Check (15% chance to trigger ANY event)
    if (Math.random() > GLOBAL_EVENT_PROBABILITY) return false;

    const { playerPokemon } = usePlayerStore.getState();
    const { selectedTopic, gameState, setCurrentEvent, setGameState, activeField } = useGameStore.getState();
    if (!playerPokemon) return false;
    if ([GameState.EVENT_ACTIVE, GameState.EVOLUTION].includes(gameState)) return false;
    const gen = selectedTopic === 'linear' ? 1 : 2;

    // 2. Filter valid candidates
    const candidates = GLOBAL_EVENTS.filter(e => {
        // Logic Conflict Fix: Do not spawn Weather Station if a Field Terrain is already active (Quest)
        if (e.kind === 'weather_control' && activeField !== 'NORMAL') return false;
        
        // Exclude dungeon steps from random rotation
        if (e.kind === 'dungeon_step') return false;

        // Condition Check
        if (e.condition) {
            const ctx: GameContext = {
                playerPokemon: usePlayerStore.getState().playerPokemon!,
                streak: useBattleStore.getState().streak,
                money: usePlayerStore.getState().money,
                turnCount: useBattleStore.getState().turnCount,
                inventory: usePlayerStore.getState().inventory
            };
            if (!e.condition(ctx)) return false;
        }

        if (e.id === 'link_trade') return !!buildTradeEvent(); 
        
        return true;
    }).map(e => {
        if (e.id === 'link_trade') return buildTradeEvent();
        if (e.id === 'ultra_signal') return buildUltraEvent(gen);
        if (e.id === 'traveling_shop') return buildShopEvent();
        return cloneEvent(e);
    }).filter(Boolean) as GameEvent[];

    if (candidates.length === 0) return false;

    // 3. Weighted Random Selection
    const totalWeight = candidates.reduce((sum, e) => sum + e.chance, 0);
    if (totalWeight === 0) return false;
    let randomValue = Math.random() * totalWeight;
    let selectedEvent: GameEvent | null = null;

    for (const event of candidates) {
        randomValue -= event.chance;
        if (randomValue <= 0) {
            selectedEvent = event;
            break;
        }
    }
    
    // Fallback
    if (!selectedEvent) selectedEvent = candidates[candidates.length - 1];

    // 4. Trigger
    setCurrentEvent(selectedEvent);
    setGameState(GameState.EVENT_ACTIVE, gameState);
    audioService.playSfx('start');
    return true;
};

export const encounters = {
    findWildPokemon: (currentStreak: number, playerSnapshot?: Pokemon, forceWild: boolean = false) => {
        const { playerPokemon } = usePlayerStore.getState();
        const { selectedTopic, setGameState, incrementEncounterCount, decrementBuffs, activeField, activeQuest, setCurrentEvent, gameState } = useGameStore.getState();
        const battleStore = useBattleStore.getState();
        const activePlayer = playerSnapshot || playerPokemon;
        if (!activePlayer) return;
        
        battleStore.resetBattleState();
        decrementBuffs();
        
        // 1. Check Quest Boss (If progress matches)
        if (environment.checkQuestBoss(activePlayer)) return;

        // NEW: Dungeon Minion Logic (Gen 2 Only for these quests)
        // If we have an active quest and NOT at boss yet, force specific dungeon encounters
        if (activeQuest && activeQuest.objective === 'CLEAR_DUNGEON') {
            const isTower = activeQuest.bossSpeciesId === 250; // Ho-Oh (Bell Tower)
            // Minion Pools (GEN 2 IDs)
            const poolIds = isTower
                ? [200, 198, 228, 167, 163, 218] // Misdreavus, Murkrow, Houndour, Spinarak, Hoothoot, Slugma
                : [170, 194, 211, 222, 223, 226]; // Chinchou, Wooper, Qwilfish, Corsola, Remoraid, Mantine

            if (poolIds.length === 0) return;
            const speciesId = poolIds[Math.floor(Math.random() * poolIds.length)];
            const entry = POKEDEX_REGISTRY.find(p => p.speciesId === speciesId);
            
            if (entry) {
                // Scaling level: Player Level + Floor Index
                const level = Math.min(50, activePlayer.level + activeQuest.currentProgress);
                const enemy = createPokemonInstance(entry, false, level);
                
                battleStore.startWildEncounter(enemy);
                usePlayerStore.getState().registerSeen(enemy.speciesId);
                setGameState(GameState.WILD_ENCOUNTER);
                setTimeout(() => setGameState(GameState.BATTLE_COMBAT), 2000);
                return;
            }
        }

        // NEW: If in Quest Mode (battles), suppress other events
        const isQuestActive = !!activeQuest;

        const encounterNumber = incrementEncounterCount();
        const skipRandomEvents = !forceWild && encounterNumber === 1;

        if (!forceWild && !isQuestActive) {
            // 3. Random Event Check (now 15% global chance, mutually exclusive with trainers/wild)
            if (!skipRandomEvents && maybeTriggerRandomEvent(currentStreak)) return;
            
            // 4. Trainer Logic
            const trainer = trainers.checkForTrainerEncounter(currentStreak, encounterNumber);
            if (trainer) {
                trainers.initiateBattle(trainer);
                return;
            }
        }
        
        // 5. Determine Forced Types (Weather/Terrain)
        const forcedTypes = environment.resolveForcedTypes();

        // 6. Wild Encounter
        const isLegendary = false; 
        const targetGen = selectedTopic === 'linear' ? 1 : 2;
        
        const enemy = generateWildPokemon(isLegendary, targetGen, currentStreak, activePlayer.level, forcedTypes);
        
        battleStore.startWildEncounter(enemy);
        usePlayerStore.getState().registerSeen(enemy.speciesId);
        setGameState(GameState.WILD_ENCOUNTER);
        setTimeout(() => setGameState(GameState.BATTLE_COMBAT), 2000);
    },

    // Legacy wrapper
    startTrainerBattle: (trainer: Trainer) => {
        trainers.initiateBattle(trainer);
    },

    handleTrainerBattleStart: (playerStarts: boolean) => {
        const { setGameState, activeBuffs } = useGameStore.getState();
        const { setBattleTimer, setBattleMessage, currentTrainer } = useBattleStore.getState();
        setGameState(GameState.BATTLE_COMBAT);
        setBattleTimer(30);
        
        if (!playerStarts) {
            if (activeBuffs['bush_camp'] && activeBuffs['bush_camp'] > 0) {
                setTimeout(() => {
                    setBattleMessage(`${currentTrainer?.name} can't see you in the bush!`);
                }, 500);
            } else {
                setTimeout(() => {
                    setBattleMessage(`${currentTrainer?.name} attacks first!`);
                    battles.handleDamagePlayer(1.0);
                }, 500);
            }
        }
    },

    resolveEvent: () => {
        const { setCurrentEvent, setGameState, prevState } = useGameStore.getState();
        setCurrentEvent(null);
        setGameState(prevState || GameState.MENU_MAIN);
    },

    declineTrainerBattle: () => {
        const { setGameState } = useGameStore.getState();
        const { endBattle, setStreak } = useBattleStore.getState();
        
        setStreak(() => 0); 
        endBattle(); 
        setGameState(GameState.DEFEAT); 
    }
};
