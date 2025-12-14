import React from 'react';
import { Pokemon } from '../../types';
import { audioService } from '../../services/audioService';

interface EvolutionScreenProps {
  prev: Pokemon;
  next: Pokemon;
  onComplete: () => void;
}

export const EvolutionScreen: React.FC<EvolutionScreenProps> = ({ prev, next, onComplete }) => (
  <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8 text-white relative overflow-hidden">
       <div className="absolute inset-0 bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-yellow-500/20 via-slate-900 to-slate-900 animate-pulse z-0"></div>
       
       <div className="relative z-10 flex flex-col items-center w-full max-w-lg">
          <h2 className="text-3xl font-pixel mb-12 text-center animate-bounce">What? {prev.name} is evolving!</h2>
          <div className="relative w-64 h-64 mb-12">
              <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20"></div>
              <img src={next.imageUrl} className="w-full h-full object-contain animate-float drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]" />
          </div>
          <div className="text-center font-mono">
              <p className="text-slate-400 mb-2">Congratulations! Your Pokemon evolved into</p>
              <p className="text-4xl font-bold text-yellow-400 uppercase">{next.name}</p>
          </div>
          <button 
              onClick={() => { audioService.playSfx('click'); onComplete(); }}
              className="mt-12 px-8 py-3 bg-white text-black font-bold rounded shadow-lg hover:scale-105 transition-transform cursor-pointer relative z-20"
          >
              CONTINUE
          </button>
       </div>
  </div>
);