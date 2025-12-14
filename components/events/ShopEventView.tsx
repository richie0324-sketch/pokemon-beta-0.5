
import React, { useState } from 'react';
import { GameEvent, ShopOffer } from '../../types';
import { ITEM_REGISTRY } from '../../data/itemData';
import { usePlayerStore } from '../../store/usePlayerStore';
import { audioService } from '../../services/audioService';
import { ArrowRight, Coins, ShoppingBag, LogOut, Package } from 'lucide-react';
import { showToast } from '../../store/useToastStore';

interface ShopEventViewProps {
    event: GameEvent;
    onClose: () => void;
}

export const ShopEventView: React.FC<ShopEventViewProps> = ({ event, onClose }) => {
    const { money, inventory, setMoney, addItem, removeItem } = usePlayerStore();
    const [shopTab, setShopTab] = useState<'BUY' | 'SELL'>('BUY');
    
    const stock = (event.data?.stock as ShopOffer[] | undefined) || [];

    const handleBuy = (offer: ShopOffer) => {
        if (money < offer.price) {
            audioService.playSfx('incorrect');
            showToast('Not enough coins.', 'warning');
            return;
        }
        audioService.playSfx('click');
        setMoney(m => m - offer.price);
        addItem(offer.itemId, offer.count);
        showToast(`Bought ${ITEM_REGISTRY[offer.itemId]?.name}`, 'success');
    };

    const handleSell = (itemId: string, count: number) => {
        const itemDef = ITEM_REGISTRY[itemId];
        if (!itemDef) return;
        const sellPrice = Math.floor(itemDef.price / 2);
        
        audioService.playSfx('correct');
        removeItem(itemId, 1);
        setMoney(m => m + sellPrice);
        showToast(`Sold ${itemDef.name} for $${sellPrice}`, 'success');
    };

    const sellableItems = inventory.filter(slot => {
        const def = ITEM_REGISTRY[slot.itemId];
        return def && def.price > 0 && slot.itemId !== 'poke-ball';
    });

    return (
        <div className="w-full h-full flex flex-col bg-slate-900 text-white font-mono overflow-hidden relative">
             {/* Background */}
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-10 z-0"></div>
             
             {/* Header */}
             <div className="p-4 bg-amber-900 border-b-4 border-amber-700 flex justify-between items-center z-10 shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-950 rounded-full border-2 border-amber-500">
                        <ShoppingBag className="text-amber-400" size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold font-pixel text-amber-100">{event.title}</h2>
                        <p className="text-xs text-amber-300/80 italic">"Rare goods, stranger!"</p>
                    </div>
                </div>
                <div className="bg-black/40 px-4 py-2 rounded-lg border border-amber-500/30 flex items-center gap-2">
                    <Coins className="text-yellow-400" size={16} />
                    <span className="font-bold text-yellow-400 text-lg">${money}</span>
                </div>
             </div>

             {/* Navigation Tabs */}
             <div className="flex p-2 gap-2 bg-slate-800 z-10">
                 <button 
                    onClick={() => setShopTab('BUY')}
                    className={`flex-1 py-3 font-bold rounded flex items-center justify-center gap-2 transition-all ${shopTab === 'BUY' ? 'bg-amber-600 text-white shadow-inner' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
                 >
                    <ShoppingBag size={18} /> BUY WARES
                 </button>
                 <button 
                    onClick={() => setShopTab('SELL')}
                    className={`flex-1 py-3 font-bold rounded flex items-center justify-center gap-2 transition-all ${shopTab === 'SELL' ? 'bg-blue-600 text-white shadow-inner' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
                 >
                    <Package size={18} /> SELL LOOT
                 </button>
             </div>

             {/* List Content */}
             <div className="flex-1 overflow-y-auto p-4 z-10 space-y-2 bg-slate-800/50">
                 {shopTab === 'BUY' ? (
                     stock.length === 0 ? <div className="text-center text-slate-500 mt-10">Sold Out!</div> :
                     stock.map((offer, idx) => {
                         const itemDef = ITEM_REGISTRY[offer.itemId];
                         if (!itemDef) return null;
                         const canAfford = money >= offer.price;
                         return (
                            <div key={idx} className="flex items-center justify-between bg-slate-800 p-3 rounded-xl border border-slate-600 shadow-sm hover:border-amber-500/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-700">
                                        {/* Placeholder Icon */}
                                        <Package className="text-slate-500" size={20} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-white flex items-center gap-2">
                                            {itemDef.name} <span className="text-xs bg-slate-700 px-2 py-0.5 rounded text-slate-300">x{offer.count}</span>
                                        </div>
                                        <div className="text-xs text-slate-400 max-w-[200px] truncate">{itemDef.description}</div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleBuy(offer)}
                                    disabled={!canAfford}
                                    className={`px-4 py-2 rounded-lg font-bold font-mono text-sm border-b-4 active:border-b-0 active:translate-y-1 transition-all
                                        ${canAfford ? 'bg-green-600 border-green-800 hover:bg-green-500 text-white' : 'bg-slate-700 border-slate-800 text-slate-500 cursor-not-allowed'}
                                    `}
                                >
                                    ${offer.price}
                                </button>
                            </div>
                         );
                     })
                 ) : (
                     sellableItems.length === 0 ? (
                        <div className="text-center text-slate-500 mt-10 italic">Your bag is empty of valuables.</div>
                     ) : (
                        sellableItems.map((slot, idx) => {
                            const itemDef = ITEM_REGISTRY[slot.itemId];
                            const sellPrice = Math.floor(itemDef.price / 2);
                            return (
                                <div key={idx} className="flex items-center justify-between bg-slate-800 p-3 rounded-xl border border-slate-600 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-700">
                                            <Package className="text-slate-500" size={20} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-white">{itemDef.name} <span className="text-xs text-slate-400">x{slot.count}</span></div>
                                            <div className="text-xs text-slate-500">Resale Value</div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleSell(slot.itemId, 1)}
                                        className="px-4 py-2 rounded-lg font-bold font-mono text-sm border-b-4 border-blue-800 bg-blue-600 hover:bg-blue-500 text-white active:border-b-0 active:translate-y-1 transition-all"
                                    >
                                        +${sellPrice}
                                    </button>
                                </div>
                            );
                        })
                     )
                 )}
             </div>

             {/* Footer */}
             <div className="p-4 bg-slate-900 border-t border-slate-700 z-10">
                 <button onClick={onClose} className="w-full py-3 bg-red-900/50 hover:bg-red-900 text-red-200 border border-red-800 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors">
                     <LogOut size={18} /> LEAVE SHOP
                 </button>
             </div>
        </div>
    );
};
