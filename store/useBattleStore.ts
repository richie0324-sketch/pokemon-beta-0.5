
import { create } from 'zustand';
// FIX: Import SaveData type.
import { Pokemon, Trainer, InventorySlot, SaveData } from '../types';

type Animation = 'none' | 'player' | 'enemy';
type CatchAnimation = 'none' | 'throwing' | 'shaking' | 'success' | 'fail';

export interface PeerOpponent {
    id: string; // Peer ID
    name: string;
    team: Pokemon[];
    avatar?: string;
    // New fields for Trainer Card
    money: number;
    badges: string[];
}

interface BattleStoreState {
    enemyPokemon: Pokemon | null;
    streak: number;
    targetStreak: number;
    turnCount: number;
    
    isTrainerBattle: boolean;
    currentTrainer: Trainer | null;
    enemyTeam: Pokemon[];
    enemyTeamIndex: number;
    battleTimer: number | null;
    lastRewards: { money: number; items: InventorySlot[] } | null;

    // Multiplayer State
    isMultiplayer: boolean;
    isMyTurn: boolean; // Controls UI Lock
    peerOpponent: PeerOpponent | null;

    battleModifiers: { atk: number; def: number };
    preppedBall: { id: string; multiplier: number } | null;
    isMasterBallActive: boolean;
    questionSeed: number;

    attackAnim: Animation;
    damageAnim: Animation;
    catchAnim: CatchAnimation;
    battleMessage: string | null;

    // Actions
    setEnemyPokemon: (pokemon: Pokemon | null) => void;
    setStreak: (updater: (streak: number) => number) => void;
    setBattleMessage: (message: string | null) => void;
    setAttackAnim: (anim: Animation) => void;
    setDamageAnim: (anim: Animation) => void;
    setCatchAnim: (anim: CatchAnimation) => void;
    setTurnCount: (updater: (count: number) => number) => void;
    setBattleTimer: (time: number | null) => void;
    setQuestionSeed: (updater: (seed: number) => number) => void;
    setBattleModifiers: (updater: (mods: { atk: number; def: number }) => { atk: number; def: number }) => void;
    setPreppedBall: (ball: { id: string; multiplier: number } | null) => void;
    setLastRewards: (rewards: { money: number; items: InventorySlot[] } | null) => void;
    setIsMasterBallActive: (isActive: boolean) => void;
    
    // Multiplayer Actions
    setPeerOpponent: (opponent: PeerOpponent | null) => void;
    setIsMultiplayer: (isMulti: boolean) => void;
    setIsMyTurn: (isMyTurn: boolean) => void;

    startWildEncounter: (enemy: Pokemon) => void;
    startTrainerBattle: (trainer: Trainer, team: Pokemon[]) => void;
    nextTrainerPokemon: () => void;
    endBattle: () => void;
    resetBattleState: () => void;

    loadBattleState: (data: Partial<SaveData>) => void;
}

const initialBattleState = {
    enemyPokemon: null,
    turnCount: 1,
    isTrainerBattle: false,
    currentTrainer: null,
    enemyTeam: [],
    enemyTeamIndex: 0,
    battleTimer: null,
    lastRewards: null,
    battleModifiers: { atk: 1.0, def: 1.0 },
    preppedBall: null,
    isMasterBallActive: false,
    questionSeed: 0,
    attackAnim: 'none' as Animation,
    damageAnim: 'none' as Animation,
    catchAnim: 'none' as CatchAnimation,
    battleMessage: null,
    isMultiplayer: false,
    isMyTurn: true,
    peerOpponent: null,
};

export const useBattleStore = create<BattleStoreState>((set, get) => ({
    ...initialBattleState,
    streak: 0,
    targetStreak: 5,

    setEnemyPokemon: (pokemon) => set({ enemyPokemon: pokemon }),
    
    // Updated setStreak to update targetStreak based on next multiple of 5
    setStreak: (updater) => set(state => {
        const newStreak = updater(state.streak);
        // Calculate next milestone (every 5 levels is a trainer)
        const newTarget = (Math.floor(newStreak / 5) + 1) * 5;
        return { 
            streak: newStreak, 
            targetStreak: newTarget 
        };
    }),

    setBattleMessage: (message) => set({ battleMessage: message }),
    setAttackAnim: (anim) => set({ attackAnim: anim }),
    setDamageAnim: (anim) => set({ damageAnim: anim }),
    setCatchAnim: (anim) => set({ catchAnim: anim }),
    setTurnCount: (updater) => set(state => ({ turnCount: updater(state.turnCount) })),
    setBattleTimer: (time) => set({ battleTimer: time }),
    setQuestionSeed: (updater) => set(state => ({ questionSeed: updater(state.questionSeed) })),
    setBattleModifiers: (updater) => set(state => ({ battleModifiers: updater(state.battleModifiers) })),
    setPreppedBall: (ball) => set({ preppedBall: ball }),
    setLastRewards: (rewards) => set({ lastRewards: rewards }),
    setIsMasterBallActive: (isActive) => set({ isMasterBallActive: isActive }),

    setPeerOpponent: (opponent) => set({ peerOpponent: opponent }),
    setIsMultiplayer: (isMulti) => set({ isMultiplayer: isMulti }),
    setIsMyTurn: (isMyTurn) => set({ isMyTurn }),

    startWildEncounter: (enemy) => {
        get().resetBattleState();
        set({
            isTrainerBattle: false,
            enemyPokemon: enemy,
            questionSeed: Math.random()
        });
    },

    startTrainerBattle: (trainer, team) => {
        get().resetBattleState();
        set({
            isTrainerBattle: true,
            currentTrainer: trainer,
            enemyTeam: team,
            enemyTeamIndex: 0,
            enemyPokemon: team[0],
            questionSeed: Math.random()
        });
    },
    
    nextTrainerPokemon: () => {
        const { enemyTeam, enemyTeamIndex } = get();
        const nextIndex = enemyTeamIndex + 1;
        if (nextIndex < enemyTeam.length) {
            set({
                enemyTeamIndex: nextIndex,
                enemyPokemon: enemyTeam[nextIndex],
                turnCount: 1,
                battleTimer: 30,
                battleMessage: `${get().currentTrainer?.name} sent out ${enemyTeam[nextIndex].name}!`,
                questionSeed: Math.random()
            });
            setTimeout(() => set({ battleMessage: null }), 2000);
        }
    },

    endBattle: () => {
        set({ 
            isTrainerBattle: false, 
            isMultiplayer: false, // Reset multiplayer flag
            currentTrainer: null, 
            enemyTeam: [], 
            battleTimer: null 
        });
    },
    
    resetBattleState: () => {
        set(initialBattleState);
    },

    loadBattleState: (data) => {
        set({
            streak: data.streak,
            targetStreak: data.targetStreak,
        });
    }
}));
