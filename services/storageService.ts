
import { SaveData, Pokemon, InventorySlot, PokemonRarity, SaveMetadata } from '../types';
import { getExpToNextLevel, RARITY_BASE_STATS } from '../constants';
import { POKEDEX_REGISTRY } from '../data/pokedexData';

// New Slot Keys
const SAVE_SLOT_PREFIX = 'mathmon_save_slot_';
const MAX_SLOTS = 3;

// Starter kit for new saves
const INITIAL_INVENTORY: InventorySlot[] = [
    { itemId: 'poke-ball', count: 10 },
    { itemId: 'potion', count: 5 },
    { itemId: 'escape-rope', count: 1 }
];

const INITIAL_MONEY = 3000;

export const StorageService = {
    // Migration helper: Move old save to slot 1 if slot 1 is empty and old save exists
    migrateLegacySave(): void {
        const oldSave = localStorage.getItem('mathmon_save_v2');
        const slot1 = localStorage.getItem(`${SAVE_SLOT_PREFIX}1`);
        
        if (oldSave && !slot1) {
            localStorage.setItem(`${SAVE_SLOT_PREFIX}1`, oldSave);
            // Optional: Remove old key to prevent confusion, or keep as backup
            // localStorage.removeItem('mathmon_save_v2'); 
        }
    },

    hasAnySave(): boolean {
        StorageService.migrateLegacySave();
        for (let i = 1; i <= MAX_SLOTS; i++) {
            if (localStorage.getItem(`${SAVE_SLOT_PREFIX}${i}`)) return true;
        }
        return false;
    },

    getSlotInfo(slotId: number): SaveMetadata {
        StorageService.migrateLegacySave();
        const raw = localStorage.getItem(`${SAVE_SLOT_PREFIX}${slotId}`);
        if (!raw) {
            return { slotId, isEmpty: true };
        }
        try {
            const data: SaveData = JSON.parse(raw);
            return {
                slotId,
                isEmpty: false,
                playerName: data.playerName,
                badges: data.badges.length,
                money: data.money,
                playTime: data.saveDate,
                avatar: data.playerAvatar
            };
        } catch {
            return { slotId, isEmpty: true };
        }
    },

    getAllSlots(): SaveMetadata[] {
        const slots: SaveMetadata[] = [];
        for (let i = 1; i <= MAX_SLOTS; i++) {
            slots.push(StorageService.getSlotInfo(i));
        }
        return slots;
    },

    save(data: SaveData, slotId: number = 1): void {
        try {
            localStorage.setItem(`${SAVE_SLOT_PREFIX}${slotId}`, JSON.stringify(data));
        } catch (e) {
            console.error("Failed to save game", e);
        }
    },

    load(slotId: number = 1): SaveData | null {
        StorageService.migrateLegacySave();
        const raw = localStorage.getItem(`${SAVE_SLOT_PREFIX}${slotId}`);
        if (!raw) return null;

        try {
            const data: any = JSON.parse(raw);
            
            // --- DATA MIGRATION / POLYFILLS ---
            
            const polyfillPokemon = (p: any): Pokemon => {
                const level = p.level || 1;
                const ivs = p.ivs || { hp: 0, atk: 0, def: 0 };
                
                const entry = POKEDEX_REGISTRY.find(e => e.speciesId === p.speciesId);
                
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

                const maxHp = baseHp + ivs.hp + (level * 2);
                const attack = baseAtk + ivs.atk + level;
                const defense = baseDef + ivs.def + level;

                return {
                    ...p,
                    maxHp: maxHp,
                    currHp: Math.min(p.currHp, maxHp), 
                    attack: attack,
                    defense: defense,
                    description: p.description || "A Pokemon from a previous adventure.",
                    exp: p.exp || 0,
                    maxExp: p.maxExp || getExpToNextLevel(level),
                    ivs: ivs
                };
            };

            const cleanData: SaveData = {
                playerName: data.playerName || 'Trainer',
                playerAvatar: data.playerAvatar || 'https://play.pokemonshowdown.com/sprites/trainers/red.png',
                trainerId: data.trainerId || '00000',
                badges: Array.isArray(data.badges) ? data.badges : [],
                selectedTopic: data.selectedTopic || 'linear',
                playerPokemon: polyfillPokemon(data.playerPokemon),
                caughtPokemon: Array.isArray(data.caughtPokemon) 
                    ? data.caughtPokemon.map(polyfillPokemon) 
                    : [polyfillPokemon(data.playerPokemon)],
                
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

    deleteSlot(slotId: number): void {
        localStorage.removeItem(`${SAVE_SLOT_PREFIX}${slotId}`);
    },

    clear(): void {
        try {
            // Remove legacy key if it exists
            localStorage.removeItem('mathmon_save_v2');
            
            // Remove all slots
            for (let i = 1; i <= MAX_SLOTS; i++) {
                localStorage.removeItem(`${SAVE_SLOT_PREFIX}${i}`);
            }
        } catch (e) {
            console.error("Failed to clear saves", e);
        }
    },

    // --- NEW: Save Code Export/Import ---
    // Modified to default to slot 1 if not specified, or allow UI to pick
    exportSave(slotId: number = 1): string | null {
        const raw = localStorage.getItem(`${SAVE_SLOT_PREFIX}${slotId}`);
        if (!raw) return null;
        try {
            return btoa(encodeURIComponent(raw));
        } catch (e) {
            console.error("Export failed", e);
            return null;
        }
    },

    importSave(code: string, slotId: number = 1): boolean {
        try {
            const raw = decodeURIComponent(atob(code.trim()));
            const data = JSON.parse(raw);
            
            if (!data.playerName || !Array.isArray(data.caughtPokemon)) {
                return false;
            }
            
            localStorage.setItem(`${SAVE_SLOT_PREFIX}${slotId}`, raw);
            return true;
        } catch (e) {
            console.error("Import failed", e);
            return false;
        }
    }
};
