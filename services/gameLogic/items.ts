
import { InventorySlot, Pokemon, GameState, PokedexEntry } from '../../types';
import { useGameStore } from '../../store/useGameStore';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useBattleStore } from '../../store/useBattleStore';
import { ITEM_REGISTRY, EVOLUTION_ITEM_MAP } from '../../data/itemData';
import { POKEDEX_REGISTRY } from '../../data/pokedexData';
import { audioService } from '../../services/audioService';
import { showToast } from '../../store/useToastStore';
import { calculateExpGain, processLevelUp } from '../../services/battleMechanics';
import { getExpToNextLevel, MAX_LEVEL } from '../../constants';
import { achievementService } from '../achievementService';

// Internal helper for canEvolve
const canEvolvByLevel = (entry: PokedexEntry, level: number): boolean => {
    if (!entry.evolvesTo || !entry.evolutionReq) return false;
    const req = entry.evolutionReq;
    if (req.method === 'level' && req.level) {
        return level >= req.level;
    }
    if (req.method === 'friendship') {
        return level >= 10;
    }
    return false;
};

export const items = {
    handleUseItem: (item: InventorySlot, targetId?: string) => {
        const itemDef = ITEM_REGISTRY[item.itemId];
        const { playerPokemon, setPlayerPokemon, caughtPokemon, setCaughtPokemon, removeItem, addItem } = usePlayerStore.getState();
        const { enemyPokemon, setBattleMessage, setBattleModifiers, setPreppedBall, battleModifiers } = useBattleStore.getState();
        
        if (!itemDef) return;

        // --- MASTER BALL (IMMEDIATE USE) ---
        if (item.itemId === 'master-ball' && enemyPokemon && !useBattleStore.getState().isTrainerBattle) {
            const { setIsMasterBallActive, setCatchAnim, setStreak, endBattle, preppedBall, setPreppedBall } = useBattleStore.getState();
            const { setGameState } = useGameStore.getState();
            
            // Refund any currently prepped ball before using Master Ball
            if (preppedBall && preppedBall.id !== 'poke-ball') {
                addItem(preppedBall.id, 1);
            }
            setPreppedBall(null);

            setGameState(GameState.BATTLE_COMBAT); // Close backpack
            removeItem(item.itemId, 1);
            achievementService.processEvent('ITEM_USED', { itemId: item.itemId });
            
            setIsMasterBallActive(true);
            audioService.playSfx('throw');

            // #14 FIX: Capture enemyPokemon snapshot now before any async delay
            const enemySnapshot = enemyPokemon;

            setTimeout(() => {
                setCatchAnim('success');
                audioService.playSfx('catch');
                setTimeout(() => {
                    // QUEST UPDATE: Master Ball catch counts as progress
                    useGameStore.getState().updateQuestProgress(1);

                    const playerStore = usePlayerStore.getState();
                    if (!enemySnapshot) return;
                    // Use snapshot to avoid stale closure on enemyPokemon
                    const enemyPokemon = enemySnapshot;
                    
                    // Calculate and grant EXP
                    const expGained = calculateExpGain(playerPokemon!, enemyPokemon);
                    if (playerPokemon) {
                        let p = { ...playerPokemon, exp: playerPokemon.exp + expGained };
                        const leveledUp = processLevelUp(p);
                        if (leveledUp) p = leveledUp;
                        setPlayerPokemon(p);
                        
                        const entry = POKEDEX_REGISTRY.find(e => e.speciesId === p.speciesId);
                        if (leveledUp && entry && canEvolvByLevel(entry, p.level)) {
                            const nextEntry = POKEDEX_REGISTRY.find(e => e.speciesId === entry.evolvesTo);
                            if (nextEntry) {
                                useGameStore.getState().queueEvolutions([{ pokemon: p, target: nextEntry }]);
                            }
                        }
                    }
                    
                    // Increment streak and end battle
                    setStreak(s => s + 1);
                    endBattle();
                    
                    // Set captured Pokemon HP to 1/3 of max
                    const capturedPokemon = { ...enemyPokemon, currHp: Math.ceil(enemyPokemon.maxHp / 3) };
                    
                    const newParty = [...playerStore.caughtPokemon, capturedPokemon];
                    if (newParty.length > 6) {
                        playerStore.setStoragePokemon(s => [...s, newParty.shift()!]);
                        playerStore.setCaughtPokemon(() => newParty);
                    } else {
                        playerStore.setCaughtPokemon(() => newParty);
                    }
                    playerStore.registerCaught(enemyPokemon.speciesId);
                    useGameStore.getState().setGameState(GameState.VICTORY_CAUGHT);
                }, 1500);
            }, 2000);
            return;
        }

        // --- ADMIN KEY (SKIP BATTLE) ---
        if (item.itemId === 'admin-key' && enemyPokemon) {
            const { setStreak, endBattle, setLastRewards } = useBattleStore.getState();
            const { setGameState } = useGameStore.getState();
            
            setGameState(GameState.BATTLE_COMBAT);
            removeItem(item.itemId, 1);
            achievementService.processEvent('ITEM_USED', { itemId: item.itemId });
            
            showToast("ADMIN KEY USED. BATTLE SKIPPED.", "success");
            
            // QUEST UPDATE: Admin key skip counts as progress
            useGameStore.getState().updateQuestProgress(1);
            
            // Simple victory without catch
            setStreak(s => s + 1);
            setLastRewards({ money: 0, items: [] }); // No rewards for skipping
            endBattle();
            setGameState(GameState.VICTORY_CAUGHT);
            return;
        }

        // --- BATTLE ITEMS ---
        if (itemDef.category === 'BATTLE') {
            let itemUsed = false;
            if (item.itemId === 'escape-rope') {
                if (useBattleStore.getState().isTrainerBattle) {
                    showToast("You can't escape from a Trainer battle!", "warning");
                    return;
                }
                useBattleStore.getState().setStreak(() => 0);
                useGameStore.getState().setGameState(GameState.DEFEAT);
                audioService.playSfx('run');
                itemUsed = true;
            }
            else if (item.itemId === 'x-attack') {
                if (battleModifiers.atk > 1.0) {
                    showToast("Attack is already boosted!", "warning");
                    return;
                }
                setBattleModifiers(prev => ({ ...prev, atk: itemDef.effectValue! }));
                showToast("Attack rose sharply!", "success");
                itemUsed = true;
            }
            else if (item.itemId === 'x-defense') {
                if (battleModifiers.def < 1.0) {
                    showToast("Defense is already boosted!", "warning");
                    return;
                }
                setBattleModifiers(prev => ({ ...prev, def: itemDef.effectValue! }));
                showToast("Defense rose sharply!", "success");
                itemUsed = true;
            }
            if (itemUsed) {
                removeItem(item.itemId, 1);
                achievementService.processEvent('ITEM_USED', { itemId: item.itemId });
            }
        }
        
        // --- BALLS (PREP) ---
        if (itemDef.category === 'BALL' && enemyPokemon) {
            const { preppedBall } = useBattleStore.getState();

            // 1. Prevent selecting same ball twice (wasting it)
            if (preppedBall?.id === item.itemId) {
                showToast(`${itemDef.name} is already active!`, "info");
                return;
            }

            // 2. Refund existing ball if switching (unless infinite poke-ball)
            if (preppedBall && preppedBall.id !== 'poke-ball') {
                addItem(preppedBall.id, 1);
            }

            // 3. Set new ball
            setPreppedBall({ id: item.itemId, multiplier: itemDef.effectValue! });
            
            // 4. Consume new ball (unless infinite)
            if(item.itemId !== 'poke-ball') {
                removeItem(item.itemId, 1);
                achievementService.processEvent('ITEM_USED', { itemId: item.itemId });
            }
            
            showToast(`${itemDef.name} prepared!`, "success");
        }
        
        // --- MEDICINE & RARE CANDY ---
        if (itemDef.category === 'MEDICINE' && targetId) {
            const target = caughtPokemon.find(p => p.id === targetId);
            if (!target) return;

            const isFainted = target.currHp <= 0;
            let updatedTarget = { ...target };
            let itemUsed = false;
            
            switch(item.itemId) {
                case 'potion':
                case 'super-potion':
                case 'hyper-potion':
                    if (!isFainted) {
                        updatedTarget.currHp = Math.min(target.maxHp, target.currHp + itemDef.effectValue!);
                        itemUsed = true;
                    }
                    break;
                case 'max-potion':
                    if (!isFainted) {
                        updatedTarget.currHp = target.maxHp;
                        itemUsed = true;
                    }
                    break;
                case 'revive':
                case 'max-revive':
                    if (isFainted) {
                        updatedTarget.currHp = Math.floor(target.maxHp * itemDef.effectValue!);
                        itemUsed = true;
                    }
                    break;
                case 'rare-candy':
                    if (!isFainted && updatedTarget.level < MAX_LEVEL) {
                        updatedTarget.level += 1;
                        updatedTarget.exp = 0;
                        updatedTarget.maxExp = getExpToNextLevel(updatedTarget.level);
                        
                        updatedTarget.maxHp += 2;
                        updatedTarget.attack += 1;
                        updatedTarget.defense += 1;
                        updatedTarget.currHp = updatedTarget.maxHp;

                        itemUsed = true;

                        const entry = POKEDEX_REGISTRY.find(e => e.speciesId === updatedTarget.speciesId);
                        if (entry && canEvolvByLevel(entry, updatedTarget.level)) {
                            const nextEntry = POKEDEX_REGISTRY.find(e => e.speciesId === entry.evolvesTo);
                            if (nextEntry) {
                                useGameStore.getState().queueEvolutions([{ pokemon: updatedTarget, target: nextEntry }]);
                            }
                        }
                    }
                    break;
            }
            
            if (itemUsed) {
                const newParty = caughtPokemon.map(p => p.id === targetId ? updatedTarget : p);
                setCaughtPokemon(() => newParty);
                if(playerPokemon?.id === targetId) setPlayerPokemon(updatedTarget);
                
                removeItem(item.itemId, 1);
                achievementService.processEvent('ITEM_USED', { itemId: item.itemId });
            }
        }
        
        // --- EVOLUTION ITEMS ---
        if (itemDef.category === 'EVOLUTION' && targetId) {
            const target = caughtPokemon.find(p => p.id === targetId);
            if (!target) return;
            const evoMap = EVOLUTION_ITEM_MAP[target.speciesId];
            if (evoMap && evoMap[item.itemId]) {
                const nextEntry = POKEDEX_REGISTRY.find(e => e.speciesId === evoMap[item.itemId]);
                if (nextEntry) {
                    useGameStore.getState().queueEvolutions([{ pokemon: target, target: nextEntry }]);
                    removeItem(item.itemId, 1);
                    achievementService.processEvent('ITEM_USED', { itemId: item.itemId });
                }
            }
        }
    },

    equipPokemon: (newPokemon: Pokemon) => {
        const playerStore = usePlayerStore.getState();
        if (playerStore.playerPokemon) {
            playerStore.syncPlayerToCaught();
        }
        playerStore.setPlayerPokemon(newPokemon);
        audioService.playSfx('catch');
    },

    handleReleasePokemon: (pokemonId: string) => {
        const { playerPokemon, setCaughtPokemon, setMoney } = usePlayerStore.getState();
        if (!playerPokemon || pokemonId === playerPokemon.id) return;
        setCaughtPokemon(prev => prev.filter(p => p.id !== pokemonId));
        setMoney(prev => prev + 500);
        audioService.playSfx('click');
    },
};