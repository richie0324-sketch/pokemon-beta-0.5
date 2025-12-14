import React from 'react';
import { Pokemon, PokemonType } from '../types';
import { TYPE_COLORS, TYPE_BG } from '../constants';
import { Heart } from 'lucide-react';

interface PokemonCardProps {
  pokemon: Pokemon;
  isPlayer: boolean;
  isActive: boolean;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, isPlayer, isActive }) => {
  const hpPercentage = Math.max(0, (pokemon.currHp / pokemon.maxHp) * 100);
  
  let hpColor = 'bg-green-500';
  if (hpPercentage < 50) hpColor = 'bg-yellow-500';
  if (hpPercentage < 20) hpColor = 'bg-red-500';

  return (
    <div className={`
      relative w-full max-w-sm rounded-xl overflow-hidden shadow-lg border-2 
      ${isActive ? 'border-yellow-400 scale-105' : 'border-gray-200'}
      transition-all duration-300
      ${TYPE_BG[pokemon.type] || 'bg-white'}
    `}>
      {/* Header */}
      <div className="p-3 flex justify-between items-center bg-black/5">
        <h3 className="font-bold text-lg flex items-center gap-2">
          {pokemon.name}
          {pokemon.isLegendary && <span className="text-yellow-600">★</span>}
        </h3>
        <span className={`px-2 py-0.5 rounded-full text-xs text-white font-bold ${TYPE_COLORS[pokemon.type]}`}>
          {pokemon.type}
        </span>
      </div>

      {/* Image Area */}
      <div className="relative h-40 bg-white/30 flex items-center justify-center p-4 overflow-hidden">
        {/* Container for Flip - If player, flip horizontally to face enemy */}
        <div className={`transition-transform duration-300 ${isActive && isPlayer ? 'scale-x-[-1]' : ''}`}>
           {/* Image with Float Animation */}
           <img 
            src={pokemon.imageUrl} 
            alt={pokemon.name} 
            className="h-32 w-32 object-contain drop-shadow-md animate-float"
          />
        </div>
        
        {isPlayer && isActive && (
           <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full shadow-md z-10">
             YOU
           </div>
        )}
      </div>

      {/* Stats Area */}
      <div className="p-4 space-y-2 bg-white/80 backdrop-blur-sm">
        <div className="flex justify-between text-sm font-bold text-gray-600">
          <span className="flex items-center gap-1"><Heart size={14} className="text-red-500 fill-red-500" /> HP</span>
          <span>{Math.ceil(pokemon.currHp)} / {pokemon.maxHp}</span>
        </div>
        
        {/* HP Bar */}
        <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden border border-gray-400">
          <div 
            className={`h-full transition-all duration-500 ease-out ${hpColor}`} 
            style={{ width: `${hpPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
