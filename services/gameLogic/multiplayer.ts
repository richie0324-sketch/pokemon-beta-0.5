
import { GameState, PeerMessage, Pokemon, Difficulty } from '../../types';
import { useGameStore } from '../../store/useGameStore';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useBattleStore } from '../../store/useBattleStore';
import { peerService } from '../peerService';
import { audioService } from '../audioService';
import { showToast } from '../../store/useToastStore';
import { POKEDEX_REGISTRY } from '../../data/pokedexData';

// #4 FIX: Track all pending timeouts so they can be cancelled on disconnect/unmount
const pendingTimers: number[] = [];
const scheduleTimeout = (fn: () => void, delay: number): number => {
    const id = window.setTimeout(() => {
        const idx = pendingTimers.indexOf(id);
        if (idx !== -1) pendingTimers.splice(idx, 1);
        fn();
    }, delay);
    pendingTimers.push(id);
    return id;
};
const clearAllPendingTimers = () => {
    while (pendingTimers.length > 0) {
        clearTimeout(pendingTimers.pop()!);
    }
};

// #5 FIX: Trade execution lock to prevent double-execution race condition
let tradeExecutionLock = false;

export const multiplayer = {
    // 1. Handle Incoming Messages
    handleIncomingMessage: (msg: PeerMessage, senderId: string) => {
        const battleStore = useBattleStore.getState();
        const { setPeerOpponent, setIsMyTurn, setBattleMessage, setAttackAnim, setDamageAnim, peerOpponent, isMultiplayer, setPeerTradeOffer, setIsPeerTradeConfirmed, isTradeConfirmed, tradeOffer, resetTradeState, setMpTurnNumber, setEnemyPokemon } = battleStore;
        const { setGameState } = useGameStore.getState();
        const { playerPokemon, setPlayerPokemon } = usePlayerStore.getState();

        console.log("MP Message:", msg.type, msg.payload);

        switch (msg.type) {
            case 'SYNC_TEAM':
                setPeerOpponent({
                    id: senderId,
                    name: msg.payload.name,
                    team: msg.payload.team,
                    avatar: msg.payload.avatar,
                    money: msg.payload.money || 0,
                    badges: msg.payload.badges || []
                });
                showToast(`${msg.payload.name} connected!`, "success");
                break;

            case 'CHALLENGE_REQUEST':
                // Handled in UI layer
                break;

            case 'CHALLENGE_RESPONSE':
                if (msg.payload.accepted) {
                    showToast("Challenge Accepted!", "success");
                    if (msg.payload.seed) {
                        const isFirst = msg.payload.firstPlayerId === peerService.myId;
                        multiplayer.startBattleLocal(msg.payload.seed, isFirst, msg.payload.difficulty);
                    }
                } else {
                    showToast("Challenge Declined.", "error");
                }
                break;

            case 'BATTLE_INIT':
                // Fallback / legacy handler if used
                const { seed, firstPlayerId } = msg.payload;
                const isMine = firstPlayerId === peerService.myId;
                multiplayer.startBattleLocal(seed, isMine);
                break;

            case 'BATTLE_MOVE':
                if (!isMultiplayer) return;

                // #1 FIX: Read fresh turn number at point of check
                const currentTurn = useBattleStore.getState().mpTurnNumber;

                // RACE CONDITION CHECK: Ignore old turn moves
                if (msg.payload.turnNumber !== currentTurn) {
                    console.warn(`Ignoring out-of-sync move. Local: ${currentTurn}, Remote: ${msg.payload.turnNumber}`);
                    return;
                }

                if (msg.payload.type === 'ATTACK') {
                    // Raw damage from opponent (based on their Atk vs our Base Def)
                    const rawDamage = msg.payload.damage || 0;
                    setBattleMessage(`${peerOpponent?.name} attacked!`);

                    setAttackAnim('enemy');
                    scheduleTimeout(() => setDamageAnim('player'), 200);
                    audioService.playSfx('attack');

                    scheduleTimeout(() => {
                        // #13 FIX: Re-read playerPokemon from fresh state inside timeout
                        const freshPlayer = usePlayerStore.getState().playerPokemon;
                        if (freshPlayer) {
                            // FAIRNESS: Apply LOCAL Defense Buffs to incoming damage
                            const defMod = useBattleStore.getState().battleModifiers.def || 1.0;
                            const actualDamage = Math.max(1, Math.floor(rawDamage / defMod));

                            const newHp = Math.max(0, freshPlayer.currHp - actualDamage);
                            setPlayerPokemon({ ...freshPlayer, currHp: newHp });
                            audioService.playSfx('damage');

                            if (newHp <= 0) {
                                showToast("Your Pokemon fainted!", "error");
                                setGameState(GameState.DEFEAT);
                            }
                        }
                        setAttackAnim('none'); setDamageAnim('none');
                    }, 500);

                } else if (msg.payload.type === 'MISS') {
                    setBattleMessage(`${peerOpponent?.name} missed!`);
                    audioService.playSfx('incorrect');
                }
                break;

            case 'TURN_END':
                if (!isMultiplayer) return;
                // #1 FIX: Use fresh turn number for the comparison
                const localTurn = useBattleStore.getState().mpTurnNumber;
                if (msg.payload.turnNumber === localTurn) {

                    // #16 FIX: Clamp HP to valid range before applying
                    if (msg.payload.hp !== undefined && battleStore.enemyPokemon) {
                        const clampedHp = Math.max(0, Math.min(battleStore.enemyPokemon.maxHp, msg.payload.hp));
                        setEnemyPokemon({
                            ...battleStore.enemyPokemon,
                            currHp: clampedHp
                        });
                    }

                    // Advance turn only if matching
                    setMpTurnNumber(localTurn + 1);
                    setIsMyTurn(true);
                    setBattleMessage("Your Turn!");
                    scheduleTimeout(() => setBattleMessage(null), 1500);
                }
                break;

            case 'TRADE_RESPONSE':
                if (msg.payload.accepted) {
                    resetTradeState();
                    setGameState(GameState.MULTIPLAYER_TRADE);
                    audioService.playSfx('correct');
                } else {
                    showToast("Trade declined.", "error");
                }
                break;

            case 'TRADE_OFFER':
                setPeerTradeOffer(msg.payload.pokemon);
                setIsPeerTradeConfirmed(false);
                break;

            case 'TRADE_CONFIRM':
                setIsPeerTradeConfirmed(true);
                // #5 FIX: Only execute if not already locked (prevents double-execution)
                if (isTradeConfirmed && tradeOffer && !tradeExecutionLock) {
                    multiplayer.executeTrade(tradeOffer, msg.payload.offer);
                }
                break;

            case 'TRADE_CANCEL':
                setGameState(GameState.MENU_MULTIPLAYER);
                resetTradeState();
                showToast("Partner cancelled trade.", "info");
                break;
        }
    },

    // 2. Actions
    sendChallenge: () => {
        peerService.send({ type: 'CHALLENGE_REQUEST', payload: {} });
    },

    acceptChallenge: (myId: string, opponentId: string) => {
        const firstPlayerId = myId > opponentId ? myId : opponentId;
        const seed = Math.random();

        // Pick a shared difficulty to ensure fairness
        const diffs: Difficulty[] = ['Easy', 'Medium', 'Hard', 'Challenge'];
        const sharedDiff = diffs[Math.floor(Math.random() * diffs.length)];

        peerService.send({
            type: 'CHALLENGE_RESPONSE',
            payload: { accepted: true, seed, firstPlayerId, difficulty: sharedDiff }
        });

        multiplayer.startBattleLocal(seed, firstPlayerId === myId, sharedDiff);
    },

    startBattleLocal: (seed: number, isMyTurn: boolean, difficulty?: Difficulty) => {
        const { peerOpponent, setSharedDifficulty } = useBattleStore.getState();

        if (!peerOpponent || !peerOpponent.team || peerOpponent.team.length === 0) {
            showToast("Error: Opponent data missing!", "error");
            return;
        }

        // #4 FIX: Clear any leftover timers from a previous battle
        clearAllPendingTimers();
        tradeExecutionLock = false;

        if (difficulty) setSharedDifficulty(difficulty);

        useBattleStore.setState({
            isMultiplayer: true,
            isTrainerBattle: false,
            enemyTeam: peerOpponent.team,
            enemyTeamIndex: 0,
            enemyPokemon: peerOpponent.team[0],
            questionSeed: seed,
            isMyTurn: isMyTurn,
            mpTurnNumber: 1,
            battleMessage: isMyTurn ? "Your Turn!" : `${peerOpponent.name}'s Turn!`
        });

        if (isMyTurn) {
            scheduleTimeout(() => useBattleStore.getState().setBattleMessage(null), 1500);
        }

        useGameStore.getState().setGameState(GameState.MULTIPLAYER_BATTLE);
        audioService.playBgm('battle');
    },

    sendAttack: (damage: number) => {
        // #13 FIX: Capture snapshot of current state at call time
        const { mpTurnNumber, setBattleMessage, setAttackAnim } = useBattleStore.getState();
        const enemySnapshot = useBattleStore.getState().enemyPokemon;

        // 1. Show local animation first
        setBattleMessage("You attacked!");
        setAttackAnim('player');
        audioService.playSfx('attack');

        // Immediate visual update for the attacker (estimation)
        if (enemySnapshot) {
            const newEnemyHp = Math.max(0, enemySnapshot.currHp - damage);
            useBattleStore.getState().setEnemyPokemon({ ...enemySnapshot, currHp: newEnemyHp });
        }

        // 2. Send Data
        peerService.send({
            type: 'BATTLE_MOVE',
            payload: { type: 'ATTACK', damage, turnNumber: mpTurnNumber }
        });

        // 3. End Turn after delay
        scheduleTimeout(() => {
            useBattleStore.getState().setAttackAnim('none');
            useBattleStore.getState().setBattleMessage(null);
            multiplayer.endTurn();
        }, 1500);
    },

    sendMiss: () => {
        const { mpTurnNumber, setBattleMessage } = useBattleStore.getState();

        setBattleMessage("You missed!");
        audioService.playSfx('incorrect');

        peerService.send({
            type: 'BATTLE_MOVE',
            payload: { type: 'MISS', turnNumber: mpTurnNumber }
        });

        scheduleTimeout(() => {
            useBattleStore.getState().setBattleMessage(null);
            multiplayer.endTurn();
        }, 1500);
    },

    endTurn: () => {
        // #1 FIX: Read fresh turn number at call time
        const mpTurnNumber = useBattleStore.getState().mpTurnNumber;
        const { playerPokemon } = usePlayerStore.getState();

        useBattleStore.getState().setIsMyTurn(false);
        useBattleStore.getState().setBattleMessage("Opponent's Turn...");

        // Send current HP for sync
        peerService.send({
            type: 'TURN_END',
            payload: {
                turnNumber: mpTurnNumber,
                hp: playerPokemon?.currHp
            }
        });
        // Increment local turn count
        useBattleStore.getState().setMpTurnNumber(mpTurnNumber + 1);
    },

    // Trade Logic
    sendTradeRequest: () => {
        peerService.send({ type: 'TRADE_REQUEST', payload: {} });
    },

    acceptTradeRequest: () => {
        const { resetTradeState } = useBattleStore.getState();
        peerService.send({ type: 'TRADE_RESPONSE', payload: { accepted: true } });
        resetTradeState();
        useGameStore.getState().setGameState(GameState.MULTIPLAYER_TRADE);
    },

    sendTradeOffer: (pokemon: Pokemon) => {
        const { setTradeOffer, setIsTradeConfirmed } = useBattleStore.getState();
        setTradeOffer(pokemon);
        setIsTradeConfirmed(false);
        peerService.send({ type: 'TRADE_OFFER', payload: { pokemon } });
    },

    confirmTrade: () => {
        const { setIsTradeConfirmed, tradeOffer, isPeerTradeConfirmed, peerTradeOffer } = useBattleStore.getState();
        setIsTradeConfirmed(true);
        peerService.send({ type: 'TRADE_CONFIRM', payload: { offer: tradeOffer } });

        // #5 FIX: Use lock to prevent double-execution
        if (isPeerTradeConfirmed && peerTradeOffer && tradeOffer && !tradeExecutionLock) {
            multiplayer.executeTrade(tradeOffer, peerTradeOffer);
        }
    },

    cancelTrade: () => {
        const { resetTradeState } = useBattleStore.getState();
        peerService.send({ type: 'TRADE_CANCEL', payload: {} });
        resetTradeState();
        tradeExecutionLock = false;
        useGameStore.getState().setGameState(GameState.MENU_MULTIPLAYER);
    },

    executeTrade: (myMon: Pokemon, theirMon: Pokemon) => {
        // #5 FIX: Acquire lock to prevent double-execution
        if (tradeExecutionLock) return;
        tradeExecutionLock = true;

        const { tradePokemon, caughtPokemon } = usePlayerStore.getState();
        const { resetTradeState } = useBattleStore.getState();
        const { setGameState, queueEvolutions } = useGameStore.getState();

        // #9 FIX: Validate that myMon still exists in the party before trading
        const myMonInParty = caughtPokemon.find(p => p.id === myMon.id);
        if (!myMonInParty) {
            showToast("Trade failed: Pokemon no longer in party.", "error");
            resetTradeState();
            tradeExecutionLock = false;
            return;
        }

        tradePokemon(myMon.id, theirMon);
        audioService.playSfx('catch');
        showToast(`Trade Complete! Received ${theirMon.name}!`, "success");

        const entry = POKEDEX_REGISTRY.find(p => p.speciesId === theirMon.speciesId);
        if (entry && entry.evolvesTo && entry.evolutionReq?.method === 'trade') {
            const nextEntry = POKEDEX_REGISTRY.find(e => e.speciesId === entry.evolvesTo);
            if (nextEntry) {
                queueEvolutions([{ pokemon: theirMon, target: nextEntry }]);
            }
        }

        resetTradeState();
        tradeExecutionLock = false;
        setGameState(GameState.MENU_MULTIPLAYER);
    },

    // Cleanup: call when leaving multiplayer entirely
    cleanup: () => {
        clearAllPendingTimers();
        tradeExecutionLock = false;
    }
};
