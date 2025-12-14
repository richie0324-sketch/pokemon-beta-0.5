import React, { memo, useMemo, useState } from 'react';
import { Pokemon } from '../types';
import { TYPE_COLORS } from '../constants';
import { calculatePotential } from '../services/pokemonGenService';
import { POKEDEX_REGISTRY } from '../data/pokedexData';
import { EVOLUTION_ITEM_MAP, ITEM_REGISTRY } from '../data/itemData';
import { audioService } from '../services/audioService';
import { showToast } from '../store/useToastStore';
import { X, Activity, Star, ArrowRight, HelpCircle, BarChart3, Swords, Trash2 } from 'lucide-react';

const getRarityStyle = (rarity: string) => {
    switch(rarity) {
        case 'Common': return 'bg-slate-600 text-slate-200';
        case 'Rare': return 'bg-blue-600 text-white';
        case 'Elite': return 'bg-purple-600 text-white';
        case 'Ultra': return 'bg-red-600 text-white';
        case 'Legendary': return 'bg-yellow-400 text-black border border-yellow-600';
        default: return 'bg-slate-600';
    }
};

const getPokemonImage = (id: number) => 
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

// Helper to determine evolution info
const getEvolutionInfo = (currentId: number) => {
    // 1. Next Evolution
    const nextEvos: { id: number, method: string, itemIcon?: string }[] = [];
    
    // Check Natural
    const naturalNext = POKEDEX_REGISTRY.find(p => p.speciesId === currentId)?.evolvesTo;
    if (naturalNext) {
        nextEvos.push({ id: naturalNext, method: "Level Up" });
    }

    // Check Item
    const itemMap = EVOLUTION_ITEM_MAP[currentId];
    if (itemMap) {
        Object.entries(itemMap).forEach(([itemId, targetId]) => {
            const itemDef = ITEM_REGISTRY[itemId];
            nextEvos.push({ 
                id: targetId, 
                method: itemDef ? itemDef.name : "Item",
                itemIcon: "⚡" 
            });
        });
    }

    // 2. Previous Evolution
    let prevEvo: { id: number, method: string } | null = null;
    
    // Search who evolves into currentId (Natural)
    const naturalPrevEntry = POKEDEX_REGISTRY.find(p => p.evolvesTo === currentId);
    if (naturalPrevEntry) {
        prevEvo = { id: naturalPrevEntry.speciesId, method: "Level Up" };
    } else {
        // Search who evolves into currentId (Item)
        let foundPrevId = -1;
        let foundMethod = "Item";
        
        for (const [pIdStr, map] of Object.entries(EVOLUTION_ITEM_MAP)) {
            const pId = parseInt(pIdStr);
            for (const [itemId, targetId] of Object.entries(map as Record<string, number>)) {
                if (targetId === currentId) {
                    foundPrevId = pId;
                    foundMethod = ITEM_REGISTRY[itemId]?.name || "Item";
                    break;
                }
            }
            if (foundPrevId !== -1) break;
        }
        
        if (foundPrevId !== -1) {
            prevEvo = { id: foundPrevId, method: foundMethod };
        }
    }

    return { prevEvo, nextEvos };
};

interface PokemonDetailModalProps {
    pokemon: Pokemon;
    onClose: () => void;
    playerPokemonId?: string;
    caughtSpeciesIds?: number[];
    seenSpeciesIds?: number[];
    viewMode?: 'pokedex' | 'party';
    onRelease?: (id: string) => void;
    canRelease?: boolean;
}

