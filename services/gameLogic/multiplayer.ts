
import { GameState, PeerMessage, Pokemon } from '../../types';
import { useGameStore } from '../../store/useGameStore';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useBattleStore } from '../../store/useBattleStore';
import { peerService } from '../peerService';
import { audioService } from '../audioService';
import { showToast } from '../../store/useToastStore';
import { POKEDEX_REGISTRY } from '../../data/pokedexData';

export const multiplayer = {
    // 1. Initial Handshake & Sync
    handleIncomingMessage: (msg: PeerMessage, senderId: string) => {
        const { setPeerOpponent, setIsMyTurn, setBattleMessage, setAttackAnim, setDamageAnim, setEnemyPokemon, peerOpponent, isMultiplayer, setPeerTradeOffer, setIsPeerTradeConfirmed, isTradeConfirmed, tradeOffer, resetTradeState } = useBattleStore.getState();
        const { setGameState, gameState, queueEvolutions } = useGameStore.getState();
        const { playerPokemon, setPlayerPokemon, tradePokemon } = usePlayerStore.getState();

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
                // Handled in UI (MultiplayerMenu)
                audioService.playSfx('start');
                break;

            case 'CHALLENGE_RESPONSE':
                // Handled in UI
                break;

            case 'BATTLE_INIT':
                // Start Battle!
                const { seed, firstPlayerId } = msg.payload;
                const isMine = firstPlayerId === peerService['myId']; 
                const opponent = useBattleStore.getState().peerOpponent;
                if (!opponent || !opponent.team.length) {
                    showToast("Error: Opponent data missing!", "error");
                    return;
                }

                useBattleStore.setState({
                    isMultiplayer: true,
                    isTrainerBattle: false, // It's PVP, slightly different from Trainer
                    enemyTeam: opponent.team,
                    enemyTeamIndex: 0,
                    enemyPokemon: opponent.team[0],
                    questionSeed: seed,
                    isMyTurn: isMine,
                    battleMessage: isMine ? "Your Turn!" : `${opponent.name}'s Turn!`
                });

                setGameState(GameState.MULTIPLAYER_BATTLE);
                audioService.playBgm('battle');
                break;

            case 'BATTLE_MOVE':
                if (!isMultiplayer) return;
                
                if (msg.payload.type === 'ATTACK') {
                    const dmg = msg.payload.damage || 0;
                    setBattleMessage(`${peerOpponent?.name} attacked!`);
                    
                    // Visuals
                    setAttackAnim('enemy');
                    setTimeout(() => setDamageAnim('player'), 200);
                    audioService.playSfx('attack');

                    setTimeout(() => {
                        if (playerPokemon) {
                            const newHp = Math.max(0, playerPokemon.currHp - dmg);
                            setPlayerPokemon({ ...playerPokemon, currHp: newHp });
                            audioService.playSfx('damage');
                            
                            if (newHp <= 0) {
                                // I fainted
                                showToast("Your Pokemon fainted!", "error");
                                // Logic for switching will be handled by DefeatScreen logic
                                setGameState(GameState.DEFEAT); 
                            }
                        }
                        setAttackAnim('none'); setDamageAnim('none');
                    }, 500);

                } else if (msg.payload.type === 'MISS') {
                    setBattleMessage(`${peerOpponent?.name} missed!`);
                    audioService.playSfx('incorrect');
                } else if (msg.payload.type === 'SWITCH') {
                    // Opponent switched pokemon
                    const newIndex = msg.payload.index;
                    const newMon = peerOpponent?.team[newIndex];
                    if (newMon) {
                        useBattleStore.setState({
                            enemyPokemon: newMon,
                            enemyTeamIndex: newIndex,
                            battleMessage: `${peerOpponent?.name} sent out ${newMon.name}!`
                        });
                        audioService.playSfx('catch'); // Switch sound
                    }
                }
                break;

            case 'TURN_END':
                if (!isMultiplayer) return;
                setIsMyTurn(true);
                setBattleMessage("Your Turn!");
                useBattleStore.setState({ turnCount: useBattleStore.getState().turnCount + 1 });
                break;
                
            case 'BATTLE_WIN':
                setGameState(GameState.VICTORY_CAUGHT);
                showToast("You Won!", "success");
                break;

            // --- TRADE LOGIC ---
            case 'TRADE_REQUEST':
                // Handled in MultiplayerMenu UI
                audioService.playSfx('start');
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
                setIsPeerTradeConfirmed(false); // Reset peer confirm if they change offer
                break;

            case 'TRADE_CONFIRM':
                setIsPeerTradeConfirmed(true);
                
                // If I am also confirmed, EXECUTE
                if (useBattleStore.getState().isTradeConfirmed) {
                    multiplayer.executeTrade(tradeOffer!, msg.payload.offer);
                }
                break;

            case 'TRADE_CANCEL':
                setGameState(GameState.MENU_MULTIPLAYER);
                resetTradeState();
                showToast("Trade Cancelled", "info");
                break;
        }
    },

    // 2. Outgoing Actions
    sendChallenge: () => {
        peerService.send({ type: 'CHALLENGE_REQUEST', payload: {} });
    },

    acceptChallenge: (myId: string, opponentId: string) => {
        const firstPlayerId = myId > opponentId ? myId : opponentId;
        const seed = Math.random();
        const payload = { accepted: true, seed, firstPlayerId };
        peerService.send({ type: 'CHALLENGE_RESPONSE', payload });
        multiplayer.startBattleLocal(seed, firstPlayerId === myId);
        setTimeout(() => {
            peerService.send({ type: 'BATTLE_INIT', payload: { seed, firstPlayerId } });
        }, 500);
    },

    startBattleLocal: (seed: number, isMyTurn: boolean) => {
        const { peerOpponent } = useBattleStore.getState();
        if (!peerOpponent) return;

        useBattleStore.setState({
            isMultiplayer: true,
            enemyTeam: peerOpponent.team,
            enemyTeamIndex: 0,
            enemyPokemon: peerOpponent.team[0],
            questionSeed: seed,
            isMyTurn: isMyTurn,
            battleMessage: isMyTurn ? "Your Turn!" : `${peerOpponent.name}'s Turn!`
        });
        
        useGameStore.getState().setGameState(GameState.MULTIPLAYER_BATTLE);
        audioService.playBgm('battle');
    },

    sendAttack: (damage: number) => {
        peerService.send({ 
            type: 'BATTLE_MOVE', 
            payload: { type: 'ATTACK', damage } 
        });
        multiplayer.endTurn();
    },

    sendMiss: () => {
        peerService.send({ 
            type: 'BATTLE_MOVE', 
            payload: { type: 'MISS' } 
        });
        multiplayer.endTurn();
    },

    endTurn: () => {
        useBattleStore.getState().setIsMyTurn(false);
        useBattleStore.getState().setBattleMessage("Opponent's Turn...");
        peerService.send({ type: 'TURN_END', payload: {} });
    },

    // --- TRADE ACTIONS ---
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
        setIsTradeConfirmed(false); // Reset confirm if changing
        peerService.send({ type: 'TRADE_OFFER', payload: { pokemon } });
    },

    confirmTrade: () => {
        const { setIsTradeConfirmed, tradeOffer, isPeerTradeConfirmed, peerTradeOffer } = useBattleStore.getState();
        setIsTradeConfirmed(true);
        // Send MY offer in confirm payload just to be safe/atomic
        peerService.send({ type: 'TRADE_CONFIRM', payload: { offer: tradeOffer } });

        // If peer already confirmed, EXECUTE
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

        // 1. Perform Swap
        tradePokemon(myMon.id, theirMon);
        audioService.playSfx('catch');
        showToast(`Trade Successful! Received ${theirMon.name}!`, "success");

        // 2. Check Evolution
        const entry = POKEDEX_REGISTRY.find(p => p.speciesId === theirMon.speciesId);
        if (entry && entry.evolvesTo && entry.evolutionReq?.method === 'trade') {
            const nextEntry = POKEDEX_REGISTRY.find(e => e.speciesId === entry.evolvesTo);
            if (nextEntry) {
                // Queue evolution
                queueEvolutions([{ pokemon: theirMon, target: nextEntry }]);
            }
        }

        // 3. Reset UI
        resetTradeState();
        setGameState(GameState.MENU_MULTIPLAYER);
    }
};
