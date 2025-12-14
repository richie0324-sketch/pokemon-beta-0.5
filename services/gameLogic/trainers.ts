
import { Trainer, Pokemon, TrainerTier, GameState } from '../../types';
import { NPC_REGISTRY } from '../../data/trainerData';
import { POKEDEX_REGISTRY } from '../../data/pokedexData';
import { useGameStore } from '../../store/useGameStore';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useBattleStore } from '../../store/useBattleStore';
import { createPokemonInstance, getStartersForRegion } from '../pokemonGenService';
import { achievementService } from '../achievementService';
import { showToast } from '../../store/useToastStore';

// --- GENERATION LOGIC ---

const generateTrainer = (tier: TrainerTier): Trainer => {
    // Filter out special characters like Mr. Ye and Gym Leaders (who have badgeIds)
    const candidates = Object.values(NPC_REGISTRY).filter(t => t.tier === tier && t.id !== 'mr-ye' && !t.badgeId); 
    if (candidates.length === 0) return NPC_REGISTRY['youngster-joey'];
    return candidates[Math.floor(Math.random() * candidates.length)];
};

const generateTrainerTeam = (trainer: Trainer, targetLevel: number, gen: 1 | 2): Pokemon[] => {
    if (trainer.id === 'mr-ye') {
        const starters = getStartersForRegion(gen);
        return starters.map(s => createPokemonInstance(
            POKEDEX_REGISTRY.find(p => p.speciesId === s.speciesId)!, 
            false, 
            targetLevel
        ));
    }

    const team: Pokemon[] = [];
    
    // Ensure Gym Leaders have slightly higher level Pokemon than the player's average
    const levelBoost = trainer.badgeId ? 2 : 0; 
    
    for (let i = 0; i < trainer.teamSize; i++) {
        let rarityChoice = 'Common';
        if (trainer.tier === 'Elite') rarityChoice = i === trainer.teamSize - 1 ? 'Elite' : 'Rare';
        if (trainer.tier === 'Master') rarityChoice = i === trainer.teamSize - 1 ? 'Legendary' : 'Ultra';
        if (trainer.tier === 'Common') rarityChoice = i === trainer.teamSize - 1 ? 'Rare' : 'Common';

        let pool = POKEDEX_REGISTRY.filter(p => 
            p.generation === gen &&
            trainer.preferredTypes.includes(p.type) && 
            p.rarity === rarityChoice && 
            (i === trainer.teamSize - 1 ? true : p.isBasic)
        );

        if (pool.length === 0) pool = POKEDEX_REGISTRY.filter(p => p.generation === gen && p.rarity === rarityChoice);
        if (pool.length === 0) pool = POKEDEX_REGISTRY.filter(p => p.generation === gen && p.rarity === 'Common');

        const entry = pool[Math.floor(Math.random() * pool.length)];
        const lvl = Math.max(1, targetLevel + levelBoost + Math.floor(Math.random() * 3) - 1);
        
        team.push(createPokemonInstance(entry, i === trainer.teamSize - 1, lvl));
    }
    
    return team;
};

// --- FACADE ---

