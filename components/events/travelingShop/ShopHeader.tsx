
import React from 'react';
import { Coins, ShoppingBag } from 'lucide-react';

interface ShopHeaderProps {
    title: string;
    description: string; // The merchant's dialogue
    money: number;
}

export const ShopHeader: React.FC<ShopHeaderProps> = ({ title, description, money }) => {
    return (
        <div className="p-4 bg-amber-900 border-b-4 border-amber-700 flex justify-between items-center z-10 shadow-lg relative overflow-hidden">
            {/* Background Texture for Header */}
            <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>

            <div className="flex items-center gap-3 relative z-10">
                <div className="p-2 bg-amber-950 rounded-full border-2 border-amber-500 shadow-md">
                    <ShoppingBag className="text-amber-400" size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold font-pixel text-amber-100 drop-shadow-md">{title}</h2>
                    <div className="bg-amber-950/50 px-2 py-1 rounded text-xs text-amber-200/90 italic border border-amber-800/50 mt-1 max-w-[200px] md:max-w-none">
                        "{description}"
                    </div>
                </div>
            </div>
            
            <div className="bg-black/40 px-4 py-2 rounded-lg border border-amber-500/30 flex items-center gap-2 shadow-inner relative z-10">
                <Coins className="text-yellow-400" size={18} />
                <span className="font-bold text-yellow-400 text-lg font-mono tracking-wide">${money}</span>
            </div>
        </div>
    );
};
