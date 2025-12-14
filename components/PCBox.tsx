
import React, { useState } from 'react';
import { useShallow } from 'zustand/shallow';
import { Pokemon } from '../types';
import { audioService } from '../services/audioService';
import { useGameStore } from '../store/useGameStore';
import { usePlayerStore } from '../store/usePlayerStore';
import { showToast } from '../store/useToastStore';
import { Monitor, X, Briefcase, CheckCircle, AlertTriangle } from 'lucide-react';
import { TYPE_COLORS } from '../constants';

export const PCBox: React.FC = () => {
    const { setGameState, prevState } = useGameStore();
    const { party, storage, swapPartyStorage, depositPokemon, withdrawPokemon } = usePlayerStore(useShallow(state => ({
        party: state.caughtPokemon,
        storage: state.storagePokemon,
        swapPartyStorage: state.swapPartyStorage,
        depositPokemon: state.depositPokemon,
        withdrawPokemon: state.withdrawPokemon,
    })));

    const [selectedPartyId, setSelectedPartyId] = useState<string | null>(null);
    const [selectedStorageId, setSelectedStorageId] = useState<string | null>(null);
    const [confirmAction, setConfirmAction] = useState<{ type: string; partyId?: string; storageId?: string; message: string; } | null>(null);

    const onClose = () => setGameState(prevState);

    const handlePartyClick = (id: string) => {
        audioService.playSfx('click');
        if (selectedStorageId) {
            const pName = party.find(p => p.id === id)?.name;
            const sName = storage.find(p => p.id === selectedStorageId)?.name;
            setConfirmAction({ type: 'SWAP', partyId: id, storageId: selectedStorageId, message: `Swap ${pName} with ${sName}?` });
        } else if (selectedPartyId === id) {
            if (party.length > 1) {
                const pName = party.find(p => p.id === id)?.name;
                setConfirmAction({ type: 'DEPOSIT', partyId: id, message: `Deposit ${pName} into PC?` });
            } else {
                showToast("Cannot deposit your last Pokemon!", "warning");
            }
        } else {
            setSelectedPartyId(id);
        }
    };

    const handleStorageClick = (id: string) => {
        audioService.playSfx('click');
        if (selectedPartyId) {
            const pName = party.find(p => p.id === selectedPartyId)?.name;
            const sName = storage.find(p => p.id === id)?.name;
            setConfirmAction({ type: 'SWAP', partyId: selectedPartyId, storageId: id, message: `Swap ${pName} with ${sName}?` });
        } else if (selectedStorageId === id) {
            if (party.length < 6) {
                const sName = storage.find(p => p.id === id)?.name;
                setConfirmAction({ type: 'WITHDRAW', storageId: id, message: `Withdraw ${sName} to Party?` });
            } else {
                showToast("Party is full!", "warning");
            }
        } else {
            setSelectedStorageId(id);
        }
    };

    const executeAction = () => {
        if (!confirmAction) return;
        audioService.playSfx('correct');

        if (confirmAction.type === 'SWAP' && confirmAction.partyId && confirmAction.storageId) {
            swapPartyStorage(confirmAction.partyId, confirmAction.storageId);
        } else if (confirmAction.type === 'DEPOSIT' && confirmAction.partyId) {
            depositPokemon(confirmAction.partyId);
        } else if (confirmAction.type === 'WITHDRAW' && confirmAction.storageId) {
            withdrawPokemon(confirmAction.storageId);
        }

        setConfirmAction(null);
        setSelectedPartyId(null);
        setSelectedStorageId(null);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col font-mono text-white">
            {confirmAction && (
                <div className="fixed inset-0 z-[150] bg-black/80 flex items-center justify-center p-4 animate-in fade-in" onClick={() => setConfirmAction(null)}>
                    <div className="bg-slate-800 border-4 border-slate-600 p-6 rounded-xl w-full max-w-sm text-center shadow-2xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-white mb-4">Confirm Action</h3>
                        <div className="bg-slate-900 p-4 rounded mb-6 border border-slate-700">
                            <p className="text-yellow-400 text-lg font-bold">{confirmAction.message}</p>
                        </div>
                        <div className="flex gap-4 justify-center">
                            <button onClick={() => { audioService.playSfx('click'); setConfirmAction(null); }} className="px-4 py-3 bg-slate-600 text-white font-bold rounded-lg border-b-4 border-slate-700 active:border-b-0 active:translate-y-1 w-1/2">CANCEL</button>
                            <button onClick={executeAction} className="px-4 py-3 bg-green-600 text-white font-bold rounded-lg border-b-4 border-green-800 active:border-b-0 active:translate-y-1 w-1/2 flex items-center justify-center gap-2"><CheckCircle size={18} /> CONFIRM</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center shadow-lg">
                <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 font-pixel text-blue-300"><Monitor className="text-blue-300" /> PC STORAGE SYSTEM</h2>
                <button onClick={onClose} className="bg-slate-700 hover:bg-slate-600 p-2 rounded-full transition-colors"><X size={24} /></button>
            </div>

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                <div className="w-full md:w-1/3 bg-slate-800 p-4 border-r border-slate-700 flex flex-col gap-4 overflow-y-auto">
                    <div className="flex items-center justify-between text-yellow-400 font-bold mb-2"><span className="flex items-center gap-2"><Briefcase size={16}/> PARTY ({party.length}/6)</span></div>
                    <div className="space-y-2">
                        {party.map(p => (
                            <button key={p.id} onClick={() => handlePartyClick(p.id)}
                                className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 transition-all ${selectedPartyId === p.id ? 'border-yellow-400 bg-slate-700 ring-2 ring-yellow-400/30' : 'border-slate-600 bg-slate-900 hover:bg-slate-750'}`}>
                                <img src={p.imageUrl} className="w-10 h-10 object-contain bg-slate-800 rounded-full" />
                                <div className="text-left flex-1 min-w-0">
                                    <div className="font-bold truncate text-sm">{p.name}</div>
                                    <div className="text-xs text-slate-400">Lv.{p.level}</div>
                                </div>
                                {selectedPartyId === p.id && party.length > 1 && (<div className="text-[10px] bg-red-600 px-2 py-1 rounded font-bold animate-pulse">TAP TO DEPOSIT</div>)}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex-1 bg-slate-900 p-4 overflow-y-auto">
                    <div className="flex items-center justify-between text-blue-300 font-bold mb-4">
                        <span className="flex items-center gap-2">BOX 1 ({storage.length})</span>
                        <div className="text-xs text-slate-500 font-normal">Tap to select, Tap again to move</div>
                    </div>
                    {storage.length === 0 ? (
                        <div className="h-64 flex items-center justify-center text-slate-600 font-pixel">BOX IS EMPTY</div>
                    ) : (
                        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {storage.map(p => (
                                <button key={p.id} onClick={() => handleStorageClick(p.id)}
                                    className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center p-2 transition-all relative ${selectedStorageId === p.id ? 'border-blue-400 bg-slate-800 ring-2 ring-blue-400/30' : 'border-slate-700 bg-slate-800 hover:bg-slate-700'}`}>
                                    <img src={p.imageUrl} className="w-12 h-12 object-contain" />
                                    <span className="text-[10px] text-slate-400 truncate w-full text-center mt-1">{p.name}</span>
                                    <span className={`text-[8px] absolute top-1 right-1 px-1 rounded ${TYPE_COLORS[p.type]}`}>Lv{p.level}</span>
                                    {selectedStorageId === p.id && party.length < 6 && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl backdrop-blur-[1px]">
                                            <span className="text-[10px] font-bold bg-green-600 px-2 py-1 rounded animate-pulse">TAP TO WITHDRAW</span>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="p-4 bg-slate-800 border-t border-slate-700 text-center text-xs text-slate-400">
                {selectedPartyId && selectedStorageId ? (
                    <span className="text-yellow-400 font-bold animate-pulse">TAP SELECTED BOX POKEMON TO CONFIRM SWAP!</span>
                ) : (
                    <span>Select a Pokemon from Party and Box to Swap</span>
                )}
            </div>
        </div>
    );
};
