
import { Pokemon, PokemonType, PokemonRarity, PokedexEntry } from '../types';
import { POKEDEX_REGISTRY } from '../data/pokedexData';
import { 
    getExpToNextLevel,
    MAX_LEVEL
} from '../constants';
import { POKEMON_DESCRIPTIONS } from '../data/flavorText';

// Helper to get image URL (Official Artwork)
const getPokemonImage = (id: number) => 
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

const getDescription = (speciesId: number, name: string, type: PokemonType): string => {
    return POKEMON_DESCRIPTIONS[speciesId] || `A wild ${type} Pokemon.`;
};

// Helper to create a Pokemon Instance from a Registry Entry
export const createPokemonInstance = (entry: PokedexEntry, isBoss: boolean = false, level: number = 1): Pokemon => {
  // Cap Level
  const finalLevel = Math.min(MAX_LEVEL, level);

  // 1. Get Fixed Species Base Stats
  let { hp: baseHp, atk: baseAtk, def: baseDef } = entry.baseStats;

  // Boss Multiplier on Base Stats
  if (isBoss) {
      baseHp = Math.round(baseHp * 1.5); 
      baseAtk = Math.round(baseAtk * 1.2);
      baseDef = Math.round(baseDef * 1.2);
  }

  // 2. Generate IVs (Individual Values) - Random 1-31
  const ivHp = Math.floor(Math.random() * 31) + 1;
  const ivAtk = Math.floor(Math.random() * 31) + 1;
  const ivDef = Math.floor(Math.random() * 31) + 1;

  // 3. Apply NEW FORMULA based on Level
  // HP  = Base_HP + IV + Level * 2
  // ATK = Base_Atk + IV + Level
  // DEF = Base_Def + IV + Level
  
  const maxHp = baseHp + ivHp + (finalLevel * 2);
  const attack = baseAtk + ivAtk + finalLevel;
  const defense = baseDef + ivDef + finalLevel;
  
  return {
    id: `inst-${Date.now()}-${Math.random()}`,
    speciesId: entry.speciesId,
    name: entry.name,
    type: entry.type,
    rarity: entry.rarity,
    maxHp: maxHp,
    currHp: maxHp,
    attack: attack,
    defense: defense,
    ivs: { hp: ivHp, atk: ivAtk, def: ivDef },
    description: getDescription(entry.speciesId, entry.name, entry.type),
    imageUrl: getPokemonImage(entry.speciesId),
    isLegendary: entry.rarity === 'Legendary',
    level: finalLevel,
    exp: 0,
    maxExp: getExpToNextLevel(finalLevel)
  };
};

export const evolvePokemon = (currentMon: Pokemon, nextEntry: PokedexEntry): Pokemon => {
    // 1. IVs persist through evolution
    const newIvs = { ...currentMon.ivs };

    // 2. Get New Base Stats
    const { hp: baseHp, atk: baseAtk, def: baseDef } = nextEntry.baseStats;

    // 3. Calculate Final Stats (Recalculate entire formula)
    const level = currentMon.level;

    const maxHp = baseHp + newIvs.hp + (level * 2);
    const attack = baseAtk + newIvs.atk + level;
    const defense = baseDef + newIvs.def + level;

    return {
        ...currentMon,
        speciesId: nextEntry.speciesId,
        name: nextEntry.name,
        type: nextEntry.type,
        rarity: nextEntry.rarity,
        imageUrl: getPokemonImage(nextEntry.speciesId),
        description: getDescription(nextEntry.speciesId, nextEntry.name, nextEntry.type),
        
        maxHp: maxHp,
        currHp: maxHp, // Heal on evolve
        attack: attack,
        defense: defense,
        ivs: newIvs
    };
};

export const calculatePotential = (p: Pokemon) => {
    const MAX_IV = 31;
    const maxTotal = MAX_IV * 3; // 93
    const totalIV = p.ivs ? (p.ivs.hp + p.ivs.atk + p.ivs.def) : 0;
    const percentage = totalIV / maxTotal;
    
    const hpPct = Math.min(1, p.ivs.hp / MAX_IV);
    const atkPct = Math.min(1, p.ivs.atk / MAX_IV);
    const defPct = Math.min(1, p.ivs.def / MAX_IV);

    let rating = "Average";
    let stars = 1;

    if (percentage >= 0.95) { rating = "Perfect"; stars = 5; } 
    else if (percentage >= 0.80) { rating = "Outstanding"; stars = 4; } 
    else if (percentage >= 0.60) { rating = "Impressive"; stars = 3; } 
    else if (percentage >= 0.40) { rating = "Decent"; stars = 2; } 
    else { rating = "Average"; stars = 1; }

    return { 
        totalIV, 
        cap: maxTotal, 
        percentage, 
        rating,
        stars,
        hpPct,
        atkPct,
        defPct
    };
};

