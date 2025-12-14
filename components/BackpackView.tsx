
import React, { useState, useEffect, memo } from 'react';
import { useShallow } from 'zustand/shallow';
import { Pokemon, InventorySlot, GameState } from '../types';
import { TYPE_COLORS } from '../constants';
import { ITEM_REGISTRY, EVOLUTION_ITEM_MAP } from '../data/itemData';
import { useGameStore } from '../store/useGameStore';
import { usePlayerStore } from '../store/usePlayerStore';
import { useBattleStore } from '../store/useBattleStore';
import { showToast } from '../store/useToastStore';
import { logic } from '../hooks/useGameLogic';
import { Briefcase, Zap, Heart, Sword, FlaskConical, Circle, Info, Coins, Trash2, Skull, AlertTriangle, GraduationCap } from 'lucide-react';
import { audioService } from '../services/audioService';
import { PokemonDetailModal } from './PokemonDetailModal';

// --- HELPERS ---

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

const getItemIcon = (id: string, category: string) => {
    if (category === 'BALL') return <Circle className={id === 'master-ball' ? 'text-purple-400' : (id === 'ultra-ball' ? 'text-yellow-400' : (id === 'great-ball' ? 'text-blue-400' : 'text-red-400'))} />;
    if (category === 'MEDICINE') return <FlaskConical className="text-pink-400" />;
    if (category === 'BATTLE') return <Sword className="text-orange-400" />;
    if (category === 'EVOLUTION') return <Zap className="text-green-400" />;
    if (id === 'exp-share') return <GraduationCap className="text-blue-300" />;
    return <Briefcase className="text-slate-400" />;
};

// Check if an item is usable on a specific pokemon
const checkUsability = (pokemon: Pokemon, itemSlot: InventorySlot | null): { usable: boolean, reason: string } => {
    if (!itemSlot) return { usable: true, reason: '' };
    
    const item = ITEM_REGISTRY[itemSlot.itemId];
    if (!item) return { usable: false, reason: 'Unknown Item' };

    if (item.id === 'exp-share') return { usable: true, reason: '' }; // Always usable (logic handled in handler)

    if (item.category === 'MEDICINE') {
        if (item.id === 'revive' || item.id === 'max-revive') {
            if (pokemon.currHp > 0) return { usable: false, reason: 'Not Fainted' };
            return { usable: true, reason: '' };
        } 
        else if (item.id === 'rare-candy') {
            if (pokemon.level >= 100) return { usable: false, reason: 'Max Level' };
            if (pokemon.currHp <= 0) return { usable: false, reason: 'Fainted' };
            return { usable: true, reason: '' };
        }
        else {
            // Potions
            if (pokemon.currHp === 0) return { usable: false, reason: 'Fainted' };
            if (pokemon.currHp >= pokemon.maxHp) return { usable: false, reason: 'HP Full' };
            return { usable: true, reason: '' };
        }
    }

    if (item.category === 'EVOLUTION') {
        const map = EVOLUTION_ITEM_MAP[pokemon.speciesId];
        if (map && map[item.id]) return { usable: true, reason: '' };
        return { usable: false, reason: 'Incompatible' };
    }

    return { usable: true, reason: '' };
};

// --- SUB-COMPONENTS ---

const InventoryItem = memo(({ slot, isBattle, isTrainerBattle, onClick }: { slot: InventorySlot, isBattle: boolean, isTrainerBattle: boolean, onClick: () => void }) => {
    const itemDef = ITEM_REGISTRY[slot.itemId];
    if (!itemDef) return null;
    const countDisplay = slot.itemId === 'poke-ball' ? '∞' : `x${slot.count}`;

    const showButton = (
        itemDef.category === 'MEDICINE' || 
        itemDef.category === 'EVOLUTION' ||
        itemDef.category === 'KEY' ||
        (itemDef.category === 'BALL' && isBattle && !isTrainerBattle && itemDef.id !== 'poke-ball') ||
        (itemDef.category === 'BATTLE' && isBattle)
    );

    return (
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center gap-4 hover:bg-slate-750 transition-colors">
            <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-600 relative shrink-0">
                    {getItemIcon(slot.itemId, itemDef.category)}
                    {itemDef.category === 'BALL' && (
                    <div className="absolute -bottom-1 -right-1 bg-black/50 rounded-full p-0.5">
                        <Info size={10} className="text-slate-400" />
                    </div>
                    )}
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold truncate">{itemDef.name}</h3>
                <p className="text-[10px] md:text-xs text-slate-400 line-clamp-2 leading-tight">{itemDef.description}</p>
                {itemDef.price > 0 && <p className="text-[10px] text-yellow-600 mt-1 font-mono">${itemDef.price}</p>}
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-xl font-mono font-bold text-white">{itemDef.category === 'KEY' ? 'Key' : countDisplay}</span>
                    {showButton && (
                        <button 
                        onClick={onClick}
                        className="px-3 py-1 text-xs font-bold rounded shadow-sm whitespace-nowrap transition-colors bg-green-600 hover:bg-green-500 text-white"
                        >
                        {itemDef.category === 'BALL' ? 'PREP' : 'USE'}
                        </button>
                    )}
            </div>
        </div>
    );
});

