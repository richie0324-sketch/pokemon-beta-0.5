
import { GameState, Pokemon, PokemonType, FieldTerrain } from '../../types';
import { useGameStore } from '../../store/useGameStore';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useBattleStore } from '../../store/useBattleStore';
import { POKEDEX_REGISTRY } from '../../data/pokedexData';
import { createPokemonInstance } from '../../services/pokemonGenService';
import { showToast } from '../../store/useToastStore';

// Map Fields to Types
export const getFieldTypes = (field: FieldTerrain): PokemonType[] | null => {
    switch (field) {
        case 'SCORCHING_SUN': return [PokemonType.FIRE, PokemonType.GROUND];
        case 'VOLCANIC_ASH': return [PokemonType.FIRE, PokemonType.ROCK];
        case 'THUNDER_STORM':
        case 'STATIC_FIELD': return [PokemonType.ELECTRIC];
        case 'BLIZZARD': return [PokemonType.ICE];
        case 'MISTY_RAIN': return [PokemonType.WATER, PokemonType.PSYCHIC];
        case 'GLITCH_FIELD': return [PokemonType.PSYCHIC, PokemonType.GHOST];
        case 'JUNGLE': return [PokemonType.GRASS, PokemonType.BUG];
        default: return null;
    }
};

// Check Quest Boss
export const checkQuestBoss = (activePlayer: Pokemon): boolean => {
    const { activeQuest, setGameState } = useGameStore.getState();
    const battleStore = useBattleStore.getState();

    if (activeQuest && activeQuest.currentProgress >= activeQuest.requiredProgress) {
         const bossEntry = POKEDEX_REGISTRY.find(p => p.speciesId === activeQuest.bossSpeciesId);
         if (bossEntry) {
             // QUEST BOSS IS ALWAYS LEVEL 45 (or scaled)
             const boss = createPokemonInstance(bossEntry, true, 45);
             
             battleStore.startWildEncounter(boss);
             usePlayerStore.getState().registerSeen(boss.speciesId);
             
             // NOTE: We do NOT completeQuest() here anymore. 
             // It must be completed AFTER victory to keep the weather active.
             
             showToast(`BOSS APPEARED: ${activeQuest.bossName}!`, "warning");
             setGameState(GameState.WILD_ENCOUNTER);
             setTimeout(() => setGameState(GameState.BATTLE_COMBAT), 2000);
             return true;
         }
    }
    return false;
};

// Resolve Field/Weather Effects
// This function calculates active types AND decrements counters for temporary weather
export const resolveForcedTypes = (): PokemonType[] | null => {
    const { activeField, activeQuest, setActiveField, encounterModifier, setEncounterModifier } = useGameStore.getState();
    let forcedTypes: PokemonType[] | null = null;

    // SAFETY CHECK: Orphaned Field
    // If a field is active but no quest exists, it's a bugged state. Reset it to NORMAL.
    if (activeField !== 'NORMAL' && !activeQuest) {
        setActiveField('NORMAL');
    } 
    else if (activeField !== 'NORMAL') {
        // 1. Handle Quest/Field Terrain (Priority)
        const fieldTypes = getFieldTypes(activeField);
        if (fieldTypes) {
            forcedTypes = fieldTypes;
        }
    }

    // 2. Handle Temporary Weather Modifier
    // Only apply if Quest isn't already forcing types (Quest overrides Weather Station)
    if (encounterModifier) {
        if (!forcedTypes) {
            forcedTypes = encounterModifier.types;
        }
        
        // Decrement Counter
        const newRemaining = encounterModifier.remaining - 1;
        if (newRemaining <= 0) {
            setEncounterModifier(null);
        } else {
            setEncounterModifier({ ...encounterModifier, remaining: newRemaining });
        }
    }

    return forcedTypes;
};

export const environment = {
    getFieldTypes,
    checkQuestBoss,
    resolveForcedTypes
};
