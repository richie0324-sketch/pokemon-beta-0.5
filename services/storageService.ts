
import { SaveData, Pokemon, GameState, MathTopic, InventorySlot, PokemonRarity } from '../types';
import { getExpToNextLevel, RARITY_BASE_STATS } from '../constants';
import { POKEDEX_REGISTRY } from '../data/pokedexData';

const SAVE_KEY = 'mathmon_save_v2';

// Starter kit for new saves
const INITIAL_INVENTORY: InventorySlot[] = [
    { itemId: 'poke-ball', count: 10 },
    { itemId: 'potion', count: 5 },
    { itemId: 'escape-rope', count: 1 }
];

const INITIAL_MONEY = 3000;

export const StorageService = {
    hasSave(): boolean {
        return !!localStorage.getItem(SAVE_KEY);
    },

    save(data: SaveData): void {
        try {
            localStorage.setItem(SAVE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error("Failed to save game", e);
        }
    },

    load(): SaveData | null {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return null;

        try {
            const data: any = JSON.parse(raw);
            
            // --- DATA MIGRATION / POLYFILLS ---
            
            const polyfillPokemon = (p: any): Pokemon => {
                // If description looks like old default or is missing, try to fetch fresh base stats
                // We want to recalculate stats using the new formula:
                // HP = Base + IV + Level*2
                // Atk = Base + IV + Level
                
                const level = p.level || 1;
                const ivs = p.ivs || { hp: 0, atk: 0, def: 0 };
                
                // Try to find original registry entry for accurate Base Stats
                const entry = POKEDEX_REGISTRY.find(e => e.speciesId === p.speciesId);
                
                // Fallback base stats if not found (using new Rarity ranges)
                let baseHp = 50;
                let baseAtk = 50;
                let baseDef = 50;

                if (entry) {
                    baseHp = entry.baseStats.hp;
                    baseAtk = entry.baseStats.atk;
                    baseDef = entry.baseStats.def;
                } else {
                    const rarity = (p.rarity || 'Common') as PokemonRarity;
                    const range = RARITY_BASE_STATS[rarity] || RARITY_BASE_STATS['Common'];
                    baseHp = range.hp[0];
                    baseAtk = range.atk[0];
                    baseDef = range.def[0];
                }

                // Apply New Formula
                const maxHp = baseHp + ivs.hp + (level * 2);
                const attack = baseAtk + ivs.atk + level;
                const defense = baseDef + ivs.def + level;

                return {
                    ...p,
                    maxHp: maxHp,
                    currHp: Math.min(p.currHp, maxHp), // Clamp HP
                    attack: attack,
                    defense: defense,
                    description: p.description || "A Pokemon from a previous adventure.",
                    exp: p.exp || 0,
                    maxExp: p.maxExp || getExpToNextLevel(level),
                    ivs: ivs
                };
            };

            // Reconstruct clean SaveData object
            const cleanData: SaveData = {
                playerName: data.playerName || 'Trainer',
                playerAvatar: data.playerAvatar || 'https://play.pokemonshowdown.com/sprites/trainers/red.png', // Default
                trainerId: data.trainerId || '00000',
                badges: Array.isArray(data.badges) ? data.badges : [],
                selectedTopic: data.selectedTopic || 'linear',
                playerPokemon: polyfillPokemon(data.playerPokemon),
                caughtPokemon: Array.isArray(data.caughtPokemon) 
                    ? data.caughtPokemon.map(polyfillPokemon) 
                    : [polyfillPokemon(data.playerPokemon)],
                
                // Added missing storagePokemon field
                storagePokemon: Array.isArray(data.storagePokemon)
                    ? data.storagePokemon.map(polyfillPokemon)
                    : [],

                seenSpeciesIds: Array.isArray(data.seenSpeciesIds) 
                    ? data.seenSpeciesIds 
                    : (Array.isArray(data.caughtPokemon) ? data.caughtPokemon.map((p: any) => p.speciesId) : []),
                
                inventory: Array.isArray(data.inventory) ? data.inventory : INITIAL_INVENTORY,
                money: typeof data.money === 'number' ? data.money : INITIAL_MONEY,
                
                caughtHistory: Array.isArray(data.caughtHistory)
                    ? data.caughtHistory
                    : (Array.isArray(data.caughtPokemon) ? Array.from(new Set(data.caughtPokemon.map((p: any) => p.speciesId))) : []),
                
                streak: data.streak || 0,
                targetStreak: data.targetStreak || 5,
                saveDate: data.saveDate || Date.now(),
                defeatedTrainers: Array.isArray(data.defeatedTrainers) ? data.defeatedTrainers : [],
                unlockedAchievements: data.unlockedAchievements || {},

                // New fields polyfill
                activeBuffs: data.activeBuffs || {},
                activeQuest: data.activeQuest || null,
                activeField: data.activeField || 'NORMAL'
            };

            return cleanData;

        } catch (e) {
            console.error("Save file corrupted", e);
            return null;
        }
    },

    clear(): void {
        localStorage.removeItem(SAVE_KEY);
    }
};