export const getRarityOdds = (level: number) => {
    let wCommon = 0, wRare = 0, wElite = 0, wUltra = 0, wLegendary = 0;
    let nextTierLevel = 0;

    // Adjusted Tiers: 1-6, 6-16, 16-29, 30+
    if (level < 6) {
        wCommon = 80; wRare = 18; wElite = 2; wUltra = 0; wLegendary = 0;
        nextTierLevel = 6;
    } else if (level < 16) {
        wCommon = 60; wRare = 30; wElite = 9; wUltra = 1; wLegendary = 0;
        nextTierLevel = 16;
    } else if (level < 30) {
        wCommon = 40; wRare = 40; wElite = 15; wUltra = 5; wLegendary = 0;
        nextTierLevel = 30;
    } else {
        wCommon = 30; wRare = 35; wElite = 20; wUltra = 10; wLegendary = 5; 
        nextTierLevel = 0;
    }

    return { 
        Common: wCommon, 
        Rare: wRare, 
        Elite: wElite, 
        Ultra: wUltra, 
        Legendary: wLegendary,
        nextTierLevel
    };
};

// Generates a wild Pokemon based on player level and streak
// UPDATED: Now accepts optional forcedTypes from Weather Station
export const generateWildPokemon = (
    forceLegendary: boolean, 
    gen: 1 | 2, 
    streak: number, 
    playerLevel: number,
    forcedTypes: PokemonType[] | null = null
): Pokemon => {
    // 1. Determine Rarity Tier
    let rarity: PokemonRarity = 'Common';
    
    if (forceLegendary) {
        rarity = 'Legendary';
    } else {
        const { Common, Rare, Elite, Ultra, Legendary } = getRarityOdds(playerLevel);
        const roll = Math.random() * 100;
        
        if (roll < Common) rarity = 'Common';
        else if (roll < Common + Rare) rarity = 'Rare';
        else if (roll < Common + Rare + Elite) rarity = 'Elite';
        else if (roll < Common + Rare + Elite + Ultra) rarity = 'Ultra';
        else rarity = 'Legendary';
    }

    // 2. Filter Registry
    let pool = POKEDEX_REGISTRY.filter(p => p.generation === gen && p.isBasic);
    
    // If forced types exist (Weather Control), filter strictly by them
    if (forcedTypes && forcedTypes.length > 0) {
        const typePool = pool.filter(p => forcedTypes.includes(p.type));
        // If we have matches for the forced type, use them. Ignore rarity to ensure the type spawns.
        if (typePool.length > 0) {
            pool = typePool;
        }
    } else {
        // Normal filtering by rarity if no weather override
        pool = pool.filter(p => p.rarity === rarity);
    }
    
    // Fallback if pool is empty
    if (pool.length === 0) {
        pool = POKEDEX_REGISTRY.filter(p => p.generation === gen && p.rarity === rarity);
    }
    if (pool.length === 0) {
        pool = POKEDEX_REGISTRY.filter(p => p.generation === gen && p.rarity === 'Common');
    }

    // 3. Pick One
    const entry = pool[Math.floor(Math.random() * pool.length)];

    // 4. Determine Level
    let level = Math.max(1, playerLevel + Math.floor(Math.random() * 5) - 2);
    if (forceLegendary) level = Math.max(level, playerLevel + 2); 
    level = Math.min(MAX_LEVEL, level);

    // 5. Create Instance
    return createPokemonInstance(entry, forceLegendary, level);
};

export const getStartersForRegion = (gen: 1 | 2): Pokemon[] => {
    const ids = gen === 1 ? [1, 4, 7] : [152, 155, 158];
    const entries = POKEDEX_REGISTRY.filter(p => ids.includes(p.speciesId));
    return entries.map(e => createPokemonInstance(e, false, 5));
};
