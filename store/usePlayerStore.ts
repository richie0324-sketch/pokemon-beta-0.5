
import { create } from 'zustand';
import { Pokemon, InventorySlot, SaveData } from '../types';
import { ITEM_REGISTRY } from '../data/itemData';

interface PlayerStoreState {
    playerPokemon: Pokemon | null;
    caughtPokemon: Pokemon[];
    storagePokemon: Pokemon[];
    seenSpeciesIds: number[];
    caughtHistory: number[];
    defeatedTrainers: string[];
    inventory: InventorySlot[];
    money: number;
    unlockedAchievements: Record<string, number>;
    
    // NEW: Identity
    trainerId: string;
    badges: string[];

    // Actions
    setPlayerPokemon: (pokemon: Pokemon | null) => void;
    setCaughtPokemon: (updater: (pokemon: Pokemon[]) => Pokemon[]) => void;
    setStoragePokemon: (updater: (pokemon: Pokemon[]) => Pokemon[]) => void;
    setInventory: (updater: (inventory: InventorySlot[]) => InventorySlot[]) => void;
    addItem: (itemId: string, count: number) => void;
    removeItem: (itemId: string, count: number) => void;
    setMoney: (updater: (money: number) => number) => void;
    setSeenSpeciesIds: (updater: (ids: number[]) => number[]) => void;
    registerSeen: (speciesId: number) => void;
    registerCaught: (speciesId: number) => void;
    addDefeatedTrainer: (trainerId: string) => void;
    unlockAchievement: (achievementId: string) => void;
    
    setTrainerId: (id: string) => void;
    addBadge: (badgeId: string) => void;
    
    // Helper
    syncPlayerToCaught: () => void;

    // PC Actions
    swapPartyStorage: (partyId: string, storageId: string) => void;
    depositPokemon: (partyId: string) => void;
    withdrawPokemon: (storageId: string) => void;
    
    // TRADE ACTIONS
    tradePokemon: (myPokemonId: string, newPokemon: Pokemon) => void;
    
    // Load/Save Logic
    loadPlayerState: (data: SaveData) => void;
}

