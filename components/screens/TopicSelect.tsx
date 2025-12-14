
import React from 'react';
import { MathTopic } from '../../types';
import { logic } from '../../hooks/useGameLogic';

export const TopicSelect: React.FC = () => (
  <div className="min-h-screen bg-slate-800 flex flex-col items-center justify-center p-4">
      <h2 className="text-xl md:text-4xl font-pixel text-white mb-8 md:mb-12 text-center drop-shadow-lg">CHOOSE YOUR REGION</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full max-w-5xl">
          {/* KANTO CARD */}
          <button 
              onClick={() => logic.handleTopicSelect('linear')} 
              className="group relative overflow-hidden bg-gradient-to-b from-red-700 to-red-900 rounded-2xl border-4 border-red-950 shadow-2xl transition-transform hover:-translate-y-2 hover:shadow-red-500/30"
          >
              <div className="absolute top-0 left-0 w-full h-1/2 bg-white/5 skew-y-6 transform origin-top-left"></div>
              
              <div className="p-6 md:p-8 flex flex-col items-center gap-4 md:gap-6 relative z-10">
                  {/* Region Name at Top */}
                  <div className="bg-black/30 px-4 md:px-6 py-1 md:py-2 rounded-full border border-white/20 backdrop-blur-sm">
                      <span className="text-lg md:text-xl font-bold text-white tracking-widest uppercase font-pixel">KANTO REGION</span>
                  </div>

                  {/* Starters in Middle */}
                  <div className="flex justify-center gap-3 md:gap-4 filter drop-shadow-xl group-hover:scale-110 transition-transform duration-300">
                      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
                      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
                      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
                  </div>

                  {/* Chapter Name at Bottom */}
                  <div className="text-center mt-2">
                      <h3 className="text-lg md:text-2xl font-bold text-white mb-1">LINEAR EQUATIONS</h3>
                      <p className="text-red-200 font-mono text-xs opacity-80">Algebra • Graphs • Gradients</p>
                  </div>
              </div>
          </button>

          {/* JOHTO CARD */}
          <button 
              onClick={() => logic.handleTopicSelect('probability')} 
              className="group relative overflow-hidden bg-gradient-to-b from-indigo-700 to-indigo-900 rounded-2xl border-4 border-indigo-950 shadow-2xl transition-transform hover:-translate-y-2 hover:shadow-indigo-500/30"
          >
              <div className="absolute top-0 left-0 w-full h-1/2 bg-white/5 skew-y-6 transform origin-top-left"></div>
              
              <div className="p-6 md:p-8 flex flex-col items-center gap-4 md:gap-6 relative z-10">
                  {/* Region Name at Top */}
                  <div className="bg-black/30 px-4 md:px-6 py-1 md:py-2 rounded-full border border-white/20 backdrop-blur-sm">
                      <span className="text-lg md:text-xl font-bold text-white tracking-widest uppercase font-pixel">JOHTO REGION</span>
                  </div>

                  {/* Starters in Middle */}
                  <div className="flex justify-center gap-3 md:gap-4 filter drop-shadow-xl group-hover:scale-110 transition-transform duration-300">
                      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/152.png" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
                      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/155.png" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
                      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/158.png" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
                  </div>

                  {/* Chapter Name at Bottom */}
                  <div className="text-center mt-2">
                      <h3 className="text-lg md:text-2xl font-bold text-white mb-1">PROBABILITY</h3>
                      <p className="text-indigo-200 font-mono text-xs opacity-80">Chance • Data • Outcomes</p>
                  </div>
              </div>
          </button>
      </div>
  </div>
);
