
import React from 'react';
import { Sparkles, Hexagon, Circle, Shield, Star, Zap, Award, Crown, Cloud, Wind, Mountain, Snowflake, Bug, Hand } from 'lucide-react';

interface TrainerCardProps {
    name: string;
    id: string;
    money: number;
    badges: string[];
    avatar: string;
    className?: string;
    variant?: 'blue' | 'red';
}

// GEN 1 BADGES (Kanto)
const GEN1_BADGES = [
    { id: 'boulder', color: 'text-gray-400', bg: 'bg-gray-500/20', border: 'border-gray-500', icon: <Hexagon size={16} fill="currentColor"/> },
    { id: 'cascade', color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500', icon: <Circle size={16} fill="currentColor"/> },
    { id: 'thunder', color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500', icon: <Zap size={16} fill="currentColor"/> },
    { id: 'rainbow', color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500', icon: <Sparkles size={16} fill="currentColor"/> },
    { id: 'soul', color: 'text-pink-400', bg: 'bg-pink-500/20', border: 'border-pink-500', icon: <Star size={16} fill="currentColor"/> },
    { id: 'marsh', color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500', icon: <Circle size={16} fill="currentColor"/> },
    { id: 'volcano', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500', icon: <Shield size={16} fill="currentColor"/> },
    { id: 'earth', color: 'text-amber-600', bg: 'bg-amber-600/20', border: 'border-amber-600', icon: <Award size={16} fill="currentColor"/> },
];

// GEN 2 BADGES (Johto)
const GEN2_BADGES = [
    { id: 'zephyr', color: 'text-indigo-300', bg: 'bg-indigo-500/20', border: 'border-indigo-400', icon: <Wind size={16} fill="currentColor"/> },
    { id: 'hive', color: 'text-lime-400', bg: 'bg-lime-500/20', border: 'border-lime-500', icon: <Bug size={16} fill="currentColor"/> },
    { id: 'plain', color: 'text-pink-300', bg: 'bg-pink-500/20', border: 'border-pink-400', icon: <Circle size={16} fill="currentColor"/> },
    { id: 'fog', color: 'text-purple-300', bg: 'bg-purple-500/20', border: 'border-purple-400', icon: <Cloud size={16} fill="currentColor"/> },
    { id: 'storm', color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500', icon: <Hand size={16} fill="currentColor"/> },
    { id: 'mineral', color: 'text-gray-300', bg: 'bg-gray-500/20', border: 'border-gray-400', icon: <Shield size={16} fill="currentColor"/> },
    { id: 'glacier', color: 'text-cyan-300', bg: 'bg-cyan-500/20', border: 'border-cyan-400', icon: <Snowflake size={16} fill="currentColor"/> },
    { id: 'rising', color: 'text-blue-600', bg: 'bg-blue-600/20', border: 'border-blue-600', icon: <Crown size={16} fill="currentColor"/> },
];

export const TrainerCard: React.FC<TrainerCardProps> = ({ name, id, money, badges, avatar, className = '', variant = 'blue' }) => {
    
    const themeStyles = variant === 'red' 
        ? 'from-red-700 to-red-900 border-red-400/30 shadow-red-900/50'
        : 'from-blue-600 to-blue-800 border-white/20 shadow-2xl';

    const labelColor = variant === 'red' ? 'text-red-200' : 'text-blue-200';

    // Determine which set to show based on what badges the user actually has
    // Or simpler: Show both rows if space permits, or toggle. 
    // Since Gen 2 is a separate run, we might want to prioritize showing the ones they have.
    const hasGen2 = badges.some(b => GEN2_BADGES.some(g2 => g2.id === b));
    
    // For this UI, let's display two compact rows if necessary, or just one if only Gen 1.
    const displayGen2 = hasGen2;

    const BadgeRow = ({ slots }: { slots: typeof GEN1_BADGES }) => (
        <div className="flex gap-1.5 md:gap-2">
            {slots.map((slot) => {
                const isUnlocked = badges.includes(slot.id);
                return (
                    <div 
                        key={slot.id} 
                        className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center border-2 transition-all
                            ${isUnlocked 
                                ? `${slot.bg} ${slot.border} ${slot.color} shadow-[0_0_10px_currentColor]` 
                                : 'bg-black/30 border-white/10 text-white/10'}
                        `}
                        title={isUnlocked ? `${slot.id.toUpperCase()} BADGE` : 'Locked'}
                    >
                        {isUnlocked ? slot.icon : <div className="w-1.5 h-1.5 rounded-full bg-white/10"></div>}
                    </div>
                );
            })}
        </div>
    );

    return (
        <div className={`relative w-full aspect-[1.58/1] bg-gradient-to-br rounded-2xl border-4 overflow-hidden transform transition-transform hover:scale-[1.02] duration-300 group shadow-2xl ${themeStyles} ${className}`}>
            
            {/* Card Background Pattern */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            
            {/* Card Header */}
            <div className="absolute top-4 left-5 right-5 flex justify-between items-start border-b border-white/20 pb-2">
                <div>
                    <h2 className="text-white font-pixel text-xs md:text-sm tracking-widest opacity-80">TRAINER CARD</h2>
                    <h1 className="text-white font-bold text-xl md:text-2xl font-pixel tracking-wide mt-1 uppercase truncate max-w-[180px]">
                        {name || 'TRAINER'}
                    </h1>
                </div>
                <div className="text-right">
                    <div className={`text-[10px] ${labelColor} font-bold uppercase`}>ID No.</div>
                    <div className="text-white font-mono font-bold text-lg">{id}</div>
                </div>
            </div>

            {/* Card Body */}
            <div className="absolute top-24 left-5 flex gap-4 items-end">
                <div className="flex flex-col gap-1">
                    <span className={`text-[10px] ${labelColor} uppercase font-bold`}>Money</span>
                    <span className="text-white font-mono font-bold text-sm bg-black/20 px-2 py-1 rounded">$ {money.toLocaleString()}</span>
                </div>
            </div>

            {/* BADGES SECTION */}
            <div className="absolute bottom-3 left-5">
                <span className={`text-[10px] ${labelColor} uppercase font-bold block mb-1`}>League Badges</span>
                <div className="flex flex-col gap-1.5">
                    <BadgeRow slots={GEN1_BADGES} />
                    {displayGen2 && <BadgeRow slots={GEN2_BADGES} />}
                </div>
            </div>

            {/* Avatar Display */}
            <div className="absolute bottom-0 right-4 w-32 h-32 md:w-40 md:h-40 flex items-end justify-center pointer-events-none">
                    {/* Glow effect behind avatar */}
                    <div className="absolute bottom-0 w-24 h-4 bg-black/40 blur-md rounded-[50%]"></div>
                    <img 
                    src={avatar} 
                    alt="Trainer" 
                    className="w-full h-full object-contain drop-shadow-xl animate-float"
                    style={{ imageRendering: 'pixelated' }}
                    />
            </div>

            {/* Holographic Shine Effect on Hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        </div>
    );
};