interface TeamMemberProps {
    pokemon: Pokemon;
    isEquipped: boolean;
    selectionModeItem: InventorySlot | null;
    isBattle: boolean;
    canRelease: boolean;
    onClick: () => void;
    onRequestRelease: (id: string, name: string) => void;
}

const TeamMember = memo(({ pokemon, isEquipped, selectionModeItem, isBattle, canRelease, onClick, onRequestRelease }: TeamMemberProps) => {
    const hpPct = (pokemon.currHp / pokemon.maxHp) * 100;
    const isFainted = pokemon.currHp <= 0;
    
    const { usable, reason } = checkUsability(pokemon, selectionModeItem);
    const isGrayedOut = selectionModeItem && !usable;

    const handleReleaseClick = (e: React.MouseEvent) => {
        e.stopPropagation(); 
        if (!canRelease) {
            showToast("You cannot release your last Pokemon!", "warning");
            return;
        }
        audioService.playSfx('click');
        onRequestRelease(pokemon.id, pokemon.name);
    };

    const handleEquip = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isFainted) {
            showToast("This Pokemon has fainted and cannot battle!", "warning");
            return;
        }
        logic.equipPokemon(pokemon);
    };

    const handleCardClick = () => {
        if (isGrayedOut) {
            audioService.playSfx('incorrect');
            showToast(`Cannot use item: ${reason}`, "warning");
            return;
        }
        onClick();
    };

    return (
      <div 
        onClick={handleCardClick}
        className={`
          relative bg-slate-800 rounded-xl p-4 border-4 transition-all cursor-pointer group
          ${isEquipped ? 'border-yellow-400 bg-slate-700' : 'border-slate-700 hover:bg-slate-750 hover:border-slate-500'}
          ${selectionModeItem && !isGrayedOut ? 'border-green-500 ring-2 ring-green-500/30' : ''}
          ${isGrayedOut ? 'opacity-50 grayscale' : ''}
        `}
      >
        {isEquipped && (
          <div className="absolute -top-3 -right-3 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded shadow-md z-10 flex items-center gap-1">
            <Zap size={12} fill="currentColor" /> EQUIPPED
          </div>
        )}

        {pokemon.isHoldingExpShare && (
            <div className="absolute -top-3 right-20 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded shadow-md z-10 flex items-center gap-1">
                <GraduationCap size={12} fill="currentColor" /> EXP
            </div>
        )}
        
        <div className="flex gap-4 items-center">
           <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center border-2 border-slate-600 relative overflow-hidden group-hover:scale-105 transition-transform">
              {isFainted ? <Skull className="text-slate-600" size={32} /> : <img src={pokemon.imageUrl} className="w-16 h-16 object-contain" />}
           </div>
           
           <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                 <div>
                   <h3 className="text-white font-bold truncate group-hover:text-yellow-400 transition-colors">{pokemon.name}</h3>
                   <div className="flex gap-1 mt-1">
                       <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold text-white ${TYPE_COLORS[pokemon.type]}`}>
                         {pokemon.type}
                       </span>
                       <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${getRarityStyle(pokemon.rarity)}`}>
                         {pokemon.rarity}
                       </span>
                   </div>
                 </div>
                 <span className="text-slate-400 text-xs font-mono">Lv.{pokemon.level}</span>
              </div>
              
              <div className="mt-3 space-y-1">
                 <div className="flex justify-between text-xs font-mono text-slate-300">
                    <span className="flex items-center gap-1">
                        {isFainted ? <span className="text-red-500 font-bold">FAINTED</span> : <><Heart size={10} className="text-green-400" /> HP</>}
                    </span>
                    <span>{Math.ceil(pokemon.currHp)}/{pokemon.maxHp}</span>
                 </div>
                 <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-600">
                    <div className={`h-full transition-all ${hpPct < 20 ? 'bg-red-500' : (hpPct < 50 ? 'bg-yellow-500' : 'bg-green-500')}`} style={{ width: `${hpPct}%` }}></div>
                 </div>
              </div>
           </div>
        </div>

        {!selectionModeItem && (
            <div className="mt-4 flex gap-2">
                {!isEquipped ? (
                <>
                    <button 
                        onClick={handleEquip}
                        className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm z-10"
                    >
                        {isBattle ? 'SWITCH IN' : 'SET PARTNER'}
                    </button>
                    
                    <button 
                        onClick={handleReleaseClick}
                        disabled={!canRelease}
                        className={`w-20 py-3 rounded-lg flex items-center justify-center gap-1 transition-colors border shadow-sm font-bold text-xs z-10
                            ${canRelease 
                                ? 'bg-red-900/80 hover:bg-red-700 text-white border-red-800' 
                                : 'bg-slate-800 text-slate-600 border-slate-700 cursor-not-allowed'}`}
                    >
                        <Trash2 size={16} /> FREE
                    </button>
                </>
                ) : (
                    <div className="w-full py-2 bg-slate-600 text-slate-400 text-center rounded font-bold text-sm cursor-default border border-slate-500/50">
                        Active Partner
                    </div>
                )}
            </div>
        )}
      </div>
    );
});