export const usePlayerStore = create<PlayerStoreState>((set, get) => ({
    playerPokemon: null,
    caughtPokemon: [],
    storagePokemon: [],
    seenSpeciesIds: [],
    caughtHistory: [],
    defeatedTrainers: [],
    inventory: [],
    money: 0,
    unlockedAchievements: {},
    trainerId: '00000',
    badges: [],

    setPlayerPokemon: (pokemon) => set({ playerPokemon: pokemon }),
    setCaughtPokemon: (updater) => set(state => ({ caughtPokemon: updater(state.caughtPokemon) })),
    setStoragePokemon: (updater) => set(state => ({ storagePokemon: updater(state.storagePokemon) })),
    setInventory: (updater) => set(state => ({ inventory: updater(state.inventory) })),
    setMoney: (updater) => set(state => ({ money: updater(state.money) })),
    setSeenSpeciesIds: (updater) => set(state => ({ seenSpeciesIds: updater(state.seenSpeciesIds) })),

    setTrainerId: (id) => set({ trainerId: id }),
    addBadge: (badgeId) => set(state => ({ 
        badges: state.badges.includes(badgeId) ? state.badges : [...state.badges, badgeId] 
    })),

    addItem: (itemId, count) => {
        const { inventory } = get();
        const existing = inventory.find(i => i.itemId === itemId);
        if (existing) {
            get().setInventory(() => inventory.map(i => i.itemId === itemId ? { ...i, count: i.count + count } : i));
        } else {
            get().setInventory(() => [...inventory, { itemId, count }]);
        }
    },
    
    removeItem: (itemId, count) => {
        if (ITEM_REGISTRY[itemId]?.category === 'KEY') return; // Cannot remove key items
        if (itemId === 'poke-ball') return; // Infinite
        
        get().setInventory(prev =>
            prev
                .map(i => (i.itemId === itemId ? { ...i, count: i.count - count } : i))
                .filter(i => i.count > 0)
        );
    },

    registerSeen: (speciesId) => set(state => ({
        seenSpeciesIds: state.seenSpeciesIds.includes(speciesId) ? state.seenSpeciesIds : [...state.seenSpeciesIds, speciesId]
    })),

    registerCaught: (speciesId) => set(state => ({
        caughtHistory: state.caughtHistory.includes(speciesId) ? state.caughtHistory : [...state.caughtHistory, speciesId]
    })),
    
    addDefeatedTrainer: (trainerId) => set(state => ({
        defeatedTrainers: state.defeatedTrainers.includes(trainerId) ? state.defeatedTrainers : [...state.defeatedTrainers, trainerId]
    })),

    unlockAchievement: (achievementId: string) => set(state => ({
        unlockedAchievements: {
            ...state.unlockedAchievements,
            [achievementId]: Date.now()
        }
    })),

    syncPlayerToCaught: () => {
        const { playerPokemon, caughtPokemon } = get();
        if (!playerPokemon) return;
        // Update the pokemon in the party list that matches the active ID
        set({
            caughtPokemon: caughtPokemon.map(p => p.id === playerPokemon.id ? playerPokemon : p)
        });
    },
    
    swapPartyStorage: (partyId, storageId) => {
        const { caughtPokemon, storagePokemon, playerPokemon } = get();
        const pIndex = caughtPokemon.findIndex(p => p.id === partyId);
        const sIndex = storagePokemon.findIndex(s => s.id === storageId);
        if (pIndex === -1 || sIndex === -1) return;

        const newParty = [...caughtPokemon];
        const newStorage = [...storagePokemon];
        [newParty[pIndex], newStorage[sIndex]] = [newStorage[sIndex], newParty[pIndex]];
        
        if (playerPokemon?.id === partyId) {
            set({ playerPokemon: newParty[pIndex] });
        }
        set({ caughtPokemon: newParty, storagePokemon: newStorage });
    },
    
    depositPokemon: (partyId) => {
        const { caughtPokemon, playerPokemon } = get();
        if (caughtPokemon.length <= 1) return;
        const p = caughtPokemon.find(p => p.id === partyId);
        if (!p) return;

        set(state => ({
            caughtPokemon: state.caughtPokemon.filter(x => x.id !== partyId),
            storagePokemon: [...state.storagePokemon, p]
        }));
        
        if (playerPokemon?.id === partyId) {
            const nextActive = get().caughtPokemon.find(x => x.id !== partyId);
            set({ playerPokemon: nextActive || null });
        }
    },
    
    withdrawPokemon: (storageId) => {
        const { caughtPokemon, storagePokemon } = get();
        if (caughtPokemon.length >= 6) return;
        const p = storagePokemon.find(s => s.id === storageId);
        if (!p) return;

        set(state => ({
            storagePokemon: state.storagePokemon.filter(x => x.id !== storageId),
            caughtPokemon: [...state.caughtPokemon, p]
        }));
    },

    tradePokemon: (myPokemonId: string, newPokemon: Pokemon) => {
        const { caughtPokemon, playerPokemon } = get();
        
        // Find current and replace with new
        const newParty = caughtPokemon.map(p => {
            if (p.id === myPokemonId) {
                return newPokemon;
            }
            return p;
        });
        
        set({ caughtPokemon: newParty });
        
        // If active pokemon was traded, update it
        if (playerPokemon && playerPokemon.id === myPokemonId) {
            set({ playerPokemon: newPokemon });
        }
        
        // Register the new one
        get().registerSeen(newPokemon.speciesId);
        get().registerCaught(newPokemon.speciesId);
    },

    loadPlayerState: (data) => {
        set({
            playerPokemon: data.playerPokemon,
            caughtPokemon: data.caughtPokemon,
            storagePokemon: data.storagePokemon || [],
            seenSpeciesIds: data.seenSpeciesIds || [],
            caughtHistory: data.caughtHistory || [],
            defeatedTrainers: data.defeatedTrainers || [],
            inventory: data.inventory,
            money: data.money,
            unlockedAchievements: data.unlockedAchievements || {},
            trainerId: data.trainerId || '00000',
            badges: data.badges || []
        });
    }
}));
