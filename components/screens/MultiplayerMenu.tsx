
import React, { useState, useEffect } from 'react';
import { GameState } from '../../types';
import { peerService, PeerStatus, PeerMessage } from '../../services/peerService';
import { multiplayer } from '../../services/gameLogic/multiplayer';
import { audioService } from '../../services/audioService';
import { useGameStore } from '../../store/useGameStore';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useBattleStore } from '../../store/useBattleStore';
import { showToast } from '../../store/useToastStore';
import { ArrowLeft, Copy, Wifi, CheckCircle, Loader2, Sword, Smartphone, ArrowRightLeft } from 'lucide-react';
import { TrainerCard } from '../TrainerCard';

export const MultiplayerMenu: React.FC = () => {
  const { setGameState, prevState, playerName, playerAvatar } = useGameStore();
  const { caughtPokemon, trainerId, badges, money } = usePlayerStore();
  const { setPeerOpponent, peerOpponent } = useBattleStore();

  const [myPeerId, setMyPeerId] = useState<string>('...');
  const [targetId, setTargetId] = useState('');
  const [status, setStatus] = useState<PeerStatus>('CONNECTING');
  
  // States for Modals
  const [isChallengeReceived, setIsChallengeReceived] = useState(false);
  const [isTradeReceived, setIsTradeReceived] = useState(false);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  
  // Track who is calling us so we can reply
  const [requestingPeerId, setRequestingPeerId] = useState<string | null>(null);

  const onBack = () => {
      audioService.playSfx('click');
      peerService.disconnect(); 
      setPeerOpponent(null);
      setGameState(prevState || GameState.MENU_MAIN);
  };

  useEffect(() => {
    peerService.init(
      (id) => setMyPeerId(id),
      (s, m) => { 
          setStatus(s); 
          if (s === 'ERROR' && m) showToast(m, 'error');
      },
      (data: PeerMessage, senderId: string) => {
         console.log("Received:", data.type, "from", senderId);
         
         if (data.type === 'CHALLENGE_REQUEST') {
             audioService.playSfx('start');
             setRequestingPeerId(senderId); 
             setIsChallengeReceived(true);
         } else if (data.type === 'CHALLENGE_RESPONSE') {
             setIsWaitingForResponse(false);
             multiplayer.handleIncomingMessage(data, senderId);
         } else if (data.type === 'TRADE_REQUEST') {
             audioService.playSfx('start');
             setRequestingPeerId(senderId);
             setIsTradeReceived(true);
         } else if (data.type === 'TRADE_RESPONSE') {
             setIsWaitingForResponse(false);
             multiplayer.handleIncomingMessage(data, senderId);
         } else {
             multiplayer.handleIncomingMessage(data, senderId); 
         }
      }
    );
    
    return () => {
        peerService.disconnect();
    };
  }, []);

  const sendSync = () => {
      if (peerService.isConnected()) {
          peerService.send({
              type: 'SYNC_TEAM',
              payload: { 
                  name: playerName, 
                  team: caughtPokemon, 
                  avatar: playerAvatar,
                  money: money,
                  badges: badges
              }
          });
      }
  };

  useEffect(() => {
      if (status === 'CONNECTED') {
          setTimeout(sendSync, 500);
      }
  }, [status]);

  const handleConnect = () => {
      if (!targetId) return;
      audioService.playSfx('click');
      peerService.connectToPeer(targetId);
  };

  const copyToClipboard = () => {
      navigator.clipboard.writeText(myPeerId);
      audioService.playSfx('click');
      showToast("ID copied!", "success");
  };

  const sendChallenge = () => {
      if (!peerService.isConnected()) {
          showToast("Not connected!", "error");
          return;
      }
      audioService.playSfx('click');
      setIsWaitingForResponse(true);
      multiplayer.sendChallenge();
  };

  const handleTradeClick = () => {
      if (!peerService.isConnected()) return;
      audioService.playSfx('click');
      setIsWaitingForResponse(true);
      multiplayer.sendTradeRequest();
  };

  const respondToChallenge = (accepted: boolean) => {
      console.log("Responding to challenge:", accepted);
      try {
          setIsChallengeReceived(false);
          const target = requestingPeerId || peerOpponent?.id;
          
          if (!target) {
              console.error("No target ID found for response");
              showToast("Error: Unknown opponent ID", "error");
              return;
          }
          
          if (accepted) {
              audioService.playSfx('correct');
              multiplayer.acceptChallenge(myPeerId, target);
          } else {
              audioService.playSfx('run');
              peerService.send({ type: 'CHALLENGE_RESPONSE', payload: { accepted: false } });
          }
      } catch (e) {
          console.error("Error responding to challenge:", e);
          setIsChallengeReceived(false);
      }
  };

  const respondToTrade = (accepted: boolean) => {
      console.log("Responding to trade:", accepted);
      try {
          setIsTradeReceived(false);
          if (accepted) {
              audioService.playSfx('correct');
              multiplayer.acceptTradeRequest();
          } else {
              audioService.playSfx('run');
              peerService.send({ type: 'TRADE_RESPONSE', payload: { accepted: false } });
          }
      } catch (e) {
          console.error("Error responding to trade:", e);
          setIsTradeReceived(false);
      }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center p-4 font-mono relative overflow-hidden">
        {/* Modal: Incoming Challenge (FIXED POSITIONING) */}
        {isChallengeReceived && (
            <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 animate-in fade-in zoom-in-95 backdrop-blur-sm">
                <div className="bg-slate-800 border-4 border-yellow-500 rounded-xl p-6 max-w-sm w-full text-center shadow-2xl relative overflow-hidden pointer-events-auto">
                    <div className="absolute inset-0 bg-yellow-500/10 animate-pulse pointer-events-none"></div>
                    <Sword size={48} className="mx-auto text-yellow-400 mb-4 animate-bounce" />
                    <h3 className="text-2xl font-pixel text-white mb-2">CHALLENGE!</h3>
                    <p className="text-slate-300 mb-6">
                        <span className="text-yellow-400 font-bold">{peerOpponent?.name || 'A Trainer'}</span> wants to battle!
                    </p>
                    <div className="flex gap-4 relative z-10">
                        <button onClick={() => respondToChallenge(false)} className="flex-1 py-3 bg-slate-600 hover:bg-slate-500 rounded font-bold text-white border-b-4 border-slate-800 active:border-b-0 active:translate-y-1 transition-all">DECLINE</button>
                        <button onClick={() => respondToChallenge(true)} className="flex-1 py-3 bg-green-600 hover:bg-green-500 rounded font-bold text-white border-b-4 border-green-800 active:border-b-0 active:translate-y-1 transition-all">ACCEPT</button>
                    </div>
                </div>
            </div>
        )}

        {/* Modal: Incoming Trade (FIXED POSITIONING) */}
        {isTradeReceived && (
            <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 animate-in fade-in zoom-in-95 backdrop-blur-sm">
                <div className="bg-slate-800 border-4 border-blue-500 rounded-xl p-6 max-w-sm w-full text-center shadow-2xl relative overflow-hidden pointer-events-auto">
                    <div className="absolute inset-0 bg-blue-500/10 animate-pulse pointer-events-none"></div>
                    <ArrowRightLeft size={48} className="mx-auto text-blue-400 mb-4 animate-spin-slow" />
                    <h3 className="text-2xl font-pixel text-white mb-2">TRADE OFFER!</h3>
                    <p className="text-slate-300 mb-6">
                        <span className="text-blue-400 font-bold">{peerOpponent?.name || 'A Trainer'}</span> wants to trade!
                    </p>
                    <div className="flex gap-4 relative z-10">
                        <button onClick={() => respondToTrade(false)} className="flex-1 py-3 bg-slate-600 hover:bg-slate-500 rounded font-bold text-white border-b-4 border-slate-800 active:border-b-0 active:translate-y-1 transition-all">DECLINE</button>
                        <button onClick={() => respondToTrade(true)} className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 rounded font-bold text-white border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 transition-all">ACCEPT</button>
                    </div>
                </div>
            </div>
        )}

        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s'}}></div>
        </div>

        <div className="w-full max-w-6xl z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4 border-b-4 border-slate-700 pb-4">
                <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft /> BACK
                </button>
                <h2 className="text-2xl md:text-3xl font-pixel text-white flex items-center gap-3">
                    <Wifi className={status === 'CONNECTED' ? 'text-green-400 animate-pulse' : 'text-slate-500'} />
                    LINK CABLE
                </h2>
                <div className="w-20"></div>
            </div>

            {/* Connection Status Bar */}
            <div className="flex gap-4 mb-6">
                <div className="flex-1 bg-slate-800 border-2 border-slate-700 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="text-xs text-slate-400 font-bold uppercase">My ID</div>
                        <code className="bg-black px-2 py-1 rounded text-yellow-400 font-mono text-sm select-all">{myPeerId}</code>
                    </div>
                    <button onClick={copyToClipboard} className="text-blue-400 hover:text-white"><Copy size={16}/></button>
                </div>
                <div className={`px-4 py-2 rounded-lg border-2 flex items-center gap-2 font-bold uppercase text-xs md:text-sm ${status === 'CONNECTED' ? 'bg-green-900/50 border-green-500 text-green-400' : 'bg-slate-900 border-slate-600 text-slate-400'}`}>
                    {status === 'CONNECTED' ? <CheckCircle size={16}/> : <Loader2 size={16} className="animate-spin"/>} {status}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
                
                {/* LEFT: MY STATUS */}
                <div className="flex flex-col gap-4">
                    <div className="text-blue-400 font-bold font-pixel text-lg">PLAYER 1</div>
                    <TrainerCard 
                        name={playerName}
                        id={trainerId}
                        money={money}
                        badges={badges}
                        avatar={playerAvatar}
                        variant="blue"
                    />
                    
                    {/* My Team Preview */}
                    <div className="bg-slate-800 rounded-xl p-4 border-2 border-slate-700">
                        <div className="text-xs text-slate-500 font-bold uppercase mb-2">My Party</div>
                        <div className="grid grid-cols-6 gap-2">
                            {caughtPokemon.slice(0, 6).map((p, i) => (
                                <div key={i} className="bg-slate-900 rounded-lg p-1 border border-slate-700 flex items-center justify-center aspect-square">
                                    <img src={p.imageUrl} className="w-full h-full object-contain" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT: OPPONENT STATUS / CONNECT */}
                <div className="flex flex-col gap-4">
                    <div className="text-red-400 font-bold font-pixel text-lg">PLAYER 2</div>
                    
                    {status === 'CONNECTED' && peerOpponent ? (
                        <>
                            <TrainerCard 
                                name={peerOpponent.name}
                                id={peerOpponent.id.substring(0, 5)} 
                                money={peerOpponent.money}
                                badges={peerOpponent.badges}
                                avatar={peerOpponent.avatar || 'https://play.pokemonshowdown.com/sprites/trainers/youngster.png'}
                                variant="red"
                            />
                            
                            {/* Opponent Team Preview */}
                            <div className="bg-slate-800 rounded-xl p-4 border-2 border-slate-700">
                                <div className="text-xs text-slate-500 font-bold uppercase mb-2">Enemy Party</div>
                                <div className="grid grid-cols-6 gap-2">
                                    {peerOpponent.team.slice(0, 6).map((p, i) => (
                                        <div key={i} className="bg-slate-900 rounded-lg p-1 border border-slate-700 flex items-center justify-center aspect-square">
                                            <img src={p.imageUrl} className="w-full h-full object-contain opacity-80" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-auto grid grid-cols-2 gap-3">
                                <button 
                                    onClick={sendChallenge}
                                    disabled={isWaitingForResponse}
                                    className={`py-4 font-bold rounded-xl border-b-4 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2
                                        ${isWaitingForResponse 
                                            ? 'bg-yellow-600 border-yellow-800 text-white animate-pulse cursor-wait col-span-2' 
                                            : 'bg-red-600 hover:bg-red-500 text-white border-red-800 shadow-lg'}`}
                                >
                                    {isWaitingForResponse ? <><Loader2 className="animate-spin"/> WAITING...</> : <><Sword /> CHALLENGE</>}
                                </button>
                                
                                {!isWaitingForResponse && (
                                    <button 
                                        onClick={handleTradeClick}
                                        className="py-4 font-bold rounded-xl border-b-4 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white border-blue-800 shadow-lg"
                                    >
                                        <ArrowRightLeft /> TRADE
                                    </button>
                                )}
                            </div>
                        </>
                    ) : (
                        // CONNECT FORM
                        <div className="h-full flex flex-col justify-center bg-slate-800 rounded-xl border-4 border-slate-700 p-8 border-dashed">
                            <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-2 justify-center opacity-50">
                                WAITING FOR CONNECTION...
                            </h3>
                            <div className="flex-1 flex flex-col gap-4 justify-center">
                                <div className="bg-black p-4 rounded-lg border border-slate-600">
                                    <label className="text-slate-500 text-xs font-bold uppercase block mb-1">Enter Friend ID:</label>
                                    <input 
                                        type="text" 
                                        value={targetId}
                                        onChange={(e) => setTargetId(e.target.value)}
                                        placeholder="paste-id-here"
                                        className="w-full bg-transparent text-white focus:outline-none font-mono text-lg"
                                    />
                                </div>
                                <button 
                                    onClick={handleConnect}
                                    disabled={!targetId || status === 'CONNECTING'}
                                    className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl border-b-4 border-green-800 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2"
                                >
                                    {status === 'CONNECTING' ? <Loader2 className="animate-spin"/> : <Smartphone />} CONNECT
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};
