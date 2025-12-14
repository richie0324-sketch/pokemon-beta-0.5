
import { GameState, PokedexEntry } from '../../types';
import { useGameStore } from '../../store/useGameStore';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useBattleStore } from '../../store/useBattleStore';
import { calculateDamage, calculateExpGain, processLevelUp } from '../../services/battleMechanics';
import { audioService } from '../../services/audioService';
import { CATCH_RATES } from '../../constants';
import { POKEDEX_REGISTRY } from '../../data/pokedexData';
import { trainers } from './trainers';
import { getFieldTypes } from './environment';
import { achievementService } from '../achievementService';

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

export const battles = {
    handleTimerExpiry: () => {
        const { battleTimer, setBattleTimer, setBattleMessage } = useBattleStore.getState();
        if (battleTimer !== 0) return;
        setBattleTimer(null);
        setBattleMessage("Time's Up!");
        audioService.playSfx('incorrect');
        battles.handleDamagePlayer(1.0);
    },

    handleDamagePlayer: (coefficient: number) => {
        const { playerPokemon, setPlayerPokemon, setCaughtPokemon } = usePlayerStore.getState();
        const { enemyPokemon, setAttackAnim, setDamageAnim, setBattleMessage, battleModifiers } = useBattleStore.getState();
        const { activeBuffs, activeField } = useGameStore.getState();
        
        if (!playerPokemon || !enemyPokemon) return;

        // BUSH CAMP LOGIC
        if (activeBuffs['bush_camp'] && activeBuffs['bush_camp'] > 0) {
            setBattleMessage("You're hidden in the bush! Enemy missed!");
            setTimeout(() => setBattleMessage(null), 1500);
            return; 
        }

        audioService.playSfx('attack');
        setAttackAnim('enemy');
        setTimeout(() => setDamageAnim('player'), 200);

        setTimeout(() => {
            // TERRAIN BONUS (Enemy Attacking)
            let terrainMod = 1.0;
            const fieldTypes = getFieldTypes(activeField);
            if (fieldTypes && fieldTypes.includes(enemyPokemon.type)) {
                terrainMod = 1.5;
            }

            // Apply modifiers: Enemy attacks player. 
            // Terrain mod acts as an attack multiplier for the enemy.
            const { damage } = calculateDamage(enemyPokemon, playerPokemon, coefficient, false, terrainMod, battleModifiers.def);
            
            // GRAVITY COIL LOGIC (Defense Boost / Damage Reduction)
            let finalDamage = damage;
            if (activeBuffs['gravity_coil'] && activeBuffs['gravity_coil'] > 0) {
                finalDamage = Math.ceil(damage * 0.5); // 50% Reduction
            }

            audioService.playSfx('damage');
            const newHp = Math.max(0, playerPokemon.currHp - finalDamage);
            
            // Update Active Pokemon
            setPlayerPokemon({ ...playerPokemon, currHp: newHp });
            
            // Sync damage to the party list immediately
            setCaughtPokemon(prev => prev.map(p => p.id === playerPokemon.id ? { ...p, currHp: newHp } : p));

            setAttackAnim('none'); setDamageAnim('none'); setBattleMessage(null);

            if (newHp <= 0) {
                setTimeout(() => {
                    useGameStore.getState().setGameState(GameState.DEFEAT);
                }, 1000);
            }
        }, 500);
    },

    handleDamageEnemy: (coefficient: number) => {
        const { playerPokemon, setPlayerPokemon } = usePlayerStore.getState();
        const { enemyPokemon, setEnemyPokemon, setAttackAnim, setDamageAnim, setBattleMessage, isTrainerBattle } = useBattleStore.getState();
        const { activeBuffs, activeField, activeQuest } = useGameStore.getState();
        
        if (!playerPokemon || !enemyPokemon) return;

        audioService.playSfx('attack');
        setAttackAnim('player');
        setTimeout(() => setDamageAnim('enemy'), 200);

        setTimeout(() => {
            // TERRAIN BONUS (Player Attacking)
            let terrainMod = 1.0;
            const fieldTypes = getFieldTypes(activeField);
            if (fieldTypes && fieldTypes.includes(playerPokemon.type)) {
                terrainMod = 1.5;
            }

            const { battleModifiers } = useBattleStore.getState();
            const totalAtkMod = battleModifiers.atk * terrainMod;

            let { damage, isCritical } = calculateDamage(playerPokemon, enemyPokemon, coefficient, true, totalAtkMod, 1.0);
            
            if (activeBuffs['sharpness_iv'] && activeBuffs['sharpness_iv'] > 0) {
                damage = Math.ceil(damage * 1.5);
                isCritical = true; 
            }

            audioService.playSfx('damage');
            const newHp = Math.max(0, enemyPokemon.currHp - damage);
            const newEnemy = { ...enemyPokemon, currHp: newHp };
            setEnemyPokemon(newEnemy);
            setAttackAnim('none'); setDamageAnim('none'); setBattleMessage(null);

            if (newHp <= 0) {
                // QUEST PROGRESSION UPDATE (For normal battles only)
                if (activeQuest) {
                    // If it IS the boss, DO NOT complete quest yet. Wait for Victory Screen.
                    // If it is NOT the boss, increment progress.
                    if (enemyPokemon.speciesId !== activeQuest.bossSpeciesId) {
                        if (activeQuest.objective === 'WIN_BATTLES' || activeQuest.objective === 'CLEAR_DUNGEON') {
                            useGameStore.getState().updateQuestProgress(1);
                        }
                    }
                }

                setTimeout(() => {
                    if (isTrainerBattle) {
                        const expGained = calculateExpGain(playerPokemon, enemyPokemon);
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
                        
                        trainers.handlePokemonFainted();
                    } else {
                        useGameStore.getState().setGameState(GameState.CATCH_PHASE);
                    }
                }, 1500);
            }
        }, 500);
    },

    handleCatchAttempt: (success: boolean) => {
        if (!success) {
            battles.handleDamagePlayer(1.0);
            return;
        }

        const { setCatchAnim, preppedBall, enemyPokemon, setIsMasterBallActive } = useBattleStore.getState();
        if (!enemyPokemon) return;

        const finalizeCatch = () => {
            const { setStreak, endBattle } = useBattleStore.getState(); 
            const { playerPokemon, setPlayerPokemon } = usePlayerStore.getState();

            const newStreak = useBattleStore.getState().streak + 1;
            setStreak(() => newStreak);
            achievementService.processEvent('BATTLE_WON', { isTrainer: false, streak: newStreak });

            if (playerPokemon) {
                const expGained = calculateExpGain(playerPokemon, enemyPokemon);
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

            // QUEST UPDATE: Catch counts as progress
            // Do NOT complete boss quest here. Wait for Victory Screen.
            const { activeQuest } = useGameStore.getState();
            if (activeQuest) {
                if (enemyPokemon.speciesId !== activeQuest.bossSpeciesId) {
                    if (activeQuest.objective === 'CATCH_POKEMON' || activeQuest.objective === 'CLEAR_DUNGEON') {
                        useGameStore.getState().updateQuestProgress(1);
                    }
                }
            }

            const playerStore = usePlayerStore.getState();
            
            const capturedPokemon = { ...enemyPokemon, currHp: Math.ceil(enemyPokemon.maxHp / 3) };
            
            const newParty = [...playerStore.caughtPokemon, capturedPokemon];
            if (newParty.length > 6) {
                playerStore.setStoragePokemon(s => [...s, newParty.shift()!]);
                playerStore.setCaughtPokemon(() => newParty);
            } else {
                playerStore.setCaughtPokemon(() => newParty);
            }
            playerStore.registerCaught(enemyPokemon.speciesId);
            achievementService.processEvent('POKEMON_CAUGHT', { speciesId: enemyPokemon.speciesId, rarity: enemyPokemon.rarity });
            
            endBattle();
            useGameStore.getState().setGameState(GameState.VICTORY_CAUGHT);
        };

        if (preppedBall?.id === 'master-ball') {
            setIsMasterBallActive(true);
            audioService.playSfx('throw');
            setTimeout(() => {
                setCatchAnim('success');
                audioService.playSfx('catch');
                setTimeout(finalizeCatch, 1500);
            }, 2000); 
            return;
        }
        
        const catchRate = CATCH_RATES[enemyPokemon.rarity] * (preppedBall?.multiplier || 1) * (1 - (enemyPokemon.currHp / enemyPokemon.maxHp) * 0.5);
        const willCatch = Math.random() < catchRate;

        setCatchAnim('throwing');
        audioService.playSfx('throw');

        setTimeout(() => {
            if (willCatch) {
                setCatchAnim('shaking');
                setTimeout(() => {
                    setCatchAnim('success');
                    audioService.playSfx('catch');
                    setTimeout(finalizeCatch, 1500);
                }, 2000);
            } else {
                setCatchAnim('shaking');
                setTimeout(() => {
                    setCatchAnim('fail');
                    setTimeout(() => {
                        setCatchAnim('none');
                        battles.handleDamagePlayer(1.0);
                    }, 1000);
                }, 2000);
            }
        }, 1000);
    }
};
