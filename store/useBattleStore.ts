
import { create } from 'zustand';
// FIX: Import SaveData type.
import { Pokemon, Trainer, InventorySlot, SaveData, Difficulty } from '../types';

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
    mpTurnNumber: number; // NEW: For syncing turn order/race conditions
    sharedDifficulty: Difficulty | null; // NEW: Synced difficulty

    // TRADE STATE
    tradeOffer: Pokemon | null;
    peerTradeOffer: Pokemon | null;
    isTradeConfirmed: boolean;
    isPeerTradeConfirmed: boolean;

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
    setMpTurnNumber: (n: number) => void;
    setSharedDifficulty: (d: Difficulty | null) => void;

    // Trade Actions
    setTradeOffer: (p: Pokemon | null) => void;
    setPeerTradeOffer: (p: Pokemon | null) => void;
    setIsTradeConfirmed: (v: boolean) => void;
    setIsPeerTradeConfirmed: (v: boolean) => void;
    resetTradeState: () => void;

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
    mpTurnNumber: 0,
    sharedDifficulty: null,
    
    tradeOffer: null,
    peerTradeOffer: null,
    isTradeConfirmed: false,
    isPeerTradeConfirmed: false,
};

export const useBattleStore = create<BattleStoreState>((set, get) => ({
    ...initialBattleState,
    streak: 0,
    targetStreak: 5,

    setEnemyPokemon: (pokemon) => set({ enemyPokemon: pokemon }),
    
    setStreak: (updater) => set(state => {
        const newStreak = updater(state.streak);
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
    setIsMultiplayer: (isMulti: boolean) => set({ isMultiplayer: isMulti }),
    setIsMyTurn: (isMyTurn: boolean) => set({ isMyTurn }),
    setMpTurnNumber: (n: number) => set({ mpTurnNumber: n }),
    setSharedDifficulty: (d) => set({ sharedDifficulty: d }),

    setTradeOffer: (p) => set({ tradeOffer: p }),
    setPeerTradeOffer: (p) => set({ peerTradeOffer: p }),
    setIsTradeConfirmed: (v) => set({ isTradeConfirmed: v }),
    setIsPeerTradeConfirmed: (v) => set({ isPeerTradeConfirmed: v }),
    resetTradeState: () => set({
        tradeOffer: null,
        peerTradeOffer: null,
        isTradeConfirmed: false,
        isPeerTradeConfirmed: false,
    }),

    startWildEncounter: (enemy: Pokemon) => {
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
            isMultiplayer: false,
            currentTrainer: null,
            enemyTeam: [],
            battleTimer: null,
            mpTurnNumber: 0,
            sharedDifficulty: null,
            battleModifiers: { atk: 1.0, def: 1.0 },
            preppedBall: null,
            isMasterBallActive: false,
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
