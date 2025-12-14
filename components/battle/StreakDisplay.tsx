
import React, { memo } from 'react';
import { useShallow } from 'zustand/shallow';
import { useBattleStore } from '../../store/useBattleStore';
import { useGameStore } from '../../store/useGameStore';
import { usePlayerStore } from '../../store/usePlayerStore';
import { audioService } from '../../services/audioService';
import { Star, Info, Crown } from 'lucide-react';

interface StreakDisplayProps {
    onClick: () => void;
    className?: string;
}

export const StreakDisplay = memo(({ onClick, className }: StreakDisplayProps) => {
    const { streak, isTrainerBattle } = useBattleStore(useShallow(state => ({
        streak: state.streak,
        isTrainerBattle: state.isTrainerBattle
    })));
    
    const activeQuest = useGameStore(state => state.activeQuest);
    
    // Access badges to determine the "True" target streak (Next Gym)
    const selectedTopic = useGameStore(state => state.selectedTopic);
    
    const badgesOwned = usePlayerStore(state => state.badges);

    const positionClass = className || "top-3 right-3";

    if (activeQuest && !isTrainerBattle) {
        // Dungeon Display
        const isBoss = activeQuest.currentProgress >= activeQuest.requiredProgress;
        return (
            <div className={`absolute z-50 flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur border shadow-lg transition-all ${positionClass} bg-red-900/60 border-red-500/50`}>
                <Crown className="text-yellow-400 fill-yellow-400 animate-pulse" size={14} />
                <span className="font-pixel text-xs md:text-lg text-white">
                    {isBoss ? 'BOSS' : `FLOOR ${activeQuest.currentProgress + 1}/${activeQuest.requiredProgress}`}
                </span>
            </div>
        );
    }

    // Logic: 
    // Gen 1: 8 Badges. Gen 2: 8 Badges.
    // If Topic is Linear -> Gen 1 badges count. 
    // Simple Approximation: Just count total badges owned relevant to current Gen?
    // Since badges have unique IDs (boulder vs zephyr), we can filter.
    
    const gen1Badges = ['boulder', 'cascade', 'thunder', 'rainbow', 'soul', 'marsh', 'volcano', 'earth'];
    const gen2Badges = ['zephyr', 'hive', 'plain', 'fog', 'storm', 'mineral', 'glacier', 'rising'];
    
    const relevantBadges = selectedTopic === 'linear' ? gen1Badges : gen2Badges;
    const currentBadgeCount = badgesOwned.filter(b => relevantBadges.includes(b)).length;
    
    // The next gym leader is at (BadgeCount + 1) * 5.
    // e.g., 0 badges -> Streak 5. 1 badge -> Streak 10.
    // Max is Streak 40 (8 badges).
    const targetStreak = Math.min(40, (currentBadgeCount + 1) * 5);

    // Special Case: If all badges obtained, target is infinite or just shows "CHAMPION"
    const isChampion = currentBadgeCount >= 8;

    return (
        <button 
            onClick={() => { audioService.playSfx('click'); onClick(); }}
            className={`absolute text-white z-50 flex items-center gap-1 md:gap-2 px-2 py-1 md:px-3 rounded-full backdrop-blur border shadow-lg transition-all duration-300 active:scale-95 group cursor-pointer
                ${positionClass}
                ${isTrainerBattle ? 'bg-blue-600/60 hover:bg-blue-600/80 border-blue-400/50' : 'bg-black/40 hover:bg-black/60 border-white/20'}`}
        >
            {isTrainerBattle ? (
                <>
                    <Info className="fill-white/20 text-white" size={16} /> 
                    <span className="font-pixel text-xs md:text-sm">INTEL</span>
                </>
            ) : (
                <>
                    <Star className="fill-yellow-400 text-yellow-400 group-hover:scale-110 transition-transform md:w-4 md:h-4" size={14} /> 
                    <span className="font-pixel text-xs md:text-lg">
                        {isChampion ? `${streak} (CHAMP)` : `${streak} / ${targetStreak}`}
                    </span>
                </>
            )}
            {!isTrainerBattle && <Info size={12} className="text-slate-300 ml-1 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block" />}
        </button>
    );
});
