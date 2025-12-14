
import React, { memo } from 'react';
import { Pokemon, Trainer } from '../../types';
import { ITEM_REGISTRY } from '../../data/itemData';
import { getRarityOdds } from '../../services/pokemonGenService';
import { getBaseCatchRateLabel } from './BattleAssets';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useGameStore } from '../../store/useGameStore';
import { Info, X, Star, User, Coins, Gift, Lock } from 'lucide-react';

interface BattleInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    playerLevel: number;
    enemyPokemon: Pokemon;
    streak: number;
    targetStreak: number; // NOTE: This prop coming from BattleScreen might still be raw math, so we recalculate here for consistency
    isTrainerBattle: boolean;
    trainerName?: string;
    enemyTeamCount: number;
    currentTrainer: Trainer | null;
}

const getTierColor = (tier: string) => {
    if (tier === 'Master') return 'text-yellow-400';
    if (tier === 'Elite') return 'text-purple-400';
    return 'text-slate-200';
};

export const BattleInfoModal = memo(({ 
    isOpen, onClose, playerLevel, enemyPokemon, streak, 
    isTrainerBattle, trainerName, enemyTeamCount, currentTrainer 
}: BattleInfoModalProps) => {
    if (!isOpen) return null;

    const odds = getRarityOdds(playerLevel);
    const catchRateInfo = getBaseCatchRateLabel(enemyPokemon.rarity);
    
    // Recalculate Logic for Modal Consistency
    const { badges: badgesOwned } = usePlayerStore.getState();
    const { selectedTopic } = useGameStore.getState();
    
    const gen1Badges = ['boulder', 'cascade', 'thunder', 'rainbow', 'soul', 'marsh', 'volcano', 'earth'];
    const gen2Badges = ['zephyr', 'hive', 'plain', 'fog', 'storm', 'mineral', 'glacier', 'rising'];
    const relevantBadges = selectedTopic === 'linear' ? gen1Badges : gen2Badges;
    const currentBadgeCount = badgesOwned.filter(b => relevantBadges.includes(b)).length;
    const nextGymStreak = Math.min(40, (currentBadgeCount + 1) * 5);
    const isChampion = currentBadgeCount >= 8;

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div className="bg-slate-800 w-full max-w-md rounded-xl border-4 border-slate-600 shadow-2xl p-6 relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-white hover:bg-white/10 rounded-full p-1"><X /></button>
                
                <h3 className="text-xl font-bold text-white mb-6 font-pixel flex items-center gap-2">
                    <Info className="text-blue-400" /> {isTrainerBattle ? 'TRAINER INTEL' : 'BATTLE ODDS'}
                </h3>

                {/* SECTION 1: BATTLE STATUS */}
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 mb-6">
                    <h4 className="text-yellow-400 font-bold mb-2 text-sm uppercase tracking-wider flex items-center gap-2">
                        <Star size={14} className="fill-yellow-400" /> {enemyPokemon.isLegendary ? 'Legendary Encounter' : (isTrainerBattle ? 'Gym Challenge' : 'League Progress')}
                    </h4>
                    
                    {!isTrainerBattle && (
                        <>
                            <div className="flex justify-between items-end mb-1">
                                <span className="text-white text-lg font-bold">
                                    {isChampion ? `${streak} Wins (Champion)` : `${streak} / ${nextGymStreak} Wins`}
                                </span>
                                <span className="text-slate-400 text-xs">
                                    {isChampion ? 'Endless Mode' : 'Next Gym Leader'}
                                </span>
                            </div>
                            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div className="h-full bg-yellow-500 transition-all duration-500" style={{ width: `${Math.min(100, (streak / nextGymStreak) * 100)}%` }}></div>
                            </div>
                            <p className="text-slate-500 text-xs mt-2 italic">
                                {isChampion 
                                    ? "You have defeated all Gym Leaders! Test your limits." 
                                    : "Reach the target streak to challenge the next Gym Leader and earn a Badge!"}
                            </p>
                        </>
                    )}
                    
                    {isTrainerBattle && (
                         <div className="text-white font-bold text-lg">
                             Current Streak: {streak}
                         </div>
                    )}
                </div>

                {/* SECTION 2: ENCOUNTER ODDS or TRAINER INFO */}
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                     <div className="flex justify-between items-center mb-3">
                         <h4 className="text-blue-400 font-bold text-sm uppercase tracking-wider">
                             {isTrainerBattle ? 'Opponent Details' : `Spawn Rates (Lv.${playerLevel})`}
                         </h4>
                     </div>
                     
                     {isTrainerBattle ? (
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <User className="text-white" size={24} />
                                <div>
                                    <div className="text-white font-bold">{trainerName}</div>
                                    <div className="text-slate-400 text-xs">Enemy Trainer</div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-slate-800 rounded">
                                <span className="text-slate-300 text-sm font-bold">Team Size</span>
                                <span className="text-white font-mono font-bold">{enemyTeamCount} Pokemon</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-slate-800 rounded">
                                <span className="text-slate-300 text-sm font-bold">Rank</span>
                                <span className={`font-mono font-bold uppercase ${getTierColor(currentTrainer?.tier || 'Common')}`}>
                                    {currentTrainer?.tier || 'Unknown'}
                                </span>
                            </div>
                            {/* Prize Info */}
                            <div className="flex justify-between items-center p-2 bg-slate-800 rounded border border-yellow-500/20">
                                <span className="text-yellow-500 text-sm font-bold flex items-center gap-1"><Coins size={14}/> Cash Prize</span>
                                <span className="text-white font-mono font-bold">${currentTrainer?.baseMoney}</span>
                            </div>
                            {/* Item Drops */}
                            <div className="bg-slate-800 p-2 rounded border border-slate-600">
                                <span className="text-slate-400 text-xs font-bold uppercase flex items-center gap-1 mb-2"><Gift size={12}/> Potential Drops</span>
                                {currentTrainer?.rewardItems && currentTrainer.rewardItems.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {currentTrainer.rewardItems.map((drop, idx) => (
                                            <span key={idx} className="text-xs bg-black/40 px-2 py-1 rounded text-white border border-slate-600">
                                                {ITEM_REGISTRY[drop.itemId]?.name || drop.itemId} <span className="text-slate-500">({Math.round(drop.chance * 100)}%)</span>
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-xs text-slate-500 italic">No item drops</span>
                                )}
                            </div>
                        </div>
                     ) : (
                        <div className="space-y-4">
                            {/* CURRENT TARGET INFO */}
                            <div className="border-b border-slate-700 pb-4">
                                <h5 className="text-slate-400 text-xs font-bold uppercase mb-2">Current Target ({enemyPokemon.rarity})</h5>
                                <div className="flex justify-between items-center p-2 bg-slate-800 rounded">
                                    <span className="text-slate-300 text-sm font-bold">Base Catch Rate</span>
                                    <span className={`font-mono font-bold ${catchRateInfo.color}`}>{catchRateInfo.label}</span>
                                </div>
                                <p className="text-[10px] text-slate-500 mt-1">
                                    Tip: Lower HP and better balls increase this chance!
                                </p>
                            </div>

                            {/* SPAWN TABLE */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center p-2 bg-slate-800 rounded">
                                    <span className="text-slate-300 text-sm font-bold">Common</span>
                                    <span className="text-white font-mono">{odds.Common}%</span>
                                </div>
                                <div className={`flex justify-between items-center p-2 rounded ${odds.Rare > 0 ? 'bg-slate-800' : 'bg-slate-800/50 opacity-50'}`}>
                                    <span className="text-blue-300 text-sm font-bold flex items-center gap-2">Rare {odds.Rare === 0 && <Lock size={10}/>}</span>
                                    <span className="text-white font-mono">{odds.Rare}%</span>
                                </div>
                                <div className={`flex justify-between items-center p-2 rounded ${odds.Elite > 0 ? 'bg-slate-800' : 'bg-slate-800/50 opacity-50'}`}>
                                    <span className="text-purple-300 text-sm font-bold flex items-center gap-2">Elite {odds.Elite === 0 && <Lock size={10}/>}</span>
                                    <span className="text-white font-mono">{odds.Elite}%</span>
                                </div>
                                <div className={`flex justify-between items-center p-2 rounded ${odds.Ultra > 0 ? 'bg-slate-800 border border-red-900/30' : 'bg-slate-800/50 opacity-50'}`}>
                                    <span className="text-red-400 text-sm font-bold flex items-center gap-2">Ultra {odds.Ultra === 0 && <Lock size={10}/>}</span>
                                    <span className="text-white font-mono">{odds.Ultra}%</span>
                                </div>
                                <div className={`flex justify-between items-center p-2 rounded ${odds.Legendary > 0 ? 'bg-slate-800 border border-yellow-900/30' : 'bg-slate-800/50 opacity-50'}`}>
                                    <span className="text-yellow-400 text-sm font-bold flex items-center gap-2">Legendary {odds.Legendary === 0 && <Lock size={10}/>}</span>
                                    <span className="text-white font-mono">{odds.Legendary}%</span>
                                </div>
                            </div>
                        </div>
                     )}

                     {!isTrainerBattle && (odds.nextTierLevel > 0 ? (
                         <div className="mt-3 pt-3 border-t border-slate-800 text-center">
                             <p className="text-xs text-green-400 font-bold">
                                 Reach Level {odds.nextTierLevel} for better odds!
                             </p>
                         </div>
                     ) : (
                         <div className="mt-3 pt-3 border-t border-slate-800 text-center">
                             <p className="text-xs text-yellow-500 font-bold">
                                 MAXIMUM RARITY ODDS REACHED!
                             </p>
                         </div>
                     ))}
                </div>
            </div>
        </div>
    );
});
