
import { PokemonType, PokemonRarity, PokedexEntry, EvolutionRequirement } from '../types';
import { RARITY_BASE_STATS } from '../constants';
import { EVOLUTION_ITEM_MAP } from './itemData';
import { GEN1_ROSTER } from './gen1';
import { GEN2_ROSTER } from './gen2';
import { BASE_STATS_MAP } from './stats/index';
import { EVOLUTION_LEVELS, EVOLUTION_TARGETS } from './evolutionData';

// Combine Rosters
const FULL_ROSTER: [number, string, PokemonType, PokemonRarity][] = [
    ...GEN1_ROSTER,
    ...GEN2_ROSTER
];

// Optimization: Pre-calculate the set of Pokemon IDs that are targets of item evolutions.
const ITEM_EVOLUTION_TARGETS = new Set<number>();
Object.values(EVOLUTION_ITEM_MAP).forEach(map => {
    Object.values(map).forEach(targetId => ITEM_EVOLUTION_TARGETS.add(targetId));
});

// Helper for logic inside data construction
const getEvolutionId = (id: number, type: PokemonType): number | undefined => {
    // Check for explicit non-sequential evolution targets first
    if (EVOLUTION_TARGETS[id]) {
        return EVOLUTION_TARGETS[id];
    }
    
    const nextId = id + 1;
    
    // If the "next" ID in the pokedex is actually a target of an item evolution,
    // then the current ID should NOT evolve into it by level up.
    if (ITEM_EVOLUTION_TARGETS.has(nextId)) {
        return undefined; // Block natural evolution
    }

    // Check if next ID exists in roster
    const nextEntry = FULL_ROSTER.find(p => p[0] === nextId);
    
    // Standard Level Up Check
    if (nextEntry && nextEntry[2] === type && nextEntry[3] !== 'Legendary') {
        return nextId;
    }
    return undefined;
}

const isBasicStage = (id: number, type: PokemonType, rarity: PokemonRarity): boolean => {
    if (rarity === 'Legendary') return true;
    
    // Check if there is a previous form
    const prevEntry = FULL_ROSTER.find(p => p[0] === id - 1);
    
    if (prevEntry) {
         // Check if that previous form naturally evolves into this one
         const prevEvolvesTo = getEvolutionId(prevEntry[0], prevEntry[2]);
         if (prevEvolvesTo === id) return false; 
         
         // Also check if this ID is a known item evolution target
         if (ITEM_EVOLUTION_TARGETS.has(id)) return false;
    }
    return true;
}

// Get Base Stats (from specific data or fallback generator)
const getBaseStats = (id: number, type: PokemonType, rarity: PokemonRarity) => {
    // 1. Check for specific data provided by user
    if (BASE_STATS_MAP[id]) {
        return BASE_STATS_MAP[id];
    }

    // Development Log (Optional: check console to see which mons are missing real stats)
    // console.debug(`[Pokedex] Missing specific stats for #${id}. Using fallback generator.`);

    // 2. Fallback to random generation based on rarity ranges (Old Logic)
    // This ensures the game still works even if you haven't filled in all 251 entries yet.
    const range = RARITY_BASE_STATS[rarity] || RARITY_BASE_STATS['Common'];
    
    // Pseudo-random seeded by ID to get consistent results per species
    const seed = id * 123.45;
    const rnd1 = Math.abs(Math.sin(seed));
    const rnd2 = Math.abs(Math.cos(seed));
    const rnd3 = Math.abs(Math.sin(seed * 2));

    const hp = Math.floor(range.hp[0] + (rnd1 * (range.hp[1] - range.hp[0])));
    const atk = Math.floor(range.atk[0] + (rnd2 * (range.atk[1] - range.atk[0])));
    const def = Math.floor(range.def[0] + (rnd3 * (range.def[1] - range.def[0])));

    return { hp, atk, def };
};

const buildRegistry = () => {
  const list: PokedexEntry[] = FULL_ROSTER.map(([id, name, type, rarity]) => {
    const evolutionReq: EvolutionRequirement | undefined = EVOLUTION_LEVELS[id];
    return {
      speciesId: id,
      name,
      type,
      rarity,
      generation: id <= 151 ? 1 : 2,
      evolvesTo: getEvolutionId(id, type),
      evolutionReq,
      isBasic: isBasicStage(id, type, rarity),
      baseStats: getBaseStats(id, type, rarity)
    };
  });
  return list;
};

export const POKEDEX_REGISTRY = buildRegistry();
