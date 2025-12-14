
import { GameState, PeerMessage, Pokemon } from '../../types';
import { useGameStore } from '../../store/useGameStore';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useBattleStore } from '../../store/useBattleStore';
import { peerService } from '../peerService';
import { audioService } from '../audioService';
import { showToast } from '../../store/useToastStore';

export const multiplayer = {
    // 1. Initial Handshake & Sync
    handleIncomingMessage: (msg: PeerMessage, senderId: string) => {
        const { setPeerOpponent, setIsMyTurn, setBattleMessage, setAttackAnim, setDamageAnim, setEnemyPokemon, peerOpponent, isMultiplayer } = useBattleStore.getState();
        const { setGameState, gameState } = useGameStore.getState();
        const { playerPokemon, setPlayerPokemon } = usePlayerStore.getState();

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
                const isMine = firstPlayerId === peerService['myId']; // Accessing internal ID via singleton prop if exposed, or pass it
                // Actually peerService doesn't expose myId publicly easily, 
                // so we rely on the payload telling us who goes first based on ID comparison logic done by host.
                
                // Set Up Battle State
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
                // Opponent admitted defeat (or I won)
                setGameState(GameState.VICTORY_CAUGHT);
                showToast("You Won!", "success");
                break;
        }
    },

    // 2. Outgoing Actions
    sendChallenge: () => {
        peerService.send({ type: 'CHALLENGE_REQUEST', payload: {} });
    },

    acceptChallenge: (myId: string, opponentId: string) => {
        // Determine who goes first (simple string comparison for consistency)
        const firstPlayerId = myId > opponentId ? myId : opponentId;
        const seed = Math.random();

        const payload = { accepted: true, seed, firstPlayerId };
        
        // Send acceptance
        peerService.send({ type: 'CHALLENGE_RESPONSE', payload });
        
        // Start Local immediately
        multiplayer.startBattleLocal(seed, firstPlayerId === myId);
        
        // Also send START signal to be safe/explicit? 
        // Actually RESPONSE with payload is enough for the other side to start.
        // But let's send a specific INIT to be clean.
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
    }
};
