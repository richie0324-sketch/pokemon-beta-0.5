
import { GameState, PeerMessage, Pokemon, Difficulty } from '../../types';
import { useGameStore } from '../../store/useGameStore';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useBattleStore } from '../../store/useBattleStore';
import { peerService } from '../peerService';
import { audioService } from '../audioService';
import { showToast } from '../../store/useToastStore';
import { POKEDEX_REGISTRY } from '../../data/pokedexData';

export const multiplayer = {
    // 1. Handle Incoming Messages
    handleIncomingMessage: (msg: PeerMessage, senderId: string) => {
        const battleStore = useBattleStore.getState();
        const { setPeerOpponent, setIsMyTurn, setBattleMessage, setAttackAnim, setDamageAnim, peerOpponent, isMultiplayer, setPeerTradeOffer, setIsPeerTradeConfirmed, isTradeConfirmed, tradeOffer, resetTradeState, mpTurnNumber, setMpTurnNumber, setEnemyPokemon } = battleStore;
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
                
                // RACE CONDITION CHECK: Ignore old turn moves
                if (msg.payload.turnNumber !== mpTurnNumber) {
                    console.warn(`Ignoring out-of-sync move. Local: ${mpTurnNumber}, Remote: ${msg.payload.turnNumber}`);
                    return;
                }
                
                if (msg.payload.type === 'ATTACK') {
                    // Raw damage from opponent (based on their Atk vs our Base Def)
                    const rawDamage = msg.payload.damage || 0;
                    setBattleMessage(`${peerOpponent?.name} attacked!`);
                    
                    setAttackAnim('enemy');
                    setTimeout(() => setDamageAnim('player'), 200);
                    audioService.playSfx('attack');

                    setTimeout(() => {
                        if (playerPokemon) {
                            // FAIRNESS: Apply LOCAL Defense Buffs to incoming damage
                            const defMod = battleStore.battleModifiers.def || 1.0;
                            const actualDamage = Math.max(1, Math.floor(rawDamage / defMod));
                            
                            const newHp = Math.max(0, playerPokemon.currHp - actualDamage);
                            setPlayerPokemon({ ...playerPokemon, currHp: newHp });
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
                if (msg.payload.turnNumber === mpTurnNumber) {
                    
                    // HP Sync: Correct the enemy health bar based on opponent's truth
                    if (msg.payload.hp !== undefined && battleStore.enemyPokemon) {
                        setEnemyPokemon({ 
                            ...battleStore.enemyPokemon, 
                            currHp: msg.payload.hp 
                        });
                    }

                    // Advance turn only if matching
                    setMpTurnNumber(mpTurnNumber + 1);
                    setIsMyTurn(true);
                    setBattleMessage("Your Turn!");
                    // CRITICAL FIX: Clear message after delay so player can see question
                    setTimeout(() => setBattleMessage(null), 1500);
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
                if (isTradeConfirmed) {
                    multiplayer.executeTrade(tradeOffer!, msg.payload.offer);
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

        if (difficulty) setSharedDifficulty(difficulty);

        useBattleStore.setState({
            isMultiplayer: true,
            isTrainerBattle: false, 
            enemyTeam: peerOpponent.team,
            enemyTeamIndex: 0,
            enemyPokemon: peerOpponent.team[0],
            questionSeed: seed, // SHARED SEED ENSURES SAME QUESTION DIFFICULTY
            isMyTurn: isMyTurn,
            mpTurnNumber: 1, // Reset turn counter
            battleMessage: isMyTurn ? "Your Turn!" : `${peerOpponent.name}'s Turn!`
        });
        
        // If starting first, clear message automatically
        if (isMyTurn) {
            setTimeout(() => useBattleStore.getState().setBattleMessage(null), 1500);
        }
        
        useGameStore.getState().setGameState(GameState.MULTIPLAYER_BATTLE);
        audioService.playBgm('battle');
    },

    sendAttack: (damage: number) => {
        const { mpTurnNumber, setBattleMessage, setAttackAnim, enemyPokemon, setEnemyPokemon } = useBattleStore.getState();
        
        // 1. Show local animation first
        setBattleMessage("You attacked!");
        setAttackAnim('player');
        audioService.playSfx('attack');

        // Immediate visual update for the attacker (estimation)
        if (enemyPokemon) {
            const newEnemyHp = Math.max(0, enemyPokemon.currHp - damage);
            setEnemyPokemon({ ...enemyPokemon, currHp: newEnemyHp });
        }

        // 2. Send Data
        peerService.send({ 
            type: 'BATTLE_MOVE', 
            payload: { type: 'ATTACK', damage, turnNumber: mpTurnNumber } 
        });

        // 3. End Turn after delay
        setTimeout(() => {
            setAttackAnim('none');
            setBattleMessage(null);
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
        
        setTimeout(() => {
            setBattleMessage(null);
            multiplayer.endTurn();
        }, 1500);
    },

    endTurn: () => {
        const { mpTurnNumber } = useBattleStore.getState();
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
        // Increment local turn count for safety
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

        if (isPeerTradeConfirmed && peerTradeOffer) {
            multiplayer.executeTrade(tradeOffer!, peerTradeOffer);
        }
    },

    cancelTrade: () => {
        const { resetTradeState } = useBattleStore.getState();
        peerService.send({ type: 'TRADE_CANCEL', payload: {} });
        resetTradeState();
        useGameStore.getState().setGameState(GameState.MENU_MULTIPLAYER);
    },

    executeTrade: (myMon: Pokemon, theirMon: Pokemon) => {
        const { tradePokemon } = usePlayerStore.getState();
        const { resetTradeState } = useBattleStore.getState();
        const { setGameState, queueEvolutions } = useGameStore.getState();

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
        setGameState(GameState.MENU_MULTIPLAYER);
    }
};