export const PokemonDetailModal = memo(({ pokemon, onClose, playerPokemonId, caughtSpeciesIds = [], seenSpeciesIds = [], viewMode = 'party', onRelease, canRelease }: PokemonDetailModalProps) => {
    const p = pokemon;
    const potential = calculatePotential(p);
    
    // Use caughtSpeciesIds (which might be History or Current Inventory depending on viewMode) to determine registration
    const isRegistered = caughtSpeciesIds.includes(p.speciesId);
    const isSeen = seenSpeciesIds.includes(p.speciesId) || isRegistered;
    const isActivePartner = playerPokemonId === p.id;
    
    const [showConfirm, setShowConfirm] = useState(false);
    
    const { prevEvo, nextEvos } = useMemo(() => getEvolutionInfo(p.speciesId), [p.speciesId]);

    // Lookup Registry Data for Base Stats
    const registryEntry = useMemo(() => POKEDEX_REGISTRY.find(e => e.speciesId === p.speciesId), [p.speciesId]);
    const baseStats = registryEntry?.baseStats || { hp: 50, atk: 50, def: 50 };

    // Helper for rendering small evolution icons (with silhouette logic)
    const renderEvoIcon = (id: number) => {
        // Check if evo is known (registered in passed history/inventory list)
        const isEvoKnown = caughtSpeciesIds.includes(id);
        const isEvoSeen = seenSpeciesIds.includes(id) || isEvoKnown;
        
        if (!isEvoSeen) {
            return <span className="text-slate-600 font-bold text-lg">?</span>;
        }

        return (
            <img 
                src={getPokemonImage(id)} 
                className={`w-full h-full object-contain p-1 ${!isEvoKnown ? 'brightness-0 opacity-60' : ''}`} 
            />
        );
    };

    // Stats Bar Component
    const StatRow = ({ label, value, max, colorClass, suffix = '', isHidden = false }: any) => {
        // Safety for max value to avoid NaN
        const safeMax = Math.max(1, max);
        const percent = isHidden ? 0 : Math.min(100, Math.max(0, (value / safeMax) * 100));
        
        return (
            <div className="flex items-center gap-3">
                <span className={`w-8 text-[10px] md:text-xs font-bold ${colorClass.replace('bg-', 'text-')}`}>{label}</span>
                <div className="flex-1 h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-700 relative">
                    {!isHidden && <div className={`h-full ${colorClass}`} style={{ width: `${percent}%` }}></div>}
                </div>
                <span className="w-14 text-[10px] md:w-16 md:text-xs font-mono font-bold text-slate-400 text-right whitespace-nowrap">
                    {isHidden ? '???' : `${value}${suffix}`}
                </span>
            </div>
        );
    };

    // Trigger Custom Confirm
    const handleReleaseClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!onRelease || !canRelease) {
            showToast("Cannot release this Pokemon!", "warning");
            return;
        }
        audioService.playSfx('click');
        setShowConfirm(true);
    };

    // Execute Release
    const confirmRelease = () => {
        if (!onRelease) return;
        audioService.playSfx('click');
        onRelease(p.id);
        onClose();
    };

    return (
      <div 
        className="fixed inset-0 z-[100] bg-black/80 flex items-end md:items-center justify-center p-2 md:p-4 backdrop-blur-sm animate-in fade-in duration-200" 
        onClick={onClose}
      >
        {/* Custom Confirmation Modal (Nested z-index) */}
        {showConfirm && (
            <div className="absolute inset-0 z-[150] flex items-center justify-center p-4 bg-black/60" onClick={(e) => e.stopPropagation()}>
                <div className="bg-slate-800 border-4 border-slate-600 p-6 rounded-xl w-full max-w-sm text-center shadow-2xl animate-in zoom-in-95">
                    <h3 className="text-xl font-bold text-white mb-4">Release {p.name}?</h3>
                    <div className="bg-slate-900 p-4 rounded mb-6 border border-slate-700">
                        <p className="text-slate-400 text-sm mb-2">You will receive <span className="text-yellow-400 font-bold">$500</span>.</p>
                        <p className="text-red-400 text-xs font-bold uppercase">This action cannot be undone!</p>
                    </div>
                    <div className="flex gap-4 justify-center">
                        <button 
                            onClick={() => { audioService.playSfx('click'); setShowConfirm(false); }} 
                            className="px-4 py-3 bg-slate-600 text-white font-bold rounded-lg border-b-4 border-slate-700 active:border-b-0 active:translate-y-1 w-1/2"
                        >
                            CANCEL
                        </button>
                        <button 
                            onClick={confirmRelease} 
                            className="px-4 py-3 bg-red-600 text-white font-bold rounded-lg border-b-4 border-red-800 active:border-b-0 active:translate-y-1 w-1/2"
                        >
                            CONFIRM
                        </button>
                    </div>
                </div>
            </div>
        )}

        <div 
            className="bg-slate-800 w-full md:max-w-lg h-[85vh] md:h-auto md:max-h-[90vh] rounded-t-2xl md:rounded-xl border-t-4 md:border-4 border-slate-600 shadow-2xl overflow-y-auto relative flex flex-col" 
            onClick={(e) => e.stopPropagation()}
        >
            {/* Header */}
            <div className={`p-3 md:p-4 ${TYPE_COLORS[p.type]} flex justify-between items-start text-white sticky top-0 z-10 shadow-md`}>
                <div>
                    <h2 className="text-xl md:text-2xl font-bold font-pixel drop-shadow-md">{p.name}</h2>
                    <div className="flex gap-2 mt-1">
                        <span className="bg-black/20 px-2 py-0.5 rounded text-xs font-bold uppercase">{p.type}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${getRarityStyle(p.rarity)} border border-white/20`}>{p.rarity}</span>
                    </div>
                </div>
                <button onClick={() => { audioService.playSfx('click'); onClose(); }} className="bg-black/20 hover:bg-black/40 rounded-full p-2 transition-colors">
                    <X size={24} />
                </button>
            </div>

            {/* Content Body */}
            <div className="p-4 md:p-6 bg-slate-800 flex-1 overflow-y-auto">
                {/* Main Info */}
                <div className="flex gap-6 mb-6">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-700 rounded-full border-4 border-slate-600 flex items-center justify-center shrink-0 shadow-inner overflow-hidden">
                        {isSeen ? (
                            <img 
                                src={p.imageUrl} 
                                className={`w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-lg ${!isRegistered ? 'brightness-0 opacity-60' : ''}`} 
                            />
                        ) : (
                            <span className="text-4xl text-slate-600 font-bold">?</span>
                        )}
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                        {/* ONLY SHOW LEVEL IF PARTY MODE */}
                        {viewMode === 'party' ? (
                            <>
                                <div className="flex items-baseline justify-between mb-0 md:mb-1">
                                    <span className="text-slate-400 font-bold text-sm uppercase">Level</span>
                                    <span className="text-2xl md:text-3xl font-bold text-white font-mono">{p.level}</span>
                                </div>
                                <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-600 relative">
                                    <div className="h-full bg-blue-500" style={{ width: `${(p.exp / p.maxExp) * 100}%` }}></div>
                                </div>
                                <div className="text-xs text-slate-500 text-right mt-1 font-mono">
                                    EXP {p.exp} / {p.maxExp}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col justify-center h-full gap-2">
                                <div className="inline-flex items-center gap-2">
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${isRegistered ? 'bg-green-600 text-white' : (isSeen ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400')}`}>
                                        {isRegistered ? "CAUGHT" : (isSeen ? "SEEN" : "UNKNOWN")}
                                    </span>
                                </div>
                                <div className="text-xs text-slate-500 font-mono italic">
                                    {isRegistered ? "Registered in Pokedex" : "Data Incomplete"}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-slate-900/50 p-3 md:p-4 rounded-lg mb-6 text-slate-400 text-xs md:text-sm italic font-mono border border-slate-700 shadow-sm leading-relaxed">
                    "{isRegistered || isSeen ? p.description : 'Data has not been registered.'}"
                </div>

                {/* Evolution Chain */}
                <div className="mb-6">
                    <h3 className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-3 flex items-center gap-2">
                        <Activity size={14} /> Evolution Chain
                    </h3>
                    <div className="bg-slate-900 rounded-lg p-4 border border-slate-700 flex items-center justify-center gap-2 md:gap-4 overflow-x-auto">
                        
                        {/* Previous */}
                        {prevEvo ? (
                            <div className="flex items-center gap-2 opacity-60 grayscale hover:grayscale-0 transition-all">
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-800 rounded-full flex items-center justify-center border border-slate-600 relative overflow-hidden">
                                        {renderEvoIcon(prevEvo.id)}
                                    </div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <ArrowRight size={16} className="text-slate-500" />
                                    <span className="text-[9px] text-slate-500 font-mono text-center w-12 truncate">{prevEvo.method}</span>
                                </div>
                            </div>
                        ) : null}

                        {/* Current */}
                        <div className="flex flex-col items-center relative">
                            <div className="w-14 h-14 md:w-16 md:h-16 bg-slate-700 rounded-full flex items-center justify-center border-2 border-yellow-500/50 shadow-lg overflow-hidden">
                                {isSeen ? (
                                    <img 
                                        src={p.imageUrl} 
                                        className={`w-10 h-10 md:w-12 md:h-12 object-contain ${!isRegistered ? 'brightness-0 opacity-60' : ''}`} 
                                    />
                                ) : (
                                    <span className="text-2xl font-bold text-slate-600">?</span>
                                )}
                            </div>
                            <span className="text-[10px] font-bold text-yellow-500 mt-1 uppercase">Current</span>
                        </div>

                        {/* Next */}
                        {nextEvos.length > 0 ? (
                            nextEvos.map((next, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <div className="flex flex-col items-center">
                                        <ArrowRight size={16} className="text-slate-500" />
                                        <span className="text-[9px] text-slate-500 font-mono text-center w-16 leading-tight break-words">{next.method}</span>
                                    </div>
                                    <div className="flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity">
                                        <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-800 rounded-full flex items-center justify-center border border-slate-600 overflow-hidden">
                                            {renderEvoIcon(next.id)}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-[10px] text-slate-600 font-mono ml-2 italic">No Evolution</div>
                        )}
                    </div>
                </div>

                {/* STATS SECTION: Toggles based on viewMode */}
                <div className="space-y-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xs text-slate-500 uppercase font-bold tracking-wider flex items-center gap-2">
                            {viewMode === 'pokedex' ? <BarChart3 size={14} /> : <Swords size={14} />}
                            {viewMode === 'pokedex' ? 'Species Base Stats' : 'Battle Potential (IVs)'}
                        </h3>
                        {viewMode === 'pokedex' ? (
                            <span className="text-xs text-slate-600 font-mono">RACE VALUES</span>
                        ) : (
                            <span className="text-xs text-slate-600 font-mono">MAX IV: 31</span>
                        )}
                    </div>
                    
                    {viewMode === 'pokedex' ? (
                        /* POKEDEX MODE: BASE STATS */
                        <div className="space-y-3 bg-slate-900 p-4 rounded-lg border border-slate-700">
                            {/* Hide stats with ??? if not registered */}
                            <StatRow label="HP" value={baseStats.hp} max={150} colorClass="bg-green-500" isHidden={!isRegistered} />
                            <StatRow label="ATK" value={baseStats.atk} max={150} colorClass="bg-red-500" isHidden={!isRegistered} />
                            <StatRow label="DEF" value={baseStats.def} max={150} colorClass="bg-blue-500" isHidden={!isRegistered} />
                        </div>
                    ) : (
                        /* PARTY/BACKPACK MODE: IVs (Only visible if registered - which it should be in party mode) */
                        isRegistered ? (
                            <>
                                <div className="space-y-3 bg-slate-900 p-4 rounded-lg border border-slate-700">
                                    <StatRow label="HP" value={p.ivs.hp || 0} max={31} colorClass="bg-green-500" suffix={` / 31`} />
                                    <StatRow label="ATK" value={p.ivs.atk || 0} max={31} colorClass="bg-red-500" suffix={` / 31`} />
                                    <StatRow label="DEF" value={p.ivs.def || 0} max={31} colorClass="bg-blue-500" suffix={` / 31`} />
                                </div>
                                <div className="flex justify-between items-center px-2">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <span className="text-xs uppercase font-bold tracking-wider">Total IV: {potential.totalIV}</span>
                                    </div>
                                    <div className="text-right flex items-center gap-1">
                                         {[1, 2, 3, 4, 5].map(starIndex => (
                                             <Star 
                                                key={starIndex}
                                                size={18}
                                                className={`${starIndex <= potential.stars ? "fill-yellow-400 text-yellow-400" : "text-slate-700 fill-slate-800"} drop-shadow-sm transition-all duration-300`}
                                             />
                                         ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="bg-slate-900 p-6 rounded-lg border border-slate-700 flex flex-col items-center text-slate-500 gap-2">
                                <HelpCircle size={32} className="opacity-20" />
                                <span className="text-xs font-mono uppercase">Catch to unlock potential</span>
                            </div>
                        )
                    )}
                </div>

                {isActivePartner && (
                    <div className="mt-6 text-center text-yellow-500 font-bold text-sm bg-yellow-500/10 py-3 rounded-lg border border-yellow-500/30 animate-pulse">
                        CURRENTLY IN BATTLE
                    </div>
                )}

                {/* Release Button (Only for Party Mode & if Release is allowed) */}
                {viewMode === 'party' && onRelease && canRelease && !isActivePartner && (
                    <button 
                        onClick={handleReleaseClick}
                        className="w-full mt-4 py-3 md:py-4 bg-red-900/80 hover:bg-red-700 text-red-100 font-bold rounded-xl border border-red-700 shadow-md flex items-center justify-center gap-2 transition-colors animate-in slide-in-from-bottom-2"
                    >
                        <Trash2 size={20} /> RELEASE POKEMON (GET $500)
                    </button>
                )}
                
                {/* Mobile Close Button (Bottom) */}
                <button 
                    onClick={() => { audioService.playSfx('click'); onClose(); }}
                    className="md:hidden w-full mt-4 py-3 bg-slate-700 text-white font-bold rounded-xl border border-slate-600 shadow-lg active:scale-95 transition-transform"
                >
                    CLOSE
                </button>
            </div>
        </div>
      </div>
    );
});