
import React, { useState, useEffect } from 'react';
import { ArrowRight, Trophy, Download, Upload, Copy, Check, X, AlertTriangle, FileJson, Save, Trash2, Clock, PlayCircle, Wrench, Beaker, Layout, Terminal } from 'lucide-react';
import { logic } from '../../hooks/useGameLogic';
import { StorageService } from '../../services/storageService';
import { useGameStore } from '../../store/useGameStore';
import { GameState, SaveMetadata } from '../../types';
import { audioService } from '../../services/audioService';
import { showToast } from '../../store/useToastStore';

export const MainMenu: React.FC = () => {
    const hasAnySave = StorageService.hasAnySave();
    const { setGameState, setCurrentSlotId, debugModeEnabled, setDebugModeEnabled, setUiDebuggerOpen, setEventEditorOpen } = useGameStore.getState();
    
    // UI State
    const [showTransfer, setShowTransfer] = useState(false);
    const [showSlotSelect, setShowSlotSelect] = useState<'LOAD' | 'NEW' | null>(null);
    const [transferMode, setTransferMode] = useState<'EXPORT' | 'IMPORT'>('EXPORT');
    const [importCode, setImportCode] = useState('');
    const [slots, setSlots] = useState<SaveMetadata[]>([]);
    
    // Secret Unlock State
    const [debugClicks, setDebugClicks] = useState(0);
    
    // Refresh slots when menu opens
    useEffect(() => {
        if (showSlotSelect || showTransfer) {
            setSlots(StorageService.getAllSlots());
        }
    }, [showSlotSelect, showTransfer]);

    const handleOpenAchievements = () => {
        audioService.playSfx('click');
        setGameState(GameState.ACHIEVEMENTS, GameState.MENU_MAIN);
    };

    const handleDataTransferOpen = () => {
        audioService.playSfx('click');
        setShowTransfer(true);
        setTransferMode('EXPORT');
        setImportCode('');
    };

    const handleSlotClick = (slot: SaveMetadata) => {
        audioService.playSfx('click');
        
        if (showSlotSelect === 'LOAD') {
            if (slot.isEmpty) {
                showToast("This slot is empty!", "warning");
                return;
            }
            logic.handleLoadGame(slot.slotId);
        } else if (showSlotSelect === 'NEW') {
            if (!slot.isEmpty) {
                if (!confirm(`Overwrite Slot ${slot.slotId}? Previous data will be lost!`)) return;
            }
            setCurrentSlotId(slot.slotId);
            logic.handleStartGame();
        }
    };

    const handleDeleteSlot = (e: React.MouseEvent, slotId: number) => {
        e.stopPropagation();
        if (confirm(`Are you sure you want to delete Save Slot ${slotId}?`)) {
            audioService.playSfx('damage');
            StorageService.deleteSlot(slotId);
            setSlots(StorageService.getAllSlots()); // Refresh
            showToast(`Slot ${slotId} deleted.`, "info");
        }
    };

    const copyToClipboard = (slotId: number) => {
        const code = StorageService.exportSave(slotId);
        if (code) {
            navigator.clipboard.writeText(code);
            audioService.playSfx('correct');
            showToast("Save code copied to clipboard!", "success");
        } else {
            audioService.playSfx('incorrect');
            showToast("No save data to export.", "error");
        }
    };

    const handleImport = (slotId: number) => {
        if (!importCode) return;
        const success = StorageService.importSave(importCode, slotId);
        if (success) {
            audioService.playSfx('correct');
            showToast(`Save loaded into Slot ${slotId}! Reloading...`, "success");
            setTimeout(() => window.location.reload(), 1500);
        } else {
            audioService.playSfx('incorrect');
            showToast("Invalid save code.", "error");
        }
    };

    // Secret Debug Trigger
    const handleVersionClick = () => {
        if (debugModeEnabled) return;
        
        const newCount = debugClicks + 1;
        setDebugClicks(newCount);
        
        if (newCount === 3) {
            audioService.playSfx('click'); // Subtle hint
        }
        
        if (newCount >= 7) {
            setDebugModeEnabled(true);
            audioService.playSfx('catch'); // Success sound
            showToast("DEVELOPER MODE UNLOCKED", "success");
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            
            {/* SAVE SLOT SELECTION MODAL */}
            {showSlotSelect && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-in fade-in zoom-in-95">
                    <div className="bg-slate-800 w-full max-w-lg rounded-xl border-4 border-slate-600 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="bg-slate-700 p-4 flex justify-between items-center border-b border-slate-600">
                            <h2 className="text-white font-pixel font-bold flex items-center gap-2">
                                <Save className="text-yellow-400" /> 
                                {showSlotSelect === 'NEW' ? 'START NEW GAME' : 'LOAD GAME'}
                            </h2>
                            <button onClick={() => setShowSlotSelect(null)} className="text-slate-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="p-6 bg-slate-900 flex-1 overflow-y-auto space-y-4">
                            {slots.map((slot) => (
                                <div 
                                    key={slot.slotId}
                                    onClick={() => handleSlotClick(slot)}
                                    className={`relative group border-4 rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.02] flex items-center gap-4
                                        ${slot.isEmpty 
                                            ? 'border-slate-700 bg-slate-800/50 text-slate-500 hover:border-slate-500' 
                                            : 'border-blue-600 bg-slate-800 hover:border-yellow-400'
                                        }
                                    `}
                                >
                                    <div className="text-2xl font-pixel text-slate-600 font-bold w-8 text-center">{slot.slotId}</div>
                                    
                                    {slot.isEmpty ? (
                                        <div className="flex-1 text-center font-bold text-lg tracking-widest opacity-50">-- EMPTY --</div>
                                    ) : (
                                        <div className="flex-1 flex items-center gap-4">
                                            {slot.avatar && (
                                                <div className="w-12 h-12 rounded-full bg-slate-900 border-2 border-slate-600 overflow-hidden shrink-0">
                                                    <img src={slot.avatar} className="w-full h-full object-contain" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="font-bold text-white truncate text-lg">{slot.playerName}</div>
                                                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-1">
                                                    <span className="flex items-center gap-1"><Trophy size={10} className="text-yellow-500"/> {slot.badges} Badges</span>
                                                    <span className="flex items-center gap-1"><Clock size={10}/> {new Date(slot.playTime || 0).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {!slot.isEmpty && (
                                        <button 
                                            onClick={(e) => handleDeleteSlot(e, slot.slotId)}
                                            className="absolute top-2 right-2 p-2 text-slate-600 hover:text-red-500 transition-colors z-10"
                                            title="Delete Save"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* DATA TRANSFER MODAL */}
            {showTransfer && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-in fade-in zoom-in-95">
                    <div className="bg-slate-800 w-full max-w-lg rounded-xl border-4 border-slate-600 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="bg-slate-700 p-4 flex justify-between items-center border-b border-slate-600">
                            <h2 className="text-white font-pixel font-bold flex items-center gap-2">
                                <FileJson className="text-yellow-400" /> SAVE DATA MANAGER
                            </h2>
                            <button onClick={() => setShowTransfer(false)} className="text-slate-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="flex bg-slate-900 border-b border-slate-700">
                            <button 
                                onClick={() => setTransferMode('EXPORT')}
                                className={`flex-1 py-3 font-bold text-sm transition-colors flex items-center justify-center gap-2 ${transferMode === 'EXPORT' ? 'bg-slate-800 text-yellow-400 border-b-2 border-yellow-400' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                <Download size={16} /> EXPORT SAVE
                            </button>
                            <button 
                                onClick={() => setTransferMode('IMPORT')}
                                className={`flex-1 py-3 font-bold text-sm transition-colors flex items-center justify-center gap-2 ${transferMode === 'IMPORT' ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                <Upload size={16} /> IMPORT SAVE
                            </button>
                        </div>

                        <div className="p-6 bg-slate-800 flex-1 overflow-y-auto">
                            {transferMode === 'EXPORT' ? (
                                <div className="space-y-4">
                                    <p className="text-slate-300 text-sm">Select a slot to export its data code.</p>
                                    <div className="space-y-2">
                                        {slots.map(slot => (
                                            <div key={slot.slotId} className="bg-slate-900 p-3 rounded border border-slate-700 flex justify-between items-center">
                                                <div className="text-sm">
                                                    <span className="font-bold text-slate-400 mr-2">SLOT {slot.slotId}</span>
                                                    {slot.isEmpty ? <span className="text-slate-600">Empty</span> : <span className="text-white">{slot.playerName}</span>}
                                                </div>
                                                {!slot.isEmpty && (
                                                    <button onClick={() => copyToClipboard(slot.slotId)} className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-xs font-bold">
                                                        COPY CODE
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="bg-red-900/30 border border-red-500/50 p-3 rounded-lg flex items-start gap-2">
                                        <AlertTriangle className="text-red-400 shrink-0" size={16} />
                                        <p className="text-red-200 text-xs">
                                            <strong>WARNING:</strong> Importing will overwrite the selected slot completely.
                                        </p>
                                    </div>
                                    <textarea 
                                        value={importCode}
                                        onChange={(e) => setImportCode(e.target.value)}
                                        placeholder="Paste code here..."
                                        className="w-full h-24 bg-black/50 border-2 border-blue-500/50 rounded-lg p-3 text-xs text-white font-mono resize-none focus:border-blue-400 outline-none"
                                    />
                                    <p className="text-slate-400 text-xs font-bold uppercase mt-2">Import to:</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {slots.map(slot => (
                                            <button 
                                                key={slot.slotId}
                                                onClick={() => handleImport(slot.slotId)}
                                                disabled={!importCode}
                                                className={`py-2 rounded border-2 font-bold text-xs ${!importCode ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 hover:border-blue-400'} border-slate-600 bg-slate-700 text-white`}
                                            >
                                                SLOT {slot.slotId}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black z-0"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0"></div>
            
            {/* Legendary Decoration Layer */}
            <div className="absolute top-10 left-10 opacity-20 animate-float" style={{ animationDuration: '6s' }}>
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/249.png" className="w-48 h-48 md:w-64 md:h-64 object-contain brightness-0 invert" />
            </div>
            <div className="absolute bottom-10 right-10 opacity-20 animate-float" style={{ animationDuration: '7s', animationDelay: '1s' }}>
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/250.png" className="w-48 h-48 md:w-64 md:h-64 object-contain brightness-0 invert" />
            </div>

            <div className="z-10 text-center space-y-8 flex flex-col items-center w-full max-w-4xl">
                
                <div className="relative">
                    {/* Central Mascot */}
                    <div className="absolute left-1/2 -translate-x-1/2 -top-32 md:-top-48 z-0 opacity-80">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png" className="w-64 h-64 md:w-96 md:h-96 object-contain drop-shadow-[0_0_50px_rgba(168,85,247,0.5)] animate-pulse" />
                    </div>

                    <h1 className="relative z-10 text-4xl md:text-7xl font-pixel text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-[4px_4px_0_#000] mb-2 tracking-tighter leading-tight">
                        POKEMON<br/>MATH ADVENTURE
                    </h1>
                    <div className="h-1 w-32 bg-yellow-500 mx-auto rounded-full mb-4 shadow-[0_0_10px_#fbbf24]"></div>
                    <p className="text-blue-200 font-mono tracking-[0.5em] text-sm md:text-lg uppercase drop-shadow-md">
                        Year 8 Mathematics RPG
                    </p>
                </div>

                <div className="flex flex-col gap-4 w-full max-w-xs mx-auto mt-12 relative z-20">
                    <button onClick={() => { audioService.playSfx('click'); setShowSlotSelect('NEW'); }} className="group relative py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-xl shadow-lg border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 transition-all overflow-hidden">
                        <span className="relative z-10 flex items-center justify-center gap-2 text-xl font-pixel">
                          NEW GAME <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </button>
                    
                    {hasAnySave && (
                        <button onClick={() => { audioService.playSfx('click'); setShowSlotSelect('LOAD'); }} className="group relative py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold rounded-xl shadow-lg border-b-4 border-green-800 active:border-b-0 active:translate-y-1 transition-all overflow-hidden">
                            <span className="relative z-10 flex items-center justify-center gap-2 text-xl font-pixel">
                              CONTINUE
                            </span>
                        </button>
                    )}

                    {hasAnySave && (
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={handleOpenAchievements} className="group relative py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white font-bold rounded-xl shadow-lg border-b-4 border-yellow-800 active:border-b-0 active:translate-y-1 transition-all overflow-hidden">
                                <span className="relative z-10 flex items-center justify-center gap-2 text-xs font-pixel">
                                <Trophy size={14} /> AWARDS
                                </span>
                            </button>
                            <button onClick={handleDataTransferOpen} className="group relative py-3 bg-gradient-to-r from-slate-600 to-slate-500 hover:from-slate-500 hover:to-slate-400 text-white font-bold rounded-xl shadow-lg border-b-4 border-slate-800 active:border-b-0 active:translate-y-1 transition-all overflow-hidden">
                                <span className="relative z-10 flex items-center justify-center gap-2 text-xs font-pixel">
                                <Save size={14} /> SLOTS
                                </span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* DEBUGGER TOOLBAR (Only Visible when Unlocked) */}
            {debugModeEnabled && (
                <div className="absolute top-4 right-4 flex gap-2 z-50">
                    <button onClick={() => setUiDebuggerOpen(true)} className="p-2 bg-slate-800 hover:bg-slate-700 rounded border border-slate-600 text-white shadow-lg" title="UI Debugger">
                        <Layout size={16} />
                    </button>
                    <button onClick={() => setGameState(GameState.WEATHER_LAB, GameState.MENU_MAIN)} className="p-2 bg-yellow-900 hover:bg-yellow-800 rounded border border-yellow-600 text-white shadow-lg" title="VFX Lab">
                        <Beaker size={16} />
                    </button>
                    <button onClick={() => setEventEditorOpen(true)} className="p-2 bg-purple-900 hover:bg-purple-800 rounded border border-purple-600 text-white shadow-lg" title="Event Editor">
                        <Terminal size={16} />
                    </button>
                </div>
            )}

            {/* Version Text (Secret Trigger) */}
            <button 
                onClick={handleVersionClick}
                className="absolute bottom-4 text-slate-600 text-xs font-mono z-30 cursor-default focus:outline-none"
            >
                MathMon v2.8 (Multi-Save Slots){debugModeEnabled && " [DEV MODE]"}
            </button>
        </div>
    );
}
