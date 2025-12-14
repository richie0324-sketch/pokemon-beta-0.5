import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface EncounterScreenProps {
  isLegendary?: boolean;
}

export const EncounterScreen: React.FC<EncounterScreenProps> = ({ isLegendary }) => (
  <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-500 ${isLegendary ? 'bg-red-900' : 'bg-slate-900'}`}>
     <div className="text-center">
         {isLegendary ? (
              <div className="animate-pulse flex flex-col items-center">
                   <div className="flex gap-4 mb-6">
                      <AlertTriangle size={64} className="text-yellow-400 fill-red-600 animate-bounce" />
                   </div>
                   <h2 className="text-4xl md:text-6xl text-yellow-300 font-pixel mb-4 drop-shadow-[4px_4px_0_#000] tracking-widest">WARNING</h2>
                   <p className="text-2xl text-white font-mono font-bold tracking-widest uppercase bg-red-800 px-6 py-2 border-y-4 border-yellow-400">LEGENDARY APPROACHING</p>
              </div>
         ) : (
              <div className="animate-pulse">
                  <AlertTriangle size={48} className="text-yellow-500 mx-auto mb-4" />
                  <h2 className="text-3xl text-white font-pixel mb-2">WILD POKEMON APPEARED!</h2>
                  <p className="text-slate-400 font-mono">Prepare for battle...</p>
              </div>
         )}
     </div>
  </div>
);