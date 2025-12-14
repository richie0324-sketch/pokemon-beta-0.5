import React from 'react';
import { ShopOffer, InventorySlot } from '../../../types';
import { ITEM_REGISTRY } from '../../../data/itemData';
import { Package } from 'lucide-react';

interface ShopInventoryProps {
    mode: 'BUY' | 'SELL';
    offers?: ShopOffer[]; // For BUY mode
    inventory?: InventorySlot[]; // For SELL mode
    money: number;
    onBuy: (offer: ShopOffer) => void;
    onSell: (itemId: string) => void;
}

export const ShopInventory: React.FC<ShopInventoryProps> = ({ mode, offers, inventory, money, onBuy, onSell }) => {
    
    // RENDER: BUY LIST
    if (mode === 'BUY') {
        if (!offers || offers.length === 0) {
            return <div className="text-center text-slate-500 mt-10 font-mono">Sold Out! Come back later.</div>;
        }

        return (
            <div className="space-y-3">
                {offers.map((offer, idx) => {
                    const itemDef = ITEM_REGISTRY[offer.itemId];
                    if (!itemDef) return null;
                    const canAfford = money >= offer.price;
                    
                    return (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-slate-800 p-3 rounded-xl border border-slate-600 shadow-sm hover:border-amber-500/50 transition-colors group">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-700 group-hover:border-amber-500/30 transition-colors shrink-0">
                                    <Package className="text-slate-500 group-hover:text-amber-400/50" size={20} />
                                </div>
                                <div className="min-w-0">
                                    <div className="font-bold text-white flex items-center gap-2 text-sm sm:text-base">
                                        <span className="truncate">{itemDef.name}</span>
                                        <span className="text-xs bg-slate-700 px-2 py-0.5 rounded text-slate-300 shrink-0">x{offer.count}</span>
                                    </div>
                                    <div className="text-xs text-slate-400 truncate">{itemDef.description}</div>
                                </div>
                            </div>
                            <button 
                                onClick={() => onBuy(offer)}
                                disabled={!canAfford}
                                className={`w-full sm:w-auto mt-3 sm:mt-0 sm:ml-4 px-4 py-2 rounded-lg font-bold font-mono text-sm border-b-4 active:border-b-0 active:translate-y-1 transition-all shrink-0
                                    ${canAfford ? 'bg-green-600 border-green-800 hover:bg-green-500 text-white shadow-lg' : 'bg-slate-700 border-slate-800 text-slate-500 cursor-not-allowed'}
                                `}
                            >
                                BUY for ${offer.price}
                            </button>
                        </div>
                    );
                })}
            </div>
        );
    }

    // RENDER: SELL LIST
    if (mode === 'SELL') {
        const sellableItems = inventory?.filter(slot => {
            const def = ITEM_REGISTRY[slot.itemId];
            return def && def.price > 0 && slot.itemId !== 'poke-ball';
        }) || [];

        if (sellableItems.length === 0) {
            return <div className="text-center text-slate-500 mt-10 italic font-mono">Your bag is empty of valuables.</div>;
        }

        return (
            <div className="space-y-3">
                {sellableItems.map((slot, idx) => {
                    const itemDef = ITEM_REGISTRY[slot.itemId];
                    const sellPrice = Math.floor(itemDef.price / 2);
                    
                    return (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-slate-800 p-3 rounded-xl border border-slate-600 shadow-sm hover:border-blue-500/50 transition-colors group">
                           <div className="flex items-center gap-3 min-w-0">
                                <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-700 group-hover:border-blue-500/30 transition-colors shrink-0">
                                    <Package className="text-slate-500 group-hover:text-blue-400/50" size={20} />
                                </div>
                                <div className="min-w-0">
                                    <div className="font-bold text-white truncate text-sm sm:text-base">{itemDef.name} <span className="text-xs text-slate-400">x{slot.count}</span></div>
                                    <div className="text-xs text-slate-500">Resale Value</div>
                                </div>
                            </div>
                            <button 
                                onClick={() => onSell(slot.itemId)}
                                className="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-4 px-4 py-2 rounded-lg font-bold font-mono text-sm border-b-4 border-blue-800 bg-blue-600 hover:bg-blue-500 text-white active:border-b-0 active:translate-y-1 transition-all shadow-lg shrink-0"
                            >
                                SELL for +${sellPrice}
                            </button>
                        </div>
                    );
                })}
            </div>
        );
    }

    return null;
};