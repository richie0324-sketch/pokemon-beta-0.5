
import React from 'react';
import { useShallow } from 'zustand/shallow';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useBattleStore } from '../../store/useBattleStore';
import { useGameStore } from '../../store/useGameStore';
import { multiplayer } from '../../services/gameLogic/multiplayer';
import { audioService } from '../../services/audioService';
import { ArrowLeft, ArrowRightLeft, Check, Lock, X } from 'lucide-react';
import { GameState } from '../../types';

export const MultiplayerTrade: React.FC = () => {
    const { caughtPokemon } = usePlayerStore();
    const { setGameState } = useGameStore();
    const { tradeOffer, peerTradeOffer, isTradeConfirmed, isPeerTradeConfirmed, peerOpponent } = useBattleStore(useShallow(state => ({
        tradeOffer: state.tradeOffer,
        peerTradeOffer: state.peerTradeOffer,
        isTradeConfirmed: state.isTradeConfirmed,
        isPeerTradeConfirmed: state.isPeerTradeConfirmed,
        peerOpponent: state.peerOpponent
    })));

    const handleSelect = (pokemonId: string) => {
        if (isTradeConfirmed) return; // Locked
        const p = caughtPokemon.find(p => p.id === pokemonId);
        if (p) {
            audioService.playSfx('click');
            multiplayer.sendTradeOffer(p);
        }
    };

    const handleConfirm = () => {
        if (!tradeOffer || !peerTradeOffer) return;
        audioService.playSfx('click');
        multiplayer.confirmTrade();
    };

    const handleCancel = () => {
        audioService.playSfx('click');
        multiplayer.cancelTrade();
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col font-mono text-white">
            {/* Header */}
            <div className="bg-slate-800 p-4 border-b-4 border-slate-700 flex justify-between items-center shadow-lg sticky top-0 z-20">
                <button onClick={handleCancel} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft size={20} /> EXIT
                </button>
                <div className="text-center">
                    <h2 className="text-xl font-pixel text-yellow-400 flex items-center gap-2 justify-center">
                        <ArrowRightLeft /> LINK TRADE
                    </h2>
                    <p className="text-xs text-slate-500 uppercase">Connected to {peerOpponent?.name || 'Unknown'}</p>
                </div>
                <div className="w-20"></div> {/* Spacer */}
            </div>

            {/* Trade Area */}
            <div className="flex-1 flex flex-col p-4 gap-4 max-w-5xl mx-auto w-full">
                
                {/* Slots */}
                <div className="flex gap-4 h-64">
                    {/* My Offer */}
                    <div className={`flex-1 rounded-xl border-4 flex flex-col items-center justify-center relative transition-all
                        ${isTradeConfirmed ? 'bg-green-900/30 border-green-500' : 'bg-slate-800 border-slate-600'}
                    `}>
                        <div className="absolute top-2 left-2 bg-blue-600 px-2 py-1 rounded text-xs font-bold">YOU</div>
                        {tradeOffer ? (
                            <>
                                <img src={tradeOffer.imageUrl} className="w-32 h-32 object-contain animate-float" />
                                <div className="text-center mt-2">
                                    <div className="font-bold text-lg">{tradeOffer.name}</div>
                                    <div className="text-xs text-slate-400">Lv.{tradeOffer.level}</div>
                                </div>
                                {isTradeConfirmed && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                                        <div className="bg-green-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2">
                                            <Check size={20} /> READY
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-slate-600 text-sm">Select Pokemon</div>
                        )}
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center justify-center">
                        <div className="bg-slate-700 p-2 rounded-full border-2 border-slate-500">
                            <ArrowRightLeft size={24} className={`text-white ${isTradeConfirmed && isPeerTradeConfirmed ? 'animate-spin' : ''}`} />
                        </div>
                    </div>

                    {/* Their Offer */}
                    <div className={`flex-1 rounded-xl border-4 flex flex-col items-center justify-center relative transition-all
                        ${isPeerTradeConfirmed ? 'bg-green-900/30 border-green-500' : 'bg-slate-800 border-slate-600'}
                    `}>
                        <div className="absolute top-2 right-2 bg-red-600 px-2 py-1 rounded text-xs font-bold">PARTNER</div>
                        {peerTradeOffer ? (
                            <>
                                <img src={peerTradeOffer.imageUrl} className="w-32 h-32 object-contain animate-float" />
                                <div className="text-center mt-2">
                                    <div className="font-bold text-lg">{peerTradeOffer.name}</div>
                                    <div className="text-xs text-slate-400">Lv.{peerTradeOffer.level}</div>
                                </div>
                                {isPeerTradeConfirmed && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                                        <div className="bg-green-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2">
                                            <Check size={20} /> READY
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-slate-600 text-sm animate-pulse">Waiting for offer...</div>
                        )}
                    </div>
                </div>

                {/* Controls */}
                <div className="flex gap-4">
                    <button 
                        onClick={handleConfirm}
                        disabled={!tradeOffer || !peerTradeOffer || isTradeConfirmed}
                        className={`flex-1 py-4 rounded-xl font-bold text-lg border-b-4 transition-all flex items-center justify-center gap-2
                            ${!tradeOffer || !peerTradeOffer 
                                ? 'bg-slate-700 text-slate-500 border-slate-800 cursor-not-allowed'
                                : (isTradeConfirmed 
                                    ? 'bg-green-600 border-green-800 text-white cursor-default'
                                    : 'bg-yellow-500 hover:bg-yellow-400 border-yellow-700 text-black active:border-b-0 active:translate-y-1')
                            }
                        `}
                    >
                        {isTradeConfirmed ? <><Lock /> LOCKED IN</> : <><Check /> CONFIRM TRADE</>}
                    </button>
                </div>

                {/* My Box */}
                <div className="flex-1 bg-slate-800 rounded-xl border border-slate-700 p-4 overflow-hidden flex flex-col">
                    <div className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Your Box</div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 overflow-y-auto">
                        {caughtPokemon.map(p => (
                            <button 
                                key={p.id}
                                onClick={() => handleSelect(p.id)}
                                disabled={isTradeConfirmed}
                                className={`
                                    p-2 rounded-lg border-2 flex flex-col items-center gap-1 transition-all
                                    ${tradeOffer?.id === p.id 
                                        ? 'bg-blue-900 border-blue-500 ring-2 ring-blue-400/50' 
                                        : 'bg-slate-900 border-slate-700 hover:border-slate-500'}
                                    ${isTradeConfirmed ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                            >
                                <img src={p.imageUrl} className="w-12 h-12 object-contain" />
                                <span className="text-xs font-bold truncate w-full text-center">{p.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};
