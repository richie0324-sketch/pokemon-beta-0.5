
import { PokemonType, PokemonRarity } from './types';

export const MAX_LEVEL = 50;

// --- TYPE EFFECTIVENESS & CONFIG ---

export const TYPE_CHART: Partial<Record<PokemonType, Partial<Record<PokemonType, number>>>> = {
  [PokemonType.FIGHTING]: { [PokemonType.NORMAL]: 2, [PokemonType.ICE]: 2, [PokemonType.ROCK]: 2, [PokemonType.DARK]: 2, [PokemonType.STEEL]: 2, [PokemonType.POISON]: 0.5, [PokemonType.FLYING]: 0.5, [PokemonType.PSYCHIC]: 0.5, [PokemonType.BUG]: 0.5, [PokemonType.GHOST]: 0 },
  [PokemonType.FIRE]: { [PokemonType.GRASS]: 2, [PokemonType.ICE]: 2, [PokemonType.BUG]: 2, [PokemonType.STEEL]: 2, [PokemonType.FIRE]: 0.5, [PokemonType.WATER]: 0.5, [PokemonType.ROCK]: 0.5, [PokemonType.DRAGON]: 0.5 },
  [PokemonType.WATER]: { [PokemonType.FIRE]: 2, [PokemonType.GROUND]: 2, [PokemonType.ROCK]: 2, [PokemonType.WATER]: 0.5, [PokemonType.GRASS]: 0.5, [PokemonType.DRAGON]: 0.5 },
  [PokemonType.GRASS]: { [PokemonType.WATER]: 2, [PokemonType.GROUND]: 2, [PokemonType.ROCK]: 2, [PokemonType.FIRE]: 0.5, [PokemonType.GRASS]: 0.5, [PokemonType.POISON]: 0.5, [PokemonType.FLYING]: 0.5, [PokemonType.BUG]: 0.5, [PokemonType.DRAGON]: 0.5, [PokemonType.STEEL]: 0.5 },
  [PokemonType.ELECTRIC]: { [PokemonType.WATER]: 2, [PokemonType.FLYING]: 2, [PokemonType.ELECTRIC]: 0.5, [PokemonType.GRASS]: 0.5, [PokemonType.DRAGON]: 0.5, [PokemonType.GROUND]: 0 },
  [PokemonType.ROCK]: { [PokemonType.FIRE]: 2, [PokemonType.ICE]: 2, [PokemonType.FLYING]: 2, [PokemonType.BUG]: 2, [PokemonType.FIGHTING]: 0.5, [PokemonType.GROUND]: 0.5, [PokemonType.STEEL]: 0.5 },
  [PokemonType.ICE]: { [PokemonType.GRASS]: 2, [PokemonType.GROUND]: 2, [PokemonType.FLYING]: 2, [PokemonType.DRAGON]: 2, [PokemonType.FIRE]: 0.5, [PokemonType.WATER]: 0.5, [PokemonType.ICE]: 0.5, [PokemonType.STEEL]: 0.5 },
  [PokemonType.GROUND]: { [PokemonType.FIRE]: 2, [PokemonType.ELECTRIC]: 2, [PokemonType.POISON]: 2, [PokemonType.ROCK]: 2, [PokemonType.STEEL]: 2, [PokemonType.GRASS]: 0.5, [PokemonType.BUG]: 0.5, [PokemonType.FLYING]: 0 },
  [PokemonType.FLYING]: { [PokemonType.GRASS]: 2, [PokemonType.FIGHTING]: 2, [PokemonType.BUG]: 2, [PokemonType.ELECTRIC]: 0.5, [PokemonType.ROCK]: 0.5, [PokemonType.STEEL]: 0.5 },
  [PokemonType.POISON]: { [PokemonType.GRASS]: 2, [PokemonType.POISON]: 0.5, [PokemonType.GROUND]: 0.5, [PokemonType.ROCK]: 0.5, [PokemonType.GHOST]: 0.5, [PokemonType.STEEL]: 0 },
  [PokemonType.GHOST]: { [PokemonType.GHOST]: 2, [PokemonType.PSYCHIC]: 2, [PokemonType.DARK]: 0.5, [PokemonType.STEEL]: 0.5, [PokemonType.NORMAL]: 0 },
  [PokemonType.PSYCHIC]: { [PokemonType.FIGHTING]: 2, [PokemonType.POISON]: 2, [PokemonType.PSYCHIC]: 0.5, [PokemonType.STEEL]: 0.5, [PokemonType.DARK]: 0 },
  [PokemonType.BUG]: { [PokemonType.GRASS]: 2, [PokemonType.PSYCHIC]: 2, [PokemonType.DARK]: 2, [PokemonType.FIRE]: 0.5, [PokemonType.FIGHTING]: 0.5, [PokemonType.POISON]: 0.5, [PokemonType.FLYING]: 0.5, [PokemonType.GHOST]: 0.5, [PokemonType.STEEL]: 0.5 },
  [PokemonType.DRAGON]: { [PokemonType.DRAGON]: 2, [PokemonType.STEEL]: 0.5 },
  [PokemonType.DARK]: { [PokemonType.PSYCHIC]: 2, [PokemonType.GHOST]: 2, [PokemonType.FIGHTING]: 0.5, [PokemonType.DARK]: 0.5, [PokemonType.STEEL]: 0.5 },
  [PokemonType.STEEL]: { [PokemonType.ICE]: 2, [PokemonType.ROCK]: 2, [PokemonType.FIRE]: 0.5, [PokemonType.WATER]: 0.5, [PokemonType.ELECTRIC]: 0.5, [PokemonType.STEEL]: 0.5 },
  [PokemonType.NORMAL]: { [PokemonType.ROCK]: 0.5, [PokemonType.STEEL]: 0.5, [PokemonType.GHOST]: 0 }
};

