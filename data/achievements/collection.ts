
import { Achievement, PokemonType } from '../../types';
import { POKEDEX_REGISTRY } from '../pokedexData';

// Helper function to count types in caught history
const countType = (history: number[], type: PokemonType) => {
    return history.reduce((acc, id) => {
        const entry = POKEDEX_REGISTRY.find(p => p.speciesId === id);
        if (entry && entry.type === type) {
            return acc + 1;
        }
        return acc;
    }, 0);
};

export const collectionAchievements: Achievement[] = [
  // --- COLLECTION: TOTAL CATCHES ---
  {
    id: 'catch_total_1', title: 'First Wild Catch', description: 'Caught your first wild Pokemon!',
    icon: '🎯', trigger: 'POKEMON_CAUGHT',
    condition: (_, ps) => ps.caughtHistory.length === 2, // Changed from 1 to 2 (Starter + 1 Wild)
    reward: { money: 500, itemId: 'potion', itemCount: 3 }
  },
  {
    id: 'catch_total_10', title: 'Novice Collector', description: 'Register 10 different species in your Pokedex.',
    icon: '📚', trigger: 'POKEMON_CAUGHT',
    condition: (_, ps) => ps.caughtHistory.length >= 11, // Adjusted for starter
    reward: { money: 1000, itemId: 'great-ball', itemCount: 5 }
  },
  {
    id: 'catch_total_25', title: 'Adept Collector', description: 'Register 25 different species.',
    icon: '📘', trigger: 'POKEMON_CAUGHT',
    condition: (_, ps) => ps.caughtHistory.length >= 26, // Adjusted for starter
    reward: { money: 2500, itemId: 'super-potion', itemCount: 5 }
  },
  {
    id: 'catch_total_50', title: 'Expert Collector', description: 'Register 50 different species.',
    icon: '📙', trigger: 'POKEMON_CAUGHT',
    condition: (_, ps) => ps.caughtHistory.length >= 51, // Adjusted for starter
    reward: { money: 5000, itemId: 'ultra-ball', itemCount: 5 }
  },
  {
    id: 'catch_total_75', title: 'Seasoned Collector', description: 'Register 75 different species.',
    icon: '📓', trigger: 'POKEMON_CAUGHT',
    condition: (_, ps) => ps.caughtHistory.length >= 76, // Adjusted for starter
    reward: { money: 7500 }
  },
  {
    id: 'catch_total_100', title: 'Master Collector', description: 'Register 100 different species.',
    icon: '📜', trigger: 'POKEMON_CAUGHT',
    condition: (_, ps) => ps.caughtHistory.length >= 101, // Adjusted for starter
    reward: { money: 10000, itemId: 'rare-candy', itemCount: 3 }
  },
  {
    id: 'catch_total_125', title: 'Prodigious Collector', description: 'Register 125 different species.',
    icon: '📔', trigger: 'POKEMON_CAUGHT',
    condition: (_, ps) => ps.caughtHistory.length >= 126, // Adjusted for starter
    reward: { money: 12500 }
  },
  {
    id: 'catch_total_151', title: 'Kanto Champion', description: 'Register all 151 original species.',
    icon: '🏆', trigger: 'POKEMON_CAUGHT',
    condition: (_, ps) => ps.caughtHistory.filter(id => id <= 151).length >= 151,
    reward: { money: 50000, itemId: 'master-ball', itemCount: 1 }
  },
  
  // --- COLLECTION: RARITY ---
  {
    id: 'catch_rarity_rare', title: 'Rare Find', description: 'Catch your first Rare Pokemon.',
    icon: '💎', trigger: 'POKEMON_CAUGHT',
    condition: (payload, ps) => payload.rarity === 'Rare' && ps.caughtHistory.length > 1, // Added length check
    reward: { money: 1000 }
  },
  {
    id: 'catch_rarity_elite', title: 'Elite Acquisition', description: 'Catch your first Elite Pokemon.',
    icon: '✨', trigger: 'POKEMON_CAUGHT',
    condition: (payload, ps) => payload.rarity === 'Elite' && ps.caughtHistory.length > 1, // Added length check
    reward: { money: 2500, itemId: 'great-ball', itemCount: 10 }
  },
  {
    id: 'catch_rarity_ultra', title: 'Ultra Discovery', description: 'Catch your first Ultra Pokemon.',
    icon: '🌟', trigger: 'POKEMON_CAUGHT',
    condition: (payload, ps) => payload.rarity === 'Ultra' && ps.caughtHistory.length > 1, // Added length check
    reward: { money: 7500, itemId: 'ultra-ball', itemCount: 10 }
  },
  {
    id: 'catch_rarity_legendary', title: 'A Living Legend', description: 'Catch your first Legendary Pokemon.',
    icon: '👑', trigger: 'POKEMON_CAUGHT',
    condition: (payload, ps) => payload.rarity === 'Legendary' && ps.caughtHistory.length > 1, // Added length check
    reward: { money: 20000, itemId: 'master-ball', itemCount: 1 }
  },

  // --- COLLECTION: TYPE SPECIALIST ---
  ...Object.values(PokemonType).map(type => ({
    id: `catch_type_${type.toLowerCase()}_10`,
    title: `${type} Fan`,
    description: `Catch 10 ${type}-type Pokemon.`,
    icon: '🏅',
    trigger: 'POKEMON_CAUGHT' as const,
    condition: (_: any, ps: any) => countType(ps.caughtHistory, type) >= 10 && ps.caughtHistory.length > 1, // Added length check
    reward: { money: 2000 }
  })),
  ...Object.values(PokemonType).map(type => ({
    id: `catch_type_${type.toLowerCase()}_20`,
    title: `${type} Master`,
    description: `Catch 20 ${type}-type Pokemon.`,
    icon: '🌟',
    trigger: 'POKEMON_CAUGHT' as const,
    condition: (_: any, ps: any) => countType(ps.caughtHistory, type) >= 20 && ps.caughtHistory.length > 1, // Added length check
    reward: { money: 5000 }
  })),

  // Specific catches
  {
    id: 'catch_snorlax', title: 'Roadblock', description: 'Catch a Snorlax.',
    icon: '😴', trigger: 'POKEMON_CAUGHT',
    condition: (payload, ps) => payload.speciesId === 143 && ps.caughtHistory.length > 1, // Added length check
    reward: { money: 1430 }
  },
  {
    id: 'catch_ditto', title: 'Imposter!', description: 'Catch a Ditto.',
    icon: '🎭', trigger: 'POKEMON_CAUGHT',
    condition: (payload, ps) => payload.speciesId === 132 && ps.caughtHistory.length > 1, // Added length check
    reward: { money: 1320 }
  },
  {
    id: 'catch_mewtwo', title: 'The Strongest', description: 'Catch Mewtwo.',
    icon: '🔮', trigger: 'POKEMON_CAUGHT',
    condition: (payload, ps) => payload.speciesId === 150 && ps.caughtHistory.length > 1, // Added length check
    reward: { money: 100000 }
  },
];