// --- MAIN COMPONENT ---

const BackpackView: React.FC = () => {
  // Use useShallow to prevent unnecessary re-renders and ensure updates are caught
  const { playerPokemon, caughtPokemon, inventory, money } = usePlayerStore(useShallow(state => ({
      playerPokemon: state.playerPokemon,
      caughtPokemon: state.caughtPokemon,
      inventory: state.inventory,
      money: state.money
  })));
  
  const { backpackTab, prevState, setGameState, setBackpackTab } = useGameStore(useShallow(state => ({
      backpackTab: state.backpackTab,
      prevState: state.prevState,
      setGameState: state.setGameState,
      setBackpackTab: state.setBackpackTab
  })));
  
  const { streak, isTrainerBattle } = useBattleStore(useShallow(state => ({
      streak: state.streak,
      isTrainerBattle: state.isTrainerBattle
  })));

  const [activeTab, setActiveTab] = useState<'TEAM' | 'ITEMS'>(backpackTab); 
  const [viewingPokemon, setViewingPokemon] = useState<Pokemon | null>(null);
  const [selectionModeItem, setSelectionModeItem] = useState<InventorySlot | null>(null);
  const [confirmRelease, setConfirmRelease] = useState<{ id: string, name: string } | null>(null);

  const isBattle = prevState === GameState.PAUSED || prevState === GameState.BATTLE_COMBAT;
  const mustSwitch = playerPokemon && playerPokemon.currHp <= 0;

  useEffect(() => {
      setActiveTab(backpackTab);
  }, [backpackTab]);

  const onClose = () => {
      if (prevState === GameState.PAUSED || 
          prevState === GameState.BATTLE_COMBAT || 
          prevState === GameState.DEFEAT) {
          setGameState(GameState.BATTLE_COMBAT); 
      } else {
          logic.findWildPokemon(streak); 
      }
  };

  const handleInitialUse = (item: InventorySlot) => {
      const itemDef = ITEM_REGISTRY[item.itemId];
      if (itemDef.category === 'MEDICINE' || itemDef.category === 'EVOLUTION' || itemDef.category === 'KEY') {
          setSelectionModeItem(item);
          setActiveTab('TEAM');
          audioService.playSfx('click');
      } else {
          logic.handleUseItem(item);
      }
  };

  const handleTeamMemberClick = (pokemon: Pokemon) => {
      if (selectionModeItem) {
          audioService.playSfx('click');
          logic.handleUseItem(selectionModeItem, pokemon.id);
      } else {
          audioService.playSfx('click'); 
          setViewingPokemon(pokemon);
      }
  };

  const handleReleaseFromModal = (id: string) => {
      setViewingPokemon(null);
      logic.handleReleasePokemon(id);
  };

  const handleRequestRelease = (id: string, name: string) => {
      setConfirmRelease({ id, name });
  };

  const confirmReleaseAction = () => {
      if (confirmRelease) {
          logic.handleReleasePokemon(confirmRelease.id);
          setConfirmRelease(null);
          audioService.playSfx('click');
      }
  };

  useEffect(() => {
      if (selectionModeItem) {
          const itemDef = ITEM_REGISTRY[selectionModeItem.itemId];
          if (itemDef.category !== 'KEY') {
              const stillHasItem = inventory.find(i => i.itemId === selectionModeItem.itemId);
              if (!stillHasItem) {
                  setSelectionModeItem(null);
              }
          }
      }
  }, [inventory, selectionModeItem]);

  const canRelease = caughtPokemon.length > 1;

  if (!playerPokemon) return null;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col font-mono text-white relative">
      
      {confirmRelease && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 p-4 animate-in fade-in duration-200" onClick={() => setConfirmRelease(null)}>
              <div className="bg-slate-800 border-4 border-slate-600 p-6 rounded-xl w-full max-w-sm text-center shadow-2xl relative" onClick={e => e.stopPropagation()}>
                  <h3 className="text-xl font-bold text-white mb-4">Release {confirmRelease.name}?</h3>
                  <div className="bg-slate-900 p-4 rounded mb-6 border border-slate-700">
                      <p className="text-slate-400 text-sm mb-2">You will receive <span className="text-yellow-400 font-bold">$500</span>.</p>
                      <p className="text-red-400 text-xs font-bold uppercase">This action cannot be undone!</p>
                  </div>
                  <div className="flex gap-4 justify-center">
                      <button onClick={() => { audioService.playSfx('click'); setConfirmRelease(null); }} className="px-4 py-3 bg-slate-600 text-white font-bold rounded-lg border-b-4 border-slate-700 active:border-b-0 active:translate-y-1 w-1/2">CANCEL</button>
                      <button onClick={confirmReleaseAction} className="px-4 py-3 bg-red-600 text-white font-bold rounded-lg border-b-4 border-red-800 active:border-b-0 active:translate-y-1 w-1/2">CONFIRM</button>
                  </div>
              </div>
          </div>
      )}

      {viewingPokemon && (
          <PokemonDetailModal 
            pokemon={viewingPokemon} 
            onClose={() => setViewingPokemon(null)} 
            playerPokemonId={playerPokemon.id}
            caughtSpeciesIds={caughtPokemon.map(p => p.speciesId)}
            seenSpeciesIds={caughtPokemon.map(p => p.speciesId)} 
            viewMode="party"
            onRelease={handleReleaseFromModal}
            canRelease={canRelease}
          />
      )}
      
      <div className="bg-slate-800 p-4 border-b border-slate-700 shadow-md sticky top-0 z-20">
         <div className="max-w-5xl mx-auto flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 font-pixel"><Briefcase className="text-yellow-400" /> BAG</h2>
            <div className="flex items-center gap-4">
                <div className="bg-black/30 px-3 py-1 rounded-full border border-yellow-500/30 flex items-center gap-2">
                    <Coins size={16} className="text-yellow-400" />
                    <span className="text-yellow-400 font-mono font-bold">${money}</span>
                </div>
                {!mustSwitch && (
                    <button onClick={() => { audioService.playSfx('click'); onClose(); }} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded font-bold">CLOSE</button>
                )}
            </div>
         </div>
         
         <div className="max-w-5xl mx-auto flex gap-4 mt-6">
            <button onClick={() => { audioService.playSfx('click'); setActiveTab('ITEMS'); setSelectionModeItem(null); setBackpackTab('ITEMS'); }}
               className={`flex-1 pb-2 px-4 font-bold transition-all border-b-4 text-center ${activeTab === 'ITEMS' ? 'border-yellow-400 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>ITEMS</button>
            <button onClick={() => { audioService.playSfx('click'); setActiveTab('TEAM'); setBackpackTab('TEAM'); }}
               className={`flex-1 pb-2 px-4 font-bold transition-all border-b-4 text-center ${activeTab === 'TEAM' ? 'border-yellow-400 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>POKEMON</button>
         </div>
      </div>

      {mustSwitch && (
          <div className="bg-red-600 text-white font-bold p-2 text-center animate-pulse sticky top-[130px] z-20 shadow-lg flex items-center justify-center gap-2">
              <AlertTriangle /> MUST SWAP TO A HEALTHY POKEMON!
          </div>
      )}

      {selectionModeItem && (
          <div className="bg-slate-800 border-b border-slate-700 p-2 text-center sticky top-[130px] z-10">
              <span className="text-sm text-green-400 font-bold mr-2">Using {ITEM_REGISTRY[selectionModeItem.itemId].name}...</span>
              <button onClick={() => setSelectionModeItem(null)} className="text-xs underline text-slate-400">Cancel</button>
          </div>
      )}

      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
         <div className="max-w-5xl mx-auto">
            {activeTab === 'TEAM' && !selectionModeItem && (
                <div className="mb-4 text-xs text-slate-400 text-center font-mono">
                    TAP CARD FOR DETAILS • TAP BUTTONS TO EQUIP/RELEASE
                </div>
            )}
            
            {activeTab === 'TEAM' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {caughtPokemon.map(p => (
                        <TeamMember key={p.id} pokemon={p} isEquipped={playerPokemon.id === p.id} selectionModeItem={selectionModeItem}
                            isBattle={isBattle} canRelease={canRelease} onClick={() => handleTeamMemberClick(p)} onRequestRelease={handleRequestRelease} />
                    ))}
                </div>
            ) : (
                inventory.length === 0 ? (
                    <div className="text-center py-20 text-slate-500 font-pixel">NO ITEMS IN BAG</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {inventory.map((slot) => (
                            <InventoryItem key={slot.itemId} slot={slot} isBattle={isBattle} isTrainerBattle={isTrainerBattle} onClick={() => handleInitialUse(slot)} />
                        ))}
                    </div>
                )
            )}
         </div>
      </div>
    </div>
  );
};

export default BackpackView;