export const trainers = {
    // 1. Encounter Check Logic
    checkForTrainerEncounter: (currentStreak: number, encounterNumber: number): Trainer | null => {
        const { defeatedTrainers, badges } = usePlayerStore.getState();
        const { selectedTopic } = useGameStore.getState();

        // A. Specific NPC Triggers
        // Mr. Ye appears at Streak 3 (One time only)
        if (currentStreak === 3 && !defeatedTrainers.includes('mr-ye')) {
            return NPC_REGISTRY['mr-ye'];
        }

        // B. Gym Leader Milestones (Multiples of 5)
        if (currentStreak > 0 && currentStreak % 5 === 0) {
            // Determine which gym leader *should* be here
            const gymIndex = (currentStreak / 5) - 1;
            
            let leaderId: string | null = null;
            
            if (selectedTopic === 'linear') {
                // GEN 1 LEADERS
                const leaders = [
                    'leader-brock', 'leader-misty', 'leader-surge', 'leader-erika',
                    'leader-koga', 'leader-sabrina', 'leader-blaine', 'leader-giovanni'
                ];
                if (gymIndex < leaders.length) leaderId = leaders[gymIndex];
            } else {
                // GEN 2 LEADERS
                const leaders = [
                    'leader-falkner', 'leader-bugsy', 'leader-whitney', 'leader-morty',
                    'leader-chuck', 'leader-jasmine', 'leader-pryce', 'leader-clair'
                ];
                if (gymIndex < leaders.length) leaderId = leaders[gymIndex];
            }
            
            if (leaderId) {
                const leader = NPC_REGISTRY[leaderId];
                // CRITICAL CHECK: Have we already beaten this specific leader?
                // If yes (e.g. badge is owned), we do NOT re-fight them.
                // We spawn a random Elite trainer instead to keep the streak challenge alive.
                if (leader.badgeId && badges.includes(leader.badgeId)) {
                    return generateTrainer('Elite');
                }
                
                return leader;
            }
            
            // If streak > 40, fallback to standard Master
            return generateTrainer('Master');
        }

        // C. Random Chance (Only after 5 encounters to let player settle in)
        if (encounterNumber > 5 && Math.random() < 0.15) {
            return generateTrainer('Common');
        }

        return null;
    },

    // 2. Start Battle Flow
    initiateBattle: (trainer: Trainer) => {
        const { caughtPokemon } = usePlayerStore.getState();
        const { selectedTopic, setGameState } = useGameStore.getState();
        const maxLvl = Math.max(...caughtPokemon.map(p => p.level), 1);
        const targetGen = selectedTopic === 'linear' ? 1 : 2;
        
        const team = generateTrainerTeam(trainer, maxLvl, targetGen);
        
        useBattleStore.getState().startTrainerBattle(trainer, team);
        team.forEach(p => usePlayerStore.getState().registerSeen(p.speciesId));
        setGameState(GameState.TRAINER_INTRO);
    },

    // 3. Next Pokemon Logic (AI Switch)
    handlePokemonFainted: () => {
        const battleStore = useBattleStore.getState();
        const { enemyTeam, enemyTeamIndex, currentTrainer } = battleStore;
        
        // Check if more pokemon exist
        if (enemyTeamIndex < enemyTeam.length - 1) {
            // Next Pokemon
            const nextIndex = enemyTeamIndex + 1;
            const nextMon = enemyTeam[nextIndex];
            
            useBattleStore.setState({
                enemyTeamIndex: nextIndex,
                enemyPokemon: nextMon,
                turnCount: 1,
                battleTimer: 30,
                battleMessage: `${currentTrainer?.name} sent out ${nextMon.name}!`,
                questionSeed: Math.random()
            });
            
            setTimeout(() => useBattleStore.setState({ battleMessage: null }), 2000);
        } else {
            // Battle Won
            trainers.resolveVictory();
        }
    },

    // 4. Victory Resolution
    resolveVictory: () => {
        const { currentTrainer, endBattle, setStreak, setLastRewards } = useBattleStore.getState();
        const { setMoney, addDefeatedTrainer, addBadge } = usePlayerStore.getState();
        const { setGameState } = useGameStore.getState();

        const money = currentTrainer?.baseMoney || 500;
        setMoney(m => m + money);
        
        if (currentTrainer) {
            addDefeatedTrainer(currentTrainer.id);
            // Award Badge
            if (currentTrainer.badgeId) {
                const badgeId = currentTrainer.badgeId;
                addBadge(badgeId);
                setTimeout(() => showToast(`Received the ${badgeId.toUpperCase()} BADGE!`, "success", 4000), 1000);
            }
        }

        // Calculate drops
        const drops = [];
        if (currentTrainer?.rewardItems) {
            for (const item of currentTrainer.rewardItems) {
                if (Math.random() < item.chance) {
                    drops.push({ itemId: item.itemId, count: 1 });
                    usePlayerStore.getState().addItem(item.itemId, 1);
                }
            }
        }

        setLastRewards({ money, items: drops });
        endBattle();
        const newStreak = useBattleStore.getState().streak + 1;
        setStreak(() => newStreak);
        achievementService.processEvent('BATTLE_WON', { isTrainer: true, streak: newStreak, trainerId: currentTrainer?.id });
        setGameState(GameState.VICTORY_CAUGHT);
    }
};
