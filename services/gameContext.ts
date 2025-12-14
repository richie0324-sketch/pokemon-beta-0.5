
import { GameActions, EncounterModifier, Pokemon, Trainer, PokedexEntry, GameState, FieldTerrain, QuestState } from '../types';
import { useGameStore } from '../store/useGameStore';
import { usePlayerStore } from '../store/usePlayerStore';
import { useBattleStore } from '../store/useBattleStore';
import { showToast } from '../store/useToastStore';
import { audioService } from './audioService';
import { POKEDEX_REGISTRY } from '../data/pokedexData';

// Wrapper to avoid circular dependency issues by reading state lazily
export const getGameActions = (): GameActions => {
    const gameStore = useGameStore.getState();
    const playerStore = usePlayerStore.getState();
    const battleStore = useBattleStore.getState();

    return {
        player: {
            pokemon: playerStore.playerPokemon,
            healActive: () => {
                const p = playerStore.playerPokemon;
                if (p) playerStore.setPlayerPokemon({ ...p, currHp: p.maxHp });
            },
            damageActivePct: (pct: number) => {
                const p = playerStore.playerPokemon;
                if (p) {
                    const dmg = Math.floor(p.maxHp * pct);
                    playerStore.setPlayerPokemon({ ...p, currHp: Math.max(1, p.currHp - dmg) });
                }
            },
            addMoney: (amount: number) => playerStore.setMoney(m => m + amount),
            addItem: (id: string, count: number) => playerStore.addItem(id, count),
            removeItem: (id: string, count: number) => playerStore.removeItem(id, count),
            hasItem: (id: string) => playerStore.inventory.some(i => i.itemId === id && i.count > 0),
            getInventory: () => playerStore.inventory,
            getAllCaught: () => playerStore.caughtPokemon
        },
        game: {
            setEncounterModifier: (mod: EncounterModifier | null) => gameStore.setEncounterModifier(mod),
            addBuff: (id: string, duration: number) => gameStore.addBuff(id, duration),
            setBackpackTab: (tab: 'ITEMS' | 'TEAM') => gameStore.setBackpackTab(tab),
            triggerEvolution: (pokemon: Pokemon, target: PokedexEntry) => {
                gameStore.queueEvolutions([{ pokemon, target }]);
            },
            // NEW: QUEST STARTER
            startQuest: (terrain: FieldTerrain, bossId: number, bossName: string, objective: QuestState['objective'], count: number) => {
                gameStore.setActiveField(terrain);
                gameStore.startQuest({
                    active: true,
                    bossSpeciesId: bossId,
                    bossName: bossName,
                    currentProgress: 0,
                    requiredProgress: count,
                    objective: objective,
                    introText: "The environment has shifted..."
                });
            }
        },
        battle: {
            startWild: (enemy: Pokemon) => {
                // Ensure event is cleared so modal doesn't linger or interfere
                gameStore.setCurrentEvent(null);
                
                battleStore.startWildEncounter(enemy);
                playerStore.registerSeen(enemy.speciesId);
                gameStore.setGameState(GameState.WILD_ENCOUNTER, gameStore.prevState);
                setTimeout(() => gameStore.setGameState(GameState.BATTLE_COMBAT), 2000);
            },
            startTrainer: (trainer: Trainer) => {
                console.warn("Direct trainer start from actions not fully implemented.");
            },
            setModifiers: (mods) => {
                battleStore.setBattleModifiers(prev => ({
                    atk: mods.atk ?? prev.atk,
                    def: mods.def ?? prev.def
                }));
            }
        },
        ui: {
            showToast: (msg, type) => showToast(msg, type || 'info'),
            playSound: (key) => audioService.playSfx(key),
            closeEvent: () => {
                gameStore.setCurrentEvent(null);
                gameStore.setGameState(gameStore.prevState || GameState.MENU_MAIN);
            },
            openShop: () => { }
        }
    };
};