export const getTypeEffectiveness = (attacker: PokemonType, defender: PokemonType): number => {
  const attackEffects = TYPE_CHART[attacker];
  if (attackEffects && defender in attackEffects) {
    return attackEffects[defender]!;
  }
  return 1.0;
};

// --- UI CONSTANTS ---

export const TYPE_COLORS: Record<PokemonType, string> = {
  [PokemonType.NORMAL]: 'bg-gray-400',
  [PokemonType.FIRE]: 'bg-red-500',
  [PokemonType.WATER]: 'bg-blue-500',
  [PokemonType.GRASS]: 'bg-green-500',
  [PokemonType.ELECTRIC]: 'bg-yellow-400 text-black',
  [PokemonType.ICE]: 'bg-cyan-300 text-black',
  [PokemonType.FIGHTING]: 'bg-orange-600',
  [PokemonType.POISON]: 'bg-purple-500',
  [PokemonType.GROUND]: 'bg-yellow-600',
  [PokemonType.FLYING]: 'bg-indigo-400',
  [PokemonType.PSYCHIC]: 'bg-pink-500',
  [PokemonType.BUG]: 'bg-lime-500',
  [PokemonType.ROCK]: 'bg-yellow-800',
  [PokemonType.GHOST]: 'bg-purple-700',
  [PokemonType.DRAGON]: 'bg-indigo-600',
  [PokemonType.STEEL]: 'bg-gray-500',
  [PokemonType.DARK]: 'bg-gray-800'
};

