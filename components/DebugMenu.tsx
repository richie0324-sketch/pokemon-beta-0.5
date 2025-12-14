import React from 'react';
import { InventorySlot, GameEvent, GameState } from '../types';
import { StorageService } from '../services/storageService';
import { ITEM_REGISTRY } from '../data/itemData';
import { POKEDEX_REGISTRY } from '../data/pokedexData';
import { useGameStore } from '../store/useGameStore';
import { usePlayerStore } from '../store/usePlayerStore';
import { useBattleStore } from '../store/useBattleStore';
import { showToast } from '../store/useToastStore';
import { GLOBAL_EVENTS } from '../data/eventRegistry';
import { audioService } from '../services/audioService';
import { Wrench, Heart, Trash2, X, CheckCircle, Package, BookOpen, Zap, Beaker, Layout } from 'lucide-react';

export const DebugMenu: React.FC = () => {
    const { setIsDebugOpen, setCurrentEvent, setGameState, setUiDebuggerOpen } = useGameStore.getState();
    const { setPlayerPokemon, setInventory, setSeenSpeciesIds, setMoney } = usePlayerStore.getState();
    const playerPokemon = usePlayerStore(state => state.playerPokemon);
    const money = usePlayerStore(state => state.money);
    const streak = useBattleStore(state => state.streak);
    const { setStreak } = useBattleStore.getState();
    const [eventId, setEventId] = React.useState<string>('');

    if (!playerPokemon) return null;

    const cloneEvent = (template: GameEvent): GameEvent => ({
        ...template,
        choices: [...template.choices], // Shallow copy needed for handlers
        data: template.data ? { ...template.data } : undefined
    });

    // Helper builders need to properly populate 'choices' not just effects
    const buildTradeEvent = (): GameEvent | null => {
        const candidate = usePlayerStore.getState().caughtPokemon.find(p => {
            const entry = POKEDEX_REGISTRY.find(e => e.speciesId === p.speciesId);
            return entry?.evolutionReq?.method === 'trade' && entry.evolvesTo && entry.evolutionReq.level && p.level >= entry.evolutionReq.level;
        });
        const template = GLOBAL_EVENTS.find(e => e.id === 'link_trade');
        if (!candidate || !template) return null;
        const entry = POKEDEX_REGISTRY.find(e => e.speciesId === candidate.speciesId);
        const nextEntry = entry?.evolvesTo ? POKEDEX_REGISTRY.find(e => e.speciesId === entry.evolvesTo) : null;
        if (!nextEntry) return null;
        
        const event = cloneEvent(template);
        event.description = `Your ${candidate.name} senses a distant trainer. Trade-evolve into ${nextEntry.name}?`;
        event.data = { tradeId: candidate.id, targetSpeciesId: nextEntry.speciesId };
        return event;
    };

    const buildUltraEvent = (): GameEvent | null => {
        const template = GLOBAL_EVENTS.find(e => e.id === 'ultra_signal');
        const gen = useGameStore.getState().selectedTopic === 'linear' ? 1 : 2;
        if (!template) return null;
        const pool = POKEDEX_REGISTRY.filter(p => p.generation === gen && p.rarity === 'Ultra' && p.isBasic);
        if (!pool.length) return null;
        const entry = pool[Math.floor(Math.random() * pool.length)];
        
        const event = cloneEvent(template);
        event.data = { entry, level: 35 };
        return event;
    };

    const buildShopEvent = (): GameEvent | null => {
        const template = GLOBAL_EVENTS.find(e => e.id === 'traveling_shop');
        if (!template) return null;
        const stock = Object.values(ITEM_REGISTRY)
            .filter(item => item.price > 0 && item.id !== 'poke-ball')
            .map(item => ({ itemId: item.id, price: item.price, count: item.category === 'BALL' ? 3 : 1 }));
        const event = cloneEvent(template);
        event.data = { stock };
        return event;
    };

    const buildEventById = (id: string): GameEvent | null => {
        switch (id) {
            case 'link_trade': return buildTradeEvent();
            case 'ultra_signal': return buildUltraEvent();
            case 'traveling_shop': return buildShopEvent();
            default:
                return GLOBAL_EVENTS.find(e => e.id === id) ? cloneEvent(GLOBAL_EVENTS.find(e => e.id === id)!) : null;
        }
    };

    const triggerEvent = () => {
        const built = buildEventById(eventId);
        if (!built) {
            showToast("Could not build event. Check conditions and try again.", "warning");
            return;
        }
        audioService.playSfx('click');
        setCurrentEvent(built);
        setGameState(GameState.EVENT_ACTIVE, useGameStore.getState().gameState);
        showToast(`Event triggered: ${built.title}`, "success");
    };

    const enterFxLab = () => {
        setIsDebugOpen(false);
        setGameState(GameState.WEATHER_LAB);
    };

    const enterUiGallery = () => {
        setIsDebugOpen(false);
        setUiDebuggerOpen(true);
    };

    const modLevel = (delta: number) => {
        let p = { ...playerPokemon };
        p.level = Math.max(1, p.level + delta);
        p.maxHp += (delta * 5);
        p.currHp = p.maxHp;
        p.attack += delta;
        setPlayerPokemon(p);
    };

    const fullHeal = () => {
        setPlayerPokemon({ ...playerPokemon, currHp: playerPokemon.maxHp });
    };

    const getAllItems = () => {
        const allItems: InventorySlot[] = Object.keys(ITEM_REGISTRY).map(key => ({
            itemId: key,
            count: 999
        }));
        
        setInventory(() => allItems);
        showToast("Inventory filled with 999 of all items!", "success");
    };

    const unlockDex = () => {
        const allIds = POKEDEX_REGISTRY.map(p => p.speciesId);
        setSeenSpeciesIds(() => allIds);
        showToast("Pokedex fully unlocked!", "success");
    };

    const resetSave = () => {
        if(confirm("DELETE SAVE DATA?")) {
            StorageService.clear();
            window.location.reload();
        }
    };

    return (
        <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4 font-mono text-white">
            <div className="bg-slate-800 border-4 border-red-500 p-6 rounded-xl w-full max-w-md relative shadow-2xl">
                <div className="flex justify-between items-center mb-6 text-red-500 border-b border-red-500/30 pb-4">
                    <h2 className="text-2xl font-bold flex items-center gap-2"><Wrench /> ADMIN TOOLS</h2>
                    <button onClick={() => setIsDebugOpen(false)} className="p-1 hover:bg-slate-700 rounded"><X /></button>
                </div>
                
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {/* NEW FX STUDIO BUTTON */}
                    <div className="flex gap-2">
                        <button onClick={enterFxLab} className="flex-1 py-3 bg-yellow-600 hover:bg-yellow-500 rounded font-bold flex items-center justify-center gap-2 border-b-4 border-yellow-800 active:border-b-0 active:translate-y-1 text-xs">
                            <Beaker size={18} fill="currentColor" /> FX STUDIO
                        </button>
                        <button onClick={enterUiGallery} className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 rounded font-bold flex items-center justify-center gap-2 border-b-4 border-cyan-800 active:border-b-0 active:translate-y-1 text-xs">
                            <Layout size={18} fill="currentColor" /> UI GALLERY
                        </button>
                    </div>

                    <div className="flex justify-between items-center bg-slate-900 p-3 rounded border border-slate-700">
                        <span className="font-bold text-yellow-400">LEVEL ({playerPokemon.level})</span>
                        <div className="flex gap-1">
                            <button onClick={() => modLevel(-1)} className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded font-bold">-</button>
                            <button onClick={() => modLevel(1)} className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded font-bold">+</button>
                        </div>
                    </div>

                    <div className="flex justify-between items-center bg-slate-900 p-3 rounded border border-slate-700">
                        <span className="font-bold text-blue-400">STREAK ({streak})</span>
                        <div className="flex gap-1">
                            <button onClick={() => setStreak(s => Math.max(0, s - 1))} className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded font-bold">-</button>
                            <button onClick={() => setStreak(s => s + 1)} className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded font-bold">+</button>
                        </div>
                    </div>

                    <div className="space-y-2 bg-slate-900 p-3 rounded border border-slate-700">
                        <div className="font-bold text-green-300">MONEY ({money})</div>
                        <div className="flex gap-2">
                            <button onClick={() => setMoney(m => Math.max(0, m - 500))} className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded font-bold">-500</button>
                            <button onClick={() => setMoney(m => m + 500)} className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded font-bold">+500</button>
                        </div>
                        <button onClick={() => setMoney(() => 5000)} className="w-full px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded font-bold">SET 5000</button>
                    </div>

                    <div className="space-y-2 bg-slate-900 p-3 rounded border border-slate-700">
                        <div className="font-bold text-purple-300 flex items-center gap-2"><Zap size={16} /> TRIGGER EVENT</div>
                        <select
                            value={eventId}
                            onChange={e => setEventId(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-2"
                        >
                            <option value="">Select an event</option>
                            {GLOBAL_EVENTS.map(ev => (
                                <option key={ev.id} value={ev.id}>{ev.title} ({ev.id})</option>
                            ))}
                        </select>
                        <button
                            onClick={triggerEvent}
                            disabled={!eventId}
                            className="w-full py-2 bg-purple-600 hover:bg-purple-500 rounded font-bold disabled:bg-slate-700 disabled:text-slate-400"
                        >
                            Trigger Event
                        </button>
                    </div>

                    <button onClick={fullHeal} className="w-full py-3 bg-green-600 hover:bg-green-700 rounded font-bold flex items-center justify-center gap-2 border-b-4 border-green-800 active:border-b-0 active:translate-y-1">
                        <Heart size={18} fill="currentColor" /> FULL HEAL
                    </button>

                    <button onClick={getAllItems} className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded font-bold flex items-center justify-center gap-2 border-b-4 border-purple-800 active:border-b-0 active:translate-y-1">
                        <Package size={18} fill="currentColor" /> GET ALL ITEMS (999x)
                    </button>

                    <button onClick={unlockDex} className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded font-bold flex items-center justify-center gap-2 border-b-4 border-blue-800 active:border-b-0 active:translate-y-1">
                        <BookOpen size={18} fill="currentColor" /> UNLOCK ALL DEX
                    </button>

                    <button onClick={resetSave} className="w-full py-3 bg-red-900 hover:bg-red-800 rounded font-bold flex items-center justify-center gap-2 mt-4 text-red-200 border-b-4 border-red-950 active:border-b-0 active:translate-y-1">
                        <Trash2 size={18} /> DELETE SAVE DATA
                    </button>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700">
                    <button onClick={() => setIsDebugOpen(false)} className="w-full py-3 bg-slate-600 hover:bg-slate-500 rounded font-bold flex items-center justify-center gap-2 border-b-4 border-slate-800 active:border-b-0 active:translate-y-1">
                        <CheckCircle size={20} /> CONFIRM & CLOSE
                    </button>
                </div>
            </div>
        </div>
    );
};