
import React, { useState, useMemo, useEffect } from 'react';
import { Pokemon, PokemonType, PokemonRarity, GameState } from '../types';
import { TYPE_COLORS } from '../constants';
import { POKEDEX_REGISTRY } from '../data/pokedexData';
import { POKEMON_DESCRIPTIONS } from '../data/flavorText';
import { useGameStore } from '../store/useGameStore';
import { usePlayerStore } from '../store/usePlayerStore';
import { Backpack, ChevronLeft, ChevronRight, X, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { audioService } from '../services/audioService';
import { PokemonDetailModal } from './PokemonDetailModal';

const ITEMS_PER_PAGE = 12;

const PokedexView: React.FC = () => {
  const { setGameState, prevState, selectedTopic } = useGameStore();
  const { caughtPokemon, seenSpeciesIds, caughtHistory } = usePlayerStore();

  const [filter, setFilter] = useState<PokemonType | 'ALL'>('ALL');
  const [rarityFilter, setRarityFilter] = useState<PokemonRarity | 'ALL'>('ALL');
  const [page, setPage] = useState(0);
  const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const targetGen = selectedTopic === 'linear' ? 1 : 2;
  const regionName = targetGen === 1 ? 'KANTO' : 'JOHTO';

  const safeCaught = Array.isArray(caughtPokemon) ? caughtPokemon : [];
  const safeSeen: number[] = Array.isArray(seenSpeciesIds) ? seenSpeciesIds : [];
  const safeHistory: number[] = (caughtHistory && caughtHistory.length > 0) ? caughtHistory : safeCaught.map(p => p.speciesId);

  const historyIdsSet = useMemo(() => new Set<number>(safeHistory), [safeHistory]);
  const seenIdsSet = useMemo(() => new Set<number>(safeSeen), [safeSeen]);

  const onClose = () => {
    setGameState(prevState);
  };
  
  useEffect(() => {
      setPage(0);
  }, [filter, rarityFilter]);

  const regionList = useMemo(() => POKEDEX_REGISTRY.filter(p => p.generation === targetGen), [targetGen]);

  const filteredList = regionList.filter(entry => {
      const typeMatch = filter === 'ALL' || entry.type === filter;
      const rarityMatch = rarityFilter === 'ALL' || entry.rarity === rarityFilter;
      return typeMatch && rarityMatch;
  });

  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE);
  const effectivePage = Math.min(page, Math.max(0, totalPages - 1));
  const startIdx = effectivePage * ITEMS_PER_PAGE;
  const currentList = filteredList.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const { caughtCounts, regionCaughtCount, regionSeenCount } = useMemo(() => {
      const counts: Record<string, number> = {};
      let caughtCount = 0;
      let seenCount = 0;
      safeCaught.forEach(p => { if (p?.name) counts[p.name] = (counts[p.name] || 0) + 1; });
      regionList.forEach(p => {
          if (historyIdsSet.has(p.speciesId)) caughtCount++;
          if (seenIdsSet.has(p.speciesId)) seenCount++;
      });
      return { caughtCounts: counts, regionCaughtCount: caughtCount, regionSeenCount: seenCount };
  }, [safeCaught, seenIdsSet, historyIdsSet, regionList]);

  const handleCardClick = (id: number, isSeen: boolean) => {
    if (isSeen) {
      audioService.playSfx('click');
      setSelectedEntryId(id);
    } else {
      audioService.playSfx('incorrect');
    }
  };

  const getRarityColor = (r: PokemonRarity | 'ALL') => {
      switch(r) {
          case 'Common': return 'bg-slate-500 text-white';
          case 'Rare': return 'bg-blue-500 text-white';
          case 'Elite': return 'bg-purple-600 text-white';
          case 'Ultra': return 'bg-red-600 text-white';
          case 'Legendary': return 'bg-yellow-500 text-black';
          default: return 'bg-white text-slate-900';
      }
  };

  const selectedPokemon = useMemo(() => {
      if (!selectedEntryId) return null;
      const caughtInstance = safeCaught.find(p => p.speciesId === selectedEntryId);
      if (caughtInstance) return caughtInstance;
      
      const entry = POKEDEX_REGISTRY.find(p => p.speciesId === selectedEntryId);
      if (!entry) return null;
      
      return {
          id: 'mock', speciesId: entry.speciesId, name: entry.name, type: entry.type,
          rarity: entry.rarity, level: 1, maxHp: entry.baseStats.hp, currHp: entry.baseStats.hp, 
          attack: entry.baseStats.atk, defense: entry.baseStats.def,
          ivs: { hp: 0, atk: 0, def: 0 }, exp: 0, maxExp: 100,
          description: POKEMON_DESCRIPTIONS[entry.speciesId] || "Data has not been registered.",
          imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${entry.speciesId}.png`,
          isLegendary: entry.rarity === 'Legendary'
      } as Pokemon;
  }, [selectedEntryId, safeCaught]);

  return (
    <div className="min-h-screen bg-slate-900 font-mono flex flex-col">
      {selectedPokemon && (
          <PokemonDetailModal 
            pokemon={selectedPokemon} onClose={() => setSelectedEntryId(null)}
            caughtSpeciesIds={Array.from(historyIdsSet)} seenSpeciesIds={Array.from(seenIdsSet)} viewMode="pokedex" />
      )}
      
      <div className="bg-slate-800 p-4 border-b border-slate-700 shadow-md sticky top-0 z-20">
          <div className="max-w-6xl mx-auto flex flex-col gap-4">
              <div className="flex flex-row justify-between items-center gap-4">
                  <div className="flex flex-col">
                      <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2 font-pixel">
                          <Backpack className="text-yellow-400" size={20} /> {regionName} POKEDEX 
                      </h2>
                      <div className="text-slate-400 text-[10px] md:text-xs font-mono mt-1 flex gap-4">
                          <span>SEEN: <span className="text-white font-bold">{regionSeenCount}</span></span>
                          <span className="text-yellow-400">CAUGHT: {regionCaughtCount}</span>
                      </div>
                  </div>
                  <div className="flex gap-2">
                      <button onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)} className={`md:hidden px-3 py-2 rounded font-bold flex items-center gap-1 transition-colors ${isMobileFilterOpen ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                          <Filter size={16} /> {isMobileFilterOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      <button onClick={() => { audioService.playSfx('click'); onClose(); }} className="px-4 md:px-6 py-2 bg-slate-600 text-white rounded hover:bg-slate-500 font-bold flex items-center gap-1">
                          <span className="hidden md:inline">CLOSE</span> <X size={18} />
                      </button>
                  </div>
              </div>
              
              <div className={`${isMobileFilterOpen ? 'block' : 'hidden'} md:block space-y-4 pt-2 md:pt-0 animate-in slide-in-from-top-2 duration-200`}>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide no-scrollbar">
                      <span className="text-[10px] text-slate-500 font-bold mr-1 uppercase shrink-0">RARITY</span>
                      {(['ALL', 'Common', 'Rare', 'Elite', 'Ultra', 'Legendary'] as const).map(r => (
                           <button key={r} onClick={() => { audioService.playSfx('click'); setRarityFilter(r); }}
                              className={`px-3 py-1 rounded text-[10px] font-bold whitespace-nowrap transition-all border
                              ${rarityFilter === r ? getRarityColor(r) + ' border-transparent ring-2 ring-white/50' : 'bg-slate-800 text-slate-400 border-slate-600 hover:border-slate-400'}`}>
                              {r}
                           </button>
                      ))}
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
                      <span className="text-[10px] text-slate-500 font-bold mr-1 uppercase shrink-0">TYPE</span>
                      <button onClick={() => { audioService.playSfx('click'); setFilter('ALL'); }}
                          className={`px-3 py-1 rounded text-[10px] font-bold whitespace-nowrap transition-all border
                          ${filter === 'ALL' ? 'bg-white text-slate-900 border-white' : 'bg-slate-800 text-slate-400 border-slate-600 hover:border-slate-400'}`}>
                          ALL
                      </button>
                      {Object.values(PokemonType).filter(type => targetGen === 2 || (type !== PokemonType.STEEL && type !== PokemonType.DARK)).map(type => (
                          <button key={type} onClick={() => { audioService.playSfx('click'); setFilter(type); }}
                              className={`px-3 py-1 rounded text-[10px] font-bold whitespace-nowrap transition-all border
                              ${filter === type ? TYPE_COLORS[type] + ' text-white border-transparent' : 'bg-slate-800 text-slate-400 border-slate-600 hover:border-slate-400'}`}>
                              {type}
                          </button>
                      ))}
                  </div>
              </div>
          </div>
      </div>

      <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-slate-900">
          <div className="max-w-6xl mx-auto">
              {currentList.length === 0 ? (
                <div className="text-center text-slate-600 mt-20 font-pixel flex flex-col items-center gap-4"><Filter size={48} className="opacity-20" />NO POKEMON FOUND</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-6">
                  {currentList.map((entry) => {
                      const count = caughtCounts[entry.name] || 0;
                      const isCaught = count > 0;
                      const isRegistered = historyIdsSet.has(entry.speciesId);
                      const isSeen = seenIdsSet.has(entry.speciesId) || isRegistered;
                      const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${entry.speciesId}.png`;
                      
                      return (
                      <button key={entry.speciesId} onClick={() => handleCardClick(entry.speciesId, isSeen)} disabled={!isSeen}
                          className={`relative bg-slate-800 rounded-xl overflow-hidden transition-all duration-300 text-left w-full pb-2
                          ${isSeen ? 'shadow-lg hover:-translate-y-1 cursor-pointer ring-2 ring-transparent hover:ring-white active:scale-95' : ''}
                          ${!isSeen ? 'opacity-50 cursor-not-allowed border border-slate-700' : 'border border-slate-600'}
                          ${isCaught ? 'ring-2 ring-yellow-500/50' : (isRegistered ? 'ring-2 ring-blue-500/30' : '')}`}>
                          <div className={`h-12 md:h-16 ${isSeen ? TYPE_COLORS[entry.type] : 'bg-slate-700'}`}></div>
                          <div className="absolute top-3 md:top-4 left-1/2 -translate-x-1/2 w-16 h-16 md:w-20 md:h-20 bg-slate-900 rounded-full p-2 border-4 border-slate-800">
                              <img src={imageUrl} className={`w-full h-full object-contain transition-all duration-500 
                                  ${isRegistered ? '' : 'brightness-0 opacity-60'} ${!isSeen ? 'hidden' : ''}`} loading="lazy" />
                              {!isSeen && <div className="absolute inset-0 flex items-center justify-center text-slate-700 font-bold text-2xl">?</div>}
                          </div>
                          <div className="pt-8 md:pt-10 pb-2 px-2 text-center">
                              <p className={`font-bold truncate text-xs md:text-sm mb-2 ${isRegistered ? 'text-white' : 'text-slate-500'}`}>
                                  {isRegistered ? entry.name : (isSeen ? entry.name : `No. ${entry.speciesId}`)}
                              </p>
                              <div className="flex flex-col gap-1.5 items-center justify-center w-full">
                                {isRegistered ? (
                                    <>
                                        {isCaught ? (
                                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-bold bg-yellow-500 text-yellow-900 w-fit shadow-sm">
                                                OWN <span className="bg-yellow-900 text-yellow-400 px-1.5 rounded-full text-[9px]">x{count}</span>
                                            </div>
                                        ) : (
                                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-bold bg-blue-900 text-blue-300 w-fit shadow-sm border border-blue-700">CAUGHT</div>
                                        )}
                                        <div className="flex gap-1 justify-center">
                                            <div className={`px-2 py-0.5 rounded-full text-[9px] font-bold border border-white/20 w-fit shadow-sm ${getRarityColor(entry.rarity)}`}>{entry.rarity.toUpperCase()}</div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] md:text-[10px] font-bold bg-slate-700 text-slate-500 border border-slate-600">{isSeen ? 'SEEN' : '???'}</div>
                                )}
                              </div>
                          </div>
                      </button>
                      );
                  })}
                </div>
              )}
          </div>
      </div>
      <div className="bg-slate-800 p-4 border-t border-slate-700 sticky bottom-0 z-20">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <button onClick={() => { audioService.playSfx('click'); setPage(p => Math.max(0, p - 1)); }} disabled={effectivePage === 0}
                className="flex items-center gap-1 px-4 py-2 rounded bg-slate-700 text-white hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed font-bold transition-all text-xs md:text-sm">
                <ChevronLeft size={16} /> PREV
            </button>
            <span className="font-mono text-slate-400 text-xs md:text-sm">
                PAGE <span className="text-white font-bold">{effectivePage + 1}</span> / <span className="text-white font-bold">{Math.max(1, totalPages)}</span>
            </span>
            <button onClick={() => { audioService.playSfx('click'); setPage(p => Math.min(totalPages - 1, p + 1)); }} disabled={effectivePage >= totalPages - 1}
                className="flex items-center gap-1 px-4 py-2 rounded bg-slate-700 text-white hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed font-bold transition-all text-xs md:text-sm">
                NEXT <ChevronRight size={16} />
            </button>
          </div>
      </div>
    </div>
  );
};

export default PokedexView;
