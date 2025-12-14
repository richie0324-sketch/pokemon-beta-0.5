
import React, { useState } from 'react';
import { Pokemon } from '../../types';
import { TYPE_COLORS } from '../../constants';
import { getStartersForRegion } from '../../services/pokemonGenService';
import { audioService } from '../../services/audioService';
import { useGameStore } from '../../store/useGameStore';
import { logic } from '../../hooks/useGameLogic';
import { Check } from 'lucide-react';

export const StarterSelect: React.FC = () => {
  const selectedTopic = useGameStore(state => state.selectedTopic);
  const regionGen = selectedTopic === 'linear' ? 1 : 2;
  
  const starters = getStartersForRegion(regionGen);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleSelect = (id: number) => {
      audioService.playSfx('click');
      setSelectedId(id);
  };

  const handleConfirm = () => {
      const choice = starters.find(s => s.speciesId === selectedId);
      if (choice) logic.chooseStarter(choice);
  };

  return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
           <div className="text-center mb-6 md:mb-8 mt-4 md:mt-0">
               <h2 className="text-xl md:text-3xl font-pixel text-white mb-2">CHOOSE YOUR PARTNER</h2>
               <p className="text-slate-400 font-mono text-xs md:text-base">Select a Pokemon to begin your journey.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-4xl mb-6 md:mb-8 overflow-y-auto max-h-[60vh] md:max-h-none p-1">
               {starters.map(starter => {
                   const isSelected = selectedId === starter.speciesId;
                   return (
                       <button 
                            key={starter.speciesId} 
                            onClick={() => handleSelect(starter.speciesId)} 
                            className={`group relative bg-slate-800 p-4 md:p-6 rounded-xl border-4 transition-all hover:-translate-y-2 flex flex-row md:flex-col items-center gap-4 md:gap-0
                                ${isSelected ? 'border-yellow-400 ring-4 ring-yellow-400/30 bg-slate-700' : 'border-slate-700 hover:border-slate-500'}
                            `}
                        >
                            {isSelected && (
                                <div className="absolute top-2 right-2 text-yellow-400 bg-yellow-400/20 p-1 rounded-full animate-bounce">
                                    <Check size={20} strokeWidth={4} />
                                </div>
                            )}
                            <div className={`w-20 h-20 md:w-32 md:h-32 rounded-full flex items-center justify-center mb-0 md:mb-4 bg-white/5 ${TYPE_COLORS[starter.type]} bg-opacity-20 shrink-0`}>
                                <img src={starter.imageUrl} className={`w-16 h-16 md:w-24 md:h-24 object-contain drop-shadow-lg transition-transform duration-300 ${isSelected ? 'scale-125' : 'group-hover:scale-110'}`} />
                            </div>
                            <div className="text-left md:text-center flex-1">
                                <h3 className="text-lg md:text-xl font-bold text-white mb-1">{starter.name}</h3>
                                <span className={`text-[10px] md:text-xs px-2 py-1 rounded font-bold text-white ${TYPE_COLORS[starter.type]}`}>{starter.type}</span>
                                <div className="mt-2 md:mt-4 text-xs md:text-sm text-slate-400 font-mono">{starter.description}</div>
                            </div>
                       </button>
                   );
               })}
           </div>

           {/* Confirm Button Area */}
           <div className="h-16 w-full max-w-xs shrink-0">
               {selectedId && (
                   <button 
                        onClick={handleConfirm}
                        className="w-full py-3 md:py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl shadow-lg border-b-4 border-green-800 active:border-b-0 active:translate-y-1 transition-all animate-pop-in"
                   >
                       START ADVENTURE!
                   </button>
               )}
           </div>
      </div>
  );
};