export const TYPE_BG: Record<PokemonType, string> = {
  [PokemonType.NORMAL]: 'bg-gradient-to-br from-gray-200 to-gray-400',
  [PokemonType.FIRE]: 'bg-gradient-to-br from-red-200 to-red-400',
  [PokemonType.WATER]: 'bg-gradient-to-br from-blue-200 to-blue-400',
  [PokemonType.GRASS]: 'bg-gradient-to-br from-green-200 to-green-400',
  [PokemonType.ELECTRIC]: 'bg-gradient-to-br from-yellow-200 to-yellow-400',
  [PokemonType.ICE]: 'bg-gradient-to-br from-cyan-100 to-cyan-300',
  [PokemonType.FIGHTING]: 'bg-gradient-to-br from-orange-400 to-orange-600',
  [PokemonType.POISON]: 'bg-gradient-to-br from-purple-300 to-purple-500',
  [PokemonType.GROUND]: 'bg-gradient-to-br from-yellow-500 to-yellow-700',
  [PokemonType.FLYING]: 'bg-gradient-to-br from-indigo-200 to-indigo-400',
  [PokemonType.PSYCHIC]: 'bg-gradient-to-br from-pink-300 to-pink-500',
  [PokemonType.BUG]: 'bg-gradient-to-br from-lime-300 to-lime-500',
  [PokemonType.ROCK]: 'bg-gradient-to-br from-yellow-700 to-yellow-900',
  [PokemonType.GHOST]: 'bg-gradient-to-br from-purple-600 to-purple-800',
  [PokemonType.DRAGON]: 'bg-gradient-to-br from-indigo-500 to-indigo-700',
  [PokemonType.STEEL]: 'bg-gradient-to-br from-gray-300 to-gray-500',
  [PokemonType.DARK]: 'bg-gradient-to-br from-gray-700 to-gray-900'
};

export const TYPE_ENVIRONMENTS: Record<PokemonType, { background: string }> = {
    [PokemonType.NORMAL]: { background: 'linear-gradient(to bottom, #87CEEB 0%, #E0F7FA 100%)' }, 
    [PokemonType.FIRE]: { background: 'linear-gradient(to bottom, #FFA07A 0%, #8B0000 100%)' }, 
    [PokemonType.WATER]: { background: 'linear-gradient(to bottom, #00BFFF 0%, #00008B 100%)' }, 
    [PokemonType.GRASS]: { background: 'linear-gradient(to bottom, #90EE90 0%, #006400 100%)' }, 
    [PokemonType.ELECTRIC]: { background: 'linear-gradient(to bottom, #FFD700 0%, #FF8C00 100%)' }, 
    [PokemonType.ICE]: { background: 'linear-gradient(to bottom, #E0FFFF 0%, #B0E0E6 100%)' }, 
    [PokemonType.FIGHTING]: { background: 'linear-gradient(to bottom, #DEB887 0%, #8B4513 100%)' }, 
    [PokemonType.POISON]: { background: 'linear-gradient(to bottom, #DDA0DD 0%, #800080 100%)' }, 
    [PokemonType.GROUND]: { background: 'linear-gradient(to bottom, #D2B48C 0%, #8B4513 100%)' }, 
    [PokemonType.FLYING]: { background: 'linear-gradient(to bottom, #87CEEB 0%, #F0F8FF 100%)' }, 
    [PokemonType.PSYCHIC]: { background: 'linear-gradient(to bottom, #FF69B4 0%, #800080 100%)' }, 
    [PokemonType.BUG]: { background: 'linear-gradient(to bottom, #9ACD32 0%, #556B2F 100%)' }, 
    [PokemonType.ROCK]: { background: 'linear-gradient(to bottom, #A9A9A9 0%, #2F4F4F 100%)' }, 
    [PokemonType.GHOST]: { background: 'linear-gradient(to bottom, #483D8B 0%, #000000 100%)' }, 
    [PokemonType.DRAGON]: { background: 'linear-gradient(to bottom, #4169E1 0%, #000080 100%)' }, 
    [PokemonType.STEEL]: { background: 'linear-gradient(to bottom, #C0C0C0 0%, #696969 100%)' }, 
    [PokemonType.DARK]: { background: 'linear-gradient(to bottom, #2F4F4F 0%, #000000 100%)' } 
};

export const LEGENDARY_BG_STYLE: { background: string } = {
    background: 'radial-gradient(circle, #ff0000 0%, #000000 100%)'
};

// --- STATS & PROGRESSION SYSTEM ---

// Base Stats Ranges (Race Values) - Adjusted for new formula
// Standard Pokemon Range: HP 40-100, Stats 40-100
export const RARITY_BASE_STATS: Record<PokemonRarity, { hp: [number, number], atk: [number, number], def: [number, number] }> = {
  'Common':    { hp: [40, 50],  atk: [40, 55],  def: [40, 55] }, 
  'Rare':      { hp: [50, 65],  atk: [55, 75], def: [55, 75] },
  'Elite':     { hp: [65, 80],  atk: [75, 95], def: [75, 95] },
  'Ultra':     { hp: [80, 100], atk: [95, 115], def: [95, 115] },
  'Legendary': { hp: [100, 120], atk: [120, 140], def: [120, 140] }
};

