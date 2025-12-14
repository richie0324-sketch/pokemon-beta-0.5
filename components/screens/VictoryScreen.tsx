
import React from 'react';
import { useShallow } from 'zustand/shallow';
import { Pokemon, InventorySlot, GameState } from '../../types';
import { ITEM_REGISTRY } from '../../data/itemData';
import { audioService } from '../../services/audioService';
import { useGameStore } from '../../store/useGameStore';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useBattleStore } from '../../store/useBattleStore';
import { logic } from '../../hooks/useGameLogic';
import { Backpack, Coins, Gift, ArrowUp, Flag } from 'lucide-react';

export const VictoryScreen: React.FC = () => {
    const { gameState, activeQuest, completeQuest } = useGameStore(useShallow(state => ({
        gameState: state.gameState,
        activeQuest: state.activeQuest,
        completeQuest: state.completeQuest
    })));
    const playerPokemon = usePlayerStore(state => state.playerPokemon);
    const { enemyPokemon, streak, lastRewards } = useBattleStore(useShallow(state => ({
        enemyPokemon: state.enemyPokemon,
        streak: state.streak,
        lastRewards: state.lastRewards
    })));

    const isDefeat = gameState === GameState.DEFEAT;
    const isFainted = isDefeat && playerPokemon && playerPokemon.currHp <= 0;
    const isEscaped = isDefeat && !isFainted;
    
    // Check if we just defeated the Quest Boss
    // The quest is NOT cleared in battles.ts anymore, so activeQuest is still valid here.
    const isBossVictory = activeQuest && enemyPokemon && enemyPokemon.speciesId === activeQuest.bossSpeciesId && !isDefeat;
    
    const onContinue = () => {
        if (isFainted) { 
            logic.healPartyAfterDefeat(true);
        } else if (isEscaped) {
            logic.findWildPokemon(0, undefined, true); 
        } else if (isBossVictory) {
            // CRITICAL FIX: Clear the quest state here, THEN spawn normal wild pokemon
            completeQuest();
            // Start a new random encounter to exit the "dungeon" loop
            logic.findWildPokemon(streak); 
        } else { 
            // Mid-dungeon or normal play
            logic.findWildPokemon(streak); 
        }
    };
    
    const onOpenBackpack = () => {
        if (isFainted) {
            logic.healPartyAfterDefeat(true);
        } else {
            useGameStore.getState().setBackpackTab('ITEMS');
            useGameStore.getState().setGameState(GameState.BACKPACK, GameState.MENU_MAIN);
        }
    };

    let bgClass = 'bg-green-800';
    let titleText = 'VICTORY!';
    let titleColor = 'text-yellow-300';
    
    if (isFainted) {
        bgClass = 'bg-red-900';
        titleText = 'DEFEATED';
        titleColor = 'text-black';
    } else if (isEscaped) {
        bgClass = 'bg-orange-800';
        titleText = 'ESCAPED!';
        titleColor = 'text-white';
    } else if (isBossVictory) {
        bgClass = 'bg-yellow-900';
        titleText = 'QUEST COMPLETE!';
        titleColor = 'text-yellow-400';
    } else if (activeQuest) {
        // Dungeon mid-state theme
        bgClass = activeQuest.bossSpeciesId === 250 ? 'bg-amber-900' : 'bg-blue-900'; 
        titleText = 'FLOOR CLEARED';
    }

    return (
      <div className={`min-h-screen ${bgClass} flex flex-col items-center justify-center p-4 md:p-8 text-white text-center transition-colors duration-1000`}>
           <h2 className={`text-4xl md:text-7xl font-pixel mb-6 md:mb-8 animate-bounce ${titleColor}`}>{titleText}</h2>
           
           {/* DUNGEON PROGRESS BAR (Hidden if Boss Victory) */}
           {activeQuest && !isDefeat && !isBossVictory && (
                <div className="mb-4 md:mb-6 w-full max-w-sm bg-black/40 p-3 md:p-4 rounded-xl border-2 border-yellow-500/50 backdrop-blur-sm shadow-lg animate-in slide-in-from-bottom-4">
                    <h3 className="text-yellow-400 font-bold font-pixel text-xs md:text-sm mb-2 uppercase tracking-widest flex justify-between">
                        <span>{activeQuest.bossSpeciesId === 250 ? "Bell Tower" : "Whirl Islands"}</span>
                        <span>Floor {activeQuest.currentProgress} / {activeQuest.requiredProgress}</span>
                    </h3>
                    <div className="w-full bg-slate-900/80 h-3 rounded-full overflow-hidden border border-slate-600 mb-2 relative">
                        <div 
                            className="h-full bg-gradient-to-r from-yellow-700 to-yellow-400 transition-all duration-1000 ease-out" 
                            style={{ width: `${Math.min(100, (activeQuest.currentProgress / activeQuest.requiredProgress) * 100)}%` }}
                        />
                    </div>
                    <p className="text-slate-300 font-mono text-[10px] md:text-xs italic">
                        {activeQuest.currentProgress >= activeQuest.requiredProgress 
                            ? "The presence is overwhelming... The Guardian is coming!" 
                            : `Continue battling to summon ${activeQuest.bossName}!`}
                    </p>
                </div>
           )}

           {enemyPokemon && !isDefeat && !lastRewards && (
               <div className="mb-6 md:mb-8">
                   <p className="text-lg md:text-xl font-mono mb-2 md:mb-4">You caught</p>
                   <img src={enemyPokemon.imageUrl} className="w-32 h-32 md:w-40 md:h-40 mx-auto object-contain drop-shadow-2xl animate-float" />
                   <p className="text-xl md:text-2xl font-bold uppercase mt-2">{enemyPokemon.name}</p>
               </div>
           )}

           {lastRewards && (
               <div className="mb-6 md:mb-8 bg-slate-800 p-4 md:p-6 rounded-xl border-4 border-yellow-500 shadow-2xl animate-pop-in w-full max-w-sm">
                   <h3 className="text-lg md:text-xl font-bold text-yellow-400 mb-3 md:mb-4 font-pixel uppercase tracking-widest">Rewards</h3>
                   <div className="space-y-2 md:space-y-3">
                       <div className="flex items-center justify-between p-2 md:p-3 bg-slate-700 rounded-lg">
                           <span className="flex items-center gap-2 text-yellow-300 font-bold text-sm md:text-base"><Coins size={16} /> Cash</span>
                           <span className="text-xl md:text-2xl font-mono font-bold text-white">+${lastRewards.money}</span>
                       </div>
                       {lastRewards.items.length > 0 && (
                           <div className="flex flex-col gap-2">
                               {lastRewards.items.map((item, i) => (
                                   <div key={i} className="flex items-center justify-between p-2 md:p-3 bg-slate-700 rounded-lg border border-blue-500/30">
                                       <span className="flex items-center gap-2 text-blue-300 font-bold text-sm md:text-base"><Gift size={16}/> {ITEM_REGISTRY[item.itemId].name}</span>
                                       <span className="font-mono font-bold text-white text-sm md:text-base">x{item.count}</span>
                                   </div>
                               ))}
                           </div>
                       )}
                   </div>
               </div>
           )}

           {!lastRewards && !activeQuest && (
               <div className="bg-black/30 p-4 md:p-6 rounded-xl backdrop-blur-sm max-w-md w-full mb-6 md:mb-8 border border-white/10">
                   {isFainted && <p className="text-base md:text-lg font-bold text-red-300">Your Pokemon fainted!</p>}
                   {isEscaped && <p className="text-base md:text-lg font-bold text-orange-200">The wild {enemyPokemon?.name} ran away!</p>}
                   {!isDefeat && (
                       <div className="flex justify-around text-center">
                           <div>
                               <p className="text-xs uppercase opacity-75 mb-1">Streak</p>
                               <p className="text-2xl md:text-3xl font-pixel text-yellow-400">{streak}</p>
                           </div>
                       </div>
                   )}
               </div>
           )}

           <div className="flex flex-col gap-3 md:gap-4 w-full max-w-xs z-10">
               <button onClick={() => { audioService.playSfx('click'); onContinue(); }} className="py-3 md:py-4 bg-white text-black font-bold rounded-xl shadow-xl hover:scale-105 transition-transform text-base md:text-lg flex items-center justify-center gap-2">
                   {isFainted ? 'RECOVER & RETURN' : 
                        (isBossVictory ? 'LEAVE DUNGEON' : 
                            (activeQuest ? 'ASCEND NEXT FLOOR' : 'CONTINUE JOURNEY')
                        )
                   }
                   {activeQuest && !isBossVictory && <ArrowUp size={20} className="animate-bounce" />}
                   {isBossVictory && <Flag size={20} />}
               </button>
               <button onClick={() => { audioService.playSfx('click'); onOpenBackpack(); }} className="py-3 bg-black/40 text-white font-bold rounded-xl hover:bg-black/60 transition-colors flex items-center justify-center gap-2 text-sm md:text-base">
                   <Backpack size={18} /> OPEN BACKPACK
               </button>
           </div>
      </div>
    );
};
