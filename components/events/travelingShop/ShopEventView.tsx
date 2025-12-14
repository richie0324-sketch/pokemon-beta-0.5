
import React, { useState } from 'react';
import { GameEvent, ShopOffer } from '../../../types';
import { ITEM_REGISTRY } from '../../../data/itemData';
import { usePlayerStore } from '../../../store/usePlayerStore';
import { audioService } from '../../../services/audioService';
import { ShoppingBag, LogOut, Package } from 'lucide-react';
import { showToast } from '../../../store/useToastStore';
import { ShopHeader } from './ShopHeader';
import { ShopInventory } from './ShopInventory';

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

    const handleSell = (itemId: string) => {
        const itemDef = ITEM_REGISTRY[itemId];
        if (!itemDef) return;
        const sellPrice = Math.floor(itemDef.price / 2);
        
        audioService.playSfx('correct');
        removeItem(itemId, 1);
        setMoney(m => m + sellPrice);
        showToast(`Sold ${itemDef.name} for $${sellPrice}`, 'success');
    };

    return (
        <div className="w-full h-full flex flex-col bg-slate-900 text-white font-mono overflow-hidden relative">
             {/* Background Pattern */}
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-10 z-0 pointer-events-none"></div>
             
             {/* 1. HEADER COMPONENT */}
             <ShopHeader 
                title={event.title} 
                description="Rare goods, stranger! What are ya buyin'?" 
                money={money} 
             />

             {/* 2. TABS */}
             <div className="flex p-2 gap-2 bg-slate-800 z-10 border-b border-slate-700">
                 <button 
                    onClick={() => { audioService.playSfx('click'); setShopTab('BUY'); }}
                    className={`flex-1 py-3 font-bold rounded flex items-center justify-center gap-2 transition-all ${shopTab === 'BUY' ? 'bg-amber-600 text-white shadow-inner' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
                 >
                    <ShoppingBag size={18} /> BUY WARES
                 </button>
                 <button 
                    onClick={() => { audioService.playSfx('click'); setShopTab('SELL'); }}
                    className={`flex-1 py-3 font-bold rounded flex items-center justify-center gap-2 transition-all ${shopTab === 'SELL' ? 'bg-blue-600 text-white shadow-inner' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
                 >
                    <Package size={18} /> SELL LOOT
                 </button>
             </div>

             {/* 3. INVENTORY CONTENT */}
             <div className="flex-1 overflow-y-auto p-4 z-10 bg-slate-900/50 backdrop-blur-sm">
                 <ShopInventory 
                    mode={shopTab}
                    offers={stock}
                    inventory={inventory}
                    money={money}
                    onBuy={handleBuy}
                    onSell={handleSell}
                 />
             </div>

             {/* 4. FOOTER */}
             <div className="p-4 bg-slate-900 border-t border-slate-700 z-10">
                 <button onClick={onClose} className="w-full py-3 bg-red-900/50 hover:bg-red-900 text-red-200 border border-red-800 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-95">
                     <LogOut size={18} /> LEAVE SHOP
                 </button>
             </div>
        </div>
    );
};