// Catch Rates
export const CATCH_RATES: Record<PokemonRarity, number> = {
    'Common': 1.0,
    'Rare': 0.9,
    'Elite': 0.7,
    'Ultra': 0.4,
    'Legendary': 0.2
};

// Experience to Next Level Formula (Adjusted for Lvl 50 cap)
export const getExpToNextLevel = (level: number): number => {
    // Quadratic Curve: 100 * L + 2 * L^2
    return Math.round(100 * level + (2 * level * level));
};

export const getBaseExpYield = (rarity: PokemonRarity): number => {
    switch(rarity) {
        case 'Common': return 15; 
        case 'Rare': return 25;
        case 'Elite': return 40;
        case 'Ultra': return 65;
        case 'Legendary': return 100;
        default: return 15;
    }
};

// NEW EXPORT: Fixed Stat Growth per Level
export const getStatGrowth = (rarity: PokemonRarity): { hp: number, atk: number, def: number } => {
    return { hp: 2, atk: 1, def: 1 };
};

export const TYPE_HP_MULTI: Partial<Record<PokemonType, number>> = {
  [PokemonType.NORMAL]: 1.00, [PokemonType.FIRE]: 1.00, [PokemonType.WATER]: 1.10, [PokemonType.GRASS]: 0.95, 
  [PokemonType.ELECTRIC]: 0.95, [PokemonType.ICE]: 0.90, [PokemonType.FIGHTING]: 1.10, [PokemonType.POISON]: 1.05, 
  [PokemonType.GROUND]: 1.20, [PokemonType.ROCK]: 1.30, [PokemonType.FLYING]: 0.95, [PokemonType.PSYCHIC]: 0.95, 
  [PokemonType.BUG]: 0.90, [PokemonType.GHOST]: 1.00, [PokemonType.DRAGON]: 1.30, [PokemonType.DARK]: 1.05, [PokemonType.STEEL]: 1.40
};

export const TYPE_ATK_MULTI: Partial<Record<PokemonType, number>> = {
  [PokemonType.NORMAL]: 1.00, [PokemonType.FIRE]: 1.10, [PokemonType.WATER]: 1.00, [PokemonType.GRASS]: 1.00, 
  [PokemonType.ELECTRIC]: 1.15, [PokemonType.ICE]: 1.20, [PokemonType.FIGHTING]: 1.20, [PokemonType.POISON]: 1.00, 
  [PokemonType.GROUND]: 1.05, [PokemonType.ROCK]: 1.10, [PokemonType.FLYING]: 1.05, [PokemonType.PSYCHIC]: 1.15, 
  [PokemonType.BUG]: 0.95, [PokemonType.GHOST]: 1.10, [PokemonType.DRAGON]: 1.20, [PokemonType.DARK]: 1.15, [PokemonType.STEEL]: 0.90
};

export const TYPE_DEF_MULTI: Partial<Record<PokemonType, number>> = {
  [PokemonType.ROCK]: 1.40, [PokemonType.STEEL]: 1.50, [PokemonType.GROUND]: 1.20, [PokemonType.ICE]: 1.10,
  [PokemonType.WATER]: 1.05, [PokemonType.GRASS]: 1.05, [PokemonType.FIRE]: 0.95, [PokemonType.ELECTRIC]: 0.90,
  [PokemonType.FIGHTING]: 0.95, [PokemonType.PSYCHIC]: 0.85, [PokemonType.FLYING]: 0.90, [PokemonType.GHOST]: 0.80,
  [PokemonType.NORMAL]: 1.00, [PokemonType.POISON]: 1.00, [PokemonType.BUG]: 1.00, [PokemonType.DRAGON]: 1.10, [PokemonType.DARK]: 0.95
};
