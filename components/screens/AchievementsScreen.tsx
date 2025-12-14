
import React, { useState } from 'react';
import { useShallow } from 'zustand/shallow';
import { GameState, Achievement } from '../../types';
import { useGameStore } from '../../store/useGameStore';
import { usePlayerStore } from '../../store/usePlayerStore';
import { ACHIEVEMENT_REGISTRY } from '../../data/achievementData';
import { audioService } from '../../services/audioService';

// Import achievement data categories
import { battleAchievements } from '../../data/achievements/battle';
import { collectionAchievements } from '../../data/achievements/collection';
import { economyAchievements } from '../../data/achievements/economy';
import { hiddenAchievements } from '../../data/achievements/hidden';
import { itemAchievements } from '../../data/achievements/items';
import { progressionAchievements } from '../../data/achievements/progression';

// Import icons for categories
import { Trophy, ArrowLeft, Lock, Package, Swords, ChevronsUp, Coins, Briefcase, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';

const achievementCategories: Record<string, { label: string; data: Achievement[]; icon: React.ReactNode }> = {
    'ALL': { label: 'All', data: ACHIEVEMENT_REGISTRY, icon: <Trophy size={16}/> },
    'COLLECTION': { label: 'Collection', data: collectionAchievements, icon: <Package size={16}/> },
    'BATTLE': { label: 'Battle', data: battleAchievements, icon: <Swords size={16}/> },
    'PROGRESSION': { label: 'Progression', data: progressionAchievements, icon: <ChevronsUp size={16}/> },
    'ECONOMY': { label: 'Economy', data: economyAchievements, icon: <Coins size={16}/> },
    'ITEMS': { label: 'Items', data: itemAchievements, icon: <Briefcase size={16}/> },
    'HIDDEN': { label: 'Hidden', data: hiddenAchievements, icon: <EyeOff size={16}/> },
};

export const AchievementsScreen: React.FC = () => {
    const { setGameState, prevState } = useGameStore(useShallow(state => ({
        setGameState: state.setGameState,
        prevState: state.prevState,
    })));
    const unlockedAchievements = usePlayerStore(state => state.unlockedAchievements);
    const [activeCategory, setActiveCategory] = useState('ALL');
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false); // New state for dropdown

    const onBack = () => {
        audioService.playSfx('click');
        setGameState(prevState || GameState.MENU_MAIN);
    };

    const handleCategoryChange = (key: string) => {
        audioService.playSfx('click');
        setActiveCategory(key);
        setIsCategoryDropdownOpen(false); // Close dropdown after selection
    };

    const toggleDropdown = () => {
        audioService.playSfx('click');
        setIsCategoryDropdownOpen(prev => !prev);
    };

    const currentList = achievementCategories[activeCategory].data;
    const unlockedCount = currentList.filter(ach => unlockedAchievements[ach.id]).length;
    const totalCount = currentList.length;

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col font-mono text-white">
            <div className="bg-slate-800 p-4 border-b-4 border-slate-700 shadow-md sticky top-0 z-20">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <button onClick={onBack} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
                        <ArrowLeft size={20} /> <span className="hidden sm:inline">BACK</span>
                    </button>
                    <h2 className="text-base sm:text-xl md:text-2xl font-bold flex items-center gap-2 font-pixel">
                        <Trophy className="text-yellow-400" /> ACHIEVEMENTS
                    </h2>
                    <div className="text-base sm:text-lg font-bold font-pixel text-yellow-400">
                        {unlockedCount}/{totalCount}
                    </div>
                </div>
                {/* Filter Controls - Responsive Dropdown/Horizontal */}
                <div className="max-w-4xl mx-auto mt-4 relative">
                    {/* Mobile Toggle Button */}
                    <button
                        onClick={toggleDropdown}
                        className="md:hidden w-full px-4 py-2 rounded-full font-bold text-sm flex items-center justify-between transition-all bg-slate-700 text-slate-300 hover:bg-slate-600"
                        aria-expanded={isCategoryDropdownOpen}
                        aria-controls="achievement-category-list"
                    >
                        <span className="flex items-center gap-2">
                            {achievementCategories[activeCategory].icon} {achievementCategories[activeCategory].label}
                        </span>
                        {isCategoryDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {/* Dropdown Content (Mobile) / Horizontal Buttons (Desktop) */}
                    <div
                        id="achievement-category-list"
                        className={`
                            absolute md:relative top-full left-0 w-full md:w-auto
                            mt-2 md:mt-0 bg-slate-800 md:bg-transparent rounded-lg md:rounded-none
                            shadow-lg md:shadow-none z-10 md:z-auto
                            flex flex-col md:flex-row gap-2 md:gap-2
                            overflow-hidden md:overflow-x-auto no-scrollbar
                            ${isCategoryDropdownOpen ? 'block' : 'hidden'} md:flex
                        `}
                        role="menu"
                    >
                        {Object.entries(achievementCategories).map(([key, { label, icon }]) => (
                            <button
                                key={key}
                                onClick={() => handleCategoryChange(key)}
                                className={`
                                    px-4 py-2 rounded-full font-bold text-xs flex items-center justify-start md:justify-center gap-2 transition-all whitespace-nowrap
                                    ${activeCategory === key
                                        ? 'bg-yellow-500 text-black shadow-md'
                                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}
                                `}
                                role="menuitem"
                            >
                                {icon} {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-1 p-4 md:p-8 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                    {currentList.map(ach => {
                        const isUnlocked = !!unlockedAchievements[ach.id];
                        const date = isUnlocked ? new Date(unlockedAchievements[ach.id]) : null;

                        return (
                            <div
                                key={ach.id}
                                className={`
                                    flex items-center gap-3 sm:gap-4 p-3 sm:p-4 mb-3 rounded-xl border-l-8 transition-all duration-300
                                    ${isUnlocked
                                        ? 'bg-slate-800 border-yellow-500 shadow-lg'
                                        : 'bg-slate-800/50 border-slate-700 opacity-60'}
                                `}
                            >
                                <div className={`text-2xl sm:text-3xl md:text-4xl p-2 sm:p-3 rounded-full ${isUnlocked ? 'bg-yellow-500/10' : 'bg-slate-700/50'}`}>
                                    {isUnlocked ? ach.icon : <Lock className="text-slate-500" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className={`font-bold text-sm md:text-lg ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                                        {isUnlocked || !ach.isHidden ? ach.title : '??????????'}
                                    </h3>
                                    <p className="text-xs md:text-sm text-slate-400 line-clamp-2 leading-tight">
                                        {isUnlocked || !ach.isHidden ? ach.description : 'Unlock this secret achievement to see details.'}
                                    </p>
                                </div>
                                {isUnlocked && date && (
                                    <div className="text-right text-slate-500 text-[10px] hidden md:block">
                                        Unlocked:<br />
                                        {date.toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
